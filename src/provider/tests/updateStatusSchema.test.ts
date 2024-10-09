import Fastify, { FastifyInstance } from 'fastify';
import request from 'supertest';
import webhookRoutes from '../../bet-platform/routes/webhook';

describe('Event Status Update Schema Validation', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = Fastify();
    server.register(webhookRoutes);
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  it('should fail when "status" is not in the allowed values', async () => {
    const invalidStatusUpdate = {
      eventId: '1',
      status: 'invalid_status',
    };

    const response = await request(server.server)
      .post('/webhook/event-status')
      .send(invalidStatusUpdate);

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Bad Request');
  });

  it('should fail when "status" is missing', async () => {
    const invalidStatusUpdate = {
      eventId: '1',
    };

    const response = await request(server.server)
      .post('/webhook/event-status')
      .send(invalidStatusUpdate);

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Bad Request');
  });
});
