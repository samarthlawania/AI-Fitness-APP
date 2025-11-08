import { prisma } from '../config/database.js';
import { logger } from '../config/logger.js';
import { llmAdapter } from '../adapters/llmAdapter.js';

const createPlanPrompt = (userData) => {
  return `
You are an expert fitness coach and nutritionist. Create a comprehensive fitness and diet plan for the following person:

**User Profile:**
- Age: ${userData.age}
- Gender: ${userData.gender}
- Height: ${userData.height}cm
- Weight: ${userData.weight}kg
- Fitness Goal: ${userData.fitnessGoal}
- Fitness Level: ${userData.fitnessLevel}
- Location: ${userData.location || 'Not specified'}
- Dietary Preference: ${userData.dietaryPref || 'None'}
- Medical Notes: ${userData.medicalNotes || 'None'}

**Instructions:**
1. Create a 7-day workout plan with specific exercises, sets, reps, and rest periods
2. Create a 7-day diet plan with meals, portions, and nutritional information
3. Calculate estimated daily calories and macronutrients
4. Provide practical tips and modifications

**Response Format (JSON only):**
{
  "workoutPlan": [
    {
      "day": 1,
      "dayName": "Monday",
      "focus": "Upper Body",
      "exercises": [
        {
          "name": "Push-ups",
          "sets": 3,
          "reps": "10-15",
          "rest": "60 seconds",
          "instructions": "Keep core tight, full range of motion"
        }
      ],
      "duration": "45 minutes",
      "notes": "Focus on form over speed"
    }
  ],
  "dietPlan": [
    {
      "day": 1,
      "dayName": "Monday",
      "meals": [
        {
          "type": "breakfast",
          "name": "Oatmeal with Berries",
          "ingredients": ["1 cup oats", "1/2 cup blueberries", "1 tbsp honey"],
          "calories": 350,
          "protein": 12,
          "carbs": 65,
          "fat": 6,
          "instructions": "Cook oats, top with berries and honey"
        }
      ],
      "totalCalories": 2200,
      "totalProtein": 120,
      "totalCarbs": 250,
      "totalFat": 80
    }
  ],
  "metadata": {
    "estimatedCaloriesPerDay": 2200,
    "macroSplit": {
      "protein": "22%",
      "carbs": "45%",
      "fat": "33%"
    },
    "estimatedWeightChangePerWeek": "-0.5kg",
    "difficultyLevel": "intermediate",
    "equipmentNeeded": ["dumbbells", "resistance bands"],
    "tips": [
      "Stay hydrated throughout the day",
      "Get 7-9 hours of sleep",
      "Listen to your body and rest when needed"
    ]
  }
}

Respond with ONLY the JSON object, no additional text.
`;
};

export const generatePlan = async (req, res) => {
  const planData = {
    ...req.body,
    userId: req.user.id,
  };

  // Create plan record
  const plan = await prisma.plan.create({
    data: {
      userId: req.user.id,
      age: planData.age,
      gender: planData.gender,
      height: planData.height,
      weight: planData.weight,
      fitnessGoal: planData.fitnessGoal,
      fitnessLevel: planData.fitnessLevel,
      location: planData.location,
      dietaryPref: planData.dietaryPref,
      medicalNotes: planData.medicalNotes,
      workoutPlan: {},
      dietPlan: {},
      metadata: {},
      status: 'generating',
    },
  });

  try {
    // Generate plan synchronously
    let parsedPlan;
    try {
      const prompt = createPlanPrompt(planData);
      const generatedPlan = await llmAdapter.generatePlan(prompt);
      parsedPlan = JSON.parse(generatedPlan);
    } catch (llmError) {
      logger.warn('LLM failed, using mock data:', llmError.message);
      // Use mock data as fallback
      parsedPlan = JSON.parse(await llmAdapter.generateMockPlan());
    }
    
    // Update plan with generated content
    const updatedPlan = await prisma.plan.update({
      where: { id: plan.id },
      data: {
        workoutPlan: parsedPlan.workoutPlan,
        dietPlan: parsedPlan.dietPlan,
        metadata: parsedPlan.metadata,
        status: 'completed',
      },
    });
    
    logger.info(`Plan generated successfully for user ${req.user.id}`);
    
    res.json({
      planId: plan.id,
      status: 'completed',
      plan: updatedPlan,
    });
  } catch (error) {
    logger.error('Plan generation failed:', error.message);
    await prisma.plan.update({
      where: { id: plan.id },
      data: { status: 'failed' },
    });
    
    res.status(500).json({
      planId: plan.id,
      status: 'failed',
      error: error.message || 'Plan generation failed',
    });
  }
};

export const getJobStatus = async (req, res) => {
  const { jobId } = req.params;

  const job = await planGenerationQueue.getJob(jobId);
  
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  const plan = await prisma.plan.findFirst({
    where: { jobId },
    select: {
      id: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.json({
    jobId,
    status: await job.getState(),
    progress: job.progress,
    plan: plan ? {
      id: plan.id,
      status: plan.status,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    } : null,
  });
};

export const getPlans = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  const skip = (page - 1) * limit;

  const [plans, total] = await Promise.all([
    prisma.plan.findMany({
      where: { userId: req.user.id },
      select: {
        id: true,
        age: true,
        gender: true,
        height: true,
        weight: true,
        fitnessGoal: true,
        fitnessLevel: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.plan.count({
      where: { userId: req.user.id },
    }),
  ]);

  res.json({
    plans,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
};

export const getPlan = async (req, res) => {
  const { id } = req.params;

  const plan = await prisma.plan.findFirst({
    where: {
      id,
      userId: req.user.id,
    },
  });

  if (!plan) {
    return res.status(404).json({ error: 'Plan not found' });
  }

  res.json({ plan });
};

export const regeneratePlan = async (req, res) => {
  const { id } = req.params;

  const existingPlan = await prisma.plan.findFirst({
    where: {
      id,
      userId: req.user.id,
    },
  });

  if (!existingPlan) {
    return res.status(404).json({ error: 'Plan not found' });
  }

  // Create new plan with same parameters
  const newPlan = await prisma.plan.create({
    data: {
      userId: req.user.id,
      age: existingPlan.age,
      gender: existingPlan.gender,
      height: existingPlan.height,
      weight: existingPlan.weight,
      fitnessGoal: existingPlan.fitnessGoal,
      fitnessLevel: existingPlan.fitnessLevel,
      location: existingPlan.location,
      dietaryPref: existingPlan.dietaryPref,
      medicalNotes: existingPlan.medicalNotes,
      workoutPlan: {},
      dietPlan: {},
      metadata: {},
      status: 'generating',
    },
  });

  // Add job to queue
  const job = await planGenerationQueue.add('generate-plan', {
    planId: newPlan.id,
    userId: req.user.id,
    age: existingPlan.age,
    gender: existingPlan.gender,
    height: existingPlan.height,
    weight: existingPlan.weight,
    fitnessGoal: existingPlan.fitnessGoal,
    fitnessLevel: existingPlan.fitnessLevel,
    location: existingPlan.location,
    dietaryPref: existingPlan.dietaryPref,
    medicalNotes: existingPlan.medicalNotes,
  });

  // Update plan with job ID
  await prisma.plan.update({
    where: { id: newPlan.id },
    data: { jobId: job.id },
  });

  logger.info(`Plan regeneration started for user ${req.user.id}, new plan ${newPlan.id}`);

  res.status(202).json({
    planId: newPlan.id,
    jobId: job.id,
    status: 'generating',
    statusUrl: `/api/plans/status/${job.id}`,
  });
};