import express from 'express';
import { authenticate, adminOnly } from '../middleware/auth.js';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

/**
 * @swagger
 * /api/admin/jobs:
 *   get:
 *     summary: Get job queue status (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Job status retrieved
 *       403:
 *         description: Admin access required
 */
router.get('/jobs', authenticate, adminOnly, adminController.getJobStatus);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get system statistics (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved
 *       403:
 *         description: Admin access required
 */
router.get('/stats', authenticate, adminOnly, adminController.getStats);

export default router;