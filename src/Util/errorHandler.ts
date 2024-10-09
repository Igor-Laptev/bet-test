import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';

// Глобальный обработчик ошибок для сервера Fastify
export default function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  console.error('Ошибка:', error);

  if (error.validation) {
    return reply.status(400).send({
      message: 'Ошибка валидации',
      details: error.validation,
    });
  }

  if ((error as any).statusCode) {
    return reply.status((error as any).statusCode).send({
      message: error.message,
      details: (error as any).details,
    });
  }

  return reply.status(500).send({ message: 'Ошибка Сервера!' });
}
