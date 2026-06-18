import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkProductService } from './workProduct.service';
import { WorkProduct } from '../entities/workProduct.entity';
import { WorkOrder } from '../entities/workOrder.entity';
import { ScheduleLine } from '../entities/scheduleLine.entity';
import { AnalyticsReplicationService } from '../analytics/analytics-replication.service';
import { BadRequestException, NotFoundException } from '../common/exceptions/custom.exceptions';

describe('WorkProductService', () => {
  let service: WorkProductService;
  let workProductRepository: jest.Mocked<Repository<WorkProduct>>;
  let workOrderRepository: jest.Mocked<Repository<WorkOrder>>;

  const mockWorkProduct: Partial<WorkProduct> = {
    id: 'wp-123',
    workProductId: 'WP-001',
    workProductName: 'Test Product',
    customizationDetails: 'Custom details',
    quantity: 10,
    completionPercentage: 50,
    productCategory: 'CAT1',
    productTypeCode: 'TYPE1',
    currencyCode: 'USD',
    content: 5000,
    status: 'IN_PROGRESS',
    workOrderId: 'wo-123',
  };

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    getCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: WorkProductService,
          useFactory: (workProductRepo, workOrderRepo, scheduleLineRepo, analyticsSvc) => {
            return new WorkProductService(workProductRepo, workOrderRepo, scheduleLineRepo, analyticsSvc);
          },
          inject: [
            getRepositoryToken(WorkProduct),
            getRepositoryToken(WorkOrder),
            getRepositoryToken(ScheduleLine),
            AnalyticsReplicationService,
          ],
        },
        {
          provide: getRepositoryToken(WorkProduct),
          useValue: {
            createQueryBuilder: jest.fn(() => mockQueryBuilder),
            findOne: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(WorkOrder),
          useValue: { findOne: jest.fn() },
        },
        {
          provide: getRepositoryToken(ScheduleLine),
          useValue: {},
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

    service = module.get<WorkProductService>(WorkProductService);
    workProductRepository = module.get(getRepositoryToken(WorkProduct));
    workOrderRepository = module.get(getRepositoryToken(WorkOrder));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllWorkProducts', () => {
    it('should return all work products with default pagination', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockWorkProduct]);

      const result = await service.getAllWorkProducts();

      expect(result.value).toHaveLength(1);
      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(50);
      expect(mockQueryBuilder.offset).toHaveBeenCalledWith(0);
    });

    it('should return work products with custom pagination', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockWorkProduct]);

      await service.getAllWorkProducts(20, 10);

      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(20);
      expect(mockQueryBuilder.offset).toHaveBeenCalledWith(10);
    });

    it('should include count when requested', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockWorkProduct]);
      mockQueryBuilder.getCount.mockResolvedValue(100);

      const result = await service.getAllWorkProducts(50, 0, true);

      expect(result.count).toBe(100);
    });

    it('should apply search filter', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockWorkProduct]);

      await service.getAllWorkProducts(50, 0, false, undefined, undefined, 'Test');

      expect(mockQueryBuilder.where).toHaveBeenCalled();
    });

    it('should apply status filter', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockWorkProduct]);

      await service.getAllWorkProducts(50, 0, false, undefined, "status eq 'IN_PROGRESS'");

      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    });

    it('should apply orderBy sorting', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockWorkProduct]);

      await service.getAllWorkProducts(50, 0, false, 'workProductName desc');

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('workProduct.workProductName', 'DESC', 'NULLS LAST');
    });

    it('should throw BadRequestException for unsupported sort field', async () => {
      await expect(service.getAllWorkProducts(50, 0, false, 'invalidField asc')).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByWorkOrderId', () => {
    it('should return work products for a valid work order UUID', async () => {
      const workOrderId = '123e4567-e89b-12d3-a456-426614174000';
      mockQueryBuilder.getMany.mockResolvedValue([mockWorkProduct]);

      const result = await service.findByWorkOrderId(workOrderId);

      expect(result.value).toHaveLength(1);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'workProduct.workOrderId = :workOrderId',
        { workOrderId }
      );
    });

    it('should resolve displayId to UUID for work order lookup', async () => {
      const displayId = 'WO-001';
      const workOrder = { id: '123e4567-e89b-12d3-a456-426614174000', displayId };
      workOrderRepository.findOne = jest.fn().mockResolvedValue(workOrder);
      mockQueryBuilder.getMany.mockResolvedValue([mockWorkProduct]);

      const result = await service.findByWorkOrderId(displayId);

      expect(workOrderRepository.findOne).toHaveBeenCalledWith({ where: { displayId } });
      expect(result.value).toHaveLength(1);
    });

    it('should throw NotFoundException when work order displayId not found', async () => {
      workOrderRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.findByWorkOrderId('INVALID')).rejects.toThrow(NotFoundException);
    });

    it('should apply pagination for work order products', async () => {
      const workOrderId = '123e4567-e89b-12d3-a456-426614174000';
      mockQueryBuilder.getMany.mockResolvedValue([mockWorkProduct]);

      await service.findByWorkOrderId(workOrderId, 10, 5);

      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.offset).toHaveBeenCalledWith(5);
    });
  });

  describe('findOne', () => {
    it('should return a work product by id', async () => {
      workProductRepository.findOne = jest.fn().mockResolvedValue(mockWorkProduct);

      const result = await service.findOne('wp-123');

      expect(result.value.id).toBe('wp-123');
    });

    it('should throw NotFoundException when work product not found', async () => {
      workProductRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a work product successfully', async () => {
      const workProductDto: any = {
        workProductId: 'WP-002',
        workOrderId: 'wo-123',
        estimatedRevenue: { currencyCode: 'USD', content: 1000 },
      };

      const savedWorkProduct = { ...mockWorkProduct, id: 'new-wp-id' };
      workProductRepository.save = jest.fn().mockResolvedValue(savedWorkProduct);
      workProductRepository.findOne = jest.fn().mockResolvedValue(savedWorkProduct);
      workOrderRepository.findOne = jest.fn().mockResolvedValue({ id: 'wo-123', workProducts: [], workOrder: null });

      const result = await service.create(workProductDto);

      expect(result.value).toHaveLength(1);
      expect(workProductRepository.save).toHaveBeenCalled();
    });

    it('should handle direct currency and content fields', async () => {
      const workProductDto: any = { workProductId: 'WP-002', workOrderId: 'wo-123', currencyCode: 'GBP', content: 3000 };
      const savedWorkProduct = { ...mockWorkProduct, currencyCode: 'GBP', content: 3000 };
      workProductRepository.save = jest.fn().mockResolvedValue(savedWorkProduct);
      workProductRepository.findOne = jest.fn().mockResolvedValue(savedWorkProduct);
      workOrderRepository.findOne = jest.fn().mockResolvedValue({ id: 'wo-123', workProducts: [] });

      const result = await service.create(workProductDto);
      expect(result.value).toHaveLength(1);
    });
  });

  describe('update', () => {
    it('should update a work product successfully', async () => {
      const updatedWorkProduct = { ...mockWorkProduct, workProductName: 'Updated' };
      workProductRepository.findOne = jest.fn()
        .mockResolvedValueOnce({ ...mockWorkProduct })
        .mockResolvedValueOnce({ ...updatedWorkProduct });
      workProductRepository.save = jest.fn().mockResolvedValue({ ...updatedWorkProduct });
      workOrderRepository.findOne = jest.fn().mockResolvedValue({ id: 'wo-123', workProducts: [] });

      const result = await service.update('wp-123', { workProductName: 'Updated' } as any);

      expect(workProductRepository.save).toHaveBeenCalled();
      expect(result.value.id).toBe('wp-123');
    });

    it('should throw NotFoundException when updating non-existent product', async () => {
      workProductRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.update('non-existent-id', {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a work product successfully', async () => {
      workProductRepository.findOne = jest.fn().mockResolvedValue(mockWorkProduct);
      workProductRepository.remove = jest.fn().mockResolvedValue(mockWorkProduct);
      workOrderRepository.findOne = jest.fn().mockResolvedValue({ id: 'wo-123', workProducts: [] });

      const result = await service.delete('wp-123');

      expect(result.value[0].status).toBe('deleted');
      expect(workProductRepository.remove).toHaveBeenCalled();
    });

    it('should throw NotFoundException when deleting non-existent product', async () => {
      workProductRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.delete('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne with workOrderId', () => {
    it('should return work product scoped by valid UUID workOrderId', async () => {
      workProductRepository.findOne = jest.fn().mockResolvedValue(mockWorkProduct);

      const result = await service.findOne('wp-123', '123e4567-e89b-12d3-a456-426614174000');

      expect(workProductRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'wp-123', workOrderId: '123e4567-e89b-12d3-a456-426614174000' },
      });
      expect(result.value.id).toBe('wp-123');
    });

    it('should throw BadRequestException for non-UUID workOrderId', async () => {
      await expect(service.findOne('wp-123', 'INVALID-ID')).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when work product not found under workOrderId', async () => {
      workProductRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(
        service.findOne('wp-123', '123e4567-e89b-12d3-a456-426614174000')
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update with workOrderId', () => {
    it('should update a work product scoped by workOrderId', async () => {
      const updatedWorkProduct = { ...mockWorkProduct, workProductName: 'Scoped Update' };
      workProductRepository.findOne = jest.fn()
        .mockResolvedValueOnce({ ...mockWorkProduct })
        .mockResolvedValueOnce({ ...updatedWorkProduct });
      workProductRepository.save = jest.fn().mockResolvedValue({ ...updatedWorkProduct });
      workOrderRepository.findOne = jest.fn().mockResolvedValue({ id: 'wo-123', workProducts: [] });

      const result = await service.update('wp-123', { workProductName: 'Scoped Update' } as any, '123e4567-e89b-12d3-a456-426614174000');

      expect(workProductRepository.save).toHaveBeenCalled();
      expect(result.value.id).toBe('wp-123');
    });

    it('should throw BadRequestException for non-UUID workOrderId in update', async () => {
      await expect(service.update('wp-123', {} as any, 'NOT-A-UUID')).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete with workOrderId', () => {
    it('should delete a work product scoped by workOrderId', async () => {
      workProductRepository.findOne = jest.fn().mockResolvedValue(mockWorkProduct);
      workProductRepository.remove = jest.fn().mockResolvedValue(mockWorkProduct);
      workOrderRepository.findOne = jest.fn().mockResolvedValue({ id: 'wo-123', workProducts: [] });

      const result = await service.delete('wp-123', '123e4567-e89b-12d3-a456-426614174000');

      expect(result.value[0].status).toBe('deleted');
      expect(workProductRepository.remove).toHaveBeenCalled();
    });

    it('should throw NotFoundException when product not found under workOrderId', async () => {
      workProductRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(
        service.delete('wp-123', '123e4567-e89b-12d3-a456-426614174000')
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('transformResponse', () => {
    it('should transform work product with estimatedRevenue', () => {
      const transformed = service.transformResponse(mockWorkProduct as WorkProduct, false);

      expect(transformed.estimatedRevenue).toEqual({ currencyCode: 'USD', content: 5000 });
      expect((transformed as any).currencyCode).toBeUndefined();
      expect((transformed as any).content).toBeUndefined();
    });

    it('should return null estimatedRevenue when both fields absent', () => {
      const workProduct = { ...mockWorkProduct, currencyCode: null, content: null };
      const transformed = service.transformResponse(workProduct as WorkProduct, false);
      expect(transformed.estimatedRevenue).toBeNull();
    });

    it('should include schedule lines when nested flag is true', () => {
      const workProductWithLines = {
        ...mockWorkProduct,
        scheduleLines: [{ id: 'sl-1', displayId: 'SL-001', scheduleLineName: 'Line 1', date: new Date(), requestedQuantity: 10, confirmedQuantity: 8, requestedEndDate: new Date(), status: 'CONFIRMED' }],
      };
      const transformed = service.transformResponse(workProductWithLines as any, true);
      expect(transformed.scheduleLines).toHaveLength(1);
    });

    it('should not include schedule lines when nested flag is false', () => {
      const workProductWithLines = { ...mockWorkProduct, scheduleLines: [{ id: 'sl-1' }] };
      const transformed = service.transformResponse(workProductWithLines as any, false);
      expect(transformed.scheduleLines).toBeUndefined();
    });

    it('should exclude workOrder from transformed response', () => {
      const workProduct = { ...mockWorkProduct, workOrder: { id: 'wo-1', orderName: 'Order 1' } };
      const transformed = service.transformResponse(workProduct as any, false);
      expect((transformed as any).workOrder).toBeUndefined();
    });
  });

  describe('applySorting', () => {
    const mockQuery = { orderBy: jest.fn().mockReturnThis() };
    beforeEach(() => mockQuery.orderBy.mockClear());

    it('should sort by workProductId', () => {
      (service as any).applySorting(mockQuery, 'workProductId asc');
      expect(mockQuery.orderBy).toHaveBeenCalledWith('workProduct.workProductId', 'ASC', 'NULLS LAST');
    });

    it('should sort by completionPercentage descending', () => {
      (service as any).applySorting(mockQuery, 'completionPercentage desc');
      expect(mockQuery.orderBy).toHaveBeenCalledWith('workProduct.completionPercentage', 'DESC', 'NULLS LAST');
    });

    it('should sort by estimatedRevenue (content field)', () => {
      (service as any).applySorting(mockQuery, 'estimatedRevenue asc');
      expect(mockQuery.orderBy).toHaveBeenCalledWith('workProduct.content', 'ASC', 'NULLS LAST');
    });

    it('should throw BadRequestException for unsupported sort field', () => {
      expect(() => (service as any).applySorting(mockQuery, 'unsupportedField asc')).toThrow(BadRequestException);
    });
  });
});
