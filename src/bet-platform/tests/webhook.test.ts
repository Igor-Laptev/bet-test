import Fastify, { FastifyInstance } from 'fastify';
import request from 'supertest';
import webhookRoutes from '../routes/webhook';
import { prisma } from '../../__mocks__/prismaClient';

describe('Webhook Event Status API', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = Fastify();
    server.register(webhookRoutes);
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Тест на несуществующее событие
  // it('должен вернуть ошибку для несуществующего события', async () => {
  //   prisma.event.findUnique.mockResolvedValueOnce(null);

  //   const response = await request(server.server)
  //     .post('/webhook/event-status')
  //     .send({ eventId: '999', status: 'pending' }); // Используем допустимый статус

  //   expect(response.status).toBe(404);
  //   expect(response.body.error).toBe('Событие не найдено');
  // });

  // Тест на обновление статуса
  // it('POST /webhook/event-status должен обновлять статус для завершенного события', async () => {
  //   prisma.event.findUnique.mockResolvedValueOnce({
  //     id: 1,
  //     coefficient: 1.85,
  //     deadline: 1750000000,
  //     status: 'pending',
  //   });
  //   prisma.event.update.mockResolvedValueOnce({
  //     id: 1,
  //     status: 'first_team_won',
  //   });

  //   const response = await request(server.server)
  //     .post('/webhook/event-status')
  //     .send({ eventId: '1', status: 'first_team_won' });

  //   expect(response.status).toBe(200);
  //   expect(response.body.message).toBe('Статусы события и ставок обновлены');
  // });

  it('POST /webhook/event-status должен вернуть ошибку для недопустимого статуса', async () => {
    const response = await request(server.server)
      .post('/webhook/event-status')
      .send({ eventId: '1', status: 'invalid_status' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
  });
});
