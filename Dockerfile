# Imagen base
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /app

# Instalar dependencias del backend
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copiar backend
COPY backend/ ./backend/

# Instalar dependencias del frontend
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# Copiar frontend
COPY frontend/ ./frontend/

# Construir frontend (React)
RUN cd frontend && npm run build

# Copiar build de React al backend/public
RUN cp -r frontend/build backend/public

# Construir backend (NestJS)
RUN cd backend && npm run build

# Exponer puerto
EXPOSE 3000

# Comando para iniciar backend
WORKDIR /app/backend
CMD ["node", "dist/main.js"]
