import { prisma } from '../../prismaClient';
import axios from 'axios';

// Описание: Сервис для обновления статусов событий и отправки вебхуков
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
