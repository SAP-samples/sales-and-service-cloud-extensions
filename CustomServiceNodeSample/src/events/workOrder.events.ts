import { WorkOrder } from '../entities/workOrder.entity';

export class WorkOrderCreatedEvent {
  constructor(public readonly workOrder: WorkOrder) {}
}

export class WorkOrderUpdatedEvent {
  constructor(
    public readonly after: WorkOrder,
    public readonly before?: WorkOrder,
  ) {}
}

export class WorkOrderDeletedEvent {
  constructor(public readonly workOrder: WorkOrder) {}
}
