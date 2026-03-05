import {
  IsOptional,
  IsString,
  IsObject,
  IsArray,
  IsDate,
  ValidateNested,
  IsEnum,
  IsUUID,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { StatusDto } from './status.dto';
import { WorkProductDTO } from './workProduct.dto';
import { Type } from 'class-transformer';
import { StatusCode } from '../enums/status.enum';
import { EstimatedRevenueDto } from './estimatedRevenue.dto';

export class UpdateWorkOrderDto {
  @IsEnum(StatusCode)
  @IsOptional()
  status?: any;

  @IsArray()
  @IsOptional()
  workProducts?: WorkProductDTO[];

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @ValidateNested()
  @Type(() => EstimatedRevenueDto)
  estimatedRevenue?: {
    currencyCode: string;
    content: number;
  };

  @IsOptional()
  @IsString()
  orderName?: string;

  @IsOptional()
  @IsNumber()
  numberOfSubscriptions?: number;

  @IsOptional()
  @IsUUID()
  projectLeadId?: string;
}
