import { WorkOrderEventTransformer } from './workOrder-event.transformer';
import { WorkOrder } from '../entities/workOrder.entity';

const mockEmployee = { id: 'emp-1', formattedName: 'Alice Smith', displayId: 'E001' };
const mockAccount = { id: 'acc-1', formattedName: 'Acme Corp', displayId: 'AC001' };

const makeWorkOrder = (overrides: Partial<WorkOrder> = {}): WorkOrder =>
  ({
    id: 'wo-001',
    orderName: 'Test Order',
    displayId: 'WO-001',
    status: 1,
    projectLeadId: null,
    accountId: null,
    currencyCode: null,
    content: null,
    startDate: null,
    endDate: null,
    workProducts: [],
    ...overrides,
  } as any);

describe('WorkOrderEventTransformer', () => {
  let transformer: WorkOrderEventTransformer;
  let employeeService: { getEmployeeById: jest.Mock };
  let accountService: { getAccountById: jest.Mock };

  beforeEach(() => {
    employeeService = { getEmployeeById: jest.fn().mockResolvedValue(null) };
    accountService = { getAccountById: jest.fn().mockResolvedValue(null) };
    transformer = new WorkOrderEventTransformer(
      employeeService as any,
      accountService as any,
    );
  });

  afterEach(() => jest.clearAllMocks());

  describe('basic field mapping', () => {
    it('should include core work order fields', async () => {
      const wo = makeWorkOrder({ id: 'wo-1', orderName: 'My Order', displayId: 'WO-100' });

      const result = await transformer.transform(wo);

      expect(result.id).toBe('wo-1');
      expect(result.orderName).toBe('My Order');
      expect(result.displayId).toBe('WO-100');
    });

    it('should not include flat currencyCode and content at top level', async () => {
      const wo = makeWorkOrder({ currencyCode: 'USD', content: 1000 });

      const result = await transformer.transform(wo);

      expect(result).not.toHaveProperty('currencyCode');
      expect(result).not.toHaveProperty('content');
    });

    it('should compose estimatedRevenue when both currencyCode and content are set', async () => {
      const wo = makeWorkOrder({ currencyCode: 'EUR', content: 5000 });

      const result = await transformer.transform(wo);

      expect(result.estimatedRevenue).toEqual({ currencyCode: 'EUR', content: 5000 });
    });

    it('should omit estimatedRevenue when currencyCode is missing', async () => {
      const wo = makeWorkOrder({ currencyCode: null, content: 5000 });

      const result = await transformer.transform(wo);

      expect(result.estimatedRevenue).toBeUndefined();
    });

    it('should omit estimatedRevenue when content is missing', async () => {
      const wo = makeWorkOrder({ currencyCode: 'USD', content: null });

      const result = await transformer.transform(wo);

      expect(result.estimatedRevenue).toBeUndefined();
    });
  });

  describe('date formatting', () => {
    it('should convert startDate to ISO string', async () => {
      const date = new Date('2024-03-15');
      const wo = makeWorkOrder({ startDate: date });

      const result = await transformer.transform(wo);

      expect(result.startDate).toBe(date.toISOString());
    });

    it('should convert endDate to ISO string', async () => {
      const date = new Date('2024-12-31');
      const wo = makeWorkOrder({ endDate: date });

      const result = await transformer.transform(wo);

      expect(result.endDate).toBe(date.toISOString());
    });

    it('should omit startDate when it is null', async () => {
      const wo = makeWorkOrder({ startDate: null });

      const result = await transformer.transform(wo);

      expect(result).not.toHaveProperty('startDate');
    });
  });

  describe('external entity resolution', () => {
    it('should include projectLead when employee fetch succeeds', async () => {
      employeeService.getEmployeeById.mockResolvedValue(mockEmployee);
      const wo = makeWorkOrder({ projectLeadId: 'emp-1' });

      const result = await transformer.transform(wo);

      expect(result.projectLead).toEqual({
        id: 'emp-1',
        formattedName: 'Alice Smith',
        displayId: 'E001',
      });
    });

    it('should omit projectLead when employee fetch returns null', async () => {
      employeeService.getEmployeeById.mockResolvedValue(null);
      const wo = makeWorkOrder({ projectLeadId: 'emp-1' });

      const result = await transformer.transform(wo);

      expect(result.projectLead).toBeUndefined();
    });

    it('should omit projectLead when employee fetch throws', async () => {
      employeeService.getEmployeeById.mockRejectedValue(new Error('API error'));
      const wo = makeWorkOrder({ projectLeadId: 'emp-bad' });

      const result = await transformer.transform(wo);

      expect(result.projectLead).toBeUndefined();
    });

    it('should include account when account fetch succeeds', async () => {
      accountService.getAccountById.mockResolvedValue(mockAccount);
      const wo = makeWorkOrder({ accountId: 'acc-1' });

      const result = await transformer.transform(wo);

      expect(result.account).toEqual({
        id: 'acc-1',
        formattedName: 'Acme Corp',
        displayId: 'AC001',
      });
    });

    it('should omit account when account fetch returns null', async () => {
      accountService.getAccountById.mockResolvedValue(null);
      const wo = makeWorkOrder({ accountId: 'acc-1' });

      const result = await transformer.transform(wo);

      expect(result.account).toBeUndefined();
    });

    it('should omit account when account fetch throws', async () => {
      accountService.getAccountById.mockRejectedValue(new Error('API error'));
      const wo = makeWorkOrder({ accountId: 'acc-bad' });

      const result = await transformer.transform(wo);

      expect(result.account).toBeUndefined();
    });

    it('should not call employee API when projectLeadId is null', async () => {
      const wo = makeWorkOrder({ projectLeadId: null });

      await transformer.transform(wo);

      expect(employeeService.getEmployeeById).not.toHaveBeenCalled();
    });

    it('should not call account API when accountId is null', async () => {
      const wo = makeWorkOrder({ accountId: null });

      await transformer.transform(wo);

      expect(accountService.getAccountById).not.toHaveBeenCalled();
    });
  });

  describe('workProducts and scheduleLines', () => {
    it('should return empty workProducts array when workProducts is null', async () => {
      const wo = makeWorkOrder({ workProducts: null });

      const result = await transformer.transform(wo);

      expect(result.workProducts).toEqual([]);
    });

    it('should strip workOrderId from workProduct', async () => {
      const wo = makeWorkOrder({
        workProducts: [
          { id: 'wp-1', workProductName: 'P1', workOrderId: 'wo-001', scheduleLines: [] } as any,
        ],
      });

      const result = await transformer.transform(wo);

      expect(result.workProducts[0]).not.toHaveProperty('workOrderId');
    });

    it('should compose workProduct estimatedRevenue from flat fields', async () => {
      const wo = makeWorkOrder({
        workProducts: [
          {
            id: 'wp-1',
            currencyCode: 'USD',
            content: 500,
            workOrderId: 'wo-001',
            scheduleLines: [],
          } as any,
        ],
      });

      const result = await transformer.transform(wo);

      expect(result.workProducts[0].estimatedRevenue).toEqual({ currencyCode: 'USD', content: 500 });
    });

    it('should set workProduct estimatedRevenue to undefined when fields are missing', async () => {
      const wo = makeWorkOrder({
        workProducts: [
          { id: 'wp-1', currencyCode: null, content: null, workOrderId: 'wo-001', scheduleLines: [] } as any,
        ],
      });

      const result = await transformer.transform(wo);

      expect(result.workProducts[0].estimatedRevenue).toBeUndefined();
    });

    it('should strip workProductId, createdAt, updatedAt from scheduleLines', async () => {
      const wo = makeWorkOrder({
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
                requestedQuantity: 10,
                confirmedQuantity: 8,
                workProductId: 'wp-1',
                createdAt: new Date(),
                updatedAt: new Date(),
              } as any,
            ],
          } as any,
        ],
      });

      const result = await transformer.transform(wo);
      const sl = result.workProducts[0].scheduleLines[0];

      expect(sl).not.toHaveProperty('workProductId');
      expect(sl).not.toHaveProperty('createdAt');
      expect(sl).not.toHaveProperty('updatedAt');
    });

    it('should convert scheduleLine date and requestedEndDate to ISO strings', async () => {
      const date = new Date('2024-05-01');
      const endDate = new Date('2024-06-01');
      const wo = makeWorkOrder({
        workProducts: [
          {
            id: 'wp-1',
            currencyCode: null,
            content: null,
            workOrderId: 'wo-001',
            scheduleLines: [
              {
                id: 'sl-1',
                date,
                requestedEndDate: endDate,
                requestedQuantity: 10,
                confirmedQuantity: 8,
                workProductId: 'wp-1',
              } as any,
            ],
          } as any,
        ],
      });

      const result = await transformer.transform(wo);
      const sl = result.workProducts[0].scheduleLines[0];

      expect(sl.date).toBe(date.toISOString());
      expect(sl.requestedEndDate).toBe(endDate.toISOString());
    });

    it('should omit scheduleLine date when it is null', async () => {
      const wo = makeWorkOrder({
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
                requestedQuantity: 5,
                confirmedQuantity: null,
                workProductId: 'wp-1',
              } as any,
            ],
          } as any,
        ],
      });

      const result = await transformer.transform(wo);
      const sl = result.workProducts[0].scheduleLines[0];

      expect(sl).not.toHaveProperty('date');
      expect(sl).not.toHaveProperty('requestedEndDate');
    });

    it('should cast requestedQuantity and confirmedQuantity to numbers', async () => {
      const wo = makeWorkOrder({
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
                requestedQuantity: '10' as any,
                confirmedQuantity: '8' as any,
                workProductId: 'wp-1',
              } as any,
            ],
          } as any,
        ],
      });

      const result = await transformer.transform(wo);
      const sl = result.workProducts[0].scheduleLines[0];

      expect(sl.requestedQuantity).toBe(10);
      expect(sl.confirmedQuantity).toBe(8);
    });

    it('should omit confirmedQuantity when it is null', async () => {
      const wo = makeWorkOrder({
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

      const result = await transformer.transform(wo);
      const sl = result.workProducts[0].scheduleLines[0];

      expect(sl).not.toHaveProperty('confirmedQuantity');
    });

    it('should return empty scheduleLines array when scheduleLines is null', async () => {
      const wo = makeWorkOrder({
        workProducts: [
          { id: 'wp-1', currencyCode: null, content: null, workOrderId: 'wo-001', scheduleLines: null } as any,
        ],
      });

      const result = await transformer.transform(wo);

      expect(result.workProducts[0].scheduleLines).toEqual([]);
    });
  });

  describe('stripNulls', () => {
    it('should remove null fields from the top-level result', async () => {
      const wo = makeWorkOrder({ displayId: null, status: null, caseDisplayId: null } as any);

      const result = await transformer.transform(wo);

      expect(result).not.toHaveProperty('displayId');
      expect(result).not.toHaveProperty('status');
      expect(result).not.toHaveProperty('caseDisplayId');
    });

    it('should convert Date fields to ISO strings', async () => {
      const date = new Date('2024-01-01');
      const wo = makeWorkOrder({ startDate: date });

      const result = await transformer.transform(wo);

      expect(typeof result.startDate).toBe('string');
      expect(result.startDate).toBe(date.toISOString());
    });
  });
});
