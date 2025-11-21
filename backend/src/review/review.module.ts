import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewRepository } from './review.repository';
import { ReviewService } from './application/review.service';
import { ReviewController } from './application/review.controller';
import { ReviewServiceImpl } from './application/review.service.impl';
import { ReviewRepositoryTypeOrm } from './infra/review.repository.typeorm';
import { Review } from './infra/persistence/review.entity';
import { QuestionsModule } from '../questions/question.module';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), QuestionsModule],
  controllers: [ReviewController],
  providers: [
    {
      provide: ReviewService,
      useClass: ReviewServiceImpl,
    },
    {
      provide: ReviewRepository,
      useClass: ReviewRepositoryTypeOrm,
    },
  ],
  exports: [ReviewService],
})
export class ReviewModule {}
