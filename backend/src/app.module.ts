import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { UsersModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { QuestionsModule } from './questions/question.module';
import { ReviewsModule } from './review/review.module';
import { ExamModule } from './exam/exam.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database:
        process.env.DATABASE_PATH || path.join(__dirname, 'scrum_app.sqlite'),
      entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: true,
    }),
    UsersModule,
    QuestionsModule,
    AuthModule,
    ReviewsModule,
    ExamModule,
  ],
})
export class AppModule {}
