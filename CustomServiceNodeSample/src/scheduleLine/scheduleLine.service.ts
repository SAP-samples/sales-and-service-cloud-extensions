import { Injectable, Scope, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleLine } from '../entities/scheduleLine.entity';
import { WorkOrder } from '../entities/workOrder.entity';
import { WorkProduct } from '../entities/workProduct.entity';
import { ScheduleLineDto } from '../dto/scheduleLine.dto';
import { BadRequestException, NotFoundException } from '../common/exceptions/custom.exceptions';
import { WorkOrderCudEventService } from '../events/workOrder-cud-event.service';
import { WorkOrderUpdatedEvent } from '../events/workOrder.events';
import { PaginationUtils } from '../common/utils/pagination.utils';

@Injectable({ scope: Scope.REQUEST })
export class ScheduleLineService {
  private readonly logger = new Logger(ScheduleLineService.name);

  constructor(
    @InjectRepository(ScheduleLine)
    private scheduleLineRepository: Repository<ScheduleLine>,
    @InjectRepository(WorkOrder)
    private workOrderRepository: Repository<WorkOrder>,
    @InjectRepository(WorkProduct)
    private workProductRepository: Repository<WorkProduct>,
    private cudEventService: WorkOrderCudEventService,
  ) {}

  async findAll(workProductId?: string, top?: number, skip?: number, count?: boolean, orderBy?: string): Promise<{ value: ScheduleLine[]; count?: number }> {
    const pagination = PaginationUtils.validatePagination(top, skip);
    const query = this.scheduleLineRepository.createQueryBuilder('scheduleLine');

    if (workProductId) {
      query.where('scheduleLine.workProductId = :workProductId', { workProductId });
    }

    if (orderBy) {
      this.applySorting(query, orderBy);
    } else {
      query.orderBy('scheduleLine.date', 'ASC');
    }

    query.limit(pagination.top);
    query.offset(pagination.skip);

    const scheduleLines = await query.getMany();
    const response: any = { value: scheduleLines };

    if (count) {
      const countQuery = this.scheduleLineRepository.createQueryBuilder('scheduleLine');
      if (workProductId) {
        countQuery.where('scheduleLine.workProductId = :workProductId', { workProductId });
      }
      response.count = await countQuery.getCount();
    }

    return response;
  }

  async findOne(id: string, workProductId?: string): Promise<{ value: ScheduleLine }> {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (workProductId && !uuidRegex.test(workProductId)) {
      throw new BadRequestException(
        `Invalid workProductId: ${workProductId}`,
        `workProductId must be a valid UUID`,
      );
    }

    const where: any = { id };
    if (workProductId) {
      where.workProductId = workProductId;
    }

    const scheduleLine = await this.scheduleLineRepository.findOne({ where });

    if (!scheduleLine) {
      throw new NotFoundException(`Schedule line with ID ${id} not found`);
    }

    return { value: scheduleLine };
  }

  async create(scheduleLineDto: ScheduleLineDto): Promise<{ value: ScheduleLine[] }> {
    // Capture beforeWorkOrder BEFORE creating the schedule line
    const beforeWorkOrder = await this.fetchWorkOrderByWorkProductId(scheduleLineDto.workProductId);

    const scheduleLine = new ScheduleLine();
    Object.assign(scheduleLine, scheduleLineDto);

    const savedScheduleLine = await this.scheduleLineRepository.save(scheduleLine);

    // Fire-and-forget CUD event for WorkOrder update due to child creation
    this.emitWorkOrderUpdatedForChildChange(savedScheduleLine.workProductId, beforeWorkOrder).catch((error) => {
      this.logger.error(
        `CUD event failed for scheduleLine create ${savedScheduleLine.id}: ${(error as Error).message}`,
      );
    });

    return { value: [savedScheduleLine] };
  }

