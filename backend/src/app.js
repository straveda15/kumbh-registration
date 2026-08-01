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

logger.info(`[CORS Debug] NODE_ENV: ${config.env}`);
logger.info(`[CORS Debug] FRONTEND_URL: ${config.frontendUrl}`);
logger.info(`[CORS Debug] AADHAAR_FRONTEND_URL: ${config.aadhaarFrontendUrl}`);
logger.info(`[CORS Debug] CORS_ORIGIN: ${process.env.CORS_ORIGIN || ''}`);
logger.info(`[CORS Debug] config.corsOrigins: ${JSON.stringify(config.corsOrigins)}`);

// CORS middleware MUST execute before helmet, express.json(), routes, and error handlers.
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no Origin header (curl, Postman, server-to-server)
      if (!origin) {
        logger.info('[CORS Debug] Request with no Origin header allowed');
        return callback(null, true);
      }

      const cleanOrigin = origin.trim().replace(/\/$/, '');
      const isAllowed = config.corsOrigins.includes(cleanOrigin);

      logger.info('[CORS Check]', {
        incomingOrigin: origin,
        normalizedOrigin: cleanOrigin,
        allowedOrigins: config.corsOrigins,
        isAllowed,
      });

      if (isAllowed) {
        return callback(null, true);
      }

      logger.warn('[CORS Rejected]', {
        incomingOrigin: origin,
        normalizedOrigin: cleanOrigin,
        allowedOrigins: config.corsOrigins,
      });
      return callback(null, false);
    },
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use(morgan(config.isProduction ? 'combined' : 'dev', { stream: httpLogStream }));

app.use(`/api/${config.apiVersion}`, routes);

app.use(notFound);
app.use(errorHandler);

export default app;
