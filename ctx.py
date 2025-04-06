import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import time
import collections # Used for deque if implementing breadth-first search strictly

# --- Configuration ---
START_URL = "https://datavizcatalogue.com/search.html"
MAX_DEPTH = 1  # How many levels of links to follow (0 = only the start page)
REQUEST_DELAY = 1 # Seconds to wait between requests to be polite to the server
USER_AGENT = "ctx/1.0 (LanguageModelContext; +http://example.com/botinfo)" # Optional: Identify your bot

# --- Main Logic ---

def fetch_and_parse(url, visited_urls, base_domain):
    """
    Fetches a URL, parses its content, extracts text and valid internal links.

    Args:
        url (str): The URL to fetch.
        visited_urls (set): A set of URLs already visited or scheduled.
        base_domain (str): The domain name of the starting URL (e.g., 'datavizcatalogue.com').

    Returns:
        tuple: (str: extracted text, set: new valid internal links found)
               Returns (None, set()) if fetching/parsing fails or URL is invalid.
    """
    if url in visited_urls:
        print(f"--- Skipping already visited: {url}")
        return None, set()

    print(f"Fetching: {url}")
    visited_urls.add(url) # Mark as visited *before* fetching

    headers = {'User-Agent': USER_AGENT}
    try:
        time.sleep(REQUEST_DELAY) # Politeness delay
        response = requests.get(url, headers=headers, timeout=10) # Added timeout
        response.raise_for_status() # Raise HTTPError for bad responses (4xx or 5xx)

        # Check if content type is HTML
        content_type = response.headers.get('content-type', '').lower()
        if 'text/html' not in content_type:
            print(f"--- Skipping non-HTML content: {url} ({content_type})")
            return None, set()

    except requests.exceptions.RequestException as e:
        print(f"!!! Error fetching {url}: {e}")
        return None, set()
    except Exception as e:
        print(f"!!! Unexpected error during request for {url}: {e}")
        return None, set()

    try:
        soup = BeautifulSoup(response.content, 'html.parser')

        # --- Text Extraction ---
        # Try to find a main content area first (common patterns)
        main_content = soup.find('article') or \
                       soup.find('main') or \
                       soup.find('div', class_='post-content') or \
                       soup.find('div', id='content') or \
                       soup.find('div', class_='content')

        if main_content:
            page_text = main_content.get_text(separator=' ', strip=True)
        else:
            # Fallback to body if no specific main content area found
            body = soup.find('body')
            page_text = body.get_text(separator=' ', strip=True) if body else ""

        if not page_text:
            print(f"--- No significant text found on: {url}")
            # Keep processing for links even if text is minimal/missing

        # --- Link Extraction ---
        links_found = set()
        for a_tag in soup.find_all('a', href=True):
            href = a_tag['href']
            # Create absolute URL
            absolute_url = urljoin(url, href)

            # --- Link Filtering ---
            parsed_absolute_url = urlparse(absolute_url)

            # 1. Remove fragments (#section)
            absolute_url_no_fragment = parsed_absolute_url._replace(fragment="").geturl()

            # 2. Check if it's an HTTP/HTTPS URL
            if parsed_absolute_url.scheme not in ['http', 'https']:
                continue

            # 3. Check if it's within the original base domain
            if parsed_absolute_url.netloc != base_domain:
                continue

            # 4. Avoid revisiting
            if absolute_url_no_fragment not in visited_urls:
                 links_found.add(absolute_url_no_fragment)

        print(f"--- Found {len(links_found)} new links on {url}")
        return page_text, links_found

    except Exception as e:
        print(f"!!! Error parsing {url}: {e}")
        return None, set() # Return None for text on parsing error


def build_context_recursive(start_url, max_depth):
    """
    Builds context by recursively scraping text and links from a starting URL.

    Args:
        start_url (str): The initial URL to crawl.
        max_depth (int): Maximum depth of links to follow.

    Returns:
        str: Concatenated text content from all visited pages.
    """
    parsed_start_url = urlparse(start_url)
    base_domain = parsed_start_url.netloc
    if not base_domain:
        print(f"!!! Invalid start URL or cannot determine domain: {start_url}")
        return ""

    visited_urls = set()
    urls_to_visit = {start_url} # Set of URLs for the current depth level
    all_text_content = []
    current_depth = 0

    while current_depth <= max_depth and urls_to_visit:
        print(f"\n=== Processing Depth {current_depth} ===")
        next_level_urls = set()
        urls_at_current_depth = list(urls_to_visit) # Copy to iterate while modifying
        urls_to_visit.clear() # Prepare for the next level

        for url in urls_at_current_depth:
            # Pass the *master* visited_urls set to the function
            text, new_links = fetch_and_parse(url, visited_urls, base_domain)

            if text:
                all_text_content.append(f"\n\n--- Content from: {url} ---\n\n{text}")

            # Add newly found, valid links to the set for the *next* depth level
            # The fetch_and_parse function already ensures they haven't been visited
            next_level_urls.update(new_links)

        # Set up for the next iteration
        urls_to_visit = next_level_urls # These will be processed in the next loop
        current_depth += 1

    print(f"\n=== Crawling Finished ===")
    print(f"Visited {len(visited_urls)} unique pages.")
    return "".join(all_text_content)

# --- Execution ---
if __name__ == "__main__":
    print(f"Starting crawl from: {START_URL}")
    print(f"Maximum depth: {MAX_DEPTH}")
    print(f"Base domain constraint: {urlparse(START_URL).netloc}")
    print("-" * 30)

    context = build_context_recursive(START_URL, MAX_DEPTH)

    print("-" * 30)
    print(f"Total context length: {len(context)} characters")
    # print("\nCollected Context:\n") # Uncomment to print the whole context
    # print(context)

    # Optional: Save to a file
    try:
        with open("llm_context.txt", "w", encoding="utf-8") as f:
            f.write(f"Context built starting from: {START_URL}\n")
            f.write(f"Max Depth: {MAX_DEPTH}\n")
            f.write(f"Number of visited pages: {len(context.split('--- Content from: ')) -1 }\n") # Rough count based on marker
            f.write("="*40 + "\n\n")
            f.write(context)
        print("\nContext saved to llm_context.txt")
    except IOError as e:
        print(f"\n!!! Error saving context to file: {e}")