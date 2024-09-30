# Bet Test Platform

## Описание проекта

Это тестовое задание для Backend Node.js разработчика, которое состоит из двух сервисов:

- **Provider** — сервис, предоставляющий информацию о событиях.
- **Bet-Platform** — сервис, принимающий ставки на события от пользователей.

## Установка и запуск проекта

### 1. Клонирование репозитория

Сначала нужно склонировать репозиторий с GitHub. Для этого выполните команду в терминале:

````bash
git clone https://github.com/<your-username>/bet-test.git

Или, если вы создаёте форк проекта:
git clone https://github.com/<your-username>/<forked-repository>.git

Перейдите в директорию проекта:
cd bet-test

2. Установка зависимостей
Перед запуском необходимо установить все зависимости проекта:

npm install


3. Настройка базы данных
Создайте базу данных PostgreSQL с именем testDb.

В файле .env укажите данные для подключения к базе данных:
Файл уже в проекте только переименовать необходимо!


4. Применение миграций
Примените миграции для настройки базы данных:
npx prisma migrate deploy


5. Запуск через Docker
Запустите сервисы с помощью Docker Compose:

```bash

docker-compose up --build

После сборки и запуска контейнеров, чтобы применить сиды для начальных данных, выполните команду:
```bash
docker exec -it bet-test-provider-1 sh -c "node dist/prisma/seed.js"
6. Тут должно быть информация про тесты, но они не работают как надо так что только руками через Postman

                                  Структура API
                                  Provider API
1. Получение списка всех событий
GET /events

Пример ответа:
[
  {
    "id": "event1",
    "coefficient": 1.75,
    "deadline": 1700000000,
    "status": "pending"
  },
  {
    "id": "event2",
    "coefficient": 2.10,
    "deadline": 1700003600,
    "status": "pending"
  }
]

2. Создание нового события
POST /events

Тело запроса:
{
  "coefficient": 1.85,
  "deadline": 1700007200
}

Пример ответа:
{
  "id": "event3",
  "coefficient": 1.85,
  "deadline": 1700007200,
  "status": "pending"
}

3. Обновление статуса события
PUT /events/:id

Тело запроса:
{
  "status": "first_team_won"
}

Пример ответа:
{
  "message": "Статус события обновлен"
}


                                Bet-Platform API
1. Получение списка событий для ставок
GET /events

Пример ответа:
[
  {
    "id": "event2",
    "coefficient": 2.10,
    "deadline": 1700003600
  },
  {
    "id": "event3",
    "coefficient": 1.85,
    "deadline": 1700007200
  }
]

2. Создание ставки
POST /bets

Тело запроса:
{
  "eventId": "event2",
  "amount": 100.00
}

Пример ответа:
{
  "betId": "bet1",
  "eventId": "event2",
  "amount": 100.00,
  "potentialWin": 210.00,
  "status": "pending"
}

3. Получение истории ставок
GET /bets

Пример ответа:
[
  {
    "betId": "bet1",
    "eventId": "event2",
    "amount": 100.00,
    "potentialWin": 210.00,
    "status": "pending"
  },
  {
    "betId": "bet2",
    "eventId": "event1",
    "amount": 50.00,
    "potentialWin": 87.50,
    "status": "won"
  }
]

4. Обработка вебхуков на изменение статуса события
POST /webhook/event-status

Тело запроса:
{
  "eventId": "event2",
  "status": "cancelled"
}

Пример ответа:
{
  "message": "Статусы ставок обновлены",
  "updatedBets": {
    "count": 1
}

                                Проверка состояния Docker-контейнеров
После запуска docker-compose up --build, выполните следующие команды, чтобы убедиться, что контейнеры запущены корректно:

1. Проверка запущенных контейнеров:
docker ps

2. Просмотр логов контейнеров:
  Для Provider сервиса:
  docker logs bet-test-provider-1

  Для Bet-Platform сервиса:
  docker logs bet-test-bet-platform-1

3. Проверка доступности API:
  Для Provider сервиса:
  curl http://localhost:3000/events


  Для Bet-Platform сервиса:
  curl http://localhost:3001/events




Примечания
Сервисы реализованы с использованием Fastify.
Для работы с базой данных используется Prisma ORM.
Тесты написаны с использованием Jest.

### Описание:

1. **Инструкции по клонированию проекта**: Указаны команды для `git clone`.
2. **Инструкция по установке зависимостей**: Описаны шаги для установки npm-пакетов.
3. **Настройка базы данных**: Описаны шаги для настройки PostgreSQL и подключения через `.env`.
4. **Применение миграций**: Указаны команды для применения миграций через Prisma.
5. **Запуск серверов**: Указаны команды для запуска двух сервисов — **provider** и **bet-platform**.
6. **API документация**: Описана структура API с примерами запросов и ответов.
7. **Проверка состояния Docker-контейнеров**
````

