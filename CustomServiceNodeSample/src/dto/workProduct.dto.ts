import { IsOptional, IsString, IsUUID, ValidateNested, IsArray } from 'class-validator';
import { EstimatedRevenue } from '../interface/EstimatedRevenue.interface';
import { EstimatedRevenueDto } from './estimatedRevenue.dto';
import { ScheduleLineDto } from './scheduleLine.dto';
import { Type } from 'class-transformer';

export class WorkProductDTO {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString()
  workProductId?: string;

  @IsOptional()
  @IsString()
  workProductName?: string;

  @IsOptional()
  @IsString()
  customizationDetails?: string;

  @IsOptional()
  quantity?: number;

  @IsOptional()
  @IsString()
  productCategory?: string;

  @IsOptional()
  completionPercentage?: number;

  @IsOptional()
  @IsString()
  productTypeCode?: string;

  @IsOptional()
  @IsString()
  currencyCode?: string;

  @IsOptional()
  content?: number;

  @IsOptional()
  @IsString()
  workOrderId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => EstimatedRevenueDto)
  estimatedRevenue?: EstimatedRevenue;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleLineDto)
  scheduleLines?: ScheduleLineDto[];
}
