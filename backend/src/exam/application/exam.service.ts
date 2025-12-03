import { Injectable } from '@nestjs/common';
import { CreateExamDto } from '../dto/create-exam.dto';
import { UpdateAnswerDto } from '../dto/update-answer.dto';
import { Exam } from '../domain';

@Injectable()
export abstract class ExamService {
  abstract createExam(dto: CreateExamDto): Promise<Exam>;

  abstract answerQuestion(examId: string, dto: UpdateAnswerDto): Promise<void>;

  abstract findById(id: string): Promise<Exam>;
}
