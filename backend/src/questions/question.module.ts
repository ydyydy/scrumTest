import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './infra/persistence/question.entity';
import { Answer } from './infra/persistence/answer.entity';
import { QuestionRepository } from './question.repository';
import { QuestionService } from './application/question.service';
import { QuestionController } from './application/question.controller';
import { QuestionServiceImpl } from './application/question.service.impl';
import { QuestionRepositoryTypeOrm } from './infra/question.repository.typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Answer])],
  controllers: [QuestionController],
  providers: [
    {
      provide: QuestionService,
      useClass: QuestionServiceImpl,
    },
    {
      provide: QuestionRepository,
      useClass: QuestionRepositoryTypeOrm,
    },
  ],
  exports: [QuestionService, QuestionRepository],
})
export class QuestionsModule {}
