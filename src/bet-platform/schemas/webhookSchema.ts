export const updateStatusSchema = {
  type: 'object',
  required: ['status'],
  properties: {
    status: {
      type: 'string',
      enum: ['pending', 'first_team_won', 'second_team_won'],
      errorMessage: {
        enum: 'Недопустимый статус.',
      },
    },
  },
  additionalProperties: false,
  errorMessage: {
    required: {
      status: 'Поле "status" обязательно.',
    },
  },
};
