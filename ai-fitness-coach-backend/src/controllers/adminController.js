import { planGenerationQueue, ttsQueue, imageQueue, pdfQueue } from '../workers/queues.js';
import { prisma } from '../config/database.js';

export const getJobStatus = async (req, res) => {
  const queues = [
    { name: 'plan-generation', queue: planGenerationQueue },
    { name: 'tts-generation', queue: ttsQueue },
    { name: 'image-generation', queue: imageQueue },
    { name: 'pdf-generation', queue: pdfQueue },
  ];

  const queueStats = await Promise.all(
    queues.map(async ({ name, queue }) => {
      const [waiting, active, completed, failed] = await Promise.all([
        queue.getWaiting(),
        queue.getActive(),
        queue.getCompleted(),
        queue.getFailed(),
      ]);

      return {
        name,
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
      };
    })
  );

  res.json({ queues: queueStats });
};

export const getStats = async (req, res) => {
  const [
    totalUsers,
    totalPlans,
    completedPlans,
    failedPlans,
    plansToday,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.plan.count(),
    prisma.plan.count({ where: { status: 'completed' } }),
    prisma.plan.count({ where: { status: 'failed' } }),
    prisma.plan.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ]);

  res.json({
    users: {
      total: totalUsers,
    },
    plans: {
      total: totalPlans,
      completed: completedPlans,
      failed: failedPlans,
      today: plansToday,
      successRate: totalPlans > 0 ? ((completedPlans / totalPlans) * 100).toFixed(2) : 0,
    },
    timestamp: new Date().toISOString(),
  });
};