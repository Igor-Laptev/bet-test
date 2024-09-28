import { FastifyInstance } from 'fastify';
import { prisma } from '../../prismaClient';
import { betCreationSchema } from '../../Util/validationSchemas';

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
      console.error(error);
      return reply
        .code(500)
        .send({ error: 'Ошибка при получении событий для ставок.' });
    }
  });

  // Создание новой ставки с валидацией
  server.post(
    '/bets',
    { schema: betCreationSchema },
    async (request, reply) => {
      const { eventId, amount } = request.body as {
        eventId: number;
        amount: number;
      };

      try {
        const event = await prisma.event.findUnique({
          where: { id: eventId },
        });

        if (!event || event.deadline < Math.floor(Date.now() / 1000)) {
          return reply
            .code(400)
            .send({
              error: 'Событие не найдено или истек дедлайн для ставок.',
            });
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
        console.error(error);
        return reply.code(500).send({ error: 'Ошибка при создании ставки.' });
      }
    }
  );

  // Получение всех ставок
  server.get('/bets', async (request, reply) => {
    try {
      const allBets = await prisma.bet.findMany();
      return reply.code(200).send(allBets);
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Ошибка при получении ставок.' });
    }
  });
}
