import { IsOptional, IsPositive, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PaginationDefaults } from './enum';

export class QueryPaginationDto {
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => value ?? PaginationDefaults.DEFAULT_PAGE)
  page: number = PaginationDefaults.DEFAULT_PAGE;

  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => value ?? PaginationDefaults.DEFAULT_LIMIT)
  @Max(PaginationDefaults.MAX_LIMIT, {
    message: `Limit cannot exceed ${PaginationDefaults.MAX_LIMIT} items`,
  })
  limit: number = PaginationDefaults.DEFAULT_LIMIT;
}
