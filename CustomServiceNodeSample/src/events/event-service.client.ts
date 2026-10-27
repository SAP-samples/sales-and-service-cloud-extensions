import { Injectable, Logger } from '@nestjs/common';
import { executeHttpRequest } from '@sap-cloud-sdk/http-client';

/**
 * Generic CloudEvent envelope shape accepted by the inbound data connector.
 * Both CUD events and analytics bulk replication use this transport.
 */
export interface CloudEventEnvelope {
  id: string;
  subject: string;
  type: string;
  specversion: string;
  source: string;
  time: string;
  datacontenttype: string;
  data: {
    type: string;
    [key: string]: any;
  };
}

/**
 * Shared transport client for delivering CloudEvents to the SAP inbound data
 * connector. Not tied to any single consumer — used by both WorkOrder CUD events
 * and the analytics data-replication (PLAN/DATA/SUMMARY) flow.
 *
 * Credentials are resolved automatically from the BTP destination configuration —
 * no manual auth headers needed.
 */
@Injectable()
export class EventServiceClient {
  private readonly logger = new Logger(EventServiceClient.name);

  async sendEvent(event: CloudEventEnvelope, destinationName: string): Promise<void> {
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
