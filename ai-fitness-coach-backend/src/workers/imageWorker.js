import { imageAdapter } from '../adapters/imageAdapter.js';
import { storageService } from '../services/storageService.js';
import { logger } from '../config/logger.js';

export const imageWorker = async (job) => {
  const { prompt, type, userId } = job.data;

  try {
    logger.info(`Starting image generation for job ${job.id}`);
    
    await job.updateProgress(20);

    // Generate image
    const imageBuffer = await imageAdapter.generateImage(prompt, type);
    
    await job.updateProgress(60);

    // Upload to storage
    const fileName = `images/${type}/${userId}/${Date.now()}.png`;
    const imageUrl = await storageService.uploadFile(fileName, imageBuffer, 'image/png');
    
    await job.updateProgress(100);

    logger.info(`Image generation completed for job ${job.id}`);
    
    return { imageUrl, status: 'completed' };
  } catch (error) {
    logger.error(`Image generation failed for job ${job.id}:`, error);
    throw error;
  }
};