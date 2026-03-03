import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

export class UpdateScheduleLineDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsNumber()
  requestedQuantity?: number;

  @IsOptional()
  @IsNumber()
  confirmedQuantity?: number;

  @IsOptional()
  @IsDateString()
  requestedEndDate?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  workProductId?: string;
}
