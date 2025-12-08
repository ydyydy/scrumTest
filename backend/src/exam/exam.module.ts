import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsModule } from '../questions/question.module';
import { ExamController } from './application/exam.controller';
import { ExamServiceImpl } from './application/exam.service.impl';
import { ExamRepository } from './exam.repository';
import { ExamService } from './application/exam.service';
import { ExamRepositoryTypeOrm } from './infra/exam.repository.typeorm';
import { Exam } from './infra/persistence';
import { UsersModule } from '../users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Exam]), QuestionsModule, UsersModule],
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
  exports: [ExamService, ExamRepository],
})
export class ExamModule {}
