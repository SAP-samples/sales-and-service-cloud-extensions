import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Repository } from 'typeorm';
import { AnalyticsReplicationService } from './analytics-replication.service';
import { EventServiceClient } from '../events/event-service.client';
import { WorkOrderEventTransformer } from '../events/workOrder-event.transformer';
import { WorkOrder } from '../entities/workOrder.entity';
import { SESSION } from '../common/constants/constants';

const makeRequest = (sourceId?: string, btpDestination?: string) => ({
  [SESSION]: { sourceId, btpDestination },
});

const mockWorkOrder = (overrides: Partial<WorkOrder> = {}): WorkOrder => ({
  id: 'wo-001',
  orderName: 'Test Order',
  displayId: 'WO-001',
  status: 1,
  projectLeadId: 'emp-123',
  accountId: 'acc-456',
  currencyCode: 'USD',
  content: 1000,
  workProducts: [],
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-12-31'),
  ...overrides,
} as any);

describe('AnalyticsReplicationService', () => {
  let service: AnalyticsReplicationService;
  let workOrderRepository: jest.Mocked<Repository<WorkOrder>>;
  let eventServiceClient: jest.Mocked<EventServiceClient>;
  let transformer: jest.Mocked<WorkOrderEventTransformer>;

  const buildModule = async (request: any) => {
    workOrderRepository = {
      count: jest.fn(),
      find: jest.fn(),
    } as any;

    eventServiceClient = { sendEvent: jest.fn().mockResolvedValue(undefined) } as any;
    transformer = { transform: jest.fn().mockResolvedValue({ id: 'wo-001', orderName: 'Test Order' }) } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AnalyticsReplicationService,
          useFactory: (repo, client, trans, req) =>
            new AnalyticsReplicationService(repo, client, trans, req),
          inject: [
            getRepositoryToken(WorkOrder),
            EventServiceClient,
            WorkOrderEventTransformer,
            REQUEST,
          ],
        },
        { provide: getRepositoryToken(WorkOrder), useValue: workOrderRepository },
        { provide: EventServiceClient, useValue: eventServiceClient },
        { provide: WorkOrderEventTransformer, useValue: transformer },
        { provide: REQUEST, useValue: request },
      ],
    }).compile();

    return module.get<AnalyticsReplicationService>(AnalyticsReplicationService);
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    service = await buildModule(makeRequest('src-id', 'btp-dest'));
  });

  describe('startDataExport - Config Validation', () => {
    it('should skip export when sourceId is missing', async () => {
      service = await buildModule(makeRequest(undefined, 'btp-dest'));

      await service.startDataExport('req-1', 'WorkOrderService', 'WorkOrder');

      expect(workOrderRepository.count).not.toHaveBeenCalled();
      expect(eventServiceClient.sendEvent).not.toHaveBeenCalled();
    });

    it('should skip export when btpDestination is missing', async () => {
      service = await buildModule(makeRequest('src-id', undefined));

      await service.startDataExport('req-1', 'WorkOrderService', 'WorkOrder');

      expect(workOrderRepository.count).not.toHaveBeenCalled();
      expect(eventServiceClient.sendEvent).not.toHaveBeenCalled();
    });

    it('should skip export when both config values are missing', async () => {
      service = await buildModule(makeRequest());

      await service.startDataExport('req-1', 'WorkOrderService', 'WorkOrder');

      expect(eventServiceClient.sendEvent).not.toHaveBeenCalled();
    });
  });

  describe('startDataExport - Success Flow', () => {
    it('should send PLAN, DATA, and SUMMARY events for one record', async () => {
      workOrderRepository.count.mockResolvedValue(1);
      workOrderRepository.find.mockResolvedValue([mockWorkOrder()]);

      await service.startDataExport('req-1', 'WorkOrderService', 'WorkOrder');

      expect(eventServiceClient.sendEvent).toHaveBeenCalledTimes(3);

      const calls = eventServiceClient.sendEvent.mock.calls;
      expect(calls[0][0].data.type).toBe('PLAN');
      expect(calls[1][0].data.type).toBe('DATA');
      expect(calls[2][0].data.type).toBe('SUMMARY');
      expect(calls[2][0].data.status).toBe('SUCCESS');
    });

    it('should send PLAN + multiple DATA events + SUMMARY for multiple records', async () => {
      workOrderRepository.count.mockResolvedValue(2);
      workOrderRepository.find.mockResolvedValue([mockWorkOrder({ id: 'wo-1' }), mockWorkOrder({ id: 'wo-2' })]);

      await service.startDataExport('req-2', 'WorkOrderService', 'WorkOrder');

      expect(eventServiceClient.sendEvent).toHaveBeenCalledTimes(4); // PLAN + 2 DATA + SUMMARY
    });

    it('should send PLAN with correct count', async () => {
      workOrderRepository.count.mockResolvedValue(42);
      workOrderRepository.find.mockResolvedValue([]);

      await service.startDataExport('req-3', 'WorkOrderService', 'WorkOrder');

      const planCall = eventServiceClient.sendEvent.mock.calls[0][0];
      expect(planCall.data.count).toBe(42);
      expect(planCall.data.type).toBe('PLAN');
    });

    it('should use correct sourceId in event payload', async () => {
      workOrderRepository.count.mockResolvedValue(0);
      workOrderRepository.find.mockResolvedValue([]);

      await service.startDataExport('req-4', 'WorkOrderService', 'WorkOrder');

      const planCall = eventServiceClient.sendEvent.mock.calls[0][0];
      expect(planCall.source).toBe('src-id');
    });

    it('should use correct destination name', async () => {
      workOrderRepository.count.mockResolvedValue(0);
      workOrderRepository.find.mockResolvedValue([]);

      await service.startDataExport('req-5', 'WorkOrderService', 'WorkOrder');

      expect(eventServiceClient.sendEvent.mock.calls[0][1]).toBe('btp-dest');
    });

    it('should send SUMMARY SUCCESS with processed count', async () => {
      workOrderRepository.count.mockResolvedValue(1);
      workOrderRepository.find.mockResolvedValue([mockWorkOrder()]);

      await service.startDataExport('req-6', 'WorkOrderService', 'WorkOrder');

      const summaryCall = eventServiceClient.sendEvent.mock.calls[2][0];
      expect(summaryCall.data.status).toBe('SUCCESS');
      expect(summaryCall.data.count).toBe(1);
    });

    it('should use transformer.transform for each record', async () => {
      workOrderRepository.count.mockResolvedValue(1);
      const wo = mockWorkOrder();
      workOrderRepository.find.mockResolvedValue([wo]);

      await service.startDataExport('req-t', 'WorkOrderService', 'WorkOrder');

      expect(transformer.transform).toHaveBeenCalledWith(wo);
      expect(transformer.transform).toHaveBeenCalledTimes(1);
    });
  });

  describe('startDataExport - Error Flow', () => {
    it('should send ABORTED summary when export fails and rethrow error', async () => {
      workOrderRepository.count.mockResolvedValue(1);
      workOrderRepository.find.mockRejectedValue(new Error('DB failure'));

      await expect(
        service.startDataExport('req-err', 'WorkOrderService', 'WorkOrder'),
      ).rejects.toThrow('DB failure');

      const summaryCalls = eventServiceClient.sendEvent.mock.calls.filter(
        ([event]) => event.data.type === 'SUMMARY',
      );
      expect(summaryCalls.length).toBe(1);
      expect(summaryCalls[0][0].data.status).toBe('ABORTED');
      expect(summaryCalls[0][0].data.errorCode).toBe('REPLICATION_ERROR');
    });

    it('should include error message in ABORTED summary', async () => {
      workOrderRepository.count.mockResolvedValue(1);
      workOrderRepository.find.mockRejectedValue(new Error('Timeout'));

      await expect(
        service.startDataExport('req-err2', 'WorkOrderService', 'WorkOrder'),
      ).rejects.toThrow('Timeout');

      const summaryCall = eventServiceClient.sendEvent.mock.calls.find(
        ([e]) => e.data.status === 'ABORTED',
      );
      expect(summaryCall[0].data.errorMessage).toBe('Timeout');
    });

    it('should not throw when ABORTED summary itself fails', async () => {
      workOrderRepository.count.mockResolvedValue(1);
      workOrderRepository.find.mockRejectedValue(new Error('DB error'));
      eventServiceClient.sendEvent
        .mockResolvedValueOnce(undefined) // PLAN succeeds
        .mockRejectedValueOnce(new Error('Summary send failed')); // ABORTED fails

      await expect(
        service.startDataExport('req-err3', 'WorkOrderService', 'WorkOrder'),
      ).rejects.toThrow('DB error');
    });
  });
});
