import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Crear usuarios de prueba
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'john.doe@example.com' },
      update: {},
      create: {
        id: uuidv4(),
        email: 'john.doe@example.com',
        name: 'John Doe',
      },
    }),
    prisma.user.upsert({
      where: { email: 'jane.smith@example.com' },
      update: {},
      create: {
        id: uuidv4(),
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
      },
    }),
    prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        id: uuidv4(),
        email: 'admin@example.com',
        name: 'Admin User',
      },
    }),
    prisma.user.upsert({
      where: { email: 'developer@example.com' },
      update: {},
      create: {
        id: uuidv4(),
        email: 'developer@example.com',
        name: 'Developer User',
      },
    }),
  ]);

  console.log(
    '✅ Users created:',
    users.map((u) => `${u.name} (${u.email})`),
  );

  // Crear algunas reservas de ejemplo
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const tomorrowEnd = new Date(tomorrow);
  tomorrowEnd.setHours(11, 0, 0, 0);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(14, 0, 0, 0);

  const nextWeekEnd = new Date(nextWeek);
  nextWeekEnd.setHours(15, 30, 0, 0);

  const bookings = await Promise.all([
    prisma.booking.upsert({
      where: { id: uuidv4() },
      update: {},
      create: {
        id: uuidv4(),
        title: 'Team Stand-up Meeting',
        description: 'Daily team synchronization meeting',
        startDate: tomorrow,
        endDate: tomorrowEnd,
        organizerId: users[0].id,
        participants: [users[1].id, users[2].id],
      },
    }),
    prisma.booking.upsert({
      where: { id: uuidv4() },
      update: {},
      create: {
        id: uuidv4(),
        title: 'Project Planning Session',
        description: 'Planning session for the next sprint',
        startDate: nextWeek,
        endDate: nextWeekEnd,
        organizerId: users[1].id,
        participants: [users[0].id, users[3].id],
      },
    }),
  ]);

  console.log(
    '✅ Bookings created:',
    bookings.map((b) => b.title),
  );

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(() => {
    return prisma.$disconnect();
  });
