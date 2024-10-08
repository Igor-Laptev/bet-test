const prisma = {
  event: {
    findMany: jest.fn(),
    create: jest.fn(),
    updateMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  bet: {
    findMany: jest.fn(),
    create: jest.fn(),
    updateMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findUnique: jest.fn(),
  },
  $transaction: jest.fn(async (actions) => {
    if (!Array.isArray(actions)) {
      throw new TypeError('actions is not iterable');
    }
    return Promise.all(actions.map((action) => action()));
  }),
};

// Устанавливаем значения по умолчанию для некоторых методов
beforeEach(() => {
  jest.clearAllMocks();

  prisma.event.findUnique.mockResolvedValue({
    id: 1,
    coefficient: 1.5,
    deadline: Math.floor(Date.now() / 1000),
    status: 'pending',
  });

  prisma.bet.findUnique.mockResolvedValue({
    id: 1,
    eventId: 1,
    amount: 100.0,
    status: 'pending',
  });

  prisma.event.delete.mockResolvedValue({ id: 1 });
});

module.exports = { prisma };
