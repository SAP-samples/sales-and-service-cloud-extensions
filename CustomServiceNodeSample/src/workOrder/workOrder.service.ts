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
import { PaginationUtils } from '../common/utils/pagination.utils';
import { WorkProductService } from '../workProduct/workProduct.service';


@Injectable({ scope: Scope.REQUEST })
export class WorkOrderService {
  private readonly logger = new Logger(WorkOrderService.name);

  constructor(
    @InjectRepository(WorkOrder)
    private workOrderRepository: Repository<WorkOrder>,

    @InjectRepository(WorkProduct)
    private workProductRepository: Repository<WorkProduct>,

    private employeeService: EmployeeService,
    private workProductService: WorkProductService,
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
            projectLeadId: workOrderDto.projectLeadId,
            Customer: workOrderDto.Customer,
            displayId: workOrderDto.displayId,
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

    this.logger.log(
      `Work order created successfully. ID: ${result.value[0].id}`,
    );

    return { value: result.value };
  }

  private async transformWorkOrderResponse(workOrder: WorkOrder, includeNested: boolean = false): Promise<any> {
    const { currencyCode, content, workProducts, projectLeadId, ...rest } = workOrder;

    let projectLead: Employee | null = null;
    if (projectLeadId) {
      try {
        projectLead = await this.employeeService.getEmployeeById(projectLeadId);
      } catch (error) {
        Logger.warn(`Failed to fetch project lead ${projectLeadId}: ${error.message}`);
      }
    }

    return {
      ...rest,
      projectLead: projectLead ? {
        id: projectLead.id,
        formattedName: projectLead.formattedName,
        displayId: projectLead.displayId,
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
    
    // Apply pagination validation
    const pagination = PaginationUtils.validatePagination(top, skip);
    
    let query = this.workOrderRepository
      .createQueryBuilder('workOrder');

    query.skip(pagination.skip);  // Always apply skip
    query.take(pagination.top);   // Always apply limit
    
    if (filter) {
      this.applyFilters(query, filter);
    }
    if (search) {
      this.searchFilter(query, search);
    }
    if (orderBy) {
      this.applyOrderBy(query, orderBy);
    }
    const value = await query.getMany();
    const transformedValue = await Promise.all(
      value.map((val) => this.transformWorkOrderResponse(val))
    );
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

  private applyFilters(query: any, filter: string): void {
    const parts = filter.split(' and ');

    for (const part of parts) {
      const [field, value] = part.split(' eq ');
      if (field && value) {
        const cleanField = field.trim();
        const cleanValue = value
          .trim()
          .replace(/^['"]|['"]$/g, '')
          .toLowerCase();

        switch (cleanField) {
          case 'status':
            query.andWhere('LOWER(workOrder.status) = :status', {
              status: cleanValue,
            });
            break;
          case 'startDate':
            query.andWhere('workOrder.startDate = :startDate', {
              startDate: this.formatDate(cleanValue),
            });
            break;
          case 'endDate':
            query.andWhere('workOrder.endDate = :endDate', {
              endDate: this.formatDate(cleanValue),
            });
            break;
          case 'orderName':
            query.andWhere('LOWER(workOrder.orderName) = :orderName', {
              orderName: cleanValue,
            });
            break;
          case 'estimatedRevenue/currencyCode':
            query.andWhere('LOWER(workOrder.currencyCode) = :currencyCode', {
              currencyCode: cleanValue,
            });
            break;
          case 'estimatedRevenue/content':
            query.andWhere('LOWER(workOrder.content) = :content', {
              content: cleanValue,
            });
            break;
          case 'numberOfSubscriptions':
            query.andWhere(
              'workOrder.numberOfSubscriptions = :numberOfSubscriptions',
              { numberOfSubscriptions: parseInt(cleanValue) },
            );
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

  private searchFilter(query: any, search: string): void {
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
          .orWhere('CAST(workOrder.numberOfSubscriptions AS VARCHAR) LIKE :search', {
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
    const workOrder = await this.workOrderRepository.findOne({
      where: { id: workOrderId },
    });

    if (!workOrder) {
      this.logger.warn(`Work Order with ID ${workOrderId} not found for deletion`);
      return {
        value: [{
          id: workOrderId,
          status: 'not_found'
        }]
      };
    }

    await this.workProductRepository.delete({
      workOrder: { id: workOrderId },
    });
    const result = await this.workOrderRepository.delete({ id: workOrderId });

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

  async updateWorkOrder(
    workOrderId: string,
    updateWorkOrderDto: UpdateWorkOrderDto,
  ): Promise<any> {
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
      if (updateWorkOrderDto.numberOfSubscriptions) {
        workOrder.numberOfSubscriptions =
          updateWorkOrderDto.numberOfSubscriptions;
      }
      
      if (updateWorkOrderDto.projectLeadId !== undefined) {
        workOrder.projectLeadId = updateWorkOrderDto.projectLeadId;
      }

      const savedWorkOrder = await this.workOrderRepository.save(workOrder);

    this.logger.log(
      `Work order updated successfully. ID: ${workOrderId}`,
    );

    const transformedWorkOrder = await this.transformWorkOrderResponse(savedWorkOrder, false);
    return { value: [transformedWorkOrder] };
  }
}
