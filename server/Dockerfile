FROM node:22-slim

WORKDIR /app

# Устанавливаем зависимости отдельно для лучшего кеширования слоёв
COPY package.json package-lock.json ./
RUN npm ci
# Копируем исходники
COPY . .

# Порт из APP_PORT (.env)
EXPOSE 8080

# При старте контейнера (когда БД уже доступна и переменные окружения проброшены
# через env_file) применяем миграции, затем запускаем сервер через tsx — он
# резолвит alias "@/..." из tsconfig. Миграции берут MIGRATION_DATABASE_URL
# (session-пулер :5432) и НЕ блокируют запуск: если migrate упал, сервер всё
# равно стартует на уже существующей схеме.
CMD ["sh", "-c", "npx drizzle-kit migrate || echo '[migrate] миграции не применены, продолжаю запуск сервера'; npx tsx src/index.ts"]
