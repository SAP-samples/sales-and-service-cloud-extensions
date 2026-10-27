import { WorkOrderCudEventService } from './workOrder-cud-event.service';
import {
  WorkOrderCreatedEvent,
  WorkOrderUpdatedEvent,
  WorkOrderDeletedEvent,
} from './workOrder.events';
import { SESSION } from '../common/constants/constants';

const makeRequest = (sourceId?: string, btpDestination?: string) => ({
  [SESSION]: { sourceId, btpDestination },
});

const makeWorkOrder = (id: string, name = 'Test Order') =>
  ({ id, orderName: name, workProducts: [] } as any);

describe('WorkOrderCudEventService', () => {
  let service: WorkOrderCudEventService;
  let eventServiceClient: { sendEvent: jest.Mock };
  let transformer: { transform: jest.Mock };

  const buildService = (request: any) => {
    eventServiceClient = { sendEvent: jest.fn().mockResolvedValue(undefined) };
    transformer = { transform: jest.fn().mockImplementation((wo: any) => Promise.resolve({ id: wo.id, orderName: wo.orderName })) };
    return new WorkOrderCudEventService(
      eventServiceClient as any,
      transformer as any,
      request,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = buildService(makeRequest('src-id', 'btp-dest'));
  });

  describe('validateConfig guard', () => {
    it('should skip event when sourceId is missing', async () => {
      service = buildService(makeRequest(undefined, 'btp-dest'));

      await service.handleCreated(new WorkOrderCreatedEvent(makeWorkOrder('wo-1')));

      expect(eventServiceClient.sendEvent).not.toHaveBeenCalled();
    });

    it('should skip event when btpDestination is missing', async () => {
      service = buildService(makeRequest('src-id', undefined));

      await service.handleCreated(new WorkOrderCreatedEvent(makeWorkOrder('wo-1')));

      expect(eventServiceClient.sendEvent).not.toHaveBeenCalled();
    });

    it('should skip event when session is absent', async () => {
      service = buildService({ [SESSION]: undefined });

      await service.handleCreated(new WorkOrderCreatedEvent(makeWorkOrder('wo-1')));

      expect(eventServiceClient.sendEvent).not.toHaveBeenCalled();
    });

    it('should send event when both sourceId and btpDestination are present', async () => {
      await service.handleCreated(new WorkOrderCreatedEvent(makeWorkOrder('wo-1')));

      expect(eventServiceClient.sendEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleCreated', () => {
    it('should send a CREATE event with only currentImage', async () => {
      const wo = makeWorkOrder('wo-1');
      const transformed = { id: 'wo-1', orderName: 'Test Order' };
      transformer.transform.mockResolvedValue(transformed);

      await service.handleCreated(new WorkOrderCreatedEvent(wo));

      const [event] = eventServiceClient.sendEvent.mock.calls[0];
      expect(event.data.type).toBe('DATA');
      expect(event.data.currentImage).toEqual(transformed);
      expect(event.data.beforeImage).toBeUndefined();
      expect(event.type).toBe('customer.ssc.workorderservice.event.workOrderCreate');
    });

    it('should use workOrder id as subject', async () => {
      transformer.transform.mockResolvedValue({ id: 'wo-99' });

      await service.handleCreated(new WorkOrderCreatedEvent(makeWorkOrder('wo-99')));

      const [event] = eventServiceClient.sendEvent.mock.calls[0];
      expect(event.subject).toBe('wo-99');
    });

    it('should include correct entityFullName and serviceFullName', async () => {
      await service.handleCreated(new WorkOrderCreatedEvent(makeWorkOrder('wo-1')));

      const [event] = eventServiceClient.sendEvent.mock.calls[0];
      expect(event.data.entityFullName).toBe('customer.ssc.workorderservice.entity.workOrder');
      expect(event.data.serviceFullName).toBe('customer.ssc.service.workOrderService');
    });

    it('should use the correct sourceId and destination', async () => {
      await service.handleCreated(new WorkOrderCreatedEvent(makeWorkOrder('wo-1')));

      const [event, destination] = eventServiceClient.sendEvent.mock.calls[0];
      expect(event.source).toBe('src-id');
      expect(destination).toBe('btp-dest');
    });

    it('should throw when sendEvent fails', async () => {
      eventServiceClient.sendEvent.mockRejectedValue(new Error('Send failed'));

      await expect(
        service.handleCreated(new WorkOrderCreatedEvent(makeWorkOrder('wo-1'))),
      ).rejects.toThrow('Send failed');
    });
  });

  describe('handleUpdated', () => {
    it('should send an UPDATE event with both beforeImage and currentImage', async () => {
      const before = makeWorkOrder('wo-1', 'Old Name');
      const after = makeWorkOrder('wo-1', 'New Name');
      transformer.transform
        .mockResolvedValueOnce({ id: 'wo-1', orderName: 'New Name' })
        .mockResolvedValueOnce({ id: 'wo-1', orderName: 'Old Name' });

      await service.handleUpdated(new WorkOrderUpdatedEvent(after, before));

      const [event] = eventServiceClient.sendEvent.mock.calls[0];
      expect(event.data.type).toBe('DATA');
      expect(event.data.currentImage).toEqual({ id: 'wo-1', orderName: 'New Name' });
      expect(event.data.beforeImage).toEqual({ id: 'wo-1', orderName: 'Old Name' });
      expect(event.type).toBe('customer.ssc.workorderservice.event.workOrderUpdate');
    });

    it('should send UPDATE event without beforeImage when before is undefined', async () => {
      const after = makeWorkOrder('wo-1');
      transformer.transform.mockResolvedValue({ id: 'wo-1' });

      await service.handleUpdated(new WorkOrderUpdatedEvent(after));

      const [event] = eventServiceClient.sendEvent.mock.calls[0];
      expect(event.data.currentImage).toBeDefined();
      expect(event.data.beforeImage).toBeUndefined();
    });

    it('should use workOrder id as subject', async () => {
      transformer.transform.mockResolvedValue({ id: 'wo-77' });

      await service.handleUpdated(new WorkOrderUpdatedEvent(makeWorkOrder('wo-77')));

      const [event] = eventServiceClient.sendEvent.mock.calls[0];
      expect(event.subject).toBe('wo-77');
    });
  });

  describe('handleDeleted', () => {
    it('should send a DELETE event with only beforeImage', async () => {
      const wo = makeWorkOrder('wo-deleted');
      const transformed = { id: 'wo-deleted', orderName: 'Deleted Order' };
      transformer.transform.mockResolvedValue(transformed);

      await service.handleDeleted(new WorkOrderDeletedEvent(wo));

      const [event] = eventServiceClient.sendEvent.mock.calls[0];
      expect(event.data.type).toBe('DATA');
      expect(event.data.beforeImage).toEqual(transformed);
      expect(event.data.currentImage).toBeUndefined();
      expect(event.type).toBe('customer.ssc.workorderservice.event.workOrderDelete');
    });

    it('should use beforeImage id as subject for delete', async () => {
      transformer.transform.mockResolvedValue({ id: 'wo-gone' });

      await service.handleDeleted(new WorkOrderDeletedEvent(makeWorkOrder('wo-gone')));

      const [event] = eventServiceClient.sendEvent.mock.calls[0];
      expect(event.subject).toBe('wo-gone');
    });
  });

  describe('CloudEvent envelope', () => {
    it('should use specversion 0.2', async () => {
      await service.handleCreated(new WorkOrderCreatedEvent(makeWorkOrder('wo-1')));

      const [event] = eventServiceClient.sendEvent.mock.calls[0];
      expect(event.specversion).toBe('0.2');
    });

    it('should set datacontenttype to application/json', async () => {
      await service.handleCreated(new WorkOrderCreatedEvent(makeWorkOrder('wo-1')));

      const [event] = eventServiceClient.sendEvent.mock.calls[0];
      expect(event.datacontenttype).toBe('application/json');
    });

    it('should include a non-empty id', async () => {
      await service.handleCreated(new WorkOrderCreatedEvent(makeWorkOrder('wo-1')));

      const [event] = eventServiceClient.sendEvent.mock.calls[0];
      expect(event.id).toBeTruthy();
    });

    it('should include a time field', async () => {
      await service.handleCreated(new WorkOrderCreatedEvent(makeWorkOrder('wo-1')));

      const [event] = eventServiceClient.sendEvent.mock.calls[0];
      expect(event.time).toBeTruthy();
      expect(new Date(event.time).toISOString()).toBe(event.time);
    });
  });
});
