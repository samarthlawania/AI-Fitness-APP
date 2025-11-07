import { prisma } from '../config/database.js';
import { logger } from '../config/logger.js';
import { llmAdapter } from '../adapters/llmAdapter.js';

export const planGenerationWorker = async (job) => {
  const { planId, userId, age, gender, height, weight, fitnessGoal, fitnessLevel, location, dietaryPref, medicalNotes } = job.data;

  try {
    logger.info(`Starting plan generation for plan ${planId}`);
    
    // Update job progress
    await job.updateProgress(10);

    // Generate plan using LLM
    const prompt = createPlanPrompt({
      age,
      gender,
      height,
      weight,
      fitnessGoal,
      fitnessLevel,
      location,
      dietaryPref,
      medicalNotes,
    });

    await job.updateProgress(30);

    const generatedPlan = await llmAdapter.generatePlan(prompt);
    
    await job.updateProgress(70);

    // Parse and validate the generated plan
    const parsedPlan = JSON.parse(generatedPlan);
    
    if (!parsedPlan.workoutPlan || !parsedPlan.dietPlan || !parsedPlan.metadata) {
      throw new Error('Invalid plan structure from LLM');
    }

    // Update plan in database
    await prisma.plan.update({
      where: { id: planId },
      data: {
        workoutPlan: parsedPlan.workoutPlan,
        dietPlan: parsedPlan.dietPlan,
        metadata: parsedPlan.metadata,
        status: 'completed',
      },
    });

    await job.updateProgress(100);

    logger.info(`Plan generation completed for plan ${planId}`);
    
    return { planId, status: 'completed' };
  } catch (error) {
    logger.error(`Plan generation failed for plan ${planId}:`, error);
    
    // Update plan status to failed
    await prisma.plan.update({
      where: { id: planId },
      data: {
        status: 'failed',
      },
    });

    throw error;
  }
};

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