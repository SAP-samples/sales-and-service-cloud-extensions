import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleLine } from '../entities/scheduleLine.entity';
import { ScheduleLineNestedController } from './scheduleLine.controller';
import { ScheduleLineService } from './scheduleLine.service';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduleLine])],
  controllers: [ScheduleLineNestedController],
  providers: [ScheduleLineService],
  exports: [ScheduleLineService],
})
export class ScheduleLineModule {}
