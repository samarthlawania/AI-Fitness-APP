import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as exportController from '../controllers/exportController.js';

const router = express.Router();

/**
 * @swagger
 * /api/export/pdf:
 *   post:
 *     summary: Generate PDF for a plan
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - planId
 *             properties:
 *               planId:
 *                 type: string
 *     responses:
 *       202:
 *         description: PDF generation started
 *       404:
 *         description: Plan not found
 */
router.post('/pdf', authenticate, exportController.generatePDF);

export default router;