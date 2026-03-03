import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkOrderController } from './workOrder.controller';
import { WorkOrderService } from './workOrder.service';
import { WorkOrder } from '../entities/workOrder.entity';
import { WorkOrderRepository } from '../repository/workOrder.repository';
import { WorkProduct } from '../entities/workProduct.entity';
import { ScheduleLine } from '../entities/scheduleLine.entity';
import { EmployeeModule } from '../employee/employee.module';
import { WorkProductModule } from '../workProduct/workProduct.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkOrder, WorkProduct, ScheduleLine]),
    EmployeeModule,
    WorkProductModule,
  ],
  controllers: [WorkOrderController],
  providers: [WorkOrderService],
  exports: [WorkOrderService],
})
export class WorkOrderModule {}
