# Imagen base
FROM node:18-alpine

# Instalar herramientas de compilación
RUN apk add --no-cache python3 make g++ bash

# Crear directorio de trabajo
WORKDIR /app

# Backend
COPY backend/package*.json ./backend/
RUN cd backend && npm install
COPY backend/ ./backend/

# Frontend
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install
COPY frontend/ ./frontend/

# Build de React
RUN cd frontend && npm run build

# Copiar build al backend/public
RUN cp -r frontend/build backend/public

# Build de backend (NestJS)
RUN cd backend && npm run build

# Exponer puerto
EXPOSE 3000

# Comando de inicio
WORKDIR /app/backend
CMD ["node", "dist/main.js"]
