import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      age: 30,
      gender: 'other',
      height: 175,
      weight: 70,
      fitnessLevel: 'advanced',
      fitnessGoal: 'general_fitness',
    },
  });

  // Create test user
  const testPassword = await bcrypt.hash('test123', 12);
  
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: testPassword,
      age: 25,
      gender: 'male',
      height: 180,
      weight: 75,
      fitnessLevel: 'beginner',
      fitnessGoal: 'weight_loss',
      dietaryPref: 'none',
    },
  });

  console.log('Seeding completed!');
  console.log('Admin user:', admin.email);
  console.log('Test user:', testUser.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });