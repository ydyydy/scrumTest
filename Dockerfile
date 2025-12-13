# Imagen base
FROM node:18-alpine

# Herramientas necesarias para build
RUN apk add --no-cache python3 make g++ bash

# Directorio de trabajo
WORKDIR /app

# Backend
COPY backend/package*.json ./backend/
RUN cd backend && npm install
COPY backend/ ./backend/

# Frontend
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install
COPY frontend/ ./frontend/

# Build de React (Vite)
RUN cd frontend && npm run build

# Copiar build al backend/public
RUN mkdir -p backend/public && cp -r frontend/dist/* backend/public/

# Build de backend (NestJS)
RUN cd backend && npm run build

# Exponer puerto
EXPOSE 3000

# Comando de inicio
WORKDIR /app/backend
CMD ["node", "dist/main.js"]
