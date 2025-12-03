import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuestionsModule } from '../questions/question.module';
import { Exam } from './domain';
import { ExamController } from './application/exam.controller';
import { ExamServiceImpl } from './application/exam.service.impl';
import { ExamRepository } from './exam.repository';
import { ExamService } from './application/exam.service';
import { ExamRepositoryTypeOrm } from './infra/exam.repository.typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Exam]), QuestionsModule],
  controllers: [ExamController],
  providers: [
    {
      provide: ExamService,
      useClass: ExamServiceImpl,
    },
    {
      provide: ExamRepository,
      useClass: ExamRepositoryTypeOrm,
    },
  ],
  exports: [ExamService],
})
export class ExamModule {}
