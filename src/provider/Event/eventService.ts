import { v4 as uuidv4 } from 'uuid';

interface Event {
  id: string;
  coefficient: number;
  deadline: number;
  status: 'pending' | 'first_team_won' | 'second_team_won';
}

// Массив для хранения событий в памяти
const events: Event[] = [];

// Получение всех событий
export function getAllEvents(): Event[] {
  return events;
}

// Создание нового события
export function createEvent(coefficient: number, deadline: number): Event {
  const newEvent: Event = {
    id: uuidv4(),
    coefficient,
    deadline,
    status: 'pending',
  };
  events.push(newEvent);
  return newEvent;
}

// Обновление статуса события
export function updateEventStatus(
  id: string,
  status: 'first_team_won' | 'second_team_won'
): Event | null {
  const event = events.find((e) => e.id === id);
  if (event) {
    event.status = status;
    return event;
  }
  return null;
}
