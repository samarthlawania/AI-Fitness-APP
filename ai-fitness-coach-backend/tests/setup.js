import { beforeAll, afterAll } from '@jest/globals';
import { prisma } from '../src/config/database.js';
import { redis } from '../src/config/redis.js';

beforeAll(async () => {
  // Setup test database
  process.env.NODE_ENV = 'test';
});

afterAll(async () => {
  // Cleanup
  await prisma.$disconnect();
  await redis.quit();
});