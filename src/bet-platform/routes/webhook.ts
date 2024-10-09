import { FastifyInstance } from 'fastify';
import { prisma } from '../../prismaClient';
import { updateStatusSchema } from '../../Util/validationSchemas';

export default async function webhookRoutes(server: FastifyInstance) {
  server.post(
    '/webhook/event-status',
    {
      schema: {
        description: 'Обновляет статус события',
        tags: ['Webhook'],
        body: updateStatusSchema,
        response: {
          200: { type: 'object', properties: { message: { type: 'string' } } },
          400: { type: 'object', properties: { error: { type: 'string' } } },
          404: { type: 'object', properties: { error: { type: 'string' } } },
        },
      },
    },
    async (request, reply) => {
      const { eventId, status } = request.body as {
        eventId: string;
        status: string;
      };

      // Парсим eventId и проверяем его
      const numericEventId = parseInt(eventId, 10);
      if (isNaN(numericEventId)) {
        return reply
          .status(400)
          .send({ error: 'Некорректный идентификатор события.' });
      }

      try {
        // Поиск события по eventId
        const event = await prisma.event.findUnique({
          where: { id: numericEventId },
        });

        if (!event) {
          return reply.status(404).send({ error: 'Событие не найдено' });
        }

        // Обновление статуса события
        await prisma.event.update({
          where: { id: numericEventId },
          data: { status },
        });
        return reply
          .status(200)
          .send({ message: 'Статусы события и ставок обновлены' });
      } catch (error) {
        console.error('Ошибка обновления статуса события:', error);
        return reply
          .status(500)
          .send({ error: 'Ошибка при обновлении статусов.' });
      }
    }
  );
}
