/** Sleeps for the given number of milliseconds. */
export const sleep = (ms: number): Promise<void> => Bun.sleep(Math.max(0, ms));
