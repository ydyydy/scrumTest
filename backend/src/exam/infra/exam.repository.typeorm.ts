import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeOrmRepository } from 'typeorm/repository/Repository';
import { Exam } from '../domain/Exam';
import { ExamRepository } from '../exam.repository';
import { ExamMapper } from '../mappers/examMapper';
import * as Persistence from './persistence';
import * as Domain from '../domain';

@Injectable()
export class ExamRepositoryTypeOrm extends ExamRepository {
  constructor(
    @InjectRepository(Persistence.Exam)
    private readonly examRepository: TypeOrmRepository<Persistence.Exam>,
  ) {
    super();
  }

  async save(entity: Domain.Exam): Promise<Domain.Exam> {
    const domainExam = Domain.Exam.create({
      userId: entity.userId,
      startDate: entity.startDate,
      finishDate: entity.finishDate ?? null,
      duration: entity.duration ?? null,
      score: entity.score ?? null,
      content: entity.content,
    });

    const exam = ExamMapper.toPersistence(domainExam);
    await this.examRepository.save(exam);

    return domainExam;
  }

  async findById(id: string): Promise<Exam> {
    const raw = await this.examRepository.findOneBy({ id });

    if (!raw) {
      throw new Error(`Exam with id ${id} not found`);
    }

    return ExamMapper.toDomain(raw);
  }

  async findWithLimit(limit = 20): Promise<Domain.Exam[]> {
    const raws = await this.examRepository
      .createQueryBuilder('exams')
      .orderBy('exams.score', 'DESC')
      .addOrderBy('exams.duration', 'ASC')
      .take(limit)
      .getMany();

    return raws.map(ExamMapper.toDomain);
  }

  async update(exam: Domain.Exam): Promise<Domain.Exam> {
    const persistence = ExamMapper.toPersistence(exam);
    await this.examRepository.save(persistence);
    return exam;
  }

  async findHistoryByUser(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<[Domain.Exam[], number]> {
    const [rows, total] = await this.examRepository.findAndCount({
      where: { userId },
      order: { finishDate: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return [rows.map(ExamMapper.toDomain), total];
  }

  async delete(id: string): Promise<void> {
    await this.examRepository.delete(id);
  }
}
