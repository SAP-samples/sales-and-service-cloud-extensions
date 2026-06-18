import {
  Injectable,
  Logger,
  Scope,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { WorkOrderDto } from '../dto/workOrder.dto';
import { WorkOrder } from '../entities/workOrder.entity';
import { 
  BadRequestException, 
  NotFoundException 
} from '../common/exceptions/custom.exceptions';
import { WorkProduct } from '../entities/workProduct.entity';
import { ScheduleLine } from '../entities/scheduleLine.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { UpdateWorkOrderDto } from '../dto/updateWorkOrder.dto';
import { Brackets } from 'typeorm';
import { EmployeeService } from '../employee/employee.service';
import { Employee } from '../interface/Employee.interface';
import { AccountService } from '../account/account.service';
import { Account } from '../interface/Account.interface';
import { PaginationUtils } from '../common/utils/pagination.utils';
import { WorkProductService } from '../workProduct/workProduct.service';
import { AnalyticsReplicationService } from '../analytics/analytics-replication.service';


@Injectable({ scope: Scope.REQUEST })
export class WorkOrderService {
  private readonly logger = new Logger(WorkOrderService.name);

  constructor(
    @InjectRepository(WorkOrder)
    private workOrderRepository: Repository<WorkOrder>,

    @InjectRepository(WorkProduct)
    private workProductRepository: Repository<WorkProduct>,

    private employeeService: EmployeeService,
    private accountService: AccountService,
    private workProductService: WorkProductService,
    private analyticsReplicationService: AnalyticsReplicationService,
  ) {}

  async createWorkOrder(workOrderDto: WorkOrderDto): Promise<any> {
    const result = await this.workOrderRepository.manager.transaction(
        async (transactionalEntityManager) => {
          // Create work order
          const workOrder = new WorkOrder();

          Object.assign(workOrder, {
            status: workOrderDto.status,
            startDate: workOrderDto.startDate,
            endDate: workOrderDto.endDate,
            currencyCode: workOrderDto.currencyCode || workOrderDto.estimatedRevenue?.currencyCode,
            content: workOrderDto.content || workOrderDto.estimatedRevenue?.content,
            orderName: workOrderDto.orderName,
            numberOfSubscriptions: workOrderDto.numberOfSubscriptions,
            priority: workOrderDto.priority,
            projectLeadId: workOrderDto.projectLead?.id,
            accountId: workOrderDto.account?.id,
            Customer: workOrderDto.Customer,
            displayId: workOrderDto.displayId,
            caseDisplayId: workOrderDto.caseDisplayId,
          });

          const savedWorkOrder = await transactionalEntityManager.save(
            WorkOrder,
            workOrder,
          );

          // Create work products if they exist
          if (workOrderDto.workProducts && workOrderDto.workProducts.length > 0) {
            for (const workProductDto of workOrderDto.workProducts) {
              const workProduct = new WorkProduct();
              Object.assign(workProduct, {
                id: workProductDto.id,
                workProductId: workProductDto.workProductId,
                workProductName: workProductDto.workProductName,
                customizationDetails: workProductDto.customizationDetails,
                currencyCode: workProductDto.currencyCode || workProductDto.estimatedRevenue?.currencyCode,
                content: workProductDto.content || workProductDto.estimatedRevenue?.content,
                status: workProductDto.status,
                workOrder: savedWorkOrder,
              });

              const savedWorkProduct = await transactionalEntityManager.save(WorkProduct, workProduct);

              // Create schedule lines if they exist for this work product
              if (workProductDto.scheduleLines && workProductDto.scheduleLines.length > 0) {
                const scheduleLines = workProductDto.scheduleLines.map((scheduleLineDto) => {
                  const scheduleLine = new ScheduleLine();
                  Object.assign(scheduleLine, {
                    date: scheduleLineDto.date,
                    requestedQuantity: scheduleLineDto.requestedQuantity,
                    confirmedQuantity: scheduleLineDto.confirmedQuantity,
                    requestedEndDate: scheduleLineDto.requestedEndDate,
                    status: scheduleLineDto.status,
                    workProductId: savedWorkProduct.id,
                  });
                  return scheduleLine;
                });

                await transactionalEntityManager.save(ScheduleLine, scheduleLines);
              }
            }
          }

          // Fetch the complete work order with work products and schedule lines
          const completeWorkOrder = await transactionalEntityManager
            .createQueryBuilder(WorkOrder, 'workOrder')
            .leftJoinAndSelect('workOrder.workProducts', 'workProducts')
            .leftJoinAndSelect('workProducts.scheduleLines', 'scheduleLines')
            .where('workOrder.id = :id', { id: savedWorkOrder.id })
            .getOne();

        // Transform the response and wrap in { value: [...] }
        const transformedWorkOrder = await this.transformWorkOrderResponse(completeWorkOrder, true);
        return { value: [transformedWorkOrder], completeWorkOrder };
      },
    );

    // Fire-and-forget analytics (won't block or fail business logic)
    this.sendCreateAnalytics(result.completeWorkOrder).catch((error) => {
      this.logger.error(
        `Analytics tracking failed for created work order ${result.value[0].id}: ${error.message}`,
      );
    });

    this.logger.log(
      `Work order created successfully. ID: ${result.value[0].id}`,
    );

    return { value: result.value };
  }

  private async sendCreateAnalytics(workOrder: any): Promise<void> {
    const entityFullName = 'customer.ssc.workorderservice.entity.workOrder';
    const serviceFullName = 'customer.ssc.service.workOrderService';

    try {
      const analyticsData = await this.analyticsReplicationService.transformWorkOrderForCudAnalytics(workOrder);

      await this.analyticsReplicationService.sendCudDataEvent({
        entityFullName,
        serviceFullName,
        currentImage: analyticsData,
        operation: 'Create',
      });
    } catch (error) {
      // Log and send ABORTED, but don't throw
      this.logger.error(`Analytics CREATE event failed: ${error.message}`);
      throw error; // Re-throw for the catch block in caller
    }
  }  private async transformWorkOrderResponse(workOrder: WorkOrder, includeNested: boolean = false): Promise<any> {
    const { currencyCode, content, workProducts, projectLeadId, accountId, ...rest } = workOrder;

    let projectLead: Employee | null = null;
    if (projectLeadId) {
      try {
        projectLead = await this.employeeService.getEmployeeById(projectLeadId);
      } catch (error) {
        Logger.warn(`Failed to fetch project lead ${projectLeadId}: ${error.message}`);
      }
    }

    let account: Account | null = null;
    if (accountId) {
      try {
        account = await this.accountService.getAccountById(accountId);
      } catch (error) {
        Logger.warn(`Failed to fetch account ${accountId}: ${error.message}`);
      }
    }

    return {
      ...rest,
      projectLead: projectLead ? {
        id: projectLead.id,
        formattedName: projectLead.formattedName,
        displayId: projectLead.displayId,
      } : null,
      account: account ? {
        id: account.id,
        formattedName: account.formattedName,
        displayId: account.displayId,
      } : null,
      estimatedRevenue:
        currencyCode && content
          ? {
              currencyCode,
              content,
            }
          : null,
      ...(includeNested && workProducts ? {
        workProducts: workProducts.map((workProduct) =>
          this.workProductService.transformResponse(workProduct, true),
        )
      } : {}),
    };
  }

  async getWorkOrders(
    top?: number,
    skip?: number,
    count?: boolean,
    orderBy?: string,
    filter?: string,
    search?: string,
  ): Promise<any> {
    Logger.log('GET WorkOrders has been called');
    Logger.log(`Filter received: "${filter}"`);
    
    // Apply pagination validation
    const pagination = PaginationUtils.validatePagination(top, skip);
    Logger.log(`Pagination: top=${pagination.top}, skip=${pagination.skip}`);
    
    let query = this.workOrderRepository
      .createQueryBuilder('workOrder');

    query.skip(pagination.skip);  // Always apply skip
    query.take(pagination.top);   // Always apply limit
    
    if (filter) {
      filter = await this.resolveExternalFilters(filter);
      this.applyFilters(query, filter);
    }
    if (search) {
      const [employeeIds, accountIds] = await Promise.all([
        this.employeeService.searchEmployeesByDisplayId(search),
        this.accountService.searchAccountsByDisplayId(search),
      ]);
      this.searchFilter(
        query,
        search,
        employeeIds.map(e => e.id),
        accountIds.map(a => a.id),
      );
    }
    if (orderBy) {
      this.applyOrderBy(query, orderBy);
    } else {
      // Default sort by createdAt descending (newest first)
      query.orderBy('workOrder.createdAt', 'DESC');
    }
    const value = await query.getMany();
    Logger.log(`Query returned ${value.length} work orders from database`);
    
    const transformedValue = await Promise.all(
      value.map((val) => this.transformWorkOrderResponse(val))
    );
    Logger.log(`Transformed ${transformedValue.length} work orders successfully`);
    
    // Always return in { value: [...] } format per guidelines
    const response: any = {
      value: transformedValue,
    };

    if (count) {
      const countQuery =
        this.workOrderRepository.createQueryBuilder('workOrder');
      if (filter) {
        this.applyFilters(countQuery, filter);
      }
      if (search) {
        this.searchFilter(countQuery, search);
      }
      response.count = await countQuery.getCount();
    }

    return response;
  }

  private async resolveExternalFilters(filter: string): Promise<string> {
    const parts = filter.split(' and ');
    const resolved = await Promise.all(parts.map(async (part) => {
      if (part.includes('projectLead.displayId') || part.includes('projectLead/displayId')) {
        const value = part.split(' eq ')[1]?.trim().replace(/^['"]|['"]$/g, '');
        if (value) {
          const employee = await this.employeeService.getEmployeeByDisplayId(value);
          if (employee) return `projectLeadId eq '${employee.id}'`;
          return `projectLeadId eq 'NOT_FOUND'`;
        }
      }
      if (part.includes('account.displayId') || part.includes('account/displayId')) {
        const value = part.split(' eq ')[1]?.trim().replace(/^['"]|['"]$/g, '');
        if (value) {
          const account = await this.accountService.getAccountByDisplayId(value);
          if (account) return `accountId eq '${account.id}'`;
          return `accountId eq 'NOT_FOUND'`;
        }
      }
      return part;
    }));
    return resolved.join(' and ');
  }

  private applyFilters(query: any, filter: string): void {
    const parts = filter.split(' and ');
    Logger.log(`Filter parts: ${JSON.stringify(parts)}`);

    for (const part of parts) {
      // Strip outer parentheses from each part
      const cleanPart = part.trim().replace(/^\(+/, '').replace(/\)+$/, '');

      let field: string | undefined;
      let value: string | undefined;
      let operator: 'eq' | 'sw' | 'ge' | 'gt' | 'le' | 'lt' = 'eq';

      if (cleanPart.includes(' sw ')) {
        [field, value] = cleanPart.split(' sw ');
        operator = 'sw';
      } else if (cleanPart.includes(' ge ')) {
        [field, value] = cleanPart.split(' ge ');
        operator = 'ge';
      } else if (cleanPart.includes(' gt ')) {
        [field, value] = cleanPart.split(' gt ');
        operator = 'gt';
      } else if (cleanPart.includes(' le ')) {
        [field, value] = cleanPart.split(' le ');
        operator = 'le';
      } else if (cleanPart.includes(' lt ')) {
        [field, value] = cleanPart.split(' lt ');
        operator = 'lt';
      } else if (cleanPart.includes(' eq ')) {
        [field, value] = cleanPart.split(' eq ');
        operator = 'eq';
      }

      Logger.log(`Filter parsed -> field: "${field}", operator: "${operator}", value: "${value}"`);

      if (field && value) {
        const cleanField = field.trim();
        const rawValue = value.trim().replace(/^['"]|['"]$/g, '');
        const cleanValue = rawValue.toLowerCase();

        switch (cleanField) {
          case 'status':
            if (operator === 'sw') {
              query.andWhere('LOWER(workOrder.status) LIKE :status', { status: `${cleanValue}%` });
            } else if (operator === 'eq') {
              query.andWhere('LOWER(workOrder.status) = :status', { status: cleanValue });
            } else {
              throw new BadRequestException(`'${operator}' operator is not supported for field: status`, `filter=${filter}`);
            }
            break;

          case 'displayId':
            if (operator === 'sw') {
              query.andWhere('workOrder.displayId LIKE :displayId', { displayId: `${rawValue}%` });
            } else if (operator === 'eq') {
              query.andWhere('workOrder.displayId = :displayId', { displayId: rawValue });
            } else {
              query.andWhere(`workOrder.displayId ${this.getSqlOperator(operator)} :displayId`, { displayId: rawValue });
            }
            break;

          case 'startDate':
            if (operator === 'sw') {
              throw new BadRequestException(`'sw' operator is not supported for date field: startDate`, `filter=${filter}`);
            } else if (operator === 'eq') {
              query.andWhere('workOrder.startDate = :startDate', { startDate: this.formatDate(cleanValue) });
            } else {
              query.andWhere(`workOrder.startDate ${this.getSqlOperator(operator)} :startDate`, { startDate: this.formatDate(cleanValue) });
            }
            break;

          case 'endDate':
            if (operator === 'sw') {
              throw new BadRequestException(`'sw' operator is not supported for date field: endDate`, `filter=${filter}`);
            } else if (operator === 'eq') {
              query.andWhere('workOrder.endDate = :endDate', { endDate: this.formatDate(cleanValue) });
            } else {
              query.andWhere(`workOrder.endDate ${this.getSqlOperator(operator)} :endDate`, { endDate: this.formatDate(cleanValue) });
            }
            break;

          case 'createdAt':
            if (operator === 'sw') {
              throw new BadRequestException(`'sw' operator is not supported for date field: createdAt`, `filter=${filter}`);
            } else if (operator === 'eq') {
              query.andWhere('workOrder.createdAt = :createdAt', { createdAt: this.formatDate(cleanValue) });
            } else {
              query.andWhere(`workOrder.createdAt ${this.getSqlOperator(operator)} :createdAt`, { createdAt: this.formatDate(cleanValue) });
            }
            break;

          case 'updatedAt':
            if (operator === 'sw') {
              throw new BadRequestException(`'sw' operator is not supported for date field: updatedAt`, `filter=${filter}`);
            } else if (operator === 'eq') {
              query.andWhere('workOrder.updatedAt = :updatedAt', { updatedAt: this.formatDate(cleanValue) });
            } else {
              query.andWhere(`workOrder.updatedAt ${this.getSqlOperator(operator)} :updatedAt`, { updatedAt: this.formatDate(cleanValue) });
            }
            break;

          case 'orderName':
            if (operator === 'sw') {
              query.andWhere('LOWER(workOrder.orderName) LIKE :orderName', { orderName: `${cleanValue}%` });
            } else if (operator === 'eq') {
              query.andWhere('LOWER(workOrder.orderName) = :orderName', { orderName: cleanValue });
            } else {
              query.andWhere(`workOrder.orderName ${this.getSqlOperator(operator)} :orderName`, { orderName: rawValue });
            }
            break;

          case 'estimatedRevenue/currencyCode':
            if (operator === 'sw') {
              query.andWhere('LOWER(workOrder.currencyCode) LIKE :currencyCode', { currencyCode: `${cleanValue}%` });
            } else if (operator === 'eq') {
              query.andWhere('LOWER(workOrder.currencyCode) = :currencyCode', { currencyCode: cleanValue });
            } else {
              throw new BadRequestException(`'${operator}' operator is not supported for field: estimatedRevenue/currencyCode`, `filter=${filter}`);
            }
            break;

          case 'estimatedRevenue/content':
            if (operator === 'sw') {
              throw new BadRequestException(`'sw' operator is not supported for numeric field: estimatedRevenue/content`, `filter=${filter}`);
            } else if (operator === 'eq') {
              query.andWhere('workOrder.content = :content', { content: parseFloat(cleanValue) });
            } else {
              query.andWhere(`workOrder.content ${this.getSqlOperator(operator)} :content`, { content: parseFloat(cleanValue) });
            }
            break;

          case 'numberOfSubscriptions':
            if (operator === 'sw') {
              throw new BadRequestException(`'sw' operator is not supported for numeric field: numberOfSubscriptions`, `filter=${filter}`);
            } else if (operator === 'eq') {
              query.andWhere('workOrder.numberOfSubscriptions = :numberOfSubscriptions', { numberOfSubscriptions: parseInt(cleanValue, 10) });
            } else {
              query.andWhere(`workOrder.numberOfSubscriptions ${this.getSqlOperator(operator)} :numberOfSubscriptions`, { numberOfSubscriptions: parseInt(cleanValue, 10) });
            }
            break;

          case 'priority':
            if (operator === 'sw') {
              throw new BadRequestException(`'sw' operator is not supported for numeric field: priority`, `filter=${filter}`);
            } else if (operator === 'eq') {
              query.andWhere('workOrder.priority = :priority', { priority: parseFloat(cleanValue) });
            } else {
              query.andWhere(`workOrder.priority ${this.getSqlOperator(operator)} :priority`, { priority: parseFloat(cleanValue) });
            }
            break;

          case 'projectLeadId':
            query.andWhere('workOrder.projectLeadId = :projectLeadId', { projectLeadId: cleanValue });
            break;

          case 'accountId':
            query.andWhere('workOrder.accountId = :accountId', { accountId: cleanValue });
            break;

          default:
            throw new BadRequestException(
              `Unsupported filter field: ${cleanField}`,
              `filter=${filter}`
            );
        }
      }
    }
  }

  private getSqlOperator(operator: 'ge' | 'gt' | 'le' | 'lt'): string {
    switch (operator) {
      case 'ge': return '>=';
      case 'gt': return '>';
      case 'le': return '<=';
      case 'lt': return '<';
    }
  }

  private formatDate(value: string): string {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new BadRequestException(
        `Invalid date format: ${value}`,
        `date=${value}`
      );
    }
    return date.toISOString();
  }

  private searchFilter(query: any, search: string, employeeIds: string[] = [], accountIds: string[] = []): void {
    const searchValue = search
      .trim()
      .replace(/^['"]|['"]$/g, '')
      .toLowerCase();

    query.andWhere(
      new Brackets((qb) => {
        qb.orWhere('LOWER(workOrder.status) LIKE LOWER(:search)', {
          search: `%${searchValue}%`,
        })
          .orWhere('LOWER(workOrder.startDate) LIKE LOWER(:search)', {
            search: `%${searchValue}%`,
          })
          .orWhere('LOWER(workOrder.endDate) LIKE LOWER(:search)', {
            search: `%${searchValue}%`,
          })
          .orWhere('LOWER(workOrder.orderName) LIKE LOWER(:search)', {
            search: `%${searchValue}%`,
          })
          .orWhere('LOWER(workOrder.displayId) LIKE LOWER(:search)', {
            search: `%${searchValue}%`,
          })
          .orWhere('LOWER(workOrder.Customer) LIKE LOWER(:search)', {
            search: `%${searchValue}%`,
          })
          .orWhere('LOWER(workOrder.currencyCode) LIKE LOWER(:search)', {
            search: `%${searchValue}%`,
          })
          .orWhere('LOWER(workOrder.content) LIKE LOWER(:search)', {
            search: `%${searchValue}%`,
          })
          .orWhere('CAST(workOrder.numberOfSubscriptions AS NVARCHAR) LIKE :search', {
            search: `%${searchValue}%`,
          })
          .orWhere('CAST(workOrder.priority AS NVARCHAR) LIKE :search', {
            search: `%${searchValue}%`,
          });

        if (employeeIds.length > 0) {
          qb.orWhere('workOrder.projectLeadId IN (:...employeeIds)', { employeeIds });
        }
        // also match directly on projectLeadId UUID
        qb.orWhere('LOWER(workOrder.projectLeadId) LIKE LOWER(:search)', {
          search: `%${searchValue}%`,
        });

        if (accountIds.length > 0) {
          qb.orWhere('workOrder.accountId IN (:...accountIds)', { accountIds });
        }
        // also match directly on accountId UUID
        qb.orWhere('LOWER(workOrder.accountId) LIKE LOWER(:search)', {
          search: `%${searchValue}%`,
        });
      }),
    );
  }

  private applyOrderBy(query: any, orderBy: string): void {
    // Parse orderBy string: "fieldName asc" or "fieldName desc"
    const parts = orderBy.trim().split(' ');
    const field = parts[0];
    const direction = parts[1]?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    // Map OData field names to database column names
    const fieldMappings: Record<string, string> = {
      'status': 'workOrder.status',
      'startDate': 'workOrder.startDate',
      'endDate': 'workOrder.endDate',
      'orderName': 'workOrder.orderName',
      'numberOfSubscriptions': 'workOrder.numberOfSubscriptions',
      'priority': 'workOrder.priority',
      'Customer': 'workOrder.Customer',
      'displayId': 'workOrder.displayId',
      'createdAt': 'workOrder.createdAt',
      'updatedAt': 'workOrder.updatedAt',
      'estimatedRevenue': 'workOrder.content', // Sort by amount (content field)
      'estimatedRevenue/currencyCode': 'workOrder.currencyCode',
      'estimatedRevenue/content': 'workOrder.content',
    };

    const dbField = fieldMappings[field];
    if (!dbField) {
      throw new BadRequestException(
        `Unsupported orderBy field: ${field}`,
        `orderBy=${orderBy}`
      );
    }

    // Apply ordering with NULLS LAST to put null values at the end
    query.orderBy(dbField, direction, 'NULLS LAST');
  }

  async getWorkOrderById(workOrderId: string): Promise<any> {
    const workOrder = await this.workOrderRepository.findOne({
      where: { id: workOrderId },
    });
    
    if (!workOrder) {
      throw new NotFoundException(
        `Work Order with ID ${workOrderId} not found`,
        `workOrderId=${workOrderId}`
      );
    }

    const transformedWorkOrder = await this.transformWorkOrderResponse(workOrder, false);
    return { value: transformedWorkOrder };
  }

  async deleteWorkOrder(workOrderId: string) {
    // Fetch the work order with relations BEFORE deletion for analytics
    const workOrderBeforeDelete = await this.workOrderRepository.findOne({
      where: { id: workOrderId },
      relations: ['workProducts', 'workProducts.scheduleLines'],
    });

    if (!workOrderBeforeDelete) {
      this.logger.warn(`Work Order with ID ${workOrderId} not found for deletion`);
      return {
        value: [{
          id: workOrderId,
          status: 'not_found'
        }]
      };
    }

    // Perform deletion
    await this.workProductRepository.delete({
      workOrder: { id: workOrderId },
    });
    const result = await this.workOrderRepository.delete({ id: workOrderId });

    // Fire-and-forget analytics (won't block or fail business logic)
    this.sendDeleteAnalytics(workOrderId, workOrderBeforeDelete).catch((error) => {
      this.logger.error(
        `Analytics tracking failed for deleted work order ${workOrderId}: ${error.message}`,
      );
    });

    this.logger.log(
      `Work order deleted successfully. ID: ${workOrderId}`,
    );

    // Return minimal payload with identifier and status per guidelines
    return {
      value: [{
        id: workOrderId,
        status: result.affected && result.affected > 0 ? 'deleted' : 'not_found'
      }]
    };
  }

  private async sendDeleteAnalytics(workOrderId: string, beforeWorkOrder: any): Promise<void> {
    const entityFullName = 'customer.ssc.workorderservice.entity.workOrder';
    const serviceFullName = 'customer.ssc.service.workOrderService';

    try {
      const beforeImage = await this.analyticsReplicationService.transformWorkOrderForCudAnalytics(beforeWorkOrder);

      await this.analyticsReplicationService.sendCudDataEvent({
        entityFullName,
        serviceFullName,
        beforeImage,
        operation: 'Delete',
      });
    } catch (error) {
      this.logger.error(`Analytics DELETE event failed: ${error.message}`);
      throw error;
    }
  }

  async updateWorkOrder(
    workOrderId: string,
    updateWorkOrderDto: UpdateWorkOrderDto,
  ): Promise<any> {
    // Fetch the work order with relations BEFORE update for analytics
    const workOrderBeforeUpdate = await this.workOrderRepository.findOne({
      where: { id: workOrderId },
      relations: ['workProducts', 'workProducts.scheduleLines'],
    });

    if (!workOrderBeforeUpdate) {
      throw new NotFoundException(
        `Work Order with ID ${workOrderId} not found`,
        `workOrderId=${workOrderId}`
      );
    }

    // Fetch the work order entity for update
      const workOrder = await this.workOrderRepository.findOneBy({
        id: workOrderId,
      });

      if (!workOrder) {
        throw new NotFoundException(
          `Work Order with ID ${workOrderId} not found`,
          `workOrderId=${workOrderId}`
        );
      }

      if (updateWorkOrderDto.status) {
        workOrder.status = updateWorkOrderDto.status;
      }
      if (updateWorkOrderDto.startDate) {
        workOrder.startDate = updateWorkOrderDto.startDate;
      }
      if (updateWorkOrderDto.orderName) {
        workOrder.orderName = updateWorkOrderDto.orderName;
      }
      if (updateWorkOrderDto.endDate) {
        workOrder.endDate = updateWorkOrderDto.endDate;
      }
      if (updateWorkOrderDto.estimatedRevenue) {
        workOrder.currencyCode =
          updateWorkOrderDto.estimatedRevenue.currencyCode;
        workOrder.content = updateWorkOrderDto.estimatedRevenue.content;
      }
      if (updateWorkOrderDto.numberOfSubscriptions !== undefined) {
        workOrder.numberOfSubscriptions =
          updateWorkOrderDto.numberOfSubscriptions;
      }
      if (updateWorkOrderDto.priority !== undefined) {
        workOrder.priority = updateWorkOrderDto.priority;
      }

      // Handle project lead update
      if (updateWorkOrderDto.projectLead?.id !== undefined) {
        workOrder.projectLeadId = updateWorkOrderDto.projectLead.id;
      }

      // Handle account update
      if (updateWorkOrderDto.account?.id !== undefined) {
        workOrder.accountId = updateWorkOrderDto.account.id;
      }

      // Handle case display ID update
      if (updateWorkOrderDto.caseDisplayId !== undefined) {
        workOrder.caseDisplayId = updateWorkOrderDto.caseDisplayId;
      }

      // Handle display ID update
      if (updateWorkOrderDto.displayId !== undefined) {
        workOrder.displayId = updateWorkOrderDto.displayId;
      }

      const savedWorkOrder = await this.workOrderRepository.save(workOrder);

    // Fetch the complete updated work order with relations
    const workOrderAfterUpdate = await this.workOrderRepository.findOne({
      where: { id: workOrderId },
      relations: ['workProducts', 'workProducts.scheduleLines'],
    });

    // Fire-and-forget analytics (won't block or fail business logic)
    this.sendUpdateAnalytics(workOrderBeforeUpdate, workOrderAfterUpdate).catch((error) => {
      this.logger.error(
        `Analytics tracking failed for updated work order ${workOrderId}: ${error.message}`,
      );
    });

    this.logger.log(
      `Work order updated successfully. ID: ${workOrderId}`,
    );

    const transformedWorkOrder = await this.transformWorkOrderResponse(savedWorkOrder, false);
    return { value: [transformedWorkOrder] };
  }

  private async sendUpdateAnalytics(beforeWorkOrder: any, afterWorkOrder: any): Promise<void> {
    const entityFullName = 'customer.ssc.workorderservice.entity.workOrder';
    const serviceFullName = 'customer.ssc.service.workOrderService';

    try {
      const beforeImage = await this.analyticsReplicationService.transformWorkOrderForCudAnalytics(beforeWorkOrder);
      const currentImage = await this.analyticsReplicationService.transformWorkOrderForCudAnalytics(afterWorkOrder);

      await this.analyticsReplicationService.sendCudDataEvent({
        entityFullName,
        serviceFullName,
        beforeImage,
        currentImage,
        operation: 'Update',
      });
    } catch (error) {
      this.logger.error(`Analytics UPDATE event failed: ${error.message}`);
      throw error;
    }
  }
}
