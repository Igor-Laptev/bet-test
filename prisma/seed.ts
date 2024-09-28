import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.event.create({
    data: {
      coefficient: 1.85,
      deadline: 1750000000,
      status: 'pending',
    },
  });
  console.log('Сиды накатились удачно!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
