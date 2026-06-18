import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsUUID,
  IsDate,
  ValidateNested,
  IsEnum,
  IsNumber,
  IsPositive,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StatusCode } from '../enums/status.enum';
import { EstimatedRevenue } from '../interface/EstimatedRevenue.interface';
import { EstimatedRevenueDto } from './estimatedRevenue.dto';
import { WorkProductDTO } from './workProduct.dto';


export class WorkOrderDto {
  @IsEnum(StatusCode)
  @IsOptional()
  status?: any;

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
  estimatedRevenue?: EstimatedRevenue;

  @IsNotEmpty()
  @IsString()
  orderName?: string;

  @IsOptional()
  @IsNumber()
  numberOfSubscriptions?: number;

  @IsOptional()
  @IsNumber()
  priority?: number;

  @IsOptional()
  @IsString()
  currencyCode?: string;

  @IsOptional()
  content?: number;

  @IsOptional()
  projectLead?: { id: string };

  @IsOptional()
  account?: { id: string };

  @IsOptional()
  @IsString()
  Customer?: string;

  @IsOptional()
  @IsString()
  displayId?: string;

  @IsOptional()
  @IsString()
  caseDisplayId?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkProductDTO)
  workProducts?: WorkProductDTO[];
}
