import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { UsersModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { QuestionsModule } from './questions/question.module';
import { ReviewModule } from './review/review.module';
import { ExamModule } from './exam/exam.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'scrum_app.sqlite', // Se crea automáticamente
      entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: true,
    }),
    UsersModule,
    QuestionsModule,
    AuthModule,
    ReviewModule,
    ExamModule,
  ],
})
export class AppModule {}
