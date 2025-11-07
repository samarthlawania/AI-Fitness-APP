import { z } from 'zod';

export const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors,
      });
    }
  };
};

// Common validation schemas
export const schemas = {
  register: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(8).max(100),
  }),

  login: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),

  updateProfile: z.object({
    name: z.string().min(2).max(100).optional(),
    age: z.number().int().min(13).max(120).optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    height: z.number().min(100).max(250).optional(),
    weight: z.number().min(30).max(300).optional(),
    location: z.string().max(100).optional(),
    fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    fitnessGoal: z.enum(['weight_loss', 'muscle_gain', 'endurance', 'general_fitness']).optional(),
    dietaryPref: z.enum(['vegetarian', 'vegan', 'keto', 'paleo', 'none']).optional(),
    medicalNotes: z.string().max(500).optional(),
  }),

  generatePlan: z.object({
    age: z.number().int().min(13).max(120),
    gender: z.enum(['male', 'female', 'other']),
    height: z.number().min(100).max(250),
    weight: z.number().min(30).max(300),
    fitnessGoal: z.enum(['weight_loss', 'muscle_gain', 'endurance', 'general_fitness']),
    fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']),
    location: z.string().max(100).optional(),
    dietaryPref: z.enum(['vegetarian', 'vegan', 'keto', 'paleo', 'none']).optional(),
    medicalNotes: z.string().max(500).optional(),
  }),

  ttsRequest: z.object({
    planId: z.string().optional(),
    text: z.string().max(5000).optional(),
  }).refine(data => data.planId || data.text, {
    message: "Either planId or text must be provided"
  }),

  imageRequest: z.object({
    prompt: z.string().min(1).max(200),
    type: z.enum(['exercise', 'meal']),
  }),
};