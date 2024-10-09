import Fastify from 'fastify';
import betRoutes from '../routes/betRoutes.js';
import webhookRoutes from '../routes/webhook.js';
import errorHandler from '../../Util/errorHandler.js';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

// Описание: Инициализация Fastify сервера и подключение маршрутов
const server = Fastify();

// Swagger documentation configuration
server.register(swagger, {
  swagger: {
    info: {
      title: 'Bet Platform API',
      description: 'API for managing bets and events',
      version: '1.0.0',
    },
    host: 'localhost:3001',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
});

// Swagger UI
server.register(swaggerUi, {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'none',
    deepLinking: false,
  },
  uiHooks: {
    onRequest: function (request, reply, next) {
      next();
    },
    preHandler: function (request, reply, next) {
      next();
    },
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
});

// Добавляем маршрут для корневого URL
server.get('/', async (request, reply) => {
  return { message: 'Приветсвуем на bet-platform API' };
});

// Подключаем маршруты для управления ставками
server.register(betRoutes);

// Подключаем маршруты для обработки вебхуков
server.register(webhookRoutes);

// Глобальный обработчик ошибок
server.setErrorHandler(errorHandler); // Регистрируем глобальный обработчик ошибок

// Запуск сервера на порту 3001
server.listen({ port: 3001, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Bet-platform API летает на ${address}`);
});
