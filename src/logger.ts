export type LogLevel = 'error' | 'warn' | 'info' | 'trace' | 'debug';

export interface LogEntry {
  level: LogLevel;
  message: string;
}

export interface Transport {
  log(entry: LogEntry, obj?: any): void;
}

export class Logger {
  transports: Transport[];

  constructor(options: { transports: Transport[] }) {
    this.transports = options.transports;
  }

  log(level: LogLevel, message: string, obj?: any) {
    this.transports.forEach((t) => t.log({ level, message }, obj));
  }

  error(msg: string, obj?: any) {
    this.log('error', msg, obj);
  }

  info(msg: string, obj?: any) {
    this.log('info', msg, obj);
  }

  verbose(msg: string, obj?: any) {
    this.log('trace', msg, obj);
  }

  trace(msg: string, obj?: any) {
    this.log('trace', msg, obj);
  }

  warn(msg: string, obj?: any) {
    this.log('warn', msg, obj);
  }

  add(transport: Transport) {
    this.transports.push(transport);
  }
}

export class ConsoleTransport implements Transport {
  log(entry: LogEntry, obj?: any): void {
    switch (entry.level) {
      case 'info':
        console.info(entry.message, obj);
        break;
      case 'debug':
        console.debug(entry.message, obj);
        break;
      case 'trace':
        console.trace(entry.message, obj);
        break;
      case 'warn':
        console.warn(entry.message, obj);
        break;
      case 'error':
        console.error(entry.message, obj);
        break;
      default:
        console.log(entry.message, obj);
    }
  }
}

export const logger = new Logger({
  transports: [new ConsoleTransport()],
});

const LOGTAIL_REMOTE = `https://in.logtail.com`;

export class LogtailTransport implements Transport {
  context: ExecutionContext;
  token: string;

  constructor(token: string, context: ExecutionContext) {
    this.token = token;
    this.context = context;
  }

  log(entry: LogEntry, obj?: any) {
    this.context.passThroughOnException();
    this.context.waitUntil(
      fetch(LOGTAIL_REMOTE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          level: entry.level,
          message: entry.message,
          context: {
            ...obj,
          },
        }),
      })
    );
  }
}
