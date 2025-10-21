import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class AnswerDto {
  @IsString()
  text: string;

  @IsBoolean()
  @IsOptional()
  isCorrect?: boolean;
}
