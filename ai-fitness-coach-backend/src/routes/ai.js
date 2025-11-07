import express from 'express';
import rateLimit from 'express-rate-limit';
import { authenticate } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';
import * as aiController from '../controllers/aiController.js';

const router = express.Router();

// Rate limiting for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { error: 'AI service rate limit exceeded. Try again later.' },
  keyGenerator: (req) => req.user.id,
});

/**
 * @swagger
 * /api/ai/tts:
 *   post:
 *     summary: Generate text-to-speech audio
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               planId:
 *                 type: string
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: TTS audio generated successfully
 *       400:
 *         description: Validation error
 *       429:
 *         description: Rate limit exceeded
 */
router.post('/tts', authenticate, aiLimiter, validate(schemas.ttsRequest), aiController.generateTTS);

/**
 * @swagger
 * /api/ai/images:
 *   post:
 *     summary: Generate images for exercises or meals
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prompt
 *               - type
 *             properties:
 *               prompt:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [exercise, meal]
 *     responses:
 *       200:
 *         description: Image generated successfully
 *       400:
 *         description: Validation error
 *       429:
 *         description: Rate limit exceeded
 */
router.post('/images', authenticate, aiLimiter, validate(schemas.imageRequest), aiController.generateImage);

export default router;