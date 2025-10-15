import { sleep } from './sleep';

export const safeFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit<RequestInitCfProperties>
): Promise<Response> => {
  const response = await fetch(input, init);

  // 1. Check for Rate Limit Exceeded (HTTP 429)
  if (response.status === 429) {
    console.warn({ message: '⚠️ Rate limit exceeded. Checking Retry-After header...' });

    // Get the value of the Retry-After header
    const retryAfter = response.headers.get('Retry-After');

    if (retryAfter) {
      // The value is usually in seconds
      const waitTimeSeconds = parseInt(retryAfter, 10);

      // Wait for the specified time
      await sleep(waitTimeSeconds * 1000);
      // Retry the request recursively
      return safeFetch(input, init);
    } else {
      // Handle case where Retry-After is missing
      throw new Error('Rate limit exceeded (429) but no Retry-After header provided.');
    }
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
};
