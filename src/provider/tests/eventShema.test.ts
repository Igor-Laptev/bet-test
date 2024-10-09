import Fastify, { FastifyInstance } from 'fastify';
import request from 'supertest';
import eventRoutes from '../routes/eventRoutes';

describe('Event Creation Schema Validation', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = Fastify();
    server.register(eventRoutes);
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  it('should fail when "coefficient" is less than 1.0', async () => {
    const invalidEvent = {
      coefficient: 0.5,
      deadline: Math.floor(Date.now() / 1000) + 1000,
    };

    const response = await request(server.server)
      .post('/events')
      .send(invalidEvent);

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Bad Request');
  });

  it('should fail when "deadline" is in the past', async () => {
    const invalidEvent = {
      coefficient: 1.5,
      deadline: Math.floor(Date.now() / 1000) - 1000,
    };

    const response = await request(server.server)
      .post('/events')
      .send(invalidEvent);

    expect(response.status).toBe(400);
    expect(response.body.error).toContain(
      'Bad Request'
    );
  });
});
