import { Test, TestingModule } from '@nestjs/testing';
import { EventServiceClient } from './event-service.client';
import { executeHttpRequest } from '@sap-cloud-sdk/http-client';
import { CloudEvent } from './interfaces/cloud-event.interface';

jest.mock('@sap-cloud-sdk/http-client', () => ({
  executeHttpRequest: jest.fn(),
}));

const mockExecuteHttpRequest = executeHttpRequest as jest.Mock;

const makeEvent = (type: 'PLAN' | 'DATA' | 'SUMMARY'): CloudEvent => ({
  id: 'event-id-123',
  subject: 'req-123',
  type: 'customer.ssc.workorderservice.event.workOrderCurrentImageData',
  specversion: '0.2',
  source: 'analytics-source-id',
  time: new Date().toISOString(),
  datacontenttype: 'application/json',
  data: {
    dataRequestId: 'req-123',
    entityFullName: 'WorkOrder',
    serviceFullName: 'WorkOrderService',
    type,
    count: 5,
  },
});

describe('EventServiceClient', () => {
  let client: EventServiceClient;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [EventServiceClient],
    }).compile();

    client = module.get<EventServiceClient>(EventServiceClient);
  });

  describe('sendEvent - Success Cases', () => {
    it('should send a PLAN event successfully', async () => {
      mockExecuteHttpRequest.mockResolvedValue({});
      const event = makeEvent('PLAN');

      await expect(client.sendEvent(event, 'test-destination')).resolves.not.toThrow();

      expect(mockExecuteHttpRequest).toHaveBeenCalledWith(
        { destinationName: 'test-destination' },
        expect.objectContaining({
          method: 'POST',
          url: 'sap/c4c/api/v1/inbound-data-connector-service/events',
          data: event,
          fetchCsrfToken: false,
        }),
      );
    });

    it('should send a DATA event successfully', async () => {
      mockExecuteHttpRequest.mockResolvedValue({});
      const event = makeEvent('DATA');

      await expect(client.sendEvent(event, 'analytics-dest')).resolves.not.toThrow();
      expect(mockExecuteHttpRequest).toHaveBeenCalledTimes(1);
    });

    it('should send a SUMMARY event successfully', async () => {
      mockExecuteHttpRequest.mockResolvedValue({});
      const event = makeEvent('SUMMARY');

      await expect(client.sendEvent(event, 'analytics-dest')).resolves.not.toThrow();
    });

    it('should pass correct headers', async () => {
      mockExecuteHttpRequest.mockResolvedValue({});

      await client.sendEvent(makeEvent('DATA'), 'dest');

      expect(mockExecuteHttpRequest).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
            'x-csrf-token': 'nocheck',
          },
        }),
      );
    });

    it('should use the provided destination name', async () => {
      mockExecuteHttpRequest.mockResolvedValue({});

      await client.sendEvent(makeEvent('PLAN'), 'my-custom-destination');

      expect(mockExecuteHttpRequest).toHaveBeenCalledWith(
        { destinationName: 'my-custom-destination' },
        expect.anything(),
      );
    });
  });

  describe('sendEvent - Error Cases', () => {
    it('should throw error when HTTP request fails', async () => {
      const error = new Error('Connection refused');
      mockExecuteHttpRequest.mockRejectedValue(error);

      await expect(client.sendEvent(makeEvent('PLAN'), 'dest')).rejects.toThrow('Connection refused');
    });

    it('should throw error when destination is unreachable', async () => {
      const error = new Error('Destination not found');
      (error as any).response = { status: 404 };
      mockExecuteHttpRequest.mockRejectedValue(error);

      await expect(client.sendEvent(makeEvent('DATA'), 'bad-dest')).rejects.toThrow('Destination not found');
    });

    it('should throw error on 401 Unauthorized', async () => {
      const error = new Error('Unauthorized');
      (error as any).response = { status: 401, data: { message: 'Invalid token' } };
      mockExecuteHttpRequest.mockRejectedValue(error);

      await expect(client.sendEvent(makeEvent('DATA'), 'dest')).rejects.toThrow('Unauthorized');
    });

    it('should throw error on 500 server error', async () => {
      const error = new Error('Internal Server Error');
      (error as any).response = { status: 500, data: {} };
      mockExecuteHttpRequest.mockRejectedValue(error);

      await expect(client.sendEvent(makeEvent('SUMMARY'), 'dest')).rejects.toThrow('Internal Server Error');
    });

    it('should rethrow original error without swallowing it', async () => {
      const originalError = new Error('Network failure');
      mockExecuteHttpRequest.mockRejectedValue(originalError);

      try {
        await client.sendEvent(makeEvent('PLAN'), 'dest');
        fail('Should have thrown');
      } catch (e) {
        expect(e).toBe(originalError);
      }
    });
  });
});
