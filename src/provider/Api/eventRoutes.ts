import { FastifyInstance } from 'fastify';
import { prisma } from '../../prismaClient';
import { updateEventStatus } from '../Service/eventService';
import { validateNumberId } from '../../Util/common';
import {
  eventCreationSchema,
  updateStatusSchema,
} from '../../Util/validationSchemas';

export default async function eventRoutes(server: FastifyInstance) {
  // Получение всех событий
  server.get('/events', async (request, reply) => {
    try {
      const allEvents = await prisma.event.findMany();
      return reply.code(200).send(allEvents);
    } catch (error) {
      console.error('Ошибка получения событий:', error);
      return reply.code(500).send({ error: 'Ошибка получения событий.' });
    }
  });

  // Создание нового события с валидацией
  server.post(
    '/events',
    { schema: eventCreationSchema },
    async (request, reply) => {
      const { coefficient, deadline } = request.body as {
        coefficient: number;
        deadline: number;
      };

      try {
        const newEvent = await prisma.event.create({
          data: {
            coefficient,
            deadline,
            status: 'pending',
          },
        });
        return reply.code(201).send(newEvent);
      } catch (error) {
        console.error('Ошибка создания события:', error);
        return reply.code(500).send({ error: 'Ошибка создания события.' });
      }
    }
  );

  // Обновление статуса события с отправкой вебхука
  server.put(
    '/events/:id',
    { schema: updateStatusSchema },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const { status } = request.body as { status: string };

      try {
        const numericId = validateNumberId(id);
        const updatedEvent = await updateEventStatus(
          numericId,
          status
        );
        return reply.code(200).send(updatedEvent);
      } catch (error) {
        console.error('Ошибка обновления статуса события:', error);
        return reply
          .code(500)
          .send({ error: 'Ошибка обновления статуса события.' });
      }
    }
  );
}
