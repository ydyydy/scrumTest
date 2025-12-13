import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { Request, Response, NextFunction } from 'express';
import * as express from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para frontend
  app.enableCors({
    origin: '*', // en producción, reemplaza con tu URL real si quieres seguridad
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true,
  });

  // Ruta donde está el build de React
  const reactBuildPath = join(process.cwd(), 'public');
  app.use(express.static(reactBuildPath));

  // Middleware para SPA: deja pasar todas las rutas de backend y sirve index.html en el resto
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Rutas de backend que deben pasar
    const apiPaths = ['/users', '/questions', '/reviews', '/exams'];

    if (apiPaths.some((p) => req.path.startsWith(p))) {
      next();
      return;
    }

    // Todas las demás rutas sirven la SPA
    res.sendFile(join(reactBuildPath, 'index.html'));
  });

  // Puerto
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Server running on port ${process.env.PORT ?? 3000}`);
}

bootstrap();
