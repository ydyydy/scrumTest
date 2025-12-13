# Etapa 1: build
FROM node:18-alpine AS build

WORKDIR /app

# Backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Backend code
COPY backend/ ./backend/

# Frontend dependencies
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# Frontend code
COPY frontend/ ./frontend/

# Build frontend
RUN cd frontend && npm run build

# Crear carpeta public y copiar build del frontend
RUN mkdir -p backend/public && cp -r frontend/dist/* backend/public/

# Etapa 2: final
FROM node:18-alpine

WORKDIR /app/backend

# Copiar backend y dependencias
COPY --from=build /app/backend/dist ./dist
COPY --from=build /app/backend/package*.json ./
COPY --from=build /app/backend/node_modules ./node_modules
COPY --from=build /app/backend/public ./public

# Copiar SQLite
COPY backend/scrum_app.sqlite ./scrum_app.sqlite

EXPOSE 3000

CMD ["node", "dist/main.js"]
