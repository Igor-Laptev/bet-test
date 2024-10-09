import Fastify, { FastifyInstance } from 'fastify';
import request from 'supertest';
import betRoutes from '../routes/betRoutes';
import { prisma } from '../../__mocks__/prismaClient';

jest.setTimeout(30000);

describe('Bet API - Additional Tests', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = Fastify();
    server.register(betRoutes);
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('DELETE /bets/:id должен возвращать 404, если ставка не найдена', async () => {
    prisma.bet.findUnique.mockResolvedValueOnce(null);

    const response = await request(server.server).delete('/bets/9999');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Ставка не найдена.');
  });

  it('DELETE /bets/:id должен удалять ставку по ID', async () => {
    prisma.bet.findUnique.mockResolvedValueOnce({
      id: 1,
      eventId: 1,
      amount: 50.0,
      status: 'pending',
    });

    prisma.bet.delete.mockResolvedValueOnce({ id: 1 });

    const response = await request(server.server).delete('/bets/1');
    expect(response.status).toBe(204);
  });

  it('POST /bets должен возвращать 400, если сумма ставки отрицательная', async () => {
    const invalidBet = { eventId: 1, amount: -50.0 };

    prisma.event.findUnique.mockResolvedValueOnce({
      id: 1,
      deadline: Math.floor(Date.now() / 1000) + 1000,
      coefficient: 1.5,
      status: 'pending',
    });

    const response = await request(server.server)
      .post('/bets')
      .send(invalidBet);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
  });

  it('PATCH /events/:id должен корректно обновлять коэффициент', async () => {
    prisma.event.findUnique.mockResolvedValueOnce({
      id: 1,
      deadline: Math.floor(Date.now() / 1000) + 1000,
      coefficient: 1.5,
      status: 'pending',
    });

    prisma.event.update.mockResolvedValueOnce({
      id: 1,
      deadline: Math.floor(Date.now() / 1000) + 1000,
      coefficient: 2.5,
      status: 'pending',
    });

    const response = await request(server.server)
      .patch('/events/1')
      .send({ coefficient: 2.5 });

    expect(response.status).toBe(200);
    expect(response.body.coefficient).toBe(2.5);
  });
});
