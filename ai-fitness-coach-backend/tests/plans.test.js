import { describe, test, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../src/server.js';
import { prisma } from '../src/config/database.js';
import { llmAdapter } from '../src/adapters/llmAdapter.js';

// Mock LLM adapter
jest.mock('../src/adapters/llmAdapter.js', () => ({
  llmAdapter: {
    generatePlan: jest.fn(),
  },
}));

describe('Plans', () => {
  let authToken;
  let userId;

  beforeEach(async () => {
    // Clean up test data
    await prisma.plan.deleteMany();
    await prisma.user.deleteMany({
      where: { email: { contains: 'test' } },
    });

    // Create and login test user
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

    authToken = registerResponse.body.accessToken;
    userId = registerResponse.body.user.id;

    // Mock LLM response
    llmAdapter.generatePlan.mockResolvedValue(
      JSON.stringify({
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
                instructions: 'Keep core tight',
              },
            ],
            duration: '45 minutes',
            notes: 'Focus on form',
          },
        ],
        dietPlan: [
          {
            day: 1,
            dayName: 'Monday',
            meals: [
              {
                type: 'breakfast',
                name: 'Oatmeal',
                calories: 350,
                protein: 12,
                carbs: 65,
                fat: 6,
              },
            ],
            totalCalories: 2200,
          },
        ],
        metadata: {
          estimatedCaloriesPerDay: 2200,
          difficultyLevel: 'beginner',
        },
      })
    );
  });

  describe('POST /api/plans/generate', () => {
    test('should generate a new plan', async () => {
      const planData = {
        age: 25,
        gender: 'male',
        height: 180,
        weight: 75,
        fitnessGoal: 'weight_loss',
        fitnessLevel: 'beginner',
      };

      const response = await request(app)
        .post('/api/plans/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send(planData)
        .expect(202);

      expect(response.body).toHaveProperty('planId');
      expect(response.body).toHaveProperty('jobId');
      expect(response.body).toHaveProperty('statusUrl');
      expect(response.body.status).toBe('generating');
    });

    test('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/plans/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should require authentication', async () => {
      const response = await request(app)
        .post('/api/plans/generate')
        .send({
          age: 25,
          gender: 'male',
          height: 180,
          weight: 75,
          fitnessGoal: 'weight_loss',
          fitnessLevel: 'beginner',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/plans', () => {
    test('should get user plans', async () => {
      const response = await request(app)
        .get('/api/plans')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('plans');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.plans)).toBe(true);
    });

    test('should require authentication', async () => {
      const response = await request(app)
        .get('/api/plans')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });
});