# ---------- Stage 1: Build ----------
FROM node:18-alpine AS build

# Dependencias para compilación
RUN apk add --no-cache python3 make g++ bash
WORKDIR /app

# ---------------- Backend ----------------
COPY backend/ ./backend/
RUN cd backend && npm install && npm run build

# ---------------- Frontend ----------------
COPY frontend/ ./frontend/
RUN cd frontend && npm install && npm run build
RUN mkdir -p backend/public && cp -r frontend/dist/* backend/public/

# ---------- Stage 2: Runtime ----------
FROM node:18-alpine
WORKDIR /app/backend

# Copiar build y dependencias del backend
COPY --from=build /app/backend/dist ./dist
COPY --from=build /app/backend/public ./public
COPY --from=build /app/backend/node_modules ./node_modules
COPY --from=build /app/backend/package*.json ./

# Copiar SQLite inicial (solo para el primer deploy)
COPY backend/scrum_app.sqlite ./scrum_app.sqlite

# Crear volumen persistente en /data para la DB
VOLUME /data

# Puerto
EXPOSE 3000

# CMD: usar la base de datos persistente y arrancar NestJS
CMD ["sh", "-c", "DATABASE_PATH=/data/scrum_app.sqlite node dist/src/main.js"]
