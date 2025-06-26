/**
 * Generates a route with the correct base path (/app or /demo).
 * This utility inspects the current window location to determine the
 * correct base path, making it usable from any component without needing
 * to pass down props or use hooks.
 *
 * @param path The path to append to the base route (e.g., '/players' or `/players/${playerName}`).
 * @returns The full path with the correct base route (e.g., '/demo/players').
 */
export const getRoute = (path: string): string => {
  // This assumes client-side rendering where window.location is available.
  const currentPath = window.location.pathname;
  const baseRoute = currentPath.startsWith('/demo') ? '/demo' : '/app';

  // Clean the path to prevent duplication (e.g., getRoute('/app/players'))
  // and ensure it starts with a single slash.
  const cleanPath = path.replace(/^\/app|^\/demo/, '').replace(/^\/*/, '/');

  // Handle the root path case
  if (cleanPath === '/') {
    return baseRoute;
  }

  return `${baseRoute}${cleanPath}`;
};