import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('exams')
export class Exam {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @CreateDateColumn()
  startDate: Date;

  @Column({ type: 'datetime', nullable: true })
  finishDate: Date | null;

  @Column({ type: 'int', nullable: true })
  duration: number | null;

  @Column({ type: 'float', nullable: true })
  score: number | null;

  @Column({ type: 'simple-json' })
  content: {
    questions: Array<{
      questionId: string;
      userAnswerIds?: string[];
      isCorrect?: boolean;
      answered?: boolean;
    }>;
  };
}
