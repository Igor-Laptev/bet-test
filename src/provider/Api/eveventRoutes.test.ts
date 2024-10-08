import Fastify, { FastifyInstance } from 'fastify';
import request from 'supertest';
import eventRoutes from './eventRoutes';
import { prisma } from '../../__mocks__/prismaClient';

describe('Provider Event API', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = Fastify();
    server.register(eventRoutes);
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('POST /events должен вернуть ошибку при создании события с истекшим сроком', async () => {
    const expiredEvent = {
      coefficient: 1.5,
      deadline: Date.now() / 1000 - 1000,
    };

    const response = await request(server.server)
      .post('/events')
      .send(expiredEvent);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
  });

  it('POST /events должен вернуть ошибку при создании события с недопустимым коэффициентом', async () => {
    const invalidCoefficientEvent = {
      coefficient: 0.5, // Это значение меньше 1
      deadline: Math.floor(Date.now() / 1000) + 10000,
    };

    const response = await request(server.server)
      .post('/events')
      .send(invalidCoefficientEvent);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
  });

  it('DELETE /events/:id должен удалять событие по ID', async () => {
    prisma.event.findUnique.mockResolvedValueOnce({ id: 1 }); // Проверка существования
    prisma.event.delete.mockResolvedValueOnce({ id: 1 });

    const response = await request(server.server).delete('/events/1');
    expect(response.status).toBe(204);
  });
});
