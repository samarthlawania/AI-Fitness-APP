import OpenAI from 'openai';
import { logger } from '../config/logger.js';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// OpenAI LLM Adapter
class LLMAdapter {
  async generatePlan(prompt) {
    return this.generateWithOpenAI(prompt);
  }

  async generateWithOpenAI(prompt) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert fitness coach and nutritionist. Always respond with valid JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: 'json_object' },
      });

      return response.choices[0].message.content;
    } catch (error) {
      logger.error('OpenAI API error:', error);
      throw new Error('Failed to generate plan with OpenAI');
    }
  }



  // Fallback method for development/testing
  async generateMockPlan() {
    return JSON.stringify({
      workoutPlan: [
        {
          day: 1,
          dayName: 'Monday',
          focus: 'Upper Body',
          exercises: [
            {
              name: 'Push-ups',
              sets: 3,
              reps: '10-15',
              rest: '60 seconds',
              instructions: 'Keep core tight, full range of motion',
            },
            {
              name: 'Dumbbell Rows',
              sets: 3,
              reps: '12',
              rest: '90 seconds',
              instructions: 'Pull with your back muscles, not arms',
            },
          ],
          duration: '45 minutes',
          notes: 'Focus on form over speed',
        },
      ],
      dietPlan: [
        {
          day: 1,
          dayName: 'Monday',
          meals: [
            {
              type: 'breakfast',
              name: 'Oatmeal with Berries',
              ingredients: ['1 cup oats', '1/2 cup blueberries', '1 tbsp honey'],
              calories: 350,
              protein: 12,
              carbs: 65,
              fat: 6,
              instructions: 'Cook oats, top with berries and honey',
            },
          ],
          totalCalories: 2200,
          totalProtein: 120,
          totalCarbs: 250,
          totalFat: 80,
        },
      ],
      metadata: {
        estimatedCaloriesPerDay: 2200,
        macroSplit: {
          protein: '22%',
          carbs: '45%',
          fat: '33%',
        },
        estimatedWeightChangePerWeek: '-0.5kg',
        difficultyLevel: 'intermediate',
        equipmentNeeded: ['dumbbells', 'resistance bands'],
        tips: [
          'Stay hydrated throughout the day',
          'Get 7-9 hours of sleep',
          'Listen to your body and rest when needed',
        ],
      },
    });
  }
}

export const llmAdapter = new LLMAdapter();