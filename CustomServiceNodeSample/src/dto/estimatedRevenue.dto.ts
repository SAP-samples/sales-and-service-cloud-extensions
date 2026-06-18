import { IsNumber, IsOptional, IsString } from 'class-validator';
import { EstimatedRevenue } from '../interface/EstimatedRevenue.interface';

export class EstimatedRevenueDto implements EstimatedRevenue {
  @IsString()
  @IsOptional()
  currencyCode?: string;

  @IsNumber()
  @IsOptional()
  content?: number;
}
