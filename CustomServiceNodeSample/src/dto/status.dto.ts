import { IsEnum, IsOptional } from 'class-validator';
import { StatusCode, StatusDescription } from '../enums/status.enum';

export class StatusDto {
  @IsEnum(StatusCode)
  @IsOptional()
  code?: StatusCode;

  @IsEnum(StatusDescription)
  @IsOptional()
  description?: StatusDescription;
}
