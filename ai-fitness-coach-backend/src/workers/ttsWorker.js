import { ttsAdapter } from '../adapters/ttsAdapter.js';
import { storageService } from '../services/storageService.js';
import { prisma } from '../config/database.js';
import { logger } from '../config/logger.js';

export const ttsWorker = async (job) => {
  const { text, userId, planId } = job.data;

  try {
    logger.info(`Starting TTS generation for job ${job.id}`);
    
    await job.updateProgress(20);

    // Generate TTS audio
    const audioBuffer = await ttsAdapter.generateSpeech(text);
    
    await job.updateProgress(60);

    // Upload to storage
    const fileName = `tts/${userId}/${Date.now()}.mp3`;
    const audioUrl = await storageService.uploadFile(fileName, audioBuffer, 'audio/mpeg');
    
    await job.updateProgress(80);

    // Update plan with audio URL if planId provided
    if (planId) {
      await prisma.plan.update({
        where: { id: planId },
        data: { audioUrl },
      });
    }

    await job.updateProgress(100);

    logger.info(`TTS generation completed for job ${job.id}`);
    
    return { audioUrl, status: 'completed' };
  } catch (error) {
    logger.error(`TTS generation failed for job ${job.id}:`, error);
    throw error;
  }
};