import Fastify, { FastifyInstance } from 'fastify';
import request from 'supertest';
import betRoutes from './betRoutes';
import { prisma } from '../../__mocks__/prismaClient';

jest.setTimeout(30000);

describe('Bet API', () => {
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

  it('POST /bets должен вернуть ошибку при создании ставки с истекшим сроком события', async () => {
    const expiredBet = { eventId: 1, amount: 50.0 };

    prisma.event.findUnique.mockResolvedValueOnce({
      id: 1,
      coefficient: 1.5,
      deadline: 1000000,
      status: 'pending',
    });

    const response = await request(server.server)
      .post('/bets')
      .send(expiredBet);

    console.log('Expected expired event deadline: 1000000');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Срок действия события истек.');
  });

  it('POST /bets должен создать ставку с корректными данными', async () => {
    const validBet = { eventId: 1, amount: 50.0 };

    prisma.event.findUnique.mockResolvedValueOnce({
      id: 1,
      deadline: Math.floor(Date.now() / 1000) + 1000,
      coefficient: 1.5,
      status: 'pending',
    });

    prisma.bet.create.mockResolvedValueOnce({
      id: 1,
      eventId: 1,
      amount: 50.0,
      status: 'pending',
    });

    const response = await request(server.server).post('/bets').send(validBet);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
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

  it('PATCH /events/:id должен обновить коэффициент события', async () => {
    prisma.event.findUnique.mockResolvedValueOnce({
      id: 1,
      deadline: Math.floor(Date.now() / 1000) + 1000,
      coefficient: 1.5,
      status: 'pending',
    });

    prisma.event.update.mockResolvedValueOnce({
      id: 1,
      deadline: Math.floor(Date.now() / 1000) + 1000,
      coefficient: 2.0,
    });

    const response = await request(server.server)
      .patch('/events/1')
      .send({ coefficient: 2.0 });

    expect(response.status).toBe(200);
    expect(response.body.coefficient).toBe(2.0);
  });
});
