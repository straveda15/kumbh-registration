import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import config from './config/env.js';
import logger, { httpLogStream } from './config/logger.js';
import { notFound } from './middlewares/notFound.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';
import routes from './routes/index.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    // Function form, not a static string/array: lets us log a clear reason
    // when an origin is rejected instead of the browser's opaque "blocked
    // by CORS policy" with no hint of what the server actually expected.
    origin: (origin, callback) => {
      // No Origin header at all (curl, server-to-server, same-origin) — not
      // a cross-origin request, nothing to check.
      if (!origin) return callback(null, true);

      if (config.corsOrigins.includes(origin)) return callback(null, true);

      logger.warn(
        `CORS: rejected origin "${origin}" — allowed origin(s): ${config.corsOrigins.join(', ')}`
      );
      return callback(new Error(`Origin "${origin}" is not allowed by CORS`));
    },
    credentials: true,
  })
);
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use(morgan(config.isProduction ? 'combined' : 'dev', { stream: httpLogStream }));

app.use(`/api/${config.apiVersion}`, routes);

app.use(notFound);
app.use(errorHandler);

export default app;
