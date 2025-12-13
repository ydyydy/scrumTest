# ---------- Stage 1: Build ----------
FROM node:18-alpine AS build

RUN apk add --no-cache python3 make g++ bash
WORKDIR /app

# Backend
COPY backend/ ./backend/
RUN cd backend && npm install && npm run build

# Frontend
COPY frontend/ ./frontend/
RUN cd frontend && npm install && npm run build
RUN mkdir -p backend/public && cp -r frontend/dist/* backend/public/

# ---------- Stage 2: Runtime ----------
FROM node:18-alpine
WORKDIR /app/backend

COPY --from=build /app/backend/dist ./dist
COPY --from=build /app/backend/public ./public
COPY --from=build /app/backend/node_modules ./node_modules
COPY --from=build /app/backend/package*.json ./

COPY backend/scrum_app.sqlite ./scrum_app.sqlite

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
