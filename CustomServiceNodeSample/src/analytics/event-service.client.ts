import { Injectable, Logger } from '@nestjs/common';
import { executeHttpRequest } from '@sap-cloud-sdk/http-client';
import { CloudEvent } from './interfaces/cloud-event.interface';

@Injectable()
export class EventServiceClient {
  private readonly logger = new Logger(EventServiceClient.name);

  /**
   * Sends a CloudEvent to the Analytics Event Service.
   * Credentials are resolved automatically from the BTP destination configuration —
   * no manual auth headers needed.
   */
  async sendEvent(event: CloudEvent, destinationName: string): Promise<void> {
    try {
      this.logger.log(
        `[${event.data.type} Event] Sending to inbound-data-connector-service/events via destination: ${destinationName}`,
      );
      this.logger.log(
        `[${event.data.type} Event] Source: ${event.source}, Type: ${event.type}, Subject: ${event.subject}`,
      );

      await executeHttpRequest(
        { destinationName },
        {
          method: 'POST',
          url: 'sap/c4c/api/v1/inbound-data-connector-service/events',
          headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
            'x-csrf-token': 'nocheck',
          },
          data: event,
          fetchCsrfToken: false,
        },
      );

      this.logger.log(
        `[${event.data.type} Event] Sent successfully - subject: ${event.subject}`,
      );
    } catch (error) {
      this.logger.error(
        `[${event.data.type} Event] Failed with status: ${error.response?.status || 'unknown'}`,
      );
      this.logger.error(
        `[${event.data.type} Event] Error message: ${error.message}`,
      );
      this.logger.error(
        `[${event.data.type} Event] Response data: ${JSON.stringify(error.response?.data || {})}`,
      );
      this.logger.error(
        `[${event.data.type} Event] Source used: ${event.source}, Destination: ${destinationName}`,
      );
      throw error;
    }
  }
}
