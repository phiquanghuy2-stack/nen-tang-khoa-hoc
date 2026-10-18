FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Chép kết quả build sang volume dùng chung với Caddy, rồi thoát
CMD ["sh", "-c", "rm -rf /shared/* && cp -r /app/dist/. /shared/ && echo 'Da chep dist sang /shared'"]