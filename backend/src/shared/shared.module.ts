import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Question } from '../questions/infra/persistence/question.entity';
import { Answer } from '../questions/infra/persistence/answer.entity';
import { Review } from '../review/infra/persistence/review.entity';
import { Exam } from '../exam/infra/persistence/exam.entity';

import { QuestionRepository } from '../questions/question.repository';
import { ReviewRepository } from '../review/review.repository';
import { ExamRepository } from '../exam/exam.repository';

import { QuestionRepositoryTypeOrm } from '../questions/infra/question.repository.typeorm';
import { ReviewRepositoryTypeOrm } from '../review/infra/review.repository.typeorm';
import { ExamRepositoryTypeOrm } from '../exam/infra/exam.repository.typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Answer, Review, Exam])],

  providers: [
    {
      provide: QuestionRepository,
      useClass: QuestionRepositoryTypeOrm,
    },
    {
      provide: ReviewRepository,
      useClass: ReviewRepositoryTypeOrm,
    },
    {
      provide: ExamRepository,
      useClass: ExamRepositoryTypeOrm,
    },
  ],

  exports: [
    QuestionRepository,
    ReviewRepository,
    ExamRepository,
    TypeOrmModule,
  ],
})
export class SharedModule {}
