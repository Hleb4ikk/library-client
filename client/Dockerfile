FROM node:22-slim

WORKDIR /app

# URL API задаётся на этапе сборки (Vite инлайнит import.meta.env)
ARG VITE_API_URL=http://localhost:8080/api
ENV VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 5173

# Раздаём собранную статику встроенным сервером Vite
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
