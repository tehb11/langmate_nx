# Langmate Backend API

NestJS backend с JWT авторизацией и PostgreSQL базой данных.

## Установка зависимостей

```bash
npm install
```

## Настройка базы данных

1. Установите PostgreSQL
2. Создайте базу данных:
```sql
CREATE DATABASE langmate;
```

3. Скопируйте файл конфигурации:
```bash
cp env.example .env
```

4. Настройте переменные окружения в `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=langmate
JWT_SECRET=your-super-secret-jwt-key
```

## Запуск

### Разработка
```bash
npm run serve
```

### Продакшн
```bash
npm run build
npm run serve:production
```

## API Endpoints

### Авторизация

#### Регистрация
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Вход
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Пользователи (требует авторизации)

#### Получить список пользователей
```http
GET /api/users
Authorization: Bearer <jwt_token>
```

#### Получить профиль текущего пользователя
```http
GET /api/users/profile
Authorization: Bearer <jwt_token>
```

## Структура проекта

```
src/
├── app/
│   ├── auth/           # Модуль авторизации
│   │   ├── dto/        # Data Transfer Objects
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── jwt.strategy.ts
│   │   └── jwt-auth.guard.ts
│   ├── users/          # Модуль пользователей
│   │   ├── user.entity.ts
│   │   ├── users.service.ts
│   │   ├── users.controller.ts
│   │   └── users.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── app.module.ts
└── main.ts
```

## Технологии

- **NestJS** - фреймворк для Node.js
- **TypeORM** - ORM для работы с базой данных
- **PostgreSQL** - реляционная база данных
- **JWT** - JSON Web Tokens для авторизации
- **Passport** - middleware для аутентификации
- **bcryptjs** - хеширование паролей
- **class-validator** - валидация DTO 