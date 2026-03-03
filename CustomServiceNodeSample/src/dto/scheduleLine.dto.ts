import { IsNotEmpty, IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

export class ScheduleLineDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  displayId?: string;

  @IsOptional()
  @IsString()
  scheduleLineName?: string;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsNumber()
  requestedQuantity: number;

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
