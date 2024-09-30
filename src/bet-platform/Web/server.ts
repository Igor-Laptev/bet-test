import Fastify from 'fastify';
import betRoutes from '../Api/betRoutes.js';
import webhookRoutes from '../Api/webhook.js';

// Описание: Инициализация Fastify сервера и подключение маршрутов
const server = Fastify();

// Добавляем маршрут для корневого URL
server.get('/', async (request, reply) => {
  return { message: 'Приветсвуем на bet-platform API' };
});

// Подключаем маршруты для управления ставками
server.register(betRoutes);

// Подключаем маршруты для обработки вебхуков
server.register(webhookRoutes);

// Запуск сервера на порту 3001
server.listen({ port: 3001, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Bet-platform API летает на ${address}`);
});
