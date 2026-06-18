import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Repository } from 'typeorm';
import { AnalyticsReplicationService } from './analytics-replication.service';
import { EventServiceClient } from './event-service.client';
import { EmployeeService } from '../employee/employee.service';
import { AccountService } from '../account/account.service';
import { WorkOrder } from '../entities/workOrder.entity';
import { SESSION } from '../common/constants/constants';

const makeRequest = (analyticsSourceId?: string, analyticsDestination?: string) => ({
  [SESSION]: { analyticsSourceId, analyticsDestination },
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
  let employeeService: jest.Mocked<EmployeeService>;
  let accountService: jest.Mocked<AccountService>;

  const buildModule = async (request: any) => {
    workOrderRepository = {
      count: jest.fn(),
      find: jest.fn(),
    } as any;

    eventServiceClient = { sendEvent: jest.fn().mockResolvedValue(undefined) } as any;
    employeeService = { getEmployeeById: jest.fn() } as any;
    accountService = { getAccountById: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AnalyticsReplicationService,
          useFactory: (repo, client, emp, acc, req) =>
            new AnalyticsReplicationService(repo, client, emp, acc, req),
          inject: [
            getRepositoryToken(WorkOrder),
            EventServiceClient,
            EmployeeService,
            AccountService,
            REQUEST,
          ],
        },
        { provide: getRepositoryToken(WorkOrder), useValue: workOrderRepository },
        { provide: EventServiceClient, useValue: eventServiceClient },
        { provide: EmployeeService, useValue: employeeService },
        { provide: AccountService, useValue: accountService },
        { provide: REQUEST, useValue: request },
      ],
    }).compile();

    return module.get<AnalyticsReplicationService>(AnalyticsReplicationService);
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    service = await buildModule(makeRequest('src-id', 'analytics-dest'));
  });

  describe('startDataExport - Config Validation', () => {
    it('should skip export when analyticsSourceId is missing', async () => {
      service = await buildModule(makeRequest(undefined, 'analytics-dest'));

      await service.startDataExport('req-1', 'WorkOrderService', 'WorkOrder');

      expect(workOrderRepository.count).not.toHaveBeenCalled();
      expect(eventServiceClient.sendEvent).not.toHaveBeenCalled();
    });

    it('should skip export when analyticsDestination is missing', async () => {
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
      employeeService.getEmployeeById.mockResolvedValue({ id: 'emp-123', formattedName: 'John', displayId: 'E1' } as any);
      accountService.getAccountById.mockResolvedValue({ id: 'acc-456', formattedName: 'Acme', displayId: 'A1' } as any);

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
      employeeService.getEmployeeById.mockResolvedValue(null);
      accountService.getAccountById.mockResolvedValue(null);

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

    it('should use correct analyticsSourceId in event payload', async () => {
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

      expect(eventServiceClient.sendEvent.mock.calls[0][1]).toBe('analytics-dest');
    });

    it('should send SUMMARY SUCCESS with processed count', async () => {
      workOrderRepository.count.mockResolvedValue(1);
      workOrderRepository.find.mockResolvedValue([mockWorkOrder()]);
      employeeService.getEmployeeById.mockResolvedValue(null);
      accountService.getAccountById.mockResolvedValue(null);

      await service.startDataExport('req-6', 'WorkOrderService', 'WorkOrder');

      const summaryCall = eventServiceClient.sendEvent.mock.calls[2][0];
      expect(summaryCall.data.status).toBe('SUCCESS');
      expect(summaryCall.data.count).toBe(1);
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
      expect(summaryCalls[0][0].data.errorCode).toBe('DATA_EXPORT_ERROR');
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

  describe('sendCudDataEvent', () => {
    it('should skip when config is incomplete', async () => {
      service = await buildModule(makeRequest());

      await service.sendCudDataEvent({
        entityFullName: 'WorkOrder',
        serviceFullName: 'WorkOrderService',
        currentImage: { id: 'wo-1' },
        operation: 'Create',
      });

      expect(eventServiceClient.sendEvent).not.toHaveBeenCalled();
    });

    it('should send CREATE event with only currentImage', async () => {
      await service.sendCudDataEvent({
        entityFullName: 'WorkOrder',
        serviceFullName: 'WorkOrderService',
        currentImage: { id: 'wo-1' },
        operation: 'Create',
      });

      const [event] = eventServiceClient.sendEvent.mock.calls[0];
      expect(event.data.currentImage).toEqual({ id: 'wo-1' });
      expect(event.data.beforeImage).toBeUndefined();
      expect(event.type).toBe('customer.ssc.workorderservice.event.workOrderCreate');
    });

    it('should send DELETE event with only beforeImage', async () => {
      await service.sendCudDataEvent({
        entityFullName: 'WorkOrder',
        serviceFullName: 'WorkOrderService',
        beforeImage: { id: 'wo-1' },
        operation: 'Delete',
      });

      const [event] = eventServiceClient.sendEvent.mock.calls[0];
      expect(event.data.beforeImage).toEqual({ id: 'wo-1' });
      expect(event.data.currentImage).toBeUndefined();
      expect(event.type).toBe('customer.ssc.workorderservice.event.workOrderDelete');
    });

    it('should send UPDATE event with both beforeImage and currentImage', async () => {
      await service.sendCudDataEvent({
        entityFullName: 'WorkOrder',
        serviceFullName: 'WorkOrderService',
        beforeImage: { id: 'wo-1', orderName: 'Old' },
        currentImage: { id: 'wo-1', orderName: 'New' },
        operation: 'Update',
      });

      const [event] = eventServiceClient.sendEvent.mock.calls[0];
      expect(event.data.beforeImage).toEqual({ id: 'wo-1', orderName: 'Old' });
      expect(event.data.currentImage).toEqual({ id: 'wo-1', orderName: 'New' });
      expect(event.type).toBe('customer.ssc.workorderservice.event.workOrderUpdate');
    });

    it('should use subject from currentImage.id for Create/Update', async () => {
      await service.sendCudDataEvent({
        entityFullName: 'WorkOrder',
        serviceFullName: 'WorkOrderService',
        currentImage: { id: 'wo-999' },
        operation: 'Create',
      });

      const [event] = eventServiceClient.sendEvent.mock.calls[0];
      expect(event.subject).toBe('wo-999');
    });

    it('should use subject from beforeImage.id for Delete', async () => {
      await service.sendCudDataEvent({
        entityFullName: 'WorkOrder',
        serviceFullName: 'WorkOrderService',
        beforeImage: { id: 'wo-deleted' },
        operation: 'Delete',
      });

      const [event] = eventServiceClient.sendEvent.mock.calls[0];
      expect(event.subject).toBe('wo-deleted');
    });

    it('should throw when sendEvent fails', async () => {
      eventServiceClient.sendEvent.mockRejectedValue(new Error('Send failed'));

      await expect(
        service.sendCudDataEvent({
          entityFullName: 'WorkOrder',
          serviceFullName: 'WorkOrderService',
          currentImage: { id: 'wo-1' },
          operation: 'Create',
        }),
      ).rejects.toThrow('Send failed');
    });
  });

  describe('transformWorkOrderForCudAnalytics', () => {
    it('should transform work order and include projectLead when found', async () => {
      const wo = mockWorkOrder({ projectLeadId: 'emp-1', accountId: undefined });
      employeeService.getEmployeeById.mockResolvedValue({ id: 'emp-1', formattedName: 'Alice', displayId: 'A1' } as any);
      accountService.getAccountById.mockResolvedValue(null);

      const result = await service.transformWorkOrderForCudAnalytics(wo);

      expect(result.projectLead).toEqual({ id: 'emp-1', formattedName: 'Alice', displayId: 'A1' });
    });

    it('should transform work order and include account when found', async () => {
      const wo = mockWorkOrder({ projectLeadId: undefined, accountId: 'acc-1' });
      employeeService.getEmployeeById.mockResolvedValue(null);
      accountService.getAccountById.mockResolvedValue({ id: 'acc-1', formattedName: 'Acme Corp', displayId: 'AC1' } as any);

      const result = await service.transformWorkOrderForCudAnalytics(wo);

      expect(result.account).toEqual({ id: 'acc-1', formattedName: 'Acme Corp', displayId: 'AC1' });
    });

    it('should include estimatedRevenue when currencyCode and content are set', async () => {
      const wo = mockWorkOrder({ currencyCode: 'EUR', content: 5000, projectLeadId: undefined, accountId: undefined });
      employeeService.getEmployeeById.mockResolvedValue(null);
      accountService.getAccountById.mockResolvedValue(null);

      const result = await service.transformWorkOrderForCudAnalytics(wo);

      expect(result.estimatedRevenue).toEqual({ currencyCode: 'EUR', content: 5000 });
    });

    it('should omit projectLead when employee fetch fails', async () => {
      const wo = mockWorkOrder({ projectLeadId: 'emp-bad' });
      employeeService.getEmployeeById.mockRejectedValue(new Error('Not found'));
      accountService.getAccountById.mockResolvedValue(null);

      const result = await service.transformWorkOrderForCudAnalytics(wo);

      expect(result.projectLead).toBeUndefined();
    });

    it('should omit account when account fetch fails', async () => {
      const wo = mockWorkOrder({ accountId: 'acc-bad' });
      employeeService.getEmployeeById.mockResolvedValue(null);
      accountService.getAccountById.mockRejectedValue(new Error('Not found'));

      const result = await service.transformWorkOrderForCudAnalytics(wo);

      expect(result.account).toBeUndefined();
    });

    it('should convert dates to ISO string format', async () => {
      const wo = mockWorkOrder({
        startDate: new Date('2024-03-15'),
        endDate: new Date('2024-09-30'),
        projectLeadId: undefined,
        accountId: undefined,
      });
      employeeService.getEmployeeById.mockResolvedValue(null);
      accountService.getAccountById.mockResolvedValue(null);

      const result = await service.transformWorkOrderForCudAnalytics(wo);

      expect(result.startDate).toBe(new Date('2024-03-15').toISOString());
      expect(result.endDate).toBe(new Date('2024-09-30').toISOString());
    });

    it('should not include currencyCode and content at top level', async () => {
      const wo = mockWorkOrder({ currencyCode: 'USD', content: 1000, projectLeadId: undefined, accountId: undefined });
      employeeService.getEmployeeById.mockResolvedValue(null);
      accountService.getAccountById.mockResolvedValue(null);

      const result = await service.transformWorkOrderForCudAnalytics(wo);

      expect(result).not.toHaveProperty('currencyCode');
      expect(result).not.toHaveProperty('content');
    });

    it('should map workProducts with scheduleLines including date and quantity conversions', async () => {
      const wo = mockWorkOrder({
        projectLeadId: undefined,
        accountId: undefined,
        currencyCode: undefined,
        content: undefined,
        workProducts: [
          {
            id: 'wp-1',
            workProductName: 'Product A',
            currencyCode: 'USD',
            content: 500,
            workOrderId: 'wo-001',
            scheduleLines: [
              {
                id: 'sl-1',
                displayId: 'SL-001',
                date: new Date('2024-05-01'),
                requestedEndDate: new Date('2024-06-01'),
                requestedQuantity: 10,
                confirmedQuantity: 8,
                workProductId: 'wp-1',
              } as any,
            ],
          } as any,
        ],
      });
      employeeService.getEmployeeById.mockResolvedValue(null);
      accountService.getAccountById.mockResolvedValue(null);

      const result = await service.transformWorkOrderForCudAnalytics(wo);

      const wp = result.workProducts[0];
      expect(wp.estimatedRevenue).toEqual({ currencyCode: 'USD', content: 500 });
      expect(wp.scheduleLines[0].date).toBe(new Date('2024-05-01').toISOString());
      expect(wp.scheduleLines[0].requestedEndDate).toBe(new Date('2024-06-01').toISOString());
      expect(wp.scheduleLines[0].requestedQuantity).toBe(10);
      expect(wp.scheduleLines[0].confirmedQuantity).toBe(8);
    });

    it('should set workProduct estimatedRevenue to undefined when currencyCode or content is missing', async () => {
      const wo = mockWorkOrder({
        projectLeadId: undefined,
        accountId: undefined,
        workProducts: [
          { id: 'wp-1', currencyCode: null, content: null, workOrderId: 'wo-001', scheduleLines: [] } as any,
        ],
      });
      employeeService.getEmployeeById.mockResolvedValue(null);
      accountService.getAccountById.mockResolvedValue(null);

      const result = await service.transformWorkOrderForCudAnalytics(wo);

      expect(result.workProducts[0].estimatedRevenue).toBeUndefined();
    });

    it('should set confirmedQuantity to undefined when it is null', async () => {
      const wo = mockWorkOrder({
        projectLeadId: undefined,
        accountId: undefined,
        workProducts: [
          {
            id: 'wp-1',
            currencyCode: null,
            content: null,
            workOrderId: 'wo-001',
            scheduleLines: [
              {
                id: 'sl-1',
                date: new Date('2024-05-01'),
                requestedQuantity: 5,
                confirmedQuantity: null,
                workProductId: 'wp-1',
              } as any,
            ],
          } as any,
        ],
      });
      employeeService.getEmployeeById.mockResolvedValue(null);
      accountService.getAccountById.mockResolvedValue(null);

      const result = await service.transformWorkOrderForCudAnalytics(wo);

      expect(result.workProducts[0].scheduleLines[0].confirmedQuantity).toBeUndefined();
    });

    it('should return empty scheduleLines array when scheduleLines is null/undefined', async () => {
      const wo = mockWorkOrder({
        projectLeadId: undefined,
        accountId: undefined,
        workProducts: [
          { id: 'wp-1', currencyCode: null, content: null, workOrderId: 'wo-001', scheduleLines: null } as any,
        ],
      });
      employeeService.getEmployeeById.mockResolvedValue(null);
      accountService.getAccountById.mockResolvedValue(null);

      const result = await service.transformWorkOrderForCudAnalytics(wo);

      expect(result.workProducts[0].scheduleLines).toEqual([]);
    });

    it('should return empty workProducts array when workProducts is null', async () => {
      const wo = mockWorkOrder({ projectLeadId: undefined, accountId: undefined, workProducts: null });
      employeeService.getEmployeeById.mockResolvedValue(null);
      accountService.getAccountById.mockResolvedValue(null);

      const result = await service.transformWorkOrderForCudAnalytics(wo);

      expect(result.workProducts).toEqual([]);
    });

    it('should omit schedule line date when date is null', async () => {
      const wo = mockWorkOrder({
        projectLeadId: undefined,
        accountId: undefined,
        workProducts: [
          {
            id: 'wp-1',
            currencyCode: null,
            content: null,
            workOrderId: 'wo-001',
            scheduleLines: [
              {
                id: 'sl-1',
                date: null,
                requestedEndDate: null,
                requestedQuantity: 3,
                confirmedQuantity: null,
                workProductId: 'wp-1',
              } as any,
            ],
          } as any,
        ],
      });
      employeeService.getEmployeeById.mockResolvedValue(null);
      accountService.getAccountById.mockResolvedValue(null);

      const result = await service.transformWorkOrderForCudAnalytics(wo);
      const sl = result.workProducts[0].scheduleLines[0];

      expect(sl.date).toBeUndefined();
      expect(sl.requestedEndDate).toBeUndefined();
    });
  });
});
