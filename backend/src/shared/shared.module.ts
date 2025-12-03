import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Question } from '../questions/infra/persistence/question.entity';
import { Answer } from '../questions/infra/persistence/answer.entity';
import { Review } from '../review/infra/persistence/review.entity';

import { QuestionRepository } from '../questions/question.repository';
import { ReviewRepository } from '../review/review.repository';

import { QuestionRepositoryTypeOrm } from '../questions/infra/question.repository.typeorm';
import { ReviewRepositoryTypeOrm } from '../review/infra/review.repository.typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Answer, Review])],

  providers: [
    {
      provide: QuestionRepository,
      useClass: QuestionRepositoryTypeOrm,
    },
    {
      provide: ReviewRepository,
      useClass: ReviewRepositoryTypeOrm,
    },
  ],

  exports: [QuestionRepository, ReviewRepository, TypeOrmModule],
})
export class SharedModule {}
