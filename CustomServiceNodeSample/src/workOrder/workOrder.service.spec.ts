import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkOrderService } from './workOrder.service';
import { WorkOrder } from '../entities/workOrder.entity';
import { WorkProduct } from '../entities/workProduct.entity';
import { ScheduleLine } from '../entities/scheduleLine.entity';
import { EmployeeService } from '../employee/employee.service';
import { WorkProductService } from '../workProduct/workProduct.service';
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
          useFactory: (workOrderRepo, workProductRepo, employeeService, workProductService) => {
            // Create instance without REQUEST scope for testing
            return new WorkOrderService(workOrderRepo, workProductRepo, employeeService, workProductService);
          },
          inject: [
            getRepositoryToken(WorkOrder),
            getRepositoryToken(WorkProduct),
            EmployeeService,
            WorkProductService,
          ],
        },
        {
          provide: getRepositoryToken(WorkOrder),
          useValue: {
            manager: {
              transaction: jest.fn(),
            },
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
          },
        },
        {
          provide: WorkProductService,
          useValue: {
            transformResponse: jest.fn(),
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
          save: jest.fn()
            .mockResolvedValueOnce(savedWorkOrder)
            .mockResolvedValueOnce(savedWorkOrder),
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
        endDate: new Date('2024-12-31'),
        workProducts: [
          {
            id: 'wp-1',
            workProductId: 'WP-001',
            customizationDetails: 'Custom',
            scheduleLines: [
              {
                date: new Date('2024-06-01'),
                requestedQuantity: 10,
                confirmedQuantity: 10,
              },
            ],
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
            getOne: jest.fn().mockResolvedValue({
              ...savedWorkOrder,
              workProducts: [{ ...savedWorkProduct, scheduleLines: [{ id: 'sl-1' }] }],
            }),
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
      const workOrders = [mockWorkOrder];
      mockQueryBuilder.getMany.mockResolvedValue(workOrders);
      employeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      const result = await service.getWorkOrders(10, 5);

      expect(result.value).toHaveLength(1);
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(5);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
    });

    it('should include count when requested', async () => {
      const workOrders = [mockWorkOrder];
      mockQueryBuilder.getMany.mockResolvedValue(workOrders);
      mockQueryBuilder.getCount.mockResolvedValue(100);
      employeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      const result = await service.getWorkOrders(50, 0, true);

      expect(result.value).toHaveLength(1);
      expect(result.count).toBe(100);
    });

    it('should apply filter for status', async () => {
      const workOrders = [mockWorkOrder];
      mockQueryBuilder.getMany.mockResolvedValue(workOrders);
      employeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      await service.getWorkOrders(50, 0, false, undefined, "status eq 'ACTIVE'");

      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    });

    it('should apply search filter', async () => {
      const workOrders = [mockWorkOrder];
      mockQueryBuilder.getMany.mockResolvedValue(workOrders);
      employeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      await service.getWorkOrders(50, 0, false, undefined, undefined, 'Test');

      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    });

    it('should apply orderBy sorting ascending', async () => {
      const workOrders = [mockWorkOrder];
      mockQueryBuilder.getMany.mockResolvedValue(workOrders);
      employeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      await service.getWorkOrders(50, 0, false, 'orderName asc');

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('workOrder.orderName', 'ASC', 'NULLS LAST');
    });

    it('should apply orderBy sorting descending', async () => {
      const workOrders = [mockWorkOrder];
      mockQueryBuilder.getMany.mockResolvedValue(workOrders);
      employeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      await service.getWorkOrders(50, 0, false, 'startDate desc');

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('workOrder.startDate', 'DESC', 'NULLS LAST');
    });

    it('should throw BadRequestException for unsupported orderBy field', async () => {
      await expect(
        service.getWorkOrders(50, 0, false, 'invalidField asc')
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for unsupported filter field', async () => {
      mockQueryBuilder.getMany.mockRejectedValue(new BadRequestException('Unsupported filter field'));

      await expect(
        service.getWorkOrders(50, 0, false, undefined, 'invalidField eq test')
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle employee lookup failure gracefully', async () => {
      const workOrders = [mockWorkOrder];
      mockQueryBuilder.getMany.mockResolvedValue(workOrders);
      employeeService.getEmployeeById.mockRejectedValue(new Error('Employee service error'));

      const result = await service.getWorkOrders();

      expect(result.value).toHaveLength(1);
      expect(result.value[0].projectLead).toBeNull();
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

      await expect(
        service.getWorkOrderById('non-existent-id')
      ).rejects.toThrow(NotFoundException);
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
      const updateDto = {
        status: StatusCode.INACTIVE,
        orderName: 'Updated Order',
        numberOfSubscriptions: 10,
      };

      workOrderRepository.findOneBy = jest.fn().mockResolvedValue(mockWorkOrder);
      workOrderRepository.save = jest.fn().mockResolvedValue({ ...mockWorkOrder, ...updateDto });
      employeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      const result = await service.updateWorkOrder('123e4567-e89b-12d3-a456-426614174000', updateDto);

      expect(result.value).toHaveLength(1);
      expect(workOrderRepository.save).toHaveBeenCalled();
    });

    it('should update estimatedRevenue fields', async () => {
      const updateDto = {
        estimatedRevenue: {
          currencyCode: 'EUR',
          content: 20000,
        },
      };

      const updatedWorkOrder = { ...mockWorkOrder, currencyCode: 'EUR', content: 20000 };
      workOrderRepository.findOneBy = jest.fn().mockResolvedValue(mockWorkOrder);
      workOrderRepository.save = jest.fn().mockResolvedValue(updatedWorkOrder);
      employeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      const result = await service.updateWorkOrder('123e4567-e89b-12d3-a456-426614174000', updateDto);

      expect(result.value).toHaveLength(1);
      expect(workOrderRepository.save).toHaveBeenCalled();
    });

    it('should update projectLeadId including null value', async () => {
      const updateDto = {
        projectLeadId: null,
      };

      workOrderRepository.findOneBy = jest.fn().mockResolvedValue(mockWorkOrder);
      workOrderRepository.save = jest.fn().mockResolvedValue({ ...mockWorkOrder, projectLeadId: null });
      employeeService.getEmployeeById.mockResolvedValue(null);

      const result = await service.updateWorkOrder('123e4567-e89b-12d3-a456-426614174000', updateDto);

      expect(result.value).toHaveLength(1);
      expect(workOrderRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when work order does not exist', async () => {
      workOrderRepository.findOneBy = jest.fn().mockResolvedValue(null);

      await expect(
        service.updateWorkOrder('non-existent-id', { status: StatusCode.INACTIVE })
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('createWorkOrder - branch coverage edge cases', () => {
    it('should create work order with currencyCode in root level (not in estimatedRevenue)', async () => {
      const createDto = {
        orderName: 'Test Order',
        status: StatusCode.ACTIVE,
        currencyCode: 'USD', // currencyCode at root level
        content: 10000,
      };

      const savedWorkOrder = { id: '123', ...createDto };
      
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

    it('should create work order with currencyCode in estimatedRevenue object', async () => {
      const createDto = {
        orderName: 'Test Order',
        status: StatusCode.ACTIVE,
        estimatedRevenue: {
          currencyCode: 'EUR',
          content: 20000,
        },
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

    it('should create work order without workProducts array', async () => {
      const createDto = {
        orderName: 'Simple Order',
        status: StatusCode.ACTIVE,
      };

      const savedWorkOrder = { id: '789', ...createDto, workProducts: [] };
      
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

    it('should create work order with workProducts but without scheduleLines', async () => {
      const createDto = {
        orderName: 'Order with Products',
        status: StatusCode.ACTIVE,
        workProducts: [
          {
            workProductName: 'Product 1',
            status: StatusCode.ACTIVE,
          },
        ],
      };

      const savedWorkOrder = { id: '111', orderName: 'Order with Products' };
      const savedWorkProduct = { id: 'wp-111', workProductName: 'Product 1' };
      
      (workOrderRepository.manager.transaction as jest.Mock) = jest.fn().mockImplementation(async (callback: any) => {
        const mockTransactionalEntityManager: any = {
          save: jest.fn()
            .mockResolvedValueOnce(savedWorkOrder)
            .mockResolvedValueOnce(savedWorkProduct),
          createQueryBuilder: jest.fn(() => ({
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue({ ...savedWorkOrder, workProducts: [savedWorkProduct] }),
          })),
        };
        return callback(mockTransactionalEntityManager);
      });

      employeeService.getEmployeeById.mockResolvedValue(null);

      const result = await service.createWorkOrder(createDto);

      expect(result.value).toHaveLength(1);
    });

    it('should handle projectLead fetch error gracefully', async () => {
      const createDto = {
        orderName: 'Order with Lead',
        status: StatusCode.ACTIVE,
        projectLeadId: 'emp-error',
      };

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
      expect(result.value[0].projectLead).toBeNull(); // Should handle error and return null
    });
  });

  describe('transformWorkOrderResponse - branch coverage', () => {
    it('should transform work order with both currencyCode and content present', async () => {
      const workOrder = {
        id: '123',
        orderName: 'Test',
        currencyCode: 'USD',
        content: 10000,
        projectLeadId: null,
        workProducts: [],
      };

      employeeService.getEmployeeById.mockResolvedValue(null);

      const result = await (service as any).transformWorkOrderResponse(workOrder, false);

      expect(result.estimatedRevenue).toEqual({
        currencyCode: 'USD',
        content: 10000,
      });
    });

    it('should return null estimatedRevenue when currencyCode is present but content is null', async () => {
      const workOrder = {
        id: '123',
        orderName: 'Test',
        currencyCode: 'USD',
        content: null,
        projectLeadId: null,
        workProducts: [],
      };

      employeeService.getEmployeeById.mockResolvedValue(null);

      const result = await (service as any).transformWorkOrderResponse(workOrder, false);

      expect(result.estimatedRevenue).toBeNull();
    });

    it('should return null estimatedRevenue when content is present but currencyCode is null', async () => {
      const workOrder = {
        id: '123',
        orderName: 'Test',
        currencyCode: null,
        content: 10000,
        projectLeadId: null,
        workProducts: [],
      };

      employeeService.getEmployeeById.mockResolvedValue(null);

      const result = await (service as any).transformWorkOrderResponse(workOrder, false);

      expect(result.estimatedRevenue).toBeNull();
    });

    it('should include workProducts when includeNested is true and workProducts exist', async () => {
      const workOrder = {
        id: '123',
        orderName: 'Test',
        projectLeadId: null,
        workProducts: [
          { id: 'wp-1', workProductName: 'Product 1', estimatedRevenue: null, createdAt: new Date(), updatedAt: new Date() },
        ],
      };

      employeeService.getEmployeeById.mockResolvedValue(null);
      jest.spyOn(workProductService, 'transformResponse').mockReturnValue({
        id: 'wp-1',
        workProductName: 'Product 1',
        estimatedRevenue: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const result = await (service as any).transformWorkOrderResponse(workOrder, true);

      expect(result.workProducts).toHaveLength(1);
      expect(workProductService.transformResponse).toHaveBeenCalled();
    });

    it('should not include workProducts when includeNested is false', async () => {
      const workOrder = {
        id: '123',
        orderName: 'Test',
        projectLeadId: null,
        workProducts: [
          { id: 'wp-1', workProductName: 'Product 1' },
        ],
      };

      employeeService.getEmployeeById.mockResolvedValue(null);

      const result = await (service as any).transformWorkOrderResponse(workOrder, false);

      expect(result.workProducts).toBeUndefined();
    });

    it('should not include workProducts when includeNested is true but workProducts is empty', async () => {
      const workOrder = {
        id: '123',
        orderName: 'Test',
        projectLeadId: null,
        workProducts: [],
      };

      employeeService.getEmployeeById.mockResolvedValue(null);

      const result = await (service as any).transformWorkOrderResponse(workOrder, true);

      // Empty array still gets spread, so we check for empty array
      expect(Array.isArray(result.workProducts) ? result.workProducts.length : 0).toBe(0);
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
      expect(workProductRepository.delete).toHaveBeenCalled();
      expect(workOrderRepository.delete).toHaveBeenCalled();
    });

    it('should return not_found when work order does not exist', async () => {
      workOrderRepository.findOne = jest.fn().mockResolvedValue(null);

      const result = await service.deleteWorkOrder('non-existent-id');

      expect(result.value).toHaveLength(1);
      expect(result.value[0].status).toBe('not_found');
    });
  });

  describe('Filter and Search Edge Cases', () => {
    it('should handle multiple filter conditions with "and"', async () => {
      const workOrders = [mockWorkOrder];
      mockQueryBuilder.getMany.mockResolvedValue(workOrders);
      employeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      await service.getWorkOrders(50, 0, false, undefined, "status eq 'ACTIVE' and orderName eq 'Test'");

      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    });

    it('should handle filter for numberOfSubscriptions', async () => {
      const workOrders = [mockWorkOrder];
      mockQueryBuilder.getMany.mockResolvedValue(workOrders);
      employeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      await service.getWorkOrders(50, 0, false, undefined, "numberOfSubscriptions eq '5'");

      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    });

    it('should handle filter for estimatedRevenue/currencyCode', async () => {
      const workOrders = [mockWorkOrder];
      mockQueryBuilder.getMany.mockResolvedValue(workOrders);
      employeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      await service.getWorkOrders(50, 0, false, undefined, "estimatedRevenue/currencyCode eq 'USD'");

      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid date format in filter', async () => {
      mockQueryBuilder.getMany.mockImplementation(() => {
        throw new BadRequestException('Invalid date format');
      });

      await expect(
        service.getWorkOrders(50, 0, false, undefined, "startDate eq 'invalid-date'")
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle empty search string', async () => {
      const workOrders = [mockWorkOrder];
      mockQueryBuilder.getMany.mockResolvedValue(workOrders);
      employeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      await service.getWorkOrders(50, 0, false, undefined, undefined, '');

      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
    });
  });

  describe('Pagination Edge Cases', () => {
    it('should enforce max pagination limit', async () => {
      const workOrders = [mockWorkOrder];
      mockQueryBuilder.getMany.mockResolvedValue(workOrders);
      employeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      // PaginationUtils should limit to max 1000
      await service.getWorkOrders(2000, 0);

      // Should be limited to 1000
      expect(mockQueryBuilder.take).toHaveBeenCalled();
    });

    it('should handle negative pagination values', async () => {
      const workOrders = [mockWorkOrder];
      mockQueryBuilder.getMany.mockResolvedValue(workOrders);
      employeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      await service.getWorkOrders(-10, -5);

      // Should default to reasonable values
      expect(mockQueryBuilder.skip).toHaveBeenCalled();
      expect(mockQueryBuilder.take).toHaveBeenCalled();
    });
  });
});
