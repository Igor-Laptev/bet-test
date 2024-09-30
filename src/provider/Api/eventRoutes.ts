import { FastifyInstance } from 'fastify';
import { prisma } from '../../prismaClient.js';

import { updateEventStatus } from '../Service/eventService.js';
import { validateNumberId } from '../../Util/common.js';
import {
  eventCreationSchema,
  updateStatusSchema,
} from '../../Util/validationSchemas.js';

// Описание: Маршруты для управления событиями
export default async function eventRoutes(server: FastifyInstance) {
  server.get('/events', async (request, reply) => {
    try {
      await prisma.$connect(); // Проверка подключения к БД
      console.log('Успешное подключение к базе данных');
      const allEvents = await prisma.event.findMany();
      console.log('События:', allEvents);
      return reply.code(200).send(allEvents);
    } catch (error) {
      console.error('Ошибка подключения к БД или получения данных:', error);
      return reply
        .code(500)
        .send({ error: 'Ошибка подключения к базе данных.' });
    }
  });

  // Получение события по id
  server.get('/events/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const event = await prisma.event.findUnique({
        where: { id: Number(id) },
      });

      if (!event) {
        return reply.code(404).send({ error: 'Событие не найдено.' });
      }

      return reply.code(200).send(event);
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Ошибка при получении события.' });
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
