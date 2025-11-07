import { prisma } from '../config/database.js';
import { planGenerationQueue } from '../workers/queues.js';
import { logger } from '../config/logger.js';

export const generatePlan = async (req, res) => {
  const planData = {
    ...req.body,
    userId: req.user.id,
  };

  // Create plan record
  const plan = await prisma.plan.create({
    data: {
      userId: req.user.id,
      age: planData.age,
      gender: planData.gender,
      height: planData.height,
      weight: planData.weight,
      fitnessGoal: planData.fitnessGoal,
      fitnessLevel: planData.fitnessLevel,
      location: planData.location,
      dietaryPref: planData.dietaryPref,
      medicalNotes: planData.medicalNotes,
      workoutPlan: {},
      dietPlan: {},
      metadata: {},
      status: 'generating',
    },
  });

  // Add job to queue
  const job = await planGenerationQueue.add('generate-plan', {
    planId: plan.id,
    ...planData,
  });

  // Update plan with job ID
  await prisma.plan.update({
    where: { id: plan.id },
    data: { jobId: job.id },
  });

  logger.info(`Plan generation started for user ${req.user.id}, plan ${plan.id}`);

  res.status(202).json({
    planId: plan.id,
    jobId: job.id,
    status: 'generating',
    statusUrl: `/api/plans/status/${job.id}`,
  });
};

export const getJobStatus = async (req, res) => {
  const { jobId } = req.params;

  const job = await planGenerationQueue.getJob(jobId);
  
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  const plan = await prisma.plan.findFirst({
    where: { jobId },
    select: {
      id: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.json({
    jobId,
    status: await job.getState(),
    progress: job.progress,
    plan: plan ? {
      id: plan.id,
      status: plan.status,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    } : null,
  });
};

export const getPlans = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  const skip = (page - 1) * limit;

  const [plans, total] = await Promise.all([
    prisma.plan.findMany({
      where: { userId: req.user.id },
      select: {
        id: true,
        age: true,
        gender: true,
        height: true,
        weight: true,
        fitnessGoal: true,
        fitnessLevel: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.plan.count({
      where: { userId: req.user.id },
    }),
  ]);

  res.json({
    plans,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
};

export const getPlan = async (req, res) => {
  const { id } = req.params;

  const plan = await prisma.plan.findFirst({
    where: {
      id,
      userId: req.user.id,
    },
  });

  if (!plan) {
    return res.status(404).json({ error: 'Plan not found' });
  }

  res.json({ plan });
};

export const regeneratePlan = async (req, res) => {
  const { id } = req.params;

  const existingPlan = await prisma.plan.findFirst({
    where: {
      id,
      userId: req.user.id,
    },
  });

  if (!existingPlan) {
    return res.status(404).json({ error: 'Plan not found' });
  }

  // Create new plan with same parameters
  const newPlan = await prisma.plan.create({
    data: {
      userId: req.user.id,
      age: existingPlan.age,
      gender: existingPlan.gender,
      height: existingPlan.height,
      weight: existingPlan.weight,
      fitnessGoal: existingPlan.fitnessGoal,
      fitnessLevel: existingPlan.fitnessLevel,
      location: existingPlan.location,
      dietaryPref: existingPlan.dietaryPref,
      medicalNotes: existingPlan.medicalNotes,
      workoutPlan: {},
      dietPlan: {},
      metadata: {},
      status: 'generating',
    },
  });

  // Add job to queue
  const job = await planGenerationQueue.add('generate-plan', {
    planId: newPlan.id,
    userId: req.user.id,
    age: existingPlan.age,
    gender: existingPlan.gender,
    height: existingPlan.height,
    weight: existingPlan.weight,
    fitnessGoal: existingPlan.fitnessGoal,
    fitnessLevel: existingPlan.fitnessLevel,
    location: existingPlan.location,
    dietaryPref: existingPlan.dietaryPref,
    medicalNotes: existingPlan.medicalNotes,
  });

  // Update plan with job ID
  await prisma.plan.update({
    where: { id: newPlan.id },
    data: { jobId: job.id },
  });

  logger.info(`Plan regeneration started for user ${req.user.id}, new plan ${newPlan.id}`);

  res.status(202).json({
    planId: newPlan.id,
    jobId: job.id,
    status: 'generating',
    statusUrl: `/api/plans/status/${job.id}`,
  });
};