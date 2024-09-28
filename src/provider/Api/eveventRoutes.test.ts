import Fastify, { FastifyInstance } from 'fastify';
import request from 'supertest';
import eventRoutes from './eventRoutes';

describe('Тестирование Provider Event API', () => {
  let server: FastifyInstance;

  // Перед всеми тестами создаём новый экземпляр сервера Fastify
  beforeAll(async () => {
    server = Fastify();
    server.register(eventRoutes);
    await server.ready(); // Ожидаем полной инициализации сервера
  });

  // Закрываем сервер после завершения всех тестов
  afterAll(async () => {
    await server.close(); // Закрываем сервер, чтобы избежать утечек
  });

  // Тест на создание нового события
  it('POST /events должен создавать новое событие', async () => {
    const newEvent = {
      coefficient: 1.85,
      deadline: Math.floor(Date.now() / 1000) + 10000, // Дедлайн в будущем
    };

    const response = await request(server.server)
      .post('/events')
      .send(newEvent);

    expect(response.status).toBe(201); // Ожидаем успешный ответ
    expect(response.body).toHaveProperty('id'); // Проверяем наличие ID события
    expect(response.body.coefficient).toBe(newEvent.coefficient); // Проверяем коэффициент
    expect(response.body.deadline).toBe(newEvent.deadline); // Проверяем дедлайн
  }, 15000);

  // Тест на валидацию некорректных данных для события
  it('POST /events должен возвращать ошибку валидации для некорректных данных', async () => {
    const invalidEvent = {
      coefficient: -1, // Недопустимый коэффициент
      deadline: Math.floor(Date.now() / 1000) - 10000, // Прошедший дедлайн
    };

    const response = await request(server.server)
      .post('/events')
      .send(invalidEvent);

    expect(response.status).toBe(400); // Ожидаем ошибку валидации
    expect(response.body.message).toBe('body/coefficient must be >= 1');
  }, 15000);

  // Тест на обновление статуса события
  it('PUT /events/:id должен обновлять статус события', async () => {
    // Сначала создаём событие
    const event = {
      coefficient: 2.0,
      deadline: Math.floor(Date.now() / 1000) + 10000, // Дедлайн в будущем
    };

    const eventResponse = await request(server.server)
      .post('/events')
      .send(event);

    const eventId = eventResponse.body.id; // Получаем ID созданного события

    // Обновляем статус события
    const updateResponse = await request(server.server)
      .put(`/events/${eventId}`)
      .send({ status: 'first_team_won' });

    expect(updateResponse.status).toBe(200); // Ожидаем успешный ответ
    expect(updateResponse.body.status).toBe('first_team_won'); // Проверяем статус
  }, 15000);
});
