# ---------- Stage 1: Build ----------
FROM node:18-alpine AS build

# Herramientas necesarias para build
RUN apk add --no-cache python3 make g++ bash

WORKDIR /app

# ---------------- Backend ----------------
COPY backend/ ./backend/
RUN cd backend && npm install && npm run build

# ---------------- Frontend ----------------
COPY frontend/ ./frontend/
RUN cd frontend && npm install && npm run build

# Copiar build de React a backend/public
RUN mkdir -p backend/public && cp -r frontend/dist/* backend/public/

# ---------- Stage 2: Production ----------
FROM node:18-alpine

WORKDIR /app/backend

# Copiar solo lo necesario desde build stage
COPY --from=build /app/backend/dist ./dist
COPY --from=build /app/backend/package*.json ./
COPY --from=build /app/backend/public ./public
COPY --from=build /app/backend/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/main.js"]
