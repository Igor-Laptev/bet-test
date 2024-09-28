import Fastify from 'fastify';
import betRoutes from '../Api/betRoutes';
import webhookRoutes from '../Api/webhook';

const server = Fastify();

server.get('/', async (request, reply) => {
  return { message: 'Приветсвуем на bet-platform API' };
});

// Подключаем маршруты для управления ставками
server.register(betRoutes);

server.register(webhookRoutes);

// Запускаем сервер
server.listen({ port: 3001 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Bet-platform API летает на ${address}`);
});
