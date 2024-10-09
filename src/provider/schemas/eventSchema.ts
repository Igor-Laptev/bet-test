// Описание: Валидационная схема для создания события
export const eventCreationSchema = {
  type: 'object',
  required: ['coefficient', 'deadline'],
  properties: {
    coefficient: { type: 'number', minimum: 1.0 },
    deadline: {
      type: 'number',
      minimum: Math.floor(Date.now() / 1000), // текущий UNIX-временной штамп
    },
  },
  additionalProperties: false,
};
