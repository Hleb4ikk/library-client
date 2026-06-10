# online library server

Some description

## project structure

```bash
my-library-server/
│
├── config/             # Конфигурационные файлы (база данных, JWT, переменные)
├── controllers/        # Логика обработки запросов (вызов сервисов, отправка ответов)
├── middleware/         # Промежуточное ПО (проверка токенов, прав доступа)
├── models/             # Схемы баз данных (Mongoose/Sequelize/Prisma)
├── routes/             # Маршруты API (связывают URL с контроллерами)
├── services/           # Бизнес-логика (создание заказа, проверка наличия книг)
├── utils/              # Вспомогательные функции (хэлперы, генерация ID)
├── validators/         # Схемы валидации входящих данных (Joi, Yup)
│
├── app.js              # Настройка Express, подключение middleware и роутов
├── server.js           # Точка входа, запуск HTTP-сервера
├── .env                # Секретные данные (порты, пароли к БД, секреты JWT)
├── package.json        # Список зависимостей и скрипты запуска
└── package-lock.json   # Фиксация версий пакетов
```
