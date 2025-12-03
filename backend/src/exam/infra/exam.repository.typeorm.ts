import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeOrmRepository } from 'typeorm/repository/Repository';
import { ExamRepository } from '../exam.repository';
import { ExamMapper } from '../mappers/examMapper';
import { UniqueEntityID } from '../../../common/core/UniqueEntityID';
import * as Domain from '../domain';
import * as Persistence from './persistence';

@Injectable()
export class ExamRepositoryTypeOrm extends ExamRepository {
  constructor(
    @InjectRepository(Persistence.Exam)
    private readonly examRepository: TypeOrmRepository<Persistence.Exam>,
  ) {
    super();
  }

  async save(exam: Domain.Exam): Promise<Domain.Exam> {
    const start = new Date();
    const end = new Date(start.getTime() + 45 * 60 * 1000); // +45min

    const examEntity = Domain.Exam.create(
      {
        userId: exam.userId,
        startDate: start,
        endDate: end,
        score: 0,
        timeSpent: 0,
        content: exam.content,
        isSubmitted: false,
      },
      new UniqueEntityID(),
    );

    await this.examRepository.save(ExamMapper.toPersistence(examEntity));
    return examEntity;
  }

  async findById(id: string): Promise<Domain.Exam> {
    const raw = await this.examRepository.findOneBy({ id });

    if (!raw) {
      throw new Error(`Exam with id ${id} not found`);
    }

    return ExamMapper.toDomain(raw);
  }

  async updateExam(exam: Domain.Exam): Promise<void> {
    await this.examRepository.save(ExamMapper.toPersistence(exam));
  }
}
