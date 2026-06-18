import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleLine } from '../entities/scheduleLine.entity';
import { WorkOrder } from '../entities/workOrder.entity';
import { WorkProduct } from '../entities/workProduct.entity';
import { ScheduleLineNestedController } from './scheduleLine.controller';
import { ScheduleLineService } from './scheduleLine.service';
import { AnalyticsReplicationService } from '../analytics/analytics-replication.service';
import { EventServiceClient } from '../analytics/event-service.client';
import { EmployeeModule } from '../employee/employee.module';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScheduleLine, WorkOrder, WorkProduct]),
    EmployeeModule,
    AccountModule,
  ],
  controllers: [ScheduleLineNestedController],
  providers: [ScheduleLineService, AnalyticsReplicationService, EventServiceClient],
  exports: [ScheduleLineService],
})
export class ScheduleLineModule {}
