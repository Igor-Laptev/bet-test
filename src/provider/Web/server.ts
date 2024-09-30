import Fastify from 'fastify';
import eventRoutes from '../Api/eventRoutes.js';
import cors from '@fastify/cors';
import { prisma } from '../../prismaClient.js';
import axios from 'axios';
import errorHandler from '../../Util/errorHandler.js';

export async function updateEventStatus(numericId: number, status: string) {
  try {
    // Обновляем статус события в базе данных
    const updatedEvent = await prisma.event.update({
      where: { id: numericId },
      data: { status },
    });

    try {
      // Отправляем вебхук в bet-platform
      await axios.post('http://localhost:3001/webhook/event-status', {
        eventId: numericId,
        status,
      });
      console.log('Вебхук успешно отправлен в bet-platform');
    } catch (webhookError) {
      console.error(
        'Ошибка при отправке вебхука в bet-platform:',
        webhookError
      );
    }

    return updatedEvent;
  } catch (error) {
    console.error('Ошибка при обновлении события и отправке вебхука:', error);
    throw new Error('Ошибка обновления события.');
  }
}


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
