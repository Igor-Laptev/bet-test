// Описание: Общие утилиты для обработки данных

// Функция для валидации числового идентификатора
export function validateNumberId(id: string | number): number {
  const numberId = Number(id);
  if (isNaN(numberId)) {
    throw new Error('Некорректный идентификатор.');
  }
  return numberId;
}
