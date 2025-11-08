// import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenAI } from '@google/genai';
import { logger } from '../config/logger.js';

// Initialize Gemini client
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

// Gemini LLM Adapter
class LLMAdapter {
  async generatePlan(prompt) {
    return this.generateWithGemini(prompt);
  }

  async generateWithGemini(prompt) {
    try {
      // Try to list available models first
      // try {
      //   const models = await genAI.listModels();
      //   logger.info('Available Gemini models:', models.map(m => m.name));
      // } catch (listError) {
      //   logger.warn('Could not list models:', listError.message);
      // }
      
      // const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const enhancedPrompt = `You are an expert fitness coach and nutritionist. Create a comprehensive fitness and diet plan. Respond with ONLY valid JSON, no additional text.

${prompt}`;
      
      const result = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: enhancedPrompt,
      });
      const text = result.text;
      
      // Clean the response to ensure it's valid JSON
      const cleanedText = text.replace(/```json\n?|```\n?/g, '').trim();
      
      return cleanedText;
    } catch (error) {
      console.log('Gemini API errorrrrr:', error);
      logger.error('Gemini API error:', {
        message: error.message,
        status: error.status,
        statusText: error.statusText,
        details: error.details || error.response?.data
      });
      throw new Error(`Failed to generate plan with Gemini: ${error.message}`);
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