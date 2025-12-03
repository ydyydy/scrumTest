import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity('exams')
export class Exam {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @CreateDateColumn()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ type: 'int', default: 0 })
  timeSpent: number; // segundos

  @Column({ type: 'int', default: 0 })
  score: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'boolean', default: false })
  isSubmitted: boolean;

  @Column({ type: 'simple-json' })
  content: {
    questions: Array<{
      questionId: string;
      correctAnswerId?: string;
      userAnswer?: string;
      isCorrect?: boolean;
    }>;
  };
}
