import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { QuestionsController } from './questions/questions.controller';
import { QuestionsService } from './questions/questions.service';
import { ExamsController } from './exams/exams.controller';
import { ExamsService } from './exams/exams.service';
import { ReviewController } from './review/review.controller';
import { ReviewService } from './review/review.service';
import { ResultsController } from './results/results.controller';
import { ResultsService } from './results/results.service';
import { GamificationController } from './gamification/gamification.controller';
import { GamificationService } from './gamification/gamification.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', 
      port: 5432,
      username: 'admin',        
      password: 'admin',   
      database: 'scrum_app', 
      autoLoadEntities: true,
      synchronize: true, 
    }),
  ],
  controllers: [AppController, UsersController, QuestionsController, ExamsController, ReviewController, ResultsController, GamificationController],
  providers: [AppService, AuthService, UsersService, QuestionsService, ExamsService, ReviewService, ResultsService, GamificationService],
})
export class AppModule {}
