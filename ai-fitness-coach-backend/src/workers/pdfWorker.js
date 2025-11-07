import { pdfService } from '../services/pdfService.js';
import { storageService } from '../services/storageService.js';
import { prisma } from '../config/database.js';
import { logger } from '../config/logger.js';

export const pdfWorker = async (job) => {
  const { planId, userId } = job.data;

  try {
    logger.info(`Starting PDF generation for job ${job.id}`);
    
    await job.updateProgress(20);

    // Get plan data
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
      include: { user: true },
    });

    if (!plan) {
      throw new Error('Plan not found');
    }

    await job.updateProgress(40);

    // Generate PDF
    const pdfBuffer = await pdfService.generatePlanPDF(plan);
    
    await job.updateProgress(80);

    // Upload to storage
    const fileName = `pdfs/${userId}/${planId}.pdf`;
    const pdfUrl = await storageService.uploadFile(fileName, pdfBuffer, 'application/pdf');
    
    // Update plan with PDF URL
    await prisma.plan.update({
      where: { id: planId },
      data: { pdfUrl },
    });

    await job.updateProgress(100);

    logger.info(`PDF generation completed for job ${job.id}`);
    
    return { pdfUrl, status: 'completed' };
  } catch (error) {
    logger.error(`PDF generation failed for job ${job.id}:`, error);
    throw error;
  }
};