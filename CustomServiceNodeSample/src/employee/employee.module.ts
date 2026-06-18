import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';

@Module({
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
