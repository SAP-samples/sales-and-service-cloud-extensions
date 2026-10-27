import { Injectable, Scope, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { PaginationUtils } from '../common/utils/pagination.utils';
import { WorkProduct } from '../entities/workProduct.entity';
import { WorkOrder } from '../entities/workOrder.entity';
import { ScheduleLine } from '../entities/scheduleLine.entity';
import { WorkProductDTO } from '../dto/workProduct.dto';
import { NotFoundException, BadRequestException } from '../common/exceptions/custom.exceptions';
import { WorkOrderCudEventService } from '../events/workOrder-cud-event.service';
import { WorkOrderUpdatedEvent } from '../events/workOrder.events';

@Injectable({ scope: Scope.REQUEST })
export class WorkProductService {
  private readonly logger = new Logger(WorkProductService.name);

  constructor(
    @InjectRepository(WorkProduct)
    private workProductRepository: Repository<WorkProduct>,
    @InjectRepository(WorkOrder)
    private workOrderRepository: Repository<WorkOrder>,
    @InjectRepository(ScheduleLine)
    private scheduleLineRepository: Repository<ScheduleLine>,
    private cudEventService: WorkOrderCudEventService,
  ) {}

  transformResponse(workProduct: WorkProduct, includeNested: boolean = false) {
    const { currencyCode, content, workOrder, scheduleLines, ...rest } = workProduct;
    return {
      ...rest,
      estimatedRevenue:
        currencyCode && content
          ? {
              currencyCode,
              content,
            }
          : null,
      ...(includeNested && scheduleLines ? {
        scheduleLines: scheduleLines.map((scheduleLine) => ({
          id: scheduleLine.id,
          displayId: scheduleLine.displayId,
          scheduleLineName: scheduleLine.scheduleLineName,
          date: scheduleLine.date,
          requestedQuantity: scheduleLine.requestedQuantity,
          confirmedQuantity: scheduleLine.confirmedQuantity,
          requestedEndDate: scheduleLine.requestedEndDate,
          status: scheduleLine.status,
        }))
      } : {}),
    };
  }

  async getAllWorkProducts(
    top?: number,
    skip?: number,
    count?: boolean,
    orderBy?: string,
    filter?: string,
    search?: string,
  ): Promise<{ value: any[]; count?: number }> {
    // Apply pagination validation
    const pagination = PaginationUtils.validatePagination(top, skip);

    const queryBuilder = this.workProductRepository.createQueryBuilder('workProduct')
      .leftJoinAndSelect('workProduct.workOrder', 'workOrder');

    // Apply search filter (HANA uses LIKE with LOWER for case-insensitive)
    if (search) {
      const searchLower = search.toLowerCase();
      queryBuilder.where(
        new Brackets((qb) => {
          qb.where('LOWER(workProduct.workProductId) LIKE :search', { search: `%${searchLower}%` })
            .orWhere('LOWER(workProduct.workProductName) LIKE :search', { search: `%${searchLower}%` })
            .orWhere('LOWER(workProduct.customizationDetails) LIKE :search', { search: `%${searchLower}%` })
            .orWhere('LOWER(workProduct.currencyCode) LIKE :search', { search: `%${searchLower}%` })
            .orWhere('LOWER(workProduct.productCategory) LIKE :search', { search: `%${searchLower}%` })
            .orWhere('LOWER(workProduct.productTypeCode) LIKE :search', { search: `%${searchLower}%` })
            .orWhere('LOWER(workProduct.status) LIKE :search', { search: `%${searchLower}%` })
            .orWhere('CAST(workProduct.quantity AS VARCHAR) LIKE :search', { search: `%${searchLower}%` })
            .orWhere('CAST(workProduct.completionPercentage AS VARCHAR) LIKE :search', { search: `%${searchLower}%` })
            .orWhere('CAST(workProduct.content AS VARCHAR) LIKE :search', { search: `%${searchLower}%` });
        })
      );
    }

    // Apply custom filter
    if (filter) {
      if (filter.includes('status eq')) {
        const statusValue = filter.split('status eq ')[1].replace(/'/g, '');
        queryBuilder.andWhere('workProduct.status = :status', { status: statusValue });
      }
    }

    // Apply sorting
    if (orderBy) {
      this.applySorting(queryBuilder, orderBy);
    } else {
      queryBuilder.orderBy('workProduct.workProductId', 'ASC');
    }

    // Always apply pagination
    queryBuilder.limit(pagination.top);
    queryBuilder.offset(pagination.skip);

    const workProducts = await queryBuilder.getMany();
    const transformedValue = workProducts.map(workProduct => this.transformResponse(workProduct));

    const response: any = {
      value: transformedValue,
    };

    if (count) {
      const countQuery = this.workProductRepository.createQueryBuilder('workProduct');

      if (search) {
        const searchLower = search.toLowerCase();
        countQuery.where(
          new Brackets((qb) => {
            qb.where('LOWER(workProduct.workProductId) LIKE :search', { search: `%${searchLower}%` })
              .orWhere('LOWER(workProduct.workProductName) LIKE :search', { search: `%${searchLower}%` })
              .orWhere('LOWER(workProduct.customizationDetails) LIKE :search', { search: `%${searchLower}%` })
              .orWhere('LOWER(workProduct.currencyCode) LIKE :search', { search: `%${searchLower}%` })
              .orWhere('LOWER(workProduct.productCategory) LIKE :search', { search: `%${searchLower}%` })
              .orWhere('LOWER(workProduct.productTypeCode) LIKE :search', { search: `%${searchLower}%` })
              .orWhere('LOWER(workProduct.status) LIKE :search', { search: `%${searchLower}%` })
              .orWhere('CAST(workProduct.quantity AS VARCHAR) LIKE :search', { search: `%${searchLower}%` })
              .orWhere('CAST(workProduct.completionPercentage AS VARCHAR) LIKE :search', { search: `%${searchLower}%` })
              .orWhere('CAST(workProduct.content AS VARCHAR) LIKE :search', { search: `%${searchLower}%` });
          })
        );
      }

      if (filter && filter.includes('status eq')) {
        const statusValue = filter.split('status eq ')[1].replace(/'/g, '');
        countQuery.andWhere('workProduct.status = :status', { status: statusValue });
      }

      response.count = await countQuery.getCount();
    }

    return response;
  }

  async findByWorkOrderId(
    workOrderId: string,
    top?: number,
    skip?: number,
    count?: boolean,
    orderBy?: string,
    filter?: string,
    search?: string,
  ): Promise<{ value: any[]; count?: number }> {
    // Apply pagination validation
    const pagination = PaginationUtils.validatePagination(top, skip);

    // Check if the parameter is a UUID or displayId and resolve to UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(workOrderId);
    let resolvedWorkOrderId = workOrderId;

    if (!isUuid) {
      const workOrder = await this.workOrderRepository.findOne({
        where: { displayId: workOrderId },
      });

      if (!workOrder) {
        throw new NotFoundException(
          `Work Order with displayId ${workOrderId} not found`,
          `workOrderId=${workOrderId}`
        );
      }

      resolvedWorkOrderId = workOrder.id;
    }

    const queryBuilder = this.workProductRepository.createQueryBuilder('workProduct')
      .where('workProduct.workOrderId = :workOrderId', { workOrderId: resolvedWorkOrderId });

    if (search) {
      const searchLower = search.toLowerCase();
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(workProduct.workProductId) LIKE :search', { search: `%${searchLower}%` })
            .orWhere('LOWER(workProduct.workProductName) LIKE :search', { search: `%${searchLower}%` })
            .orWhere('LOWER(workProduct.customizationDetails) LIKE :search', { search: `%${searchLower}%` })
            .orWhere('LOWER(workProduct.currencyCode) LIKE :search', { search: `%${searchLower}%` })
            .orWhere('LOWER(workProduct.productCategory) LIKE :search', { search: `%${searchLower}%` })
            .orWhere('LOWER(workProduct.productTypeCode) LIKE :search', { search: `%${searchLower}%` })
            .orWhere('LOWER(workProduct.status) LIKE :search', { search: `%${searchLower}%` })
            .orWhere('CAST(workProduct.quantity AS VARCHAR) LIKE :search', { search: `%${searchLower}%` })
            .orWhere('CAST(workProduct.completionPercentage AS VARCHAR) LIKE :search', { search: `%${searchLower}%` })
            .orWhere('CAST(workProduct.content AS VARCHAR) LIKE :search', { search: `%${searchLower}%` });
        })
      );
    }

    if (filter) {
      if (filter.includes('status eq')) {
        const statusValue = filter.split('status eq ')[1].replace(/'/g, '');
        queryBuilder.andWhere('workProduct.status = :status', { status: statusValue });
      }
    }

    if (orderBy) {
      this.applySorting(queryBuilder, orderBy);
    } else {
      queryBuilder.orderBy('workProduct.workProductId', 'ASC');
    }

    queryBuilder.limit(pagination.top);
    queryBuilder.offset(pagination.skip);

    const workProducts = await queryBuilder.getMany();
    const transformedValue = workProducts.map(wp => this.transformResponse(wp, false));

    const response: any = {
      value: transformedValue,
    };

    const countQuery = this.workProductRepository.createQueryBuilder('workProduct')
      .where('workProduct.workOrderId = :workOrderId', { workOrderId: resolvedWorkOrderId });

    if (search) {
      const searchLower = search.toLowerCase();
      countQuery.andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(workProduct.workProductId) LIKE :search', { search: `%${searchLower}%` })
            .orWhere('LOWER(workProduct.workProductName) LIKE :search', { search: `%${searchLower}%` })
            .orWhere('LOWER(workProduct.customizationDetails) LIKE :search', { search: `%${searchLower}%` })
            .orWhere('LOWER(workProduct.currencyCode) LIKE :search', { search: `%${searchLower}%` })
            .orWhere('LOWER(workProduct.productCategory) LIKE :search', { search: `%${searchLower}%` })
            .orWhere('LOWER(workProduct.productTypeCode) LIKE :search', { search: `%${searchLower}%` })
            .orWhere('LOWER(workProduct.status) LIKE :search', { search: `%${searchLower}%` })
            .orWhere('CAST(workProduct.quantity AS VARCHAR) LIKE :search', { search: `%${searchLower}%` })
            .orWhere('CAST(workProduct.completionPercentage AS VARCHAR) LIKE :search', { search: `%${searchLower}%` })
            .orWhere('CAST(workProduct.content AS VARCHAR) LIKE :search', { search: `%${searchLower}%` });
        })
      );
    }

    if (filter && filter.includes('status eq')) {
      const statusValue = filter.split('status eq ')[1].replace(/'/g, '');
      countQuery.andWhere('workProduct.status = :status', { status: statusValue });
    }

    response.count = await countQuery.getCount();

    return response;
  }

  async findOne(id: string, workOrderId?: string): Promise<{ value: any }> {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (workOrderId && !uuidRegex.test(workOrderId)) {
      throw new BadRequestException(
        `Invalid workOrderId: ${workOrderId}`,
        `workOrderId must be a valid UUID`,
      );
    }

    const where: any = { id };
    if (workOrderId) {
      where.workOrderId = workOrderId;
    }

    const workProduct = await this.workProductRepository.findOne({ where });

    if (!workProduct) {
      throw new NotFoundException(`Work product with ID ${id} not found`);
    }

    const transformed = this.transformResponse(workProduct, false);
    return { value: transformed };
  }

  async create(workProductDto: WorkProductDTO): Promise<{ value: any[] }> {
    const workProduct = new WorkProduct();

    const currencyCode = workProductDto.estimatedRevenue?.currencyCode || workProductDto.currencyCode;
    const content = workProductDto.estimatedRevenue?.content || workProductDto.content;

    Object.assign(workProduct, {
      workProductId: workProductDto.workProductId,
      workProductName: workProductDto.workProductName,
      customizationDetails: workProductDto.customizationDetails,
      quantity: workProductDto.quantity,
      productCategory: workProductDto.productCategory,
      completionPercentage: workProductDto.completionPercentage,
      productTypeCode: workProductDto.productTypeCode,
      currencyCode: currencyCode,
      content: content,
      status: workProductDto.status,
      workOrderId: workProductDto.workOrderId,
    });

    // Capture beforeWorkOrder BEFORE creating the work product
    const beforeWorkOrder = await this.workOrderRepository.findOne({
      where: { id: workProductDto.workOrderId },
      relations: ['workProducts', 'workProducts.scheduleLines'],
    });

    const savedWorkProduct = await this.workProductRepository.save(workProduct);

    // Fire-and-forget CUD event for WorkOrder update due to child creation
    this.emitWorkOrderUpdatedForChildChange(savedWorkProduct.workOrderId, beforeWorkOrder).catch((error) => {
      this.logger.error(
        `CUD event failed for workProduct create ${savedWorkProduct.id}: ${(error as Error).message}`,
      );
    });

    // Reload from database to get all computed/default values
    const reloadedWorkProduct = await this.workProductRepository.findOne({
      where: { id: savedWorkProduct.id },
    });

    const transformed = this.transformResponse(reloadedWorkProduct, false);
    return { value: [transformed] };
  }

  async update(id: string, workProductDto: WorkProductDTO, workOrderId?: string): Promise<{ value: any }> {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (workOrderId && !uuidRegex.test(workOrderId)) {
      throw new BadRequestException(
        `Invalid workOrderId: ${workOrderId}`,
        `workOrderId must be a valid UUID`,
      );
    }

    const existing = await this.workProductRepository.findOne({
      where: workOrderId ? { id, workOrderId } : { id },
    });

    if (!existing) {
      throw new NotFoundException(`Work product with ID ${id} not found`);
    }

    const existingWorkProduct = existing;

    // Capture beforeWorkOrder BEFORE updating the work product
    const beforeWorkOrder = await this.workOrderRepository.findOne({
      where: { id: existingWorkProduct.workOrderId },
      relations: ['workProducts', 'workProducts.scheduleLines'],
    });

    const currencyCode = workProductDto.estimatedRevenue?.currencyCode || workProductDto.currencyCode;
    const content = workProductDto.estimatedRevenue?.content || workProductDto.content;

    Object.assign(existingWorkProduct, {
      workProductId: workProductDto.workProductId,
      workProductName: workProductDto.workProductName,
      customizationDetails: workProductDto.customizationDetails,
      quantity: workProductDto.quantity,
      productCategory: workProductDto.productCategory,
      completionPercentage: workProductDto.completionPercentage,
      productTypeCode: workProductDto.productTypeCode,
      currencyCode: currencyCode,
      content: content,
      status: workProductDto.status,
    });

    await this.workProductRepository.save(existingWorkProduct);

    // Fire-and-forget CUD event for WorkOrder update due to child update
    this.emitWorkOrderUpdatedForChildChange(existingWorkProduct.workOrderId, beforeWorkOrder).catch((error) => {
      this.logger.error(
        `CUD event failed for workProduct update ${id}: ${(error as Error).message}`,
      );
    });

    // Reload from database to get fresh data
    const reloadedWorkProduct = await this.workProductRepository.findOne({
      where: { id },
    });

    const transformed = this.transformResponse(reloadedWorkProduct, false);
    return { value: transformed };
  }

  private applySorting(query: any, orderBy: string): void {
    const parts = orderBy.trim().split(' ');
    const field = parts[0];
    const direction = parts[1]?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const sortableFields: { [key: string]: string } = {
      'workProductId': 'workProduct.workProductId',
      'workProductName': 'workProduct.workProductName',
      'customizationDetails': 'workProduct.customizationDetails',
      'quantity': 'workProduct.quantity',
      'productCategory': 'workProduct.productCategory',
      'completionPercentage': 'workProduct.completionPercentage',
      'productTypeCode': 'workProduct.productTypeCode',
      'status': 'workProduct.status',
      'estimatedRevenue': 'workProduct.content',
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

  async delete(id: string, workOrderId?: string): Promise<{ value: any[] }> {
    const workProduct = await this.findOne(id, workOrderId);
    const resolvedWorkOrderId = workProduct.value.workOrderId;

    // Capture beforeWorkOrder BEFORE deleting the work product
    const beforeWorkOrder = await this.workOrderRepository.findOne({
      where: { id: resolvedWorkOrderId },
      relations: ['workProducts', 'workProducts.scheduleLines'],
    });

    await this.workProductRepository.remove(workProduct.value);

    // Fire-and-forget CUD event for WorkOrder update due to child deletion
    this.emitWorkOrderUpdatedForChildChange(resolvedWorkOrderId, beforeWorkOrder).catch((error) => {
      this.logger.error(
        `CUD event failed for workProduct delete ${id}: ${(error as Error).message}`,
      );
    });

    return {
      value: [{
        id: id,
        status: 'deleted'
      }]
    };
  }

  private async emitWorkOrderUpdatedForChildChange(
    workOrderId: string,
    beforeWorkOrder?: WorkOrder,
  ): Promise<void> {
    const workOrder = await this.workOrderRepository.findOne({
      where: { id: workOrderId },
      relations: ['workProducts', 'workProducts.scheduleLines'],
    });

    if (!workOrder) {
      this.logger.warn(`WorkOrder ${workOrderId} not found for CUD event`);
      return;
    }

    await this.cudEventService.handleUpdated(new WorkOrderUpdatedEvent(workOrder, beforeWorkOrder));
  }
}
