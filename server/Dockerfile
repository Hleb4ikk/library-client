FROM node:22-slim

WORKDIR /app

# Устанавливаем зависимости отдельно для лучшего кеширования слоёв
COPY package.json package-lock.json ./
RUN npm ci

# Копируем исходники
COPY . .

# Порт из APP_PORT (.env)
EXPOSE 8080

# Запускаем через tsx — он резолвит alias "@/..." из tsconfig
CMD ["npx", "tsx", "src/index.ts"]
