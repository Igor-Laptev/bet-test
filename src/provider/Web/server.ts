import Fastify from 'fastify';
import eventRoutes from '../Api/eventRoutes.js';
import cors from '@fastify/cors';
import { prisma } from '../../prismaClient.js';
import axios from 'axios';
import errorHandler from '../../Util/errorHandler.js';

// Инициализация Fastify сервера
const server = Fastify();

// Регистрация CORS
server.register(cors, { origin: '*' });

// Добавляем маршрут для корневого URL
server.get('/', async (request, reply) => {
  return { message: 'Приветсвуем на provider API' };
});

// Регистрация маршрутов для событий
server.register(eventRoutes);

// Глобальный обработчик ошибок
server.setErrorHandler(errorHandler);

// Запуск сервера
server.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server летает на ${address}`);
});
