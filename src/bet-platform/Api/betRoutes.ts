import { FastifyInstance } from 'fastify';
import { prisma } from '../../prismaClient.js';
import { betCreationSchema } from '../../Util/validationSchemas.js';

export default async function betRoutes(server: FastifyInstance) {
  server.get('/events', async (request, reply) => {
    try {
      const events = await prisma.event.findMany({
        where: {
          deadline: {
            gt: Math.floor(Date.now() / 1000),
          },
        },
        select: {
          id: true,
          coefficient: true,
          deadline: true,
        },
      });
      return reply.code(200).send(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      return reply
        .code(500)
        .send({ error: 'Ошибка при получении событий для ставок.' });
    }
  });

  server.post(
    '/bets',
    {
      schema: {
        description: 'Создает новую ставку',
        tags: ['Bets'],
        body: betCreationSchema,
        response: {
          201: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              eventId: { type: 'integer' },
              amount: { type: 'number' },
              potentialWin: { type: 'number' },
              status: { type: 'string' },
            },
          },
          400: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
          404: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { eventId, amount } = request.body as {
        eventId: number;
        amount: number;
      };

      if (amount <= 0) {
        return reply
          .code(400)
          .send({ error: 'Сумма ставки должна быть положительной.' });
      }

      try {
        const event = await prisma.event.findUnique({
          where: { id: eventId },
        });

        const currentTime = Math.floor(Date.now() / 1000);
        console.log('Event:', event);
        console.log('Current time:', currentTime);

        if (!event) {
          console.log(`Event with ID ${eventId} not found`);
          return reply.code(404).send({ error: 'Событие не найдено.' });
        }

        if (event.deadline < currentTime) {
          console.log(`Event with ID ${eventId} is expired`);
          return reply
            .code(400)
            .send({ error: 'Срок действия события истек.' });
        }

        const newBet = await prisma.bet.create({
          data: {
            eventId,
            amount,
            potentialWin: amount * event.coefficient,
            status: 'pending',
          },
        });

        return reply.code(201).send(newBet);
      } catch (error) {
        console.error('Error creating bet:', error);
        return reply.code(500).send({ error: 'Ошибка при создании ставки.' });
      }
    }
  );

  // Маршрут для удаления ставки по ID
  server.delete('/bets/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const bet = await prisma.bet.findUnique({ where: { id: Number(id) } });
      if (!bet) {
        return reply.code(404).send({ error: 'Ставка не найдена.' });
      }

      await prisma.bet.delete({ where: { id: Number(id) } });
      return reply.code(204).send();
    } catch (error) {
      console.error('Error deleting bet:', error);
      return reply.code(500).send({ error: 'Ошибка при удалении ставки.' });
    }
  });

  server.patch('/events/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { coefficient } = request.body as { coefficient: number };

    try {
      const event = await prisma.event.findUnique({
        where: { id: Number(id) },
      });

      if (!event) {
        return reply.code(404).send({ error: 'Событие не найдено.' });
      }

      const updatedEvent = await prisma.event.update({
        where: { id: Number(id) },
        data: { coefficient },
      });

      return reply.code(200).send(updatedEvent);
    } catch (error) {
      console.error('Error updating event:', error);
      return reply.code(500).send({ error: 'Ошибка при обновлении события.' });
    }
  });
}
