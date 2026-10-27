import { EventServiceClient } from './event-service.client';
import { executeHttpRequest } from '@sap-cloud-sdk/http-client';

jest.mock('@sap-cloud-sdk/http-client', () => ({
  executeHttpRequest: jest.fn(),
}));

const mockExecuteHttpRequest = executeHttpRequest as jest.Mock;

const makeEnvelope = (type: string) => ({
  id: 'event-id-123',
  subject: 'subject-123',
  type: 'customer.ssc.workorderservice.event.workOrderCreate',
  specversion: '0.2',
  source: 'src-id',
  time: new Date().toISOString(),
  datacontenttype: 'application/json',
  data: {
    type,
    dataRequestId: 'req-123',
    entityFullName: 'customer.ssc.workorderservice.entity.workOrder',
    serviceFullName: 'customer.ssc.service.workOrderService',
  },
});

describe('EventServiceClient', () => {
  let client: EventServiceClient;

  beforeEach(() => {
    jest.clearAllMocks();
    client = new EventServiceClient();
  });

  describe('sendEvent — success cases', () => {
    it('should send an event and resolve without throwing', async () => {
      mockExecuteHttpRequest.mockResolvedValue({});

      await expect(
        client.sendEvent(makeEnvelope('DATA'), 'test-destination'),
      ).resolves.not.toThrow();

      expect(mockExecuteHttpRequest).toHaveBeenCalledTimes(1);
    });

    it('should call executeHttpRequest with correct URL and method', async () => {
      mockExecuteHttpRequest.mockResolvedValue({});

      await client.sendEvent(makeEnvelope('DATA'), 'test-destination');

      expect(mockExecuteHttpRequest).toHaveBeenCalledWith(
        { destinationName: 'test-destination' },
        expect.objectContaining({
          method: 'POST',
          url: 'sap/c4c/api/v1/inbound-data-connector-service/events',
          fetchCsrfToken: false,
        }),
      );
    });

    it('should pass correct headers', async () => {
      mockExecuteHttpRequest.mockResolvedValue({});

      await client.sendEvent(makeEnvelope('PLAN'), 'dest');

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

    it('should pass the event payload as request data', async () => {
      mockExecuteHttpRequest.mockResolvedValue({});
      const event = makeEnvelope('DATA');

      await client.sendEvent(event, 'dest');

      expect(mockExecuteHttpRequest).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ data: event }),
      );
    });

    it('should use the provided destination name', async () => {
      mockExecuteHttpRequest.mockResolvedValue({});

      await client.sendEvent(makeEnvelope('PLAN'), 'my-custom-destination');

      expect(mockExecuteHttpRequest).toHaveBeenCalledWith(
        { destinationName: 'my-custom-destination' },
        expect.anything(),
      );
    });
  });

  describe('sendEvent — error cases', () => {
    it('should rethrow the original error when the HTTP request fails', async () => {
      const originalError = new Error('Connection refused');
      mockExecuteHttpRequest.mockRejectedValue(originalError);

      await expect(
        client.sendEvent(makeEnvelope('DATA'), 'dest'),
      ).rejects.toThrow('Connection refused');
    });

    it('should rethrow the exact original error object', async () => {
      const originalError = new Error('Network failure');
      mockExecuteHttpRequest.mockRejectedValue(originalError);

      let caught: Error;
      try {
        await client.sendEvent(makeEnvelope('DATA'), 'dest');
      } catch (e) {
        caught = e;
      }

      expect(caught).toBe(originalError);
    });

    it('should throw on 401 Unauthorized', async () => {
      const error = new Error('Unauthorized');
      (error as any).response = { status: 401, data: { message: 'Invalid token' } };
      mockExecuteHttpRequest.mockRejectedValue(error);

      await expect(
        client.sendEvent(makeEnvelope('DATA'), 'dest'),
      ).rejects.toThrow('Unauthorized');
    });

    it('should throw on 500 server error', async () => {
      const error = new Error('Internal Server Error');
      (error as any).response = { status: 500, data: {} };
      mockExecuteHttpRequest.mockRejectedValue(error);

      await expect(
        client.sendEvent(makeEnvelope('SUMMARY'), 'dest'),
      ).rejects.toThrow('Internal Server Error');
    });

    it('should throw on destination not found', async () => {
      const error = new Error('Destination not found');
      (error as any).response = { status: 404 };
      mockExecuteHttpRequest.mockRejectedValue(error);

      await expect(
        client.sendEvent(makeEnvelope('DATA'), 'bad-dest'),
      ).rejects.toThrow('Destination not found');
    });
  });
});
