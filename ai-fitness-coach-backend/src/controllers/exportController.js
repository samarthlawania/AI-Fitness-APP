import { pdfQueue } from '../workers/queues.js';
import { prisma } from '../config/database.js';
import { logger } from '../config/logger.js';

export const generatePDF = async (req, res) => {
  const { planId } = req.body;

  const plan = await prisma.plan.findFirst({
    where: {
      id: planId,
      userId: req.user.id,
    },
  });

  if (!plan) {
    return res.status(404).json({ error: 'Plan not found' });
  }

  if (plan.status !== 'completed') {
    return res.status(400).json({ error: 'Plan is not ready for PDF generation' });
  }

  // Add PDF generation job to queue
  const job = await pdfQueue.add('generate-pdf', {
    planId,
    userId: req.user.id,
  });

  logger.info(`PDF generation started for user ${req.user.id}, plan ${planId}`);

  res.status(202).json({
    jobId: job.id,
    status: 'processing',
    message: 'PDF generation started',
  });
};