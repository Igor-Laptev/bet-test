import { FastifyInstance } from 'fastify';
import { prisma } from '../../prismaClient.js';
import { eventCreationSchema } from '../../Util/validationSchemas.js';

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
    {
      schema: {
        description: 'Создает новое событие',
        tags: ['Events'],
        body: eventCreationSchema,
        response: {
          201: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              coefficient: { type: 'number' },
              deadline: { type: 'integer' },
              status: { type: 'string' },
            },
          },
          400: { type: 'object', properties: { error: { type: 'string' } } },
        },
      },
    },
    async (request, reply) => {
      const { coefficient, deadline } = request.body as {
        coefficient: number;
        deadline: number;
      };
      if (deadline < Math.floor(Date.now() / 1000))
        return reply.code(400).send({ error: 'Срок действия события истек.' });
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
