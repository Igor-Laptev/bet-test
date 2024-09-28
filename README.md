# Bet Test Platform

## Описание проекта

Это тестовое задание для Backend Node.js разработчика, которое состоит из двух сервисов:

- **Provider** — сервис, предоставляющий информацию о событиях.
- **Bet-Platform** — сервис, принимающий ставки на события от пользователей.

## Установка и запуск проекта

### 1. Клонирование репозитория

Сначала нужно склонировать репозиторий с GitHub. Для этого выполните команду в терминале:

```bash
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
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/testDb"


4. Применение миграций
Примените миграции для настройки базы данных:
npx prisma migrate deploy


5. Запуск сервера
Запустите каждый сервис в отдельных терминалах.

Запуск сервиса provider:
npm run dev --workspace=provider

Запуск сервиса bet-platform:
npm run dev --workspace=bet-platform


6. Тестирование
Чтобы проверить работу приложения, вы можете запустить тесты с помощью:
npm test


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
```
