/**
 * Sleeps for a specified amount of time.
 * @param {number} ms - Milliseconds to sleep.
 * @returns {Promise<void>}
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((r) => setTimeout(r, ms));
};
