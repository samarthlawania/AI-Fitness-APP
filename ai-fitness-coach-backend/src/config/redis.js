import { createClient } from 'redis';
import { logger } from './logger.js';

export const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redis.on('error', (err) => logger.error('Redis Client Error', err));
redis.on('connect', () => logger.info('Redis connected successfully'));

try {
  await redis.connect();
} catch (error) {
  logger.warn('Redis connection failed, running without queue support:', error.message);
}