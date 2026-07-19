import mongoose from 'mongoose';
import config from '../config/env.js';
import logger from '../config/logger.js';

mongoose.set('strictQuery', true);

mongoose.connection.on('connected', () => {
  logger.info('MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB connection disconnected');
});

// Cached on `globalThis`, not just a module-scoped variable: on Vercel this
// module is evaluated fresh on every "cold start" but the same process (and
// therefore the same globalThis) is reused for every "warm" invocation that
// follows, so caching the connect() PROMISE here — not just the resolved
// connection — means (a) warm invocations skip reconnecting entirely, and
// (b) two requests that both hit a cold container at once await the same
// in-flight promise instead of racing two separate mongoose.connect() calls.
// Locally (node src/server.js) this collapses to "connect once at boot",
// identical to the previous behavior.
const globalForMongoose = globalThis;

export const connectDatabase = () => {
  if (!globalForMongoose.__mongooseConnectPromise) {
    globalForMongoose.__mongooseConnectPromise = mongoose.connect(config.mongoUri).catch((err) => {
      // Don't cache a permanent failure — let the next invocation retry.
      globalForMongoose.__mongooseConnectPromise = null;
      throw err;
    });
  }

  return globalForMongoose.__mongooseConnectPromise;
};

export const disconnectDatabase = async () => {
  await mongoose.disconnect();
  globalForMongoose.__mongooseConnectPromise = null;
};
