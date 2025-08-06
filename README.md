# BACKEND

# Установка зависимостей

yarn install

# Копирование переменных окружения (выполнять в apps/back) и настроить под свои данные

cp env.example env

# Настройка базы данных или (Docker):

```bash
docker run --name postgres-langmate \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=langmate \
  -p 5432:5432 \
  -d postgres:15
```

# Проверьте или настройте переменные в `env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=langmate
```

# Запуск сервера

yarn start:back

# MOBILE

# Проверить что окружение настроено для запуска RN проектов

# Запуск android

yarn android
