import {
  configureSync,
  getConsoleSink,
  getLogger,
  getTextFormatter,
  isLogLevel,
  type LogLevel
} from '@logtape/logtape';

/**
 * Logging goes through LogTape. Every logger sits under `basura`, so `logger('anilist')` is `basura.anilist`.
 *
 * This module configures LogTape when imported, so entry points import it before anything that might log while loading.
 */
const ROOT = 'basura';

export const logger = (...category: string[]) => getLogger([ROOT, ...category]);

/**
 * `LOG_LEVEL` overrides the default, e.g. `debug` in production.
 * Read straight from the environment because this module loads before `env.ts`.
 */
const requestedLevel = Bun.env.LOG_LEVEL?.trim().toLowerCase();
const lowestLevel: LogLevel =
  requestedLevel && isLogLevel(requestedLevel) ? requestedLevel : Bun.env.NODE_ENV === 'production' ? 'info' : 'debug';

configureSync({
  sinks: {
    console: getConsoleSink({ formatter: getTextFormatter({ timestamp: 'date-time', value: 'bare' }) })
  },
  loggers: [
    { category: [ROOT], lowestLevel, sinks: ['console'] },
    { category: ['logtape', 'meta'], lowestLevel: 'warning', sinks: ['console'] }
  ]
});
