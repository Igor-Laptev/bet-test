export function validateNumberId(id: string): number {
  const numberId = parseInt(id, 10);
  if (isNaN(numberId)) {
    throw new Error('Некорректный идентификатор.');
  }
  return numberId;
}
