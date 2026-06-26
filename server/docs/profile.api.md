# Profile API

Базовый префикс всех эндпоинтов: `/api/me`

Все маршруты **требуют авторизации** — заголовок `Authorization: Bearer <token>`.

Middleware `authMiddleware` подключён на уровне роутера, поэтому каждый эндпоинт работает только с данными **текущего** авторизованного пользователя.

---

## GET `/api/me`

**Назначение:** получение профиля текущего пользователя.

**Примечания:**
- Возвращает базовую информацию об аккаунте без пароля.

### Query-параметры

Отсутствуют.

### Тело запроса

Отсутствует.

### Ответы

#### 200 OK — успех

```json
{
  "success": true,
  "message": "Профиль успешно получен",
  "data": {
    "id": 1,
    "username": "john_doe",
    "createdAt": "2026-06-01T08:00:00.000Z"
  }
}
```

| Поле              | Тип      | Описание |
|-------------------|----------|----------|
| `data.id`         | `number` | ID пользователя. |
| `data.username`   | `string` | Имя пользователя (логин). |
| `data.createdAt`  | `string` | Дата регистрации (ISO 8601). |

#### 401 Unauthorized — не авторизован

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

#### 404 Not Found — пользователь не найден

```json
{
  "success": false,
  "message": "Пользователь не найден"
}
```

#### 500 Internal Server Error — ошибка сервера

```json
{
  "success": false,
  "message": "Ошибка при получении профиля"
}
```

---

## PUT `/api/me/login`

**Назначение:** смена логина (имени пользователя) текущего аккаунта.

**Примечания:**
- Новый логин должен быть уникальным среди всех пользователей.
- Нельзя «сменить» логин на тот же самый, что уже используется.

### Query-параметры

Отсутствуют.

### Тело запроса

`Content-Type: application/json`

```json
{
  "new_username": "string"
}
```

| Поле           | Тип      | Обязательное | Описание |
|----------------|----------|--------------|----------|
| `new_username` | `string` | да           | Новый логин. Минимум 3 символа. |

### Ответы

#### 200 OK — успех

```json
{
  "success": true,
  "message": "Логин успешно изменён",
  "data": {
    "id": 1,
    "username": "new_username",
    "createdAt": "2026-06-01T08:00:00.000Z"
  }
}
```

| Поле              | Тип      | Описание |
|-------------------|----------|----------|
| `data.id`         | `number` | ID пользователя. |
| `data.username`   | `string` | Обновлённый логин. |
| `data.createdAt`  | `string` | Дата регистрации (ISO 8601). |

#### 400 Bad Request — ошибка валидации

```json
{
  "success": false,
  "message": "Ошибка валидации",
  "description": [
    {
      "code": "too_small",
      "path": ["new_username"],
      "message": "Too small: expected string to have >=3 characters"
    }
  ]
}
```

#### 401 Unauthorized — не авторизован

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

#### 404 Not Found — пользователь не найден

```json
{
  "success": false,
  "message": "Пользователь не найден"
}
```

#### 409 Conflict — логин недоступен

```json
{
  "success": false,
  "message": "Новый логин совпадает с текущим"
}
```

или

```json
{
  "success": false,
  "message": "Логин уже занят другим пользователем"
}
```

#### 500 Internal Server Error — ошибка сервера

```json
{
  "success": false,
  "message": "Ошибка при изменении логина"
}
```

---

## PUT `/api/me/password`

**Назначение:** смена пароля текущего аккаунта.

**Примечания:**
- Требуется указать текущий пароль для подтверждения.
- Новый пароль не может совпадать с текущим.
- Пароль должен соответствовать тем же правилам, что при регистрации: минимум 6 символов, строчная и заглавная буква, цифра и спецсимвол (`@$!%*?&`).

### Query-параметры

Отсутствуют.

### Тело запроса

`Content-Type: application/json`

```json
{
  "current_password": "string",
  "new_password": "string"
}
```

| Поле               | Тип      | Обязательное | Описание |
|--------------------|----------|--------------|----------|
| `current_password` | `string` | да           | Текущий пароль пользователя. |
| `new_password`     | `string` | да           | Новый пароль (те же правила сложности, что при регистрации). |

### Ответы

#### 200 OK — успех

```json
{
  "success": true,
  "message": "Пароль успешно изменён"
}
```

#### 400 Bad Request — ошибка валидации или совпадение паролей

Ошибка Zod-схемы:

```json
{
  "success": false,
  "message": "Ошибка валидации",
  "description": []
}
```

Новый пароль совпадает с текущим:

```json
{
  "success": false,
  "message": "Новый пароль совпадает с текущим"
}
```

#### 401 Unauthorized — не авторизован или неверный текущий пароль

Не передан/невалидный токен:

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

Неверный текущий пароль:

```json
{
  "success": false,
  "message": "Введённый текущий пароль неверный"
}
```

#### 404 Not Found — пользователь не найден

```json
{
  "success": false,
  "message": "Пользователь не найден"
}
```

#### 500 Internal Server Error — ошибка сервера

```json
{
  "success": false,
  "message": "Ошибка при изменении пароля"
}
```

