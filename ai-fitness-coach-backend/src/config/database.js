import { PrismaClient } from '@prisma/client';
import { logger } from './logger.js';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Connection test
prisma.$connect()
  .then(() => logger.info('Database connected successfully'))
  .catch((error) => logger.error('Database connection failed:', error));