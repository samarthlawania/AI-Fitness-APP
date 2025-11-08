import 'dotenv/config';
import { Worker } from 'bullmq';
import { redis } from '../config/redis.js';
import { logger } from '../config/logger.js';
import { planGenerationWorker } from './planGenerationWorker.js';
import { ttsWorker } from './ttsWorker.js';
import { imageWorker } from './imageWorker.js';
import { pdfWorker } from './pdfWorker.js';

// Plan Generation Worker
const planWorker = new Worker('plan-generation', planGenerationWorker, {
  connection: redis,
  concurrency: 2,
});

// TTS Worker
const ttsWorkerInstance = new Worker('tts-generation', ttsWorker, {
  connection: redis,
  concurrency: 3,
});

// Image Generation Worker (disabled)
// const imageWorkerInstance = new Worker('image-generation', imageWorker, {
//   connection: redis,
//   concurrency: 2,
// });

// PDF Generation Worker
const pdfWorkerInstance = new Worker('pdf-generation', pdfWorker, {
  connection: redis,
  concurrency: 2,
});

// Worker event handlers
const workers = [planWorker, ttsWorkerInstance, pdfWorkerInstance];

workers.forEach((worker) => {
  worker.on('completed', (job) => {
    logger.info(`Job ${job.id} completed in queue ${worker.name}`);
  });

  worker.on('failed', (job, err) => {
    logger.error(`Job ${job.id} failed in queue ${worker.name}:`, err);
  });

  worker.on('error', (err) => {
    logger.error(`Worker error in ${worker.name}:`, err);
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down workers gracefully');
  await Promise.all(workers.map(worker => worker.close()));
  await redis.quit();
  process.exit(0);
});

logger.info('Workers started successfully');