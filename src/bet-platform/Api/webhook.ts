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

      const updatedBets = await prisma.bet.updateMany({
        where: { eventId: numericEventId },
        data: { status },
      });

      return reply
        .code(200)
        .send({ message: 'Статусы ставок обновлены', updatedBets });
    } catch (error) {
      console.error(error);
      return reply
        .code(500)
        .send({ error: 'Ошибка при обновлении статусов ставок.' });
    }
  });
}
