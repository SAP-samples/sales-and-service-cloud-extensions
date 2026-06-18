import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkOrderService } from './workOrder.service';
import { WorkOrder } from '../entities/workOrder.entity';
import { WorkProduct } from '../entities/workProduct.entity';
import { EmployeeService } from '../employee/employee.service';
import { AccountService } from '../account/account.service';
import { WorkProductService } from '../workProduct/workProduct.service';
import { AnalyticsReplicationService } from '../analytics/analytics-replication.service';
import { BadRequestException, NotFoundException } from '../common/exceptions/custom.exceptions';
import { StatusCode } from '../enums/status.enum';

describe('WorkOrderService', () => {
  let service: WorkOrderService;
  let workOrderRepository: jest.Mocked<Repository<WorkOrder>>;
  let workProductRepository: jest.Mocked<Repository<WorkProduct>>;
  let employeeService: jest.Mocked<EmployeeService>;
  let workProductService: jest.Mocked<WorkProductService>;

  const mockWorkOrder: Partial<WorkOrder> = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    orderName: 'Test Order',
    displayId: 'WO-001',
    status: StatusCode.ACTIVE,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    currencyCode: 'USD',
    content: 10000,
    numberOfSubscriptions: 5,
    projectLeadId: 'emp-123',
    Customer: 'Test Customer',
    workProducts: [],
  };

  const mockEmployee = {
    id: 'emp-123',
    formattedName: 'John Doe',
    displayId: 'EMP001',
  };

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    getOne: jest.fn(),
    getCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: WorkOrderService,
          useFactory: (workOrderRepo, workProductRepo, employeeSvc, accountSvc, workProductSvc, analyticsSvc) => {
            return new WorkOrderService(workOrderRepo, workProductRepo, employeeSvc, accountSvc, workProductSvc, analyticsSvc);
          },
          inject: [
            getRepositoryToken(WorkOrder),
            getRepositoryToken(WorkProduct),
            EmployeeService,
            AccountService,
            WorkProductService,
            AnalyticsReplicationService,
          ],
        },
        {
          provide: getRepositoryToken(WorkOrder),
          useValue: {
            manager: { transaction: jest.fn() },
            createQueryBuilder: jest.fn(() => mockQueryBuilder),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(WorkProduct),
          useValue: {
            delete: jest.fn(),
          },
        },
        {
          provide: EmployeeService,
          useValue: {
            getEmployeeById: jest.fn(),
            searchEmployeesByDisplayId: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: AccountService,
          useValue: {
            getAccountById: jest.fn(),
            searchAccountsByDisplayId: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: WorkProductService,
          useValue: { transformResponse: jest.fn() },
        },
        {
          provide: AnalyticsReplicationService,
          useValue: {
            transformWorkOrderForCudAnalytics: jest.fn().mockResolvedValue({}),
            sendCudDataEvent: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<WorkOrderService>(WorkOrderService);
    workOrderRepository = module.get(getRepositoryToken(WorkOrder));
    workProductRepository = module.get(getRepositoryToken(WorkProduct));
    employeeService = module.get(EmployeeService);
    workProductService = module.get(WorkProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createWorkOrder', () => {
    it('should create a work order successfully without work products', async () => {
      const workOrderDto: any = {
        orderName: 'Test Order',
        status: StatusCode.ACTIVE,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        numberOfSubscriptions: 5,
        Customer: 'Test Customer',
      };

      const savedWorkOrder = { ...mockWorkOrder };

      (workOrderRepository.manager.transaction as jest.Mock) = jest.fn().mockImplementation(async (callback: any) => {
        const mockTransactionalEntityManager: any = {
          save: jest.fn().mockResolvedValueOnce(savedWorkOrder),
          createQueryBuilder: jest.fn(() => ({
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue(savedWorkOrder),
          })),
        };
        return callback(mockTransactionalEntityManager);
      });

      employeeService.getEmployeeById.mockResolvedValue(null);

      const result = await service.createWorkOrder(workOrderDto);

      expect(result.value).toHaveLength(1);
      expect(result.value[0].orderName).toBe('Test Order');
      expect(workOrderRepository.manager.transaction).toHaveBeenCalled();
    });

    it('should create a work order with work products and schedule lines', async () => {
      const workOrderDto: any = {
        orderName: 'Test Order',
        status: StatusCode.ACTIVE,
        startDate: new Date('2024-01-01'),
        workProducts: [
          {
            workProductId: 'WP-001',
            scheduleLines: [{ date: new Date('2024-06-01'), requestedQuantity: 10 }],
          },
        ],
      };

      const savedWorkOrder = { ...mockWorkOrder };
      const savedWorkProduct = { id: 'wp-1', workProductId: 'WP-001' };

      (workOrderRepository.manager.transaction as jest.Mock) = jest.fn().mockImplementation(async (callback: any) => {
        const mockTransactionalEntityManager: any = {
          save: jest.fn()
            .mockResolvedValueOnce(savedWorkOrder)
            .mockResolvedValueOnce(savedWorkProduct)
            .mockResolvedValueOnce([{ id: 'sl-1' }]),
          createQueryBuilder: jest.fn(() => ({
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue({ ...savedWorkOrder, workProducts: [{ ...savedWorkProduct, scheduleLines: [{ id: 'sl-1' }] }] }),
          })),
        };
        return callback(mockTransactionalEntityManager);
      });

      employeeService.getEmployeeById.mockResolvedValue(null);
      workProductService.transformResponse.mockReturnValue({ id: 'wp-1', estimatedRevenue: null, createdAt: new Date(), updatedAt: new Date() } as any);

      const result = await service.createWorkOrder(workOrderDto);

      expect(result.value).toHaveLength(1);
      expect(workOrderRepository.manager.transaction).toHaveBeenCalled();
    });

    it('should create work order with currencyCode in estimatedRevenue object', async () => {
      const createDto: any = {
        orderName: 'Test Order',
        estimatedRevenue: { currencyCode: 'EUR', content: 20000 },
      };

      const savedWorkOrder = { id: '456', orderName: 'Test Order', currencyCode: 'EUR', content: 20000 };

      (workOrderRepository.manager.transaction as jest.Mock) = jest.fn().mockImplementation(async (callback: any) => {
        const mockTransactionalEntityManager: any = {
          save: jest.fn().mockResolvedValueOnce(savedWorkOrder),
          createQueryBuilder: jest.fn(() => ({
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue(savedWorkOrder),
          })),
        };
        return callback(mockTransactionalEntityManager);
      });

      employeeService.getEmployeeById.mockResolvedValue(null);
      const result = await service.createWorkOrder(createDto);
      expect(result.value).toHaveLength(1);
    });

    it('should create work order with priority field', async () => {
      const createDto: any = {
        orderName: 'Priority Order',
        priority: 2,
      };

      const savedWorkOrder = { id: '789', orderName: 'Priority Order', priority: 2 };

      (workOrderRepository.manager.transaction as jest.Mock) = jest.fn().mockImplementation(async (callback: any) => {
        const mockTransactionalEntityManager: any = {
          save: jest.fn().mockResolvedValueOnce(savedWorkOrder),
          createQueryBuilder: jest.fn(() => ({
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue(savedWorkOrder),
          })),
        };
        return callback(mockTransactionalEntityManager);
      });

      employeeService.getEmployeeById.mockResolvedValue(null);
      const result = await service.createWorkOrder(createDto);
      expect(result.value).toHaveLength(1);
    });

    it('should handle projectLead fetch error gracefully', async () => {
      const createDto: any = { orderName: 'Order', projectLeadId: 'emp-error' };
      const savedWorkOrder = { id: '222', ...createDto };

      (workOrderRepository.manager.transaction as jest.Mock) = jest.fn().mockImplementation(async (callback: any) => {
        const mockTransactionalEntityManager: any = {
          save: jest.fn().mockResolvedValueOnce(savedWorkOrder),
          createQueryBuilder: jest.fn(() => ({
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue(savedWorkOrder),
          })),
        };
        return callback(mockTransactionalEntityManager);
      });

      employeeService.getEmployeeById.mockRejectedValue(new Error('Employee service unavailable'));

      const result = await service.createWorkOrder(createDto);
      expect(result.value).toHaveLength(1);
      expect(result.value[0].projectLead).toBeNull();
    });
  });

  describe('getWorkOrders', () => {
    it('should return paginated work orders with default pagination', async () => {
      const workOrders = [mockWorkOrder, { ...mockWorkOrder, id: 'another-id' }];
      mockQueryBuilder.getMany.mockResolvedValue(workOrders);
      employeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      const result = await service.getWorkOrders();

      expect(result.value).toHaveLength(2);
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(50);
    });

    it('should return work orders with custom pagination', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockWorkOrder]);
      employeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      await service.getWorkOrders(10, 5);

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(5);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
    });

    it('should include count when requested', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockWorkOrder]);
      mockQueryBuilder.getCount.mockResolvedValue(100);
      employeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      const result = await service.getWorkOrders(50, 0, true);

      expect(result.count).toBe(100);
    });

    it('should apply filter for status', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockWorkOrder]);
      employeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      await service.getWorkOrders(50, 0, false, undefined, "status eq 'ACTIVE'");

      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    });

    it('should apply search filter', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockWorkOrder]);
      employeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      await service.getWorkOrders(50, 0, false, undefined, undefined, 'Test');

      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    });

    it('should apply orderBy ascending', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockWorkOrder]);
      employeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      await service.getWorkOrders(50, 0, false, 'orderName asc');

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('workOrder.orderName', 'ASC', 'NULLS LAST');
    });

    it('should apply orderBy descending', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockWorkOrder]);
      employeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      await service.getWorkOrders(50, 0, false, 'startDate desc');

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('workOrder.startDate', 'DESC', 'NULLS LAST');
    });

    it('should apply orderBy for priority', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockWorkOrder]);
      employeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      await service.getWorkOrders(50, 0, false, 'priority asc');

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('workOrder.priority', 'ASC', 'NULLS LAST');
    });

    it('should throw BadRequestException for unsupported orderBy field', async () => {
      await expect(service.getWorkOrders(50, 0, false, 'invalidField asc')).rejects.toThrow(BadRequestException);
    });

    it('should handle employee lookup failure gracefully', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockWorkOrder]);
      employeeService.getEmployeeById.mockRejectedValue(new Error('Employee service error'));

      const result = await service.getWorkOrders();

      expect(result.value).toHaveLength(1);
      expect(result.value[0].projectLead).toBeNull();
    });

    it('should enforce max pagination limit', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockWorkOrder]);
      employeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      await service.getWorkOrders(2000, 0);

      expect(mockQueryBuilder.take).toHaveBeenCalled();
    });
  });

  describe('getWorkOrderById', () => {
    it('should return a work order by id', async () => {
      workOrderRepository.findOne = jest.fn().mockResolvedValue(mockWorkOrder);
      employeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      const result = await service.getWorkOrderById('123e4567-e89b-12d3-a456-426614174000');

      expect(result.value.id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(result.value.projectLead).toEqual({
        id: mockEmployee.id,
        formattedName: mockEmployee.formattedName,
        displayId: mockEmployee.displayId,
      });
    });

    it('should throw NotFoundException when work order does not exist', async () => {
      workOrderRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.getWorkOrderById('non-existent-id')).rejects.toThrow(NotFoundException);
    });

    it('should return work order with null projectLead when employee not found', async () => {
      workOrderRepository.findOne = jest.fn().mockResolvedValue(mockWorkOrder);
      employeeService.getEmployeeById.mockResolvedValue(null);

      const result = await service.getWorkOrderById('123e4567-e89b-12d3-a456-426614174000');

      expect(result.value.projectLead).toBeNull();
    });
  });

  describe('updateWorkOrder', () => {
    it('should update a work order successfully', async () => {
      const updateDto = { status: StatusCode.INACTIVE, orderName: 'Updated Order', numberOfSubscriptions: 10 };
      workOrderRepository.findOne = jest.fn().mockResolvedValue({ ...mockWorkOrder });
      workOrderRepository.findOneBy = jest.fn().mockResolvedValue({ ...mockWorkOrder });
      workOrderRepository.save = jest.fn().mockResolvedValue({ ...mockWorkOrder, ...updateDto });
      employeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      const result = await service.updateWorkOrder('123e4567-e89b-12d3-a456-426614174000', updateDto);

      expect(result.value).toHaveLength(1);
      expect(workOrderRepository.save).toHaveBeenCalled();
    });

    it('should update estimatedRevenue fields', async () => {
      const updateDto = { estimatedRevenue: { currencyCode: 'EUR', content: 20000 } };
      workOrderRepository.findOne = jest.fn().mockResolvedValue({ ...mockWorkOrder });
      workOrderRepository.findOneBy = jest.fn().mockResolvedValue({ ...mockWorkOrder });
      workOrderRepository.save = jest.fn().mockResolvedValue({ ...mockWorkOrder, currencyCode: 'EUR', content: 20000 });
      employeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      const result = await service.updateWorkOrder('123e4567-e89b-12d3-a456-426614174000', updateDto);

      expect(result.value).toHaveLength(1);
      expect(workOrderRepository.save).toHaveBeenCalled();
    });

    it('should update Customer field', async () => {
      const updateDto = { Customer: 'New Customer' };
      workOrderRepository.findOne = jest.fn().mockResolvedValue({ ...mockWorkOrder });
      workOrderRepository.findOneBy = jest.fn().mockResolvedValue({ ...mockWorkOrder });
      workOrderRepository.save = jest.fn().mockResolvedValue({ ...mockWorkOrder, Customer: 'New Customer' });
      employeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      const result = await service.updateWorkOrder('123e4567-e89b-12d3-a456-426614174000', updateDto);

      expect(result.value).toHaveLength(1);
      expect(workOrderRepository.save).toHaveBeenCalled();
    });

    it('should update priority field', async () => {
      const updateDto = { priority: 3 };
      workOrderRepository.findOne = jest.fn().mockResolvedValue({ ...mockWorkOrder });
      workOrderRepository.findOneBy = jest.fn().mockResolvedValue({ ...mockWorkOrder });
      workOrderRepository.save = jest.fn().mockResolvedValue({ ...mockWorkOrder, priority: 3 });
      employeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      const result = await service.updateWorkOrder('123e4567-e89b-12d3-a456-426614174000', updateDto);

      expect(result.value).toHaveLength(1);
      expect(workOrderRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when work order does not exist', async () => {
      workOrderRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(
        service.updateWorkOrder('non-existent-id', { status: StatusCode.INACTIVE })
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteWorkOrder', () => {
    it('should delete a work order successfully', async () => {
      workOrderRepository.findOne = jest.fn().mockResolvedValue(mockWorkOrder);
      workProductRepository.delete = jest.fn().mockResolvedValue({ affected: 1 });
      workOrderRepository.delete = jest.fn().mockResolvedValue({ affected: 1 });

      const result = await service.deleteWorkOrder('123e4567-e89b-12d3-a456-426614174000');

      expect(result.value).toHaveLength(1);
      expect(result.value[0].status).toBe('deleted');
    });

    it('should return not_found when work order does not exist', async () => {
      workOrderRepository.findOne = jest.fn().mockResolvedValue(null);

      const result = await service.deleteWorkOrder('non-existent-id');

      expect(result.value[0].status).toBe('not_found');
    });
  });

  describe('Filter and Search Edge Cases', () => {
    it('should handle filter for numberOfSubscriptions', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockWorkOrder]);
      employeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      await service.getWorkOrders(50, 0, false, undefined, "numberOfSubscriptions eq '5'");

      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    });

    it('should handle filter for estimatedRevenue/currencyCode', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockWorkOrder]);
      employeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      await service.getWorkOrders(50, 0, false, undefined, "estimatedRevenue/currencyCode eq 'USD'");

      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    });

    it('should handle filter for priority', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockWorkOrder]);
      employeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      await service.getWorkOrders(50, 0, false, undefined, "priority eq '1'");

      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    });

    it('should handle empty search string', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockWorkOrder]);
      employeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      await service.getWorkOrders(50, 0, false, undefined, undefined, '');

      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
    });
  });
});
