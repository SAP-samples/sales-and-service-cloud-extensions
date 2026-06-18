import { Repository } from 'typeorm';
import { WorkOrder } from '../entities/workOrder.entity';

export class WorkOrderRepository extends Repository<WorkOrder> {}
