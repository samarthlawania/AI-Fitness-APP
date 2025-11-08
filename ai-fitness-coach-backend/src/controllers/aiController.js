import { ttsAdapter } from '../adapters/ttsAdapter.js';
import { prisma } from '../config/database.js';
import { logger } from '../config/logger.js';

export const generateTTS = async (req, res) => {
  const { planId, text } = req.body;
  let ttsText = text;

  if (!ttsText && !planId) {
    return res.status(400).json({ error: 'Either text or planId is required' });
  }

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

    ttsText = generatePlanSummary(plan);
  }

  try {
    logger.info(`Generating TTS for user ${req.user.id}`);
    
    const audioBuffer = await ttsAdapter.generateSpeech(ttsText);
    
    // Return audio file directly
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
      'Content-Disposition': 'attachment; filename="speech.mp3"'
    });
    
    res.send(audioBuffer);
  } catch (error) {
    logger.error('TTS generation failed:', error);
    res.status(500).json({ error: 'TTS generation failed' });
  }
};

export const generateImage = async (req, res) => {
  const { prompt, type } = req.body;

  logger.info(`Mock image generation for user ${req.user.id}`);

  res.json({
    status: 'completed',
    message: 'Image generation completed (mock)',
    prompt,
    type,
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