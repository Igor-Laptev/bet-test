import { PrismaClient } from '@prisma/client';

// Описание: Инициализация Prisma клиента для взаимодействия с базой данных
const prisma = new PrismaClient();

export { prisma };
