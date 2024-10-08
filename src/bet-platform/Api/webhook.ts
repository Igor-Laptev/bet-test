import { FastifyInstance } from 'fastify';
import { prisma } from '../../prismaClient.js';
import { validateNumberId } from '../../Util/common.js';

export default async function webhookRoutes(server: FastifyInstance) {
  server.post('/webhook/event-status', async (request, reply) => {
    const { eventId, status } = request.body as {
      eventId: string;
      status: string;
    };

    const validStatuses = ['won', 'lost', 'pending'];
    if (!validStatuses.includes(status)) {
      return reply.code(400).send({ error: 'Недопустимый статус.' });
    }

    try {
      const numericEventId = validateNumberId(eventId);
      const event = await prisma.event.findUnique({
        where: { id: numericEventId },
      });

      if (!event) {
        return reply.code(404).send({ error: 'Событие не найдено' });
      }

      await prisma.$transaction(async (prisma) => {
        await prisma.event.update({
          where: { id: numericEventId },
          data: { status },
        });

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
