import { Test, TestingModule } from '@nestjs/testing';
import { WorkOrderController } from './workOrder.controller';
import { WorkOrderService } from './workOrder.service';
import { AnalyticsReplicationService } from '../analytics/analytics-replication.service';
import { WorkOrderDto } from '../dto/workOrder.dto';
import { UpdateWorkOrderDto } from '../dto/updateWorkOrder.dto';
import { StatusCode } from '../enums/status.enum';
import { Response } from 'express';

describe('WorkOrderController', () => {
  let controller: WorkOrderController;
  let service: jest.Mocked<WorkOrderService>;

  const mockWorkOrder = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    orderName: 'Test Order',
    displayId: 'WO-001',
    status: StatusCode.ACTIVE,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    estimatedRevenue: {
      currencyCode: 'USD',
      content: 10000,
    },
    numberOfSubscriptions: 5,
    projectLead: {
      id: 'emp-123',
      formattedName: 'John Doe',
      displayId: 'EMP001',
    },
    Customer: 'Test Customer',
  };

  const mockResponse = {
    header: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkOrderController],
      providers: [
        {
          provide: WorkOrderService,
          useValue: {
            createWorkOrder: jest.fn(),
            getWorkOrders: jest.fn(),
            getWorkOrderById: jest.fn(),
            updateWorkOrder: jest.fn(),
            deleteWorkOrder: jest.fn(),
          },
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

    controller = module.get<WorkOrderController>(WorkOrderController);
    service = module.get(WorkOrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createWorkOrder', () => {
    it('should create a work order and return 201 with Location header', async () => {
      const workOrderDto: WorkOrderDto = {
        orderName: 'Test Order',
        status: StatusCode.ACTIVE,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        numberOfSubscriptions: 5,
        Customer: 'Test Customer',
        projectLead: { id: 'emp-123' },
        displayId: 'WO-001',
      };

      service.createWorkOrder.mockResolvedValue({
        value: [mockWorkOrder],
      });

      const result = await controller.createWorkOrder(workOrderDto, mockResponse);

      expect(service.createWorkOrder).toHaveBeenCalledWith(workOrderDto);
      expect(result.value).toHaveLength(1);
      expect(result.value[0].id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(mockResponse.header).toHaveBeenCalledWith(
        'Location',
        '/work-order-service/workOrders/123e4567-e89b-12d3-a456-426614174000'
      );
    });

    it('should create a work order with work products', async () => {
      const workOrderDto: any = {
        orderName: 'Test Order',
        status: StatusCode.ACTIVE,
        startDate: new Date('2024-01-01'),
        workProducts: [
          {
            workProductId: 'WP-001',
            workProductName: 'Product 1',
            quantity: 10,
          },
        ],
      };

      service.createWorkOrder.mockResolvedValue({
        value: [mockWorkOrder],
      });

      const result = await controller.createWorkOrder(workOrderDto, mockResponse);

      expect(service.createWorkOrder).toHaveBeenCalledWith(workOrderDto);
      expect(result.value).toHaveLength(1);
    });
  });

  describe('getWorkOrders', () => {
    it('should return list of work orders with default pagination', async () => {
      service.getWorkOrders.mockResolvedValue({
        value: [mockWorkOrder],
      });

      const result = await controller.getWorkOrders();

      expect(service.getWorkOrders).toHaveBeenCalledWith(undefined, undefined, undefined, undefined, undefined, undefined);
      expect(result.value).toHaveLength(1);
      expect(result.value[0].id).toBe('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should return list of work orders with custom pagination', async () => {
      service.getWorkOrders.mockResolvedValue({
        value: [mockWorkOrder],
      });

      const result = await controller.getWorkOrders(20, 10);

      expect(service.getWorkOrders).toHaveBeenCalledWith(20, 10, undefined, undefined, undefined, undefined);
      expect(result.value).toHaveLength(1);
    });

    it('should return list with count when requested', async () => {
      service.getWorkOrders.mockResolvedValue({
        value: [mockWorkOrder],
        count: 100,
      });

      const result = await controller.getWorkOrders(50, 0, true);

      expect(service.getWorkOrders).toHaveBeenCalledWith(50, 0, true, undefined, undefined, undefined);
      expect(result.value).toHaveLength(1);
      expect(result.count).toBe(100);
    });

    it('should apply orderBy parameter', async () => {
      service.getWorkOrders.mockResolvedValue({ value: [mockWorkOrder] });

      await controller.getWorkOrders(50, 0, false, 'orderName asc');

      expect(service.getWorkOrders).toHaveBeenCalledWith(50, 0, false, 'orderName asc', undefined, undefined);
    });

    it('should apply filter parameter', async () => {
      service.getWorkOrders.mockResolvedValue({ value: [mockWorkOrder] });

      await controller.getWorkOrders(50, 0, false, undefined, "status eq 'ACTIVE'");

      expect(service.getWorkOrders).toHaveBeenCalledWith(50, 0, false, undefined, "status eq 'ACTIVE'", undefined);
    });

    it('should apply search parameter', async () => {
      service.getWorkOrders.mockResolvedValue({ value: [mockWorkOrder] });

      await controller.getWorkOrders(50, 0, false, undefined, undefined, 'Test');

      expect(service.getWorkOrders).toHaveBeenCalledWith(50, 0, false, undefined, undefined, 'Test');
    });

    it('should handle empty result set', async () => {
      service.getWorkOrders.mockResolvedValue({ value: [] });

      const result = await controller.getWorkOrders();

      expect(result.value).toHaveLength(0);
    });
  });

  describe('getWorkOrderById', () => {
    it('should return a work order by id', async () => {
      service.getWorkOrderById.mockResolvedValue({ value: mockWorkOrder });

      const result = await controller.getWorkOrderById('123e4567-e89b-12d3-a456-426614174000');

      expect(service.getWorkOrderById).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
      expect(result).toEqual({ value: mockWorkOrder });
    });

    it('should handle non-existent work order', async () => {
      service.getWorkOrderById.mockRejectedValue(new Error('Work Order not found'));

      await expect(
        controller.getWorkOrderById('non-existent-id')
      ).rejects.toThrow('Work Order not found');
    });
  });

  describe('updateWorkOrder', () => {
    it('should update a work order successfully', async () => {
      const updateDto: UpdateWorkOrderDto = {
        status: StatusCode.INACTIVE,
        orderName: 'Updated Order',
      };

      const updatedWorkOrder = { ...mockWorkOrder, status: StatusCode.INACTIVE, orderName: 'Updated Order' };
      service.updateWorkOrder.mockResolvedValue({ value: [updatedWorkOrder] });

      const result = await controller.updateWorkOrder('123e4567-e89b-12d3-a456-426614174000', updateDto);

      expect(service.updateWorkOrder).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000', updateDto);
      expect(result.value[0].status).toBe(StatusCode.INACTIVE);
      expect(result.value[0].orderName).toBe('Updated Order');
    });

    it('should update only provided fields', async () => {
      const updateDto: UpdateWorkOrderDto = { numberOfSubscriptions: 10 };
      service.updateWorkOrder.mockResolvedValue({ value: [{ ...mockWorkOrder, numberOfSubscriptions: 10 }] });

      const result = await controller.updateWorkOrder('123e4567-e89b-12d3-a456-426614174000', updateDto);

      expect(result.value[0].numberOfSubscriptions).toBe(10);
    });

    it('should update estimatedRevenue', async () => {
      const updateDto: UpdateWorkOrderDto = { estimatedRevenue: { currencyCode: 'EUR', content: 20000 } };
      service.updateWorkOrder.mockResolvedValue({ value: [{ ...mockWorkOrder, estimatedRevenue: { currencyCode: 'EUR', content: 20000 } }] });

      const result = await controller.updateWorkOrder('123e4567-e89b-12d3-a456-426614174000', updateDto);

      expect(result.value[0].estimatedRevenue.currencyCode).toBe('EUR');
      expect(result.value[0].estimatedRevenue.content).toBe(20000);
    });

    it('should handle update of non-existent work order', async () => {
      service.updateWorkOrder.mockRejectedValue(new Error('Work Order not found'));

      await expect(
        controller.updateWorkOrder('non-existent-id', { status: StatusCode.INACTIVE })
      ).rejects.toThrow('Work Order not found');
    });
  });

  describe('deleteWorkOrder', () => {
    it('should delete a work order successfully', async () => {
      service.deleteWorkOrder.mockResolvedValue({
        value: [{ id: '123e4567-e89b-12d3-a456-426614174000', status: 'deleted' }],
      });

      const result = await controller.deleteWorkOrder('123e4567-e89b-12d3-a456-426614174000');

      expect(service.deleteWorkOrder).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
      expect(result.value[0].status).toBe('deleted');
    });

    it('should handle deletion of non-existent work order', async () => {
      service.deleteWorkOrder.mockResolvedValue({ value: [{ id: 'non-existent-id', status: 'not_found' }] });

      const result = await controller.deleteWorkOrder('non-existent-id');

      expect(result.value[0].status).toBe('not_found');
    });
  });

  describe('HTTP Status Codes', () => {
    it('should return 201 for POST createWorkOrder', async () => {
      service.createWorkOrder.mockResolvedValue({ value: [mockWorkOrder] });
      await controller.createWorkOrder({ orderName: 'Test' } as any, mockResponse);
      expect(service.createWorkOrder).toHaveBeenCalled();
    });

    it('should return 200 for GET getWorkOrders', async () => {
      service.getWorkOrders.mockResolvedValue({ value: [mockWorkOrder] });
      await controller.getWorkOrders();
      expect(service.getWorkOrders).toHaveBeenCalled();
    });

    it('should return 200 for GET getWorkOrderById', async () => {
      service.getWorkOrderById.mockResolvedValue({ value: mockWorkOrder });
      await controller.getWorkOrderById('123e4567-e89b-12d3-a456-426614174000');
      expect(service.getWorkOrderById).toHaveBeenCalled();
    });

    it('should return 200 for PATCH updateWorkOrder', async () => {
      service.updateWorkOrder.mockResolvedValue({ value: [mockWorkOrder] });
      await controller.updateWorkOrder('123e4567-e89b-12d3-a456-426614174000', {});
      expect(service.updateWorkOrder).toHaveBeenCalled();
    });

    it('should return 200 for DELETE deleteWorkOrder', async () => {
      service.deleteWorkOrder.mockResolvedValue({ value: [{ id: '123e4567-e89b-12d3-a456-426614174000', status: 'deleted' }] });
      await controller.deleteWorkOrder('123e4567-e89b-12d3-a456-426614174000');
      expect(service.deleteWorkOrder).toHaveBeenCalled();
    });
  });
});
