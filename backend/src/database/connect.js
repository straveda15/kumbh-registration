import mongoose from 'mongoose';
import config from '../config/env.js';
import logger from '../config/logger.js';

mongoose.set('strictQuery', true);

export const connectDatabase = async () => {
  mongoose.connection.on('connected', () => {
    logger.info('MongoDB connection established');
  });

  mongoose.connection.on('error', (err) => {
    logger.error(`MongoDB connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB connection disconnected');
  });

  await mongoose.connect(config.mongoUri);

  return mongoose.connection;
};

export const disconnectDatabase = async () => {
  await mongoose.disconnect();
};
