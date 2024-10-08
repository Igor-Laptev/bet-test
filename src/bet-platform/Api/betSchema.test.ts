import Fastify, { FastifyInstance } from 'fastify';
import request from 'supertest';
import betRoutes from './betRoutes';
import { prisma } from '../../__mocks__/prismaClient';

describe('Bet Creation Schema Validation', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = Fastify();
    server.register(betRoutes);
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  it('should fail when "amount" is less than 1.0', async () => {
    const invalidBet = {
      eventId: 1,
      amount: -10,
    };

    const response = await request(server.server)
      .post('/bets')
      .send(invalidBet);

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Bad Request');
  });

  it('should fail when "eventId" is missing', async () => {
    const invalidBet = {
      amount: 100,
    };

    const response = await request(server.server)
      .post('/bets')
      .send(invalidBet);

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Bad Request');
  });
});
