// Описание: Валидационная схема для создания ставки

export const betCreationSchema = {
  type: 'object',
  required: ['eventId', 'amount'],
  properties: {
    eventId: { type: 'integer' },
    amount: { type: 'number', minimum: 1.0 },
  },
  additionalProperties: false,
};