---

## GET `/api/me/likes`

**Назначение:** получение списка книг, которые лайкнул текущий пользователь.

**Примечания:**
- Результаты с пагинацией.
- Для каждой записи подтягиваются название и обложка из Open Library.

### Query-параметры

| Параметр | Тип      | Обязательный | По умолчанию | Описание |
|----------|----------|--------------|--------------|----------|
| `page`   | `string` | нет          | `1`          | Номер страницы. Должен быть положительным целым числом. |
| `limit`  | `string` | нет          | `3`          | Количество записей на странице. Должен быть положительным целым числом. |

### Тело запроса

Отсутствует.

### Ответы

#### 200 OK — успех

```json
{
  "success": true,
  "message": "Список лайков успешно получен",
  "data": {
    "likes": [
      {
        "id": 5,
        "book_olid": "OL45883W",
        "created_at": "2026-06-10T15:00:00.000Z",
        "title": "The Great Gatsby",
        "cover": "https://covers.openlibrary.org/b/id/8231855-L.jpg"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 3,
      "total": 7,
      "totalPages": 3
    }
  }
}
```

| Поле                         | Тип             | Описание |
|------------------------------|-----------------|----------|
| `data.likes`                 | `array`         | Список лайков. |
| `data.likes[].id`            | `number`        | ID записи лайка. |
| `data.likes[].book_olid`     | `string`        | OLID книги. |
| `data.likes[].created_at`    | `string`        | Дата постановки лайка (ISO 8601). |
| `data.likes[].title`         | `string`        | Название книги. |
| `data.likes[].cover`         | `string \| null`| URL обложки или `null`. |
| `data.pagination.page`       | `number`        | Текущая страница. |
| `data.pagination.limit`      | `number`        | Размер страницы. |
| `data.pagination.total`      | `number`        | Общее количество лайков пользователя. |
| `data.pagination.totalPages` | `number`        | Общее количество страниц. |

#### 400 Bad Request — ошибка валидации

```json
{
  "success": false,
  "message": "Ошибка валидации",
  "description": []
}
```

#### 401 Unauthorized — не авторизован

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

#### 404 Not Found — книга не найдена в Open Library

Может вернуться при загрузке данных о книге из внешнего API.

```json
{
  "success": false,
  "message": "Книга не найдена в Open Library"
}
```

#### 500 Internal Server Error — ошибка сервера

```json
{
  "success": false,
  "message": "Ошибка при получении списка лайков"
}
```

---

## GET `/api/me/comments`

**Назначение:** получение списка комментариев текущего пользователя.

**Примечания:**
- Результаты с пагинацией.
- Для каждого комментария подтягиваются данные о книге (название, обложка).

### Query-параметры

| Параметр | Тип      | Обязательный | По умолчанию | Описание |
|----------|----------|--------------|--------------|----------|
| `page`   | `string` | нет          | `1`          | Номер страницы. Должен быть положительным целым числом. |
| `limit`  | `string` | нет          | `3`          | Количество записей на странице. Должен быть положительным целым числом. |

### Тело запроса

Отсутствует.

### Ответы

#### 200 OK — успех

```json
{
  "success": true,
  "message": "Список комментариев успешно получен",
  "data": {
    "comments": [
      {
        "id": 12,
        "text": "Отличная книга!",
        "book_olid": "OL45883W",
        "book_title": "The Great Gatsby",
        "book_cover": "https://covers.openlibrary.org/b/id/8231855-L.jpg",
        "created_at": "2026-06-11T09:00:00.000Z",
        "updated_at": "2026-06-11T09:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 3,
      "total": 5,
      "totalPages": 2
    }
  }
}
```

| Поле                            | Тип             | Описание |
|---------------------------------|-----------------|----------|
| `data.comments`                 | `array`         | Список комментариев пользователя. |
| `data.comments[].id`            | `number`        | ID комментария. |
| `data.comments[].text`          | `string`        | Текст комментария. |
| `data.comments[].book_olid`     | `string`        | OLID книги, к которой оставлен комментарий. |
| `data.comments[].book_title`    | `string`        | Название книги. |
| `data.comments[].book_cover`    | `string \| null`| URL обложки книги или `null`. |
| `data.comments[].created_at`    | `string`        | Дата создания (ISO 8601). |
| `data.comments[].updated_at`    | `string \| null`| Дата последнего изменения (ISO 8601). |
| `data.pagination.page`          | `number`        | Текущая страница. |
| `data.pagination.limit`         | `number`        | Размер страницы. |
| `data.pagination.total`         | `number`        | Общее количество комментариев пользователя. |
| `data.pagination.totalPages`    | `number`        | Общее количество страниц. |

#### 400 Bad Request — ошибка валидации

```json
{
  "success": false,
  "message": "Ошибка валидации",
  "description": []
}
```

#### 401 Unauthorized — не авторизован

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

#### 404 Not Found — книга не найдена в Open Library

```json
{
  "success": false,
  "message": "Книга не найдена в Open Library"
}
```

#### 500 Internal Server Error — ошибка сервера

```json
{
  "success": false,
  "message": "Ошибка при получении списка комментариев"
}
```
