import winston from 'winston';
import Transport from 'winston-transport';

export const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

const LOGTAIL_REMOTE = `https://in.logtail.com`;

export class LogtailTransport extends Transport {
  context: ExecutionContext;
  token: string;

  constructor(token: string, context: ExecutionContext, opts?: winston.transport.TransportStreamOptions) {
    super(opts);
    this.token = token;
    this.context = context;
  }

  public log(entry: winston.LogEntry, next: () => void) {
    const writeRemote = new Promise<void>(async (resolve, _) => {
      await fetch(LOGTAIL_REMOTE, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          message: `[${entry.level}] ${entry.message}`,
        }),
      });
      next();
      resolve();
    });

    this.context.waitUntil(writeRemote);
  }
}
