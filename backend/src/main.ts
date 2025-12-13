import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import * as express from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // en producción, poner tu frontend real
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true,
  });

  const reactBuildPath = join(__dirname, '..', 'public');
  app.use(express.static(reactBuildPath));

  // Middleware para React SPA
  app.use((req: express.Request, res: express.Response) => {
    res.sendFile(join(reactBuildPath, 'index.html'));
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
