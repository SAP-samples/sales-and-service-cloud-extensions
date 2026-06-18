import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkProduct } from '../entities/workProduct.entity';
import { WorkOrder } from '../entities/workOrder.entity';
import { ScheduleLine } from '../entities/scheduleLine.entity';
import { WorkProductNestedController } from './workProduct.controller';
import { WorkProductService } from './workProduct.service';
import { AnalyticsReplicationService } from '../analytics/analytics-replication.service';
import { EventServiceClient } from '../analytics/event-service.client';
import { EmployeeModule } from '../employee/employee.module';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkProduct, WorkOrder, ScheduleLine]),
    EmployeeModule,
    AccountModule,
  ],
  controllers: [WorkProductNestedController],
  providers: [WorkProductService, AnalyticsReplicationService, EventServiceClient],
  exports: [WorkProductService],
})
export class WorkProductModule {}
