import Fastify, { FastifyInstance } from 'fastify';
import request from 'supertest';
import betRoutes from './betRoutes';

// Описание: Тестирование Bet API
// Используются инструменты Fastify и Supertest для эмуляции запросов и проверок ответов
describe('Тестирование Bet API', () => {
  let server: FastifyInstance;

  // Перед всеми тестами создаём новый экземпляр сервера Fastify
  beforeAll(async () => {
    server = Fastify();
    server.register(betRoutes);
    await server.ready(); // Ожидаем полной инициализации сервера
  });

  // Закрываем сервер после завершения всех тестов
  afterAll(async () => {
    await server.close(); // Закрываем сервер, чтобы избежать утечек
  });

  // Тест проверяет, что при отсутствии ставок возвращается пустой массив
  it('GET /bets должен возвращать пустой массив, если ставок нет', async () => {
    const response = await request(server.server).get('/bets');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]); // Ожидаем пустой массив
  }, 15000); // Увеличен тайм-аут до 15 секунд

  // Тест проверяет, что при неверном ID события возвращается ошибка
  it('POST /bets должен вернуть ошибку для неверного ID события', async () => {
    const invalidBet = {
      eventId: 9999, // Несуществующий ID события
      amount: 100.0,
    };

    const response = await request(server.server)
      .post('/bets')
      .send(invalidBet);

    expect(response.status).toBe(400); // Ожидаем ошибку
    expect(response.body.error).toBe(
      'Событие не найдено или истек дедлайн для ставок.'
    );
  }, 15000);

  // Тест проверяет, что возвращается список всех ставок
  it('GET /bets должен вернуть все ставки', async () => {
    const response = await request(server.server).get('/bets');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true); // Ожидаем массив ставок
  }, 15000);
});
