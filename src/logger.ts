import { ConsoleTransport, Logger } from '@studio-bogus/logging';

export const logger: Logger = new Logger({
  transports: [new ConsoleTransport()],
});
