import { Transform, Type } from 'class-transformer';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class QueryLocationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number;

  @IsOptional()
  @IsString()
  ten_vi_tri?: string;

  @IsOptional()
  @IsString()
  tinh_thanh?: string;

  @IsOptional()
  @IsString()
  quoc_gia?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    if (typeof value === 'object') {
      return value;
    }

    if (typeof value === 'string') {
      try {
        const parsedValue = JSON.parse(value);

        if (
          parsedValue &&
          typeof parsedValue === 'object' &&
          !Array.isArray(parsedValue)
        ) {
          return parsedValue;
        }
      } catch {
        return undefined;
      }
    }

    return undefined;
  })
  @IsObject()
  filters?: Record<string, unknown>;
}
