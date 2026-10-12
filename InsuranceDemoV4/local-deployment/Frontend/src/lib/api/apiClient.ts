import axios from 'axios';

const GATEWAY = import.meta.env.VITE_API_GATEWAY_URL;

if (!GATEWAY) {
  throw new Error(
    'VITE_API_GATEWAY_URL is not set. Copy Frontend/.env.example to Frontend/.env and set VITE_API_GATEWAY_URL to your API gateway URL.',
  );
}

/**
 * Creates an axios instance scoped to a specific API path on the shared gateway.
 * All API modules should use this instead of calling axios.create() directly.
 *
 * @param path   The API-specific path segment,
 * @param timeout  Request timeout in ms (default 10000)
 * @param extraHeaders  Any headers beyond Content-Type / Accept
 */
export const createApiClient = (
  path: string,
  timeout = 10000,
  extraHeaders: Record<string, string> = {},
) =>
  axios.create({
    baseURL: `${GATEWAY}${path}`,
    timeout,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...extraHeaders,
    },
    withCredentials: false,
  });
