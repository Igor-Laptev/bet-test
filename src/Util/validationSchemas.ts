// Описание: Валидационные схемы для обработки данных в API

// Схема для создания события
export const eventCreationSchema = {
  body: {
    type: 'object',
    required: ['coefficient', 'deadline'],
    properties: {
      coefficient: { type: 'number', minimum: 1.0 },
      deadline: {
        type: 'number',
        minimum: Math.floor(Date.now() / 1000),
      },
    },
    additionalProperties: false,
  },
};

// Схема для обновления статуса события
export const updateStatusSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
  body: {
    type: 'object',
    required: ['status'],
    properties: {
      status: {
        type: 'string',
        enum: ['pending', 'first_team_won', 'second_team_won'],
      },
    },
    additionalProperties: false,
  },
};

// Схема для создания ставки
export const betCreationSchema = {
  body: {
    type: 'object',
    required: ['eventId', 'amount'],
    properties: {
      eventId: { type: 'integer' },
      amount: { type: 'number', minimum: 1.0 },
    },
    additionalProperties: false,
  },
};
