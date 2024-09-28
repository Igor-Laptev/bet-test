import { prisma } from '../../prismaClient';
import axios from 'axios';

export async function updateEventStatus(
  numericId: number,
  status: string
) {
  try {
    const updatedEvent = await prisma.event.update({
      where: { id: numericId },
      data: { status },
    });

    // Отправляем вебхук в bet-platform
    await axios.post('http://localhost:3001/webhook/event-status', {
      eventId: numericId,
      status,
    });
    console.log('Вебхук успешно отправлен в bet-platform');

    return updatedEvent;
  } catch (error) {
    console.error('Ошибка при обновлении события и отправке вебхука:', error);
    throw new Error('Ошибка обновления события.');
  }
}
