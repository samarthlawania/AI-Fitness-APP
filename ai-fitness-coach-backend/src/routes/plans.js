import express from 'express';
import rateLimit from 'express-rate-limit';
import { authenticate } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';
import * as planController from '../controllers/planController.js';

const router = express.Router();

// Rate limiting for plan generation
const planGenerationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: parseInt(process.env.PLAN_GENERATION_LIMIT_PER_HOUR) || 5,
  message: { error: 'Plan generation limit exceeded. Try again later.' },
  keyGenerator: (req) => req.user.id,
});

/**
 * @swagger
 * /api/plans/generate:
 *   post:
 *     summary: Generate a new fitness plan
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - age
 *               - gender
 *               - height
 *               - weight
 *               - fitnessGoal
 *               - fitnessLevel
 *             properties:
 *               age:
 *                 type: integer
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               height:
 *                 type: number
 *               weight:
 *                 type: number
 *               fitnessGoal:
 *                 type: string
 *                 enum: [weight_loss, muscle_gain, endurance, general_fitness]
 *               fitnessLevel:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *               location:
 *                 type: string
 *               dietaryPref:
 *                 type: string
 *                 enum: [vegetarian, vegan, keto, paleo, none]
 *               medicalNotes:
 *                 type: string
 *     responses:
 *       202:
 *         description: Plan generation started
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Rate limit exceeded
 */
router.post('/generate', authenticate, planGenerationLimiter, validate(schemas.generatePlan), planController.generatePlan);

/**
 * @swagger
 * /api/plans/status/{jobId}:
 *   get:
 *     summary: Get plan generation status
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job status retrieved
 *       404:
 *         description: Job not found
 */
router.get('/status/:jobId', authenticate, planController.getJobStatus);

/**
 * @swagger
 * /api/plans:
 *   get:
 *     summary: Get user's plans
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Plans retrieved successfully
 */
router.get('/', authenticate, planController.getPlans);

/**
 * @swagger
 * /api/plans/{id}:
 *   get:
 *     summary: Get a specific plan
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Plan retrieved successfully
 *       404:
 *         description: Plan not found
 */
router.get('/:id', authenticate, planController.getPlan);

/**
 * @swagger
 * /api/plans/{id}/regenerate:
 *   post:
 *     summary: Regenerate an existing plan
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       202:
 *         description: Plan regeneration started
 *       404:
 *         description: Plan not found
 *       429:
 *         description: Rate limit exceeded
 */
router.post('/:id/regenerate', authenticate, planGenerationLimiter, planController.regeneratePlan);

export default router;