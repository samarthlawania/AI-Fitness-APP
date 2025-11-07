import { ttsQueue, imageQueue } from '../workers/queues.js';
import { prisma } from '../config/database.js';
import { logger } from '../config/logger.js';

export const generateTTS = async (req, res) => {
  const { planId, text } = req.body;
  let ttsText = text;

  // If planId is provided, get plan content for TTS
  if (planId) {
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
      return res.status(400).json({ error: 'Plan is not ready for TTS generation' });
    }

    // Generate summary text from plan
    ttsText = generatePlanSummary(plan);
  }

  // Add TTS job to queue
  const job = await ttsQueue.add('generate-tts', {
    text: ttsText,
    userId: req.user.id,
    planId,
  });

  logger.info(`TTS generation started for user ${req.user.id}, job ${job.id}`);

  res.json({
    jobId: job.id,
    status: 'processing',
    message: 'TTS generation started',
  });
};

export const generateImage = async (req, res) => {
  const { prompt, type } = req.body;

  // Add image generation job to queue
  const job = await imageQueue.add('generate-image', {
    prompt,
    type,
    userId: req.user.id,
  });

  logger.info(`Image generation started for user ${req.user.id}, job ${job.id}`);

  res.json({
    jobId: job.id,
    status: 'processing',
    message: 'Image generation started',
  });
};

const generatePlanSummary = (plan) => {
  const workoutDays = plan.workoutPlan.length;
  const totalExercises = plan.workoutPlan.reduce((total, day) => total + day.exercises.length, 0);
  
  return `
    Your personalized fitness plan is ready! 
    This ${workoutDays}-day program includes ${totalExercises} exercises designed for your ${plan.fitnessGoal} goal.
    Your estimated daily calorie target is ${plan.metadata.estimatedCaloriesPerDay} calories.
    The plan is designed for ${plan.metadata.difficultyLevel} level.
    Remember to stay hydrated, get adequate rest, and listen to your body throughout your fitness journey.
    Good luck achieving your fitness goals!
  `.trim();
};