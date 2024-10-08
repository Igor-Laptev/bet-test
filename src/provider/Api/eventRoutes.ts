import { FastifyInstance } from 'fastify';
import { prisma } from '../../prismaClient.js';
import { updateEventStatus } from '../Service/eventService.js';
import { validateNumberId } from '../../Util/common.js';
import {
  eventCreationSchema,
  updateStatusSchema,
} from '../../Util/validationSchemas.js';

export default async function eventRoutes(server: FastifyInstance) {
  server.get('/events', async (request, reply) => {
    try {
      const allEvents = await prisma.event.findMany();
      return reply.code(200).send(allEvents);
    } catch (error) {
      return reply.code(500).send({ error: 'Ошибка при получении событий.' });
    }
  });

  server.post(
    '/events',
    { schema: eventCreationSchema },
    async (request, reply) => {
      const { coefficient, deadline } = request.body as {
        coefficient: number;
        deadline: number;
      };

      if (deadline < Math.floor(Date.now() / 1000)) {
        return reply.code(400).send({ error: 'Срок действия события истек.' });
      }

      try {
        const newEvent = await prisma.event.create({
          data: { coefficient, deadline, status: 'pending' },
        });
        return reply.code(201).send(newEvent);
      } catch (error) {
        return reply.code(500).send({ error: 'Ошибка создания события.' });
      }
    }
  );

  server.delete('/events/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const event = await prisma.event.findUnique({
        where: { id: Number(id) },
      });
      if (!event) {
        return reply.code(404).send({ error: 'Событие не найдено.' });
      }

      await prisma.event.delete({ where: { id: Number(id) } });
      return reply.code(204).send();
    } catch (error) {
      return reply.code(500).send({ error: 'Ошибка при удалении события.' });
    }
  });
}
