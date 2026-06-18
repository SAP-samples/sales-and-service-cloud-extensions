import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkOrderController } from './workOrder.controller';
import { WorkOrderService } from './workOrder.service';
import { WorkOrder } from '../entities/workOrder.entity';
import { WorkOrderRepository } from 'src/repository/workOrder.repository';
import { WorkProduct } from 'src/entities/workProduct.entity';
import { ScheduleLine } from 'src/entities/scheduleLine.entity';
import { EmployeeModule } from '../employee/employee.module';
import { AccountModule } from '../account/account.module';
import { WorkProductModule } from '../workProduct/workProduct.module';
import { AnalyticsReplicationService } from '../analytics/analytics-replication.service';
import { EventServiceClient } from '../analytics/event-service.client';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkOrder, WorkProduct, ScheduleLine]),
    EmployeeModule,
    AccountModule,
    WorkProductModule,
  ],
  controllers: [WorkOrderController],
  providers: [WorkOrderService, AnalyticsReplicationService, EventServiceClient],
  exports: [WorkOrderService],
})
export class WorkOrderModule {}

