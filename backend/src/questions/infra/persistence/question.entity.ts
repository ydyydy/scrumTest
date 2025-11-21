import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('questions')
export class Question {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  text: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  category: string;
}
