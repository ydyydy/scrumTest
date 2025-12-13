# 1️⃣ Imagen base
FROM node:18-alpine

# 2️⃣ Instalar herramientas necesarias para build
RUN apk add --no-cache python3 make g++ bash

# 3️⃣ Crear directorio de trabajo
WORKDIR /app

# 4️⃣ Copiar backend completo y build
COPY backend/ ./backend/
RUN cd backend && npm install && npm run build

# 5️⃣ Copiar frontend completo y build
COPY frontend/ ./frontend/
RUN cd frontend && npm install && npm run build

# 6️⃣ Copiar build de React a backend/public
RUN mkdir -p backend/public && cp -r frontend/dist/* backend/public/

# 7️⃣ Exponer puerto
EXPOSE 3000

# 8️⃣ Comando de inicio
WORKDIR /app/backend
CMD ["node", "dist/main.js"]
