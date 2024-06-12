import os
import time
import argparse
import difflib
import re
import json

import google.generativeai as genai
import diff_match_patch as dmp_module

genai.configure(api_key=os.environ["GEMINI_API_KEY"])


def upload_to_gemini(path, mime_type=None):
    file = genai.upload_file(path, mime_type=mime_type)
    print(f"Uploaded file '{file.display_name}' as: {file.uri}")
    return file


def wait_for_files_active(files):
    print("Waiting for file processing...")
    for name in (file.name for file in files):
        file = genai.get_file(name)
        while file.state.name == "PROCESSING":
            print(".", end="", flush=True)
            time.sleep(10)
            file = genai.get_file(name)
        if file.state.name != "ACTIVE":
            raise Exception(f"File {file.name} failed to process")
    print("...all files ready")
    print()


def concatenate_text_files(directory):
    """Concatenates all text files in a directory recursively.

    Args:
      directory: The path to the directory.

    Returns:
      The path to the concatenated file.
    """
    concatenated_file_path = os.path.join(directory, "concatenated_files.txt")
    with open(concatenated_file_path, "w") as outfile:
        for root, _, files in os.walk(directory):
            for file in files:
                if (
                    file.endswith(".ts")
                    or file.endswith(".tsx")
                    or file.endswith(".html")
                    or file.endswith(".scss")
                ):
                    filepath = os.path.join(root, file)
                    with open(filepath, "r") as infile:
                        outfile.write(f"## {file}\n")
                        outfile.write(infile.read())
                        outfile.write("\n")
    return concatenated_file_path


def generate_diff(original_file_path, modified_file_path):
    """Generates a diff between two files.

    Args:
      original_file_path: The path to the original file.
      modified_file_path: The path to the modified file.

    Returns:
      A string containing the diff.
    """
    with open(original_file_path, "r") as original_file, open(
        modified_file_path, "r"
    ) as modified_file:
        original_lines = original_file.readlines()
        modified_lines = modified_file.readlines()
        diff = difflib.ndiff(original_lines, modified_lines)
        return "\n".join(diff)


def save_changed_files(changed_files, directory):
    """Saves the changed files to the specified directory.

    Args:
      changed_files: A dictionary of changed files.
      directory: The path to the directory where files will be saved.
    """
    for filename, content in changed_files.items():
        with open(os.path.join(directory, filename), "w") as f:
            f.write(content)


def main():
    text1 = """def greet(name):
  print(f"Hello, {name}!")

greet("Alice")"""
    text2 = """def greet(name):
  print(f"Hello, {name}! How are you doing today?")

greet("Bob")"""
    dmp = dmp_module.diff_match_patch()
    diff = dmp.diff_main(text1, text2)
    dmp.diff_cleanupSemantic(diff)
    patches = dmp.patch_make(text1, diff)
    patch_text = dmp.patch_toText(patches)
    print(patch_text)

    parser = argparse.ArgumentParser(
        description="Upload a file or directory to Gemini and interact with it."
    )
    parser.add_argument("path", help="Path to a file or directory.")
    args = parser.parse_args()

    path = args.path

    generation_config = {
        "temperature": 0,
        "top_p": 0.95,
        "top_k": 64,
        "max_output_tokens": 100000,
        "response_mime_type": "text/plain",
    }

    # Load the prompt from the file
    with open("./tools/ardent_prompt.txt", "r") as f:
        prompt = f.read()

    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config=generation_config,
        system_instruction=prompt,
    )

    if os.path.isdir(path):
        concatenated_file_path = concatenate_text_files(path)
        file = upload_to_gemini(concatenated_file_path, mime_type="text/plain")
        # os.remove(os.path.join(path, "concatenated_files.txt"))
    else:
        file = upload_to_gemini(path)

    wait_for_files_active([file])

    chat_session = model.start_chat(
        history=[
            {
                "role": "user",
                "parts": [
                    file,
                ],
            },
        ]
    )

    while True:
        user_input = input("You: ")
        if user_input.lower() == "exit":
            break
        response = chat_session.send_message(user_input)

        # # Collect responses until a complete JSON is received
        # max_retries = 10
        # full_response = ""
        # for _ in range(max_retries):
        #     full_response += response.text
        #     print(f"Received response: {response.text}")
        #     try:
        #         response_json = json.loads(full_response)
        #         break  # Successfully parsed, exit the loop
        #     except json.JSONDecodeError:
        #         print("Partial response received. Waiting for more...")
        #         response = chat_session.send_message("continue")

        # Output the message
        print(f"Gemini: {response.text}")

        # # Extract and save changed files
        # changed_files = response_json.get("changed_files")
        # if changed_files:
        #     save_changed_files(changed_files, path)
        #     print(f"Saved changed files to {path}")


if __name__ == "__main__":
    main()