  async update(id: string, updateDto: any, workProductId?: string): Promise<{ value: ScheduleLine }> {
    const result = await this.findOne(id, workProductId);
    const scheduleLine = result.value;

    // Capture beforeWorkOrder BEFORE updating the schedule line
    const beforeWorkOrder = await this.fetchWorkOrderByWorkProductId(scheduleLine.workProductId);

    if (updateDto.displayId !== undefined) scheduleLine.displayId = updateDto.displayId;
    if (updateDto.scheduleLineName !== undefined) scheduleLine.scheduleLineName = updateDto.scheduleLineName;
    if (updateDto.date !== undefined) scheduleLine.date = updateDto.date;
    if (updateDto.requestedQuantity !== undefined) scheduleLine.requestedQuantity = updateDto.requestedQuantity;
    if (updateDto.confirmedQuantity !== undefined) scheduleLine.confirmedQuantity = updateDto.confirmedQuantity;
    if (updateDto.requestedEndDate !== undefined) scheduleLine.requestedEndDate = updateDto.requestedEndDate;
    if (updateDto.status !== undefined) scheduleLine.status = updateDto.status;
    if (updateDto.workProductId !== undefined) scheduleLine.workProductId = updateDto.workProductId;

    const resolvedWorkProductId = scheduleLine.workProductId;
    await this.scheduleLineRepository.save(scheduleLine);

    // Fire-and-forget CUD event for WorkOrder update due to child update
    this.emitWorkOrderUpdatedForChildChange(resolvedWorkProductId, beforeWorkOrder).catch((error) => {
      this.logger.error(
        `CUD event failed for scheduleLine update ${id}: ${(error as Error).message}`,
      );
    });

    return this.findOne(id);
  }

  private applySorting(query: any, orderBy: string): void {
    const parts = orderBy.trim().split(' ');
    const field = parts[0];
    const direction = parts[1]?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const sortableFields: { [key: string]: string } = {
      'displayId': 'scheduleLine.displayId',
      'scheduleLineName': 'scheduleLine.scheduleLineName',
      'date': 'scheduleLine.date',
      'requestedQuantity': 'scheduleLine.requestedQuantity',
      'confirmedQuantity': 'scheduleLine.confirmedQuantity',
      'requestedEndDate': 'scheduleLine.requestedEndDate',
      'status': 'scheduleLine.status',
    };

    if (sortableFields[field]) {
      query.orderBy(sortableFields[field], direction, 'NULLS LAST');
    } else {
      throw new BadRequestException(
        `Unsupported sort field: ${field}`,
        `orderby=${orderBy}`
      );
    }
  }

  async delete(id: string, workProductId?: string): Promise<{ value: any[] }> {
    const scheduleLine = await this.findOne(id, workProductId);
    const resolvedWorkProductId = scheduleLine.value.workProductId;

    // Capture beforeWorkOrder BEFORE deleting the schedule line
    const beforeWorkOrder = await this.fetchWorkOrderByWorkProductId(resolvedWorkProductId);

    const result = await this.scheduleLineRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Schedule line with ID ${id} not found`);
    }

    // Fire-and-forget CUD event for WorkOrder update due to child deletion
    this.emitWorkOrderUpdatedForChildChange(resolvedWorkProductId, beforeWorkOrder).catch((error) => {
      this.logger.error(
        `CUD event failed for scheduleLine delete ${id}: ${(error as Error).message}`,
      );
    });

    return {
      value: [{
        id: id,
        status: 'deleted'
      }]
    };
  }

  private async fetchWorkOrderByWorkProductId(workProductId: string): Promise<WorkOrder | null> {
    const workProduct = await this.workProductRepository.findOne({
      where: { id: workProductId },
    });
    if (!workProduct) return null;

    return this.workOrderRepository.findOne({
      where: { id: workProduct.workOrderId },
      relations: ['workProducts', 'workProducts.scheduleLines'],
    });
  }

  private async emitWorkOrderUpdatedForChildChange(
    workProductId: string,
    beforeWorkOrder?: WorkOrder,
  ): Promise<void> {
    const workProduct = await this.workProductRepository.findOne({
      where: { id: workProductId },
    });

    if (!workProduct) {
      this.logger.warn(`WorkProduct ${workProductId} not found for CUD event`);
      return;
    }

    const workOrder = await this.workOrderRepository.findOne({
      where: { id: workProduct.workOrderId },
      relations: ['workProducts', 'workProducts.scheduleLines'],
    });

    if (!workOrder) {
      this.logger.warn(`WorkOrder ${workProduct.workOrderId} not found for CUD event`);
      return;
    }

    await this.cudEventService.handleUpdated(new WorkOrderUpdatedEvent(workOrder, beforeWorkOrder));
  }
}
