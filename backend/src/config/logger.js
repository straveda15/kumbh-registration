import path from 'path';
import { fileURLToPath } from 'url';
import winston from 'winston';
import config from './env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsDir = path.join(__dirname, '..', 'logs');

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

const consoleFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp: ts, stack }) => `[${ts}] ${level}: ${stack || message}`)
);

const fileFormat = combine(timestamp(), errors({ stack: true }), json());

// Vercel Functions run on a filesystem that's read-only outside /tmp, and
// their only real log sink is stdout/stderr (captured as Runtime Logs) —
// writing to src/logs/*.log there would fail on every single request.
// `VERCEL` is set by the platform on every deployment, so this is the one
// place that needs to know it's running there; local dev and any other
// host are unaffected and keep writing to the log files as before.
const isServerless = Boolean(process.env.VERCEL);

const logger = winston.createLogger({
  level: config.isProduction ? 'info' : 'debug',
  transports: isServerless
    ? []
    : [
        new winston.transports.File({
          filename: path.join(logsDir, 'error.log'),
          level: 'error',
          format: fileFormat,
        }),
        new winston.transports.File({
          filename: path.join(logsDir, 'combined.log'),
          format: fileFormat,
        }),
      ],
  exceptionHandlers: isServerless
    ? []
    : [new winston.transports.File({ filename: path.join(logsDir, 'exceptions.log') })],
  rejectionHandlers: isServerless
    ? []
    : [new winston.transports.File({ filename: path.join(logsDir, 'rejections.log') })],
});

// Console output: always on Vercel (it's the only sink there — JSON-
// formatted so it stays parseable in the Runtime Logs viewer), otherwise
// only outside production, exactly as before.
if (isServerless) {
  logger.add(new winston.transports.Console({ format: fileFormat }));
} else if (!config.isProduction) {
  logger.add(new winston.transports.Console({ format: consoleFormat }));
}

export const httpLogStream = {
  write: (message) => logger.info(message.trim()),
};

export default logger;
