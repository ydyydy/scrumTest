import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { QuestionsModule } from './questions/question.module';
import { ReviewsModule } from './review/review.module';
import { ExamModule } from './exam/exam.module';
import { envs } from './config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: envs.postgresHost,
        port: envs.postgresPort,
        username: envs.postgresUser,
        password: envs.postgresPassword,
        database: envs.postgresDb,
        autoLoadEntities: true,
        synchronize: true, // Solo desarrollo
        logging: false,
        migrations: [],
        subscribers: [],
      }),
    }),
    UsersModule,
    QuestionsModule,
    AuthModule,
    ReviewsModule,
    ExamModule,
  ],
})
export class AppModule {}
