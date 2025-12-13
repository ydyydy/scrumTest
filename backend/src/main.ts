import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { Request, Response, NextFunction } from 'express';

import * as express from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,PATCH,DELETE',
  });

  const reactBuildPath = join(process.cwd(), 'public');

  app.use(express.static(reactBuildPath));

  app.use((req: Request, res: Response, next: NextFunction) => {
    // dejar pasar API
    if (
      req.path.startsWith('/users') ||
      req.path.startsWith('/questions') ||
      req.path.startsWith('/reviews') ||
      req.path.startsWith('/exams')
    ) {
      next();
      return;
    }

    res.sendFile(join(reactBuildPath, 'index.html'));
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
