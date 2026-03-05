import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkProduct } from '../entities/workProduct.entity';
import { WorkOrder } from '../entities/workOrder.entity';
import { ScheduleLine } from '../entities/scheduleLine.entity';
import { WorkProductNestedController } from './workProduct.controller';
import { WorkProductService } from './workProduct.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkProduct, WorkOrder, ScheduleLine]),
  ],
  controllers: [WorkProductNestedController],
  providers: [WorkProductService],
  exports: [WorkProductService],
})
export class WorkProductModule {}
