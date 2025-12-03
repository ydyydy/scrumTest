import {
  IsString,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AnswerDto } from './create-answer.dto';

export class CreateQuestionDto {
  @IsString()
  text: string;

  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  @ArrayMinSize(4, { message: 'A question must have exactly 4 answers' })
  @ArrayMaxSize(4, { message: 'A question must have exactly 4 answers' })
  answers: AnswerDto[];

  @IsString()
  category: string;

  @IsString()
  questionType: 'single' | 'multiple';
}
