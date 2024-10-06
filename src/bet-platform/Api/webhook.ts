import { FastifyInstance } from 'fastify';
import { prisma } from '../../prismaClient.js';
import { validateNumberId } from '../../Util/common.js';

// Описание: Маршрут для обработки вебхуков от provider сервиса
export default async function webhookRoutes(server: FastifyInstance) {
  // Обработка статуса события
  server.post('/webhook/event-status', async (request, reply) => {
    const { eventId, status } = request.body as {
      eventId: string;
      status: string;
    };

    try {
      const numericEventId = validateNumberId(eventId);

      // Использование транзакции для обновления статусов
      await prisma.$transaction(async (prisma) => {
        // Обновляем статус события
        await prisma.event.update({
          where: { id: numericEventId },
          data: { status },
        });

        // Обновляем статусы связанных ставок
        await prisma.bet.updateMany({
          where: { eventId: numericEventId },
          data: { status },
        });
      });

      return reply
        .code(200)
        .send({ message: 'Статусы события и ставок обновлены' });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Ошибка при обновлении статусов.' });
    }
  });
}
