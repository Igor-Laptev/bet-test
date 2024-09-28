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
    request.log.info('Запрос на получение всех событий');
    try {
      const allEvents = await prisma.event.findMany();
      request.log.info('Все события успешно получены');
      return reply.code(200).send(allEvents);
    } catch (error) {
      request.log.error('Ошибка получения событий:', error);
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

      request.log.info('Запрос на создание нового события');
      try {
        const newEvent = await prisma.event.create({
          data: {
            coefficient,
            deadline,
            status: 'pending',
          },
        });
        request.log.info(`Событие успешно создано с ID ${newEvent.id}`);
        return reply.code(201).send(newEvent);
      } catch (error) {
        request.log.error('Ошибка создания события:', error);
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

      request.log.info(`Запрос на обновление статуса события с ID ${id}`);
      try {
        const numberId = validateNumberId(id);
        const updatedEvent = await updateEventStatus(numberId, status);
        request.log.info(`Статус события с ID ${numberId} успешно обновлен`);
        return reply.code(200).send(updatedEvent);
      } catch (error) {
        request.log.error('Ошибка обновления статуса события:', error);
        return reply
          .code(500)
          .send({ error: 'Ошибка обновления статуса события.' });
      }
    }
  );
}
