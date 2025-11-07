import { prisma } from '../config/database.js';

export const getProfile = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      age: true,
      gender: true,
      height: true,
      weight: true,
      location: true,
      fitnessLevel: true,
      fitnessGoal: true,
      dietaryPref: true,
      medicalNotes: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.json({ user });
};

export const updateProfile = async (req, res) => {
  const updates = req.body;

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: updates,
    select: {
      id: true,
      name: true,
      email: true,
      age: true,
      gender: true,
      height: true,
      weight: true,
      location: true,
      fitnessLevel: true,
      fitnessGoal: true,
      dietaryPref: true,
      medicalNotes: true,
      updatedAt: true,
    },
  });

  res.json({ user });
};