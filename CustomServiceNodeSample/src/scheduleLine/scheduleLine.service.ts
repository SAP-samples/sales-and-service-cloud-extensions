import { Injectable, Scope, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleLine } from '../entities/scheduleLine.entity';
import { WorkOrder } from '../entities/workOrder.entity';
import { WorkProduct } from '../entities/workProduct.entity';
import { ScheduleLineDto } from '../dto/scheduleLine.dto';
import { UpdateScheduleLineDto } from '../dto/updateScheduleLine.dto';
import { BadRequestException, NotFoundException } from '../common/exceptions/custom.exceptions';
import { AnalyticsReplicationService } from '../analytics/analytics-replication.service';
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
    private analyticsReplicationService: AnalyticsReplicationService,
  ) {}

  async findAll(workProductId?: string, top?: number, skip?: number, count?: boolean, orderBy?: string): Promise<{ value: ScheduleLine[]; count?: number }> {
    const pagination = PaginationUtils.validatePagination(top, skip);
    const query = this.scheduleLineRepository.createQueryBuilder('scheduleLine');

    if (workProductId) {
      query.where('scheduleLine.workProductId = :workProductId', { workProductId });
    }

    // Apply sorting
    if (orderBy) {
      this.applySorting(query, orderBy);
    } else {
      // Default sort by date
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
    const scheduleLine = new ScheduleLine();
    Object.assign(scheduleLine, scheduleLineDto);
    
    const savedScheduleLine = await this.scheduleLineRepository.save(scheduleLine);
    
    // Fire-and-forget analytics for WorkOrder update due to child creation
    this.sendScheduleLineChangeAnalytics(savedScheduleLine.workProductId, 'Create').catch((error) => {
      this.logger.error(
        `Analytics tracking failed for scheduleLine create ${savedScheduleLine.id}: ${error.message}`,
      );
    });
    
    // Create returns array format
    return { value: [savedScheduleLine] };
  }

  async update(id: string, updateDto: any, workProductId?: string): Promise<{ value: ScheduleLine }> {
    const result = await this.findOne(id, workProductId);
    const scheduleLine = result.value;
    
    // Update only provided fields
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

    // Fire-and-forget analytics for WorkOrder update due to child update
    this.sendScheduleLineChangeAnalytics(resolvedWorkProductId, 'Update').catch((error) => {
      this.logger.error(
        `Analytics tracking failed for scheduleLine update ${id}: ${error.message}`,
      );
    });
    
    return this.findOne(id);
  }

  private applySorting(query: any, orderBy: string): void {
    // Parse $orderby parameter: "field direction" e.g., "date desc"
    const parts = orderBy.trim().split(' ');
    const field = parts[0];
    const direction = parts[1]?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    // Map of allowed sortable fields
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
    // Validates existence and parent ownership if workProductId provided
    const scheduleLine = await this.findOne(id, workProductId);
    const resolvedWorkProductId = scheduleLine.value.workProductId;

    const result = await this.scheduleLineRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Schedule line with ID ${id} not found`);
    }

    // Fire-and-forget analytics for WorkOrder update due to child deletion
    this.sendScheduleLineChangeAnalytics(resolvedWorkProductId, 'Delete').catch((error) => {
      this.logger.error(
        `Analytics tracking failed for scheduleLine delete ${id}: ${error.message}`,
      );
    });
    
    return {
      value: [{
        id: id,
        status: 'deleted'
      }]
    };
  }

  private async sendScheduleLineChangeAnalytics(
    workProductId: string,
    operation: 'Create' | 'Update' | 'Delete',
  ): Promise<void> {
    const entityFullName = 'customer.ssc.workorderservice.entity.workOrder';
    const serviceFullName = 'customer.ssc.service.workOrderService';

    try {
      // Get workProduct to find parent workOrderId
      const workProduct = await this.workProductRepository.findOne({
        where: { id: workProductId },
      });

      if (!workProduct) {
        this.logger.warn(`WorkProduct ${workProductId} not found for analytics`);
        return;
      }

      // Fetch complete WorkOrder with all relations
      const workOrderAfter = await this.workOrderRepository.findOne({
        where: { id: workProduct.workOrderId },
        relations: ['workProducts', 'workProducts.scheduleLines'],
      });

      if (!workOrderAfter) {
        this.logger.warn(`WorkOrder ${workProduct.workOrderId} not found for analytics`);
        return;
      }

      const currentImage = await this.analyticsReplicationService.transformWorkOrderForCudAnalytics(workOrderAfter);

      // Send UPDATE event for the parent WorkOrder to reflect child changes
      await this.analyticsReplicationService.sendCudDataEvent({
        entityFullName,
        serviceFullName,
        currentImage,
        operation: 'Update',
      });
    } catch (error) {
      this.logger.error(`Analytics scheduleLine ${operation} event failed: ${error.message}`);
      throw error;
    }
  }
}
