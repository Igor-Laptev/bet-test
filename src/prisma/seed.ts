import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Создаем два события
  const event1 = await prisma.event.create({
    data: {
      coefficient: 1.85,
      deadline: 1750000000,
      status: 'pending',
    },
  });

  const event2 = await prisma.event.create({
    data: {
      coefficient: 2.0,
      deadline: 1760000000,
      status: 'pending',
    },
  });

  console.log('Созданы события:', event1.id, event2.id);

  // Создаем две ставки, привязанные к событиям
  await prisma.bet.create({
    data: {
      eventId: event1.id, 
      amount: 100.0,
      potentialWin: 185.0, 
      status: 'open', 
    },
  });

  await prisma.bet.create({
    data: {
      eventId: event2.id, 
      amount: 200.0,
      potentialWin: 400.0, 
      status: 'open', 
    },
  });

  console.log('Созданы две ставки.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
