import { Injectable, Logger, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { EventServiceClient } from './event-service.client';
import { CudEvent } from './interfaces/cud-event.interface';
import { WorkOrderEventTransformer } from './workOrder-event.transformer';
import {
  WorkOrderCreatedEvent,
  WorkOrderUpdatedEvent,
  WorkOrderDeletedEvent,
} from './workOrder.events';
import { SESSION } from '../common/constants/constants';

/**
 * Publishes WorkOrder CUD (Create/Update/Delete) events as CloudEvents.
 * Not analytics-specific — any downstream consumer (analytics, timeline, audit)
 * can subscribe to these events.
 *
 * The analytics data-replication flow (PLAN/DATA/SUMMARY) is a separate concern
 * and lives in AnalyticsReplicationService.
 *
 * Events are silently skipped when SSC_TENANT_SOURCE_ID or
 * SSC_BTP_DESTINATION environment variables are not configured.
 */
@Injectable({ scope: Scope.REQUEST })
export class WorkOrderCudEventService {
  private readonly logger = new Logger(WorkOrderCudEventService.name);
  private readonly entityFullName = 'customer.ssc.workorderservice.entity.workOrder';
  private readonly serviceFullName = 'customer.ssc.service.workOrderService';

  constructor(
    private eventServiceClient: EventServiceClient,
    private transformer: WorkOrderEventTransformer,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  private get sourceId(): string {
    return this.request[SESSION]?.sourceId;
  }

  private get destination(): string {
    return this.request[SESSION]?.btpDestination;
  }

  private validateConfig(): boolean {
    const sourceId = this.sourceId;
    const destination = this.destination;
    if (!sourceId || !destination) {
      this.logger.warn(
        `[CUD Event] Event skipped — analytics config incomplete. ` +
          `sourceId: ${sourceId ?? 'MISSING'}, destination: ${destination ?? 'MISSING'}. ` +
          `Check SSC_TENANT_SOURCE_ID and SSC_BTP_DESTINATION env vars.`,
      );
      return false;
    }
    return true;
  }

  async handleCreated({ workOrder }: WorkOrderCreatedEvent): Promise<void> {
    const currentImage = await this.transformer.transform(workOrder);
    await this.sendCudDataEvent({ currentImage, operation: 'Create' });
  }

  async handleUpdated({ after, before }: WorkOrderUpdatedEvent): Promise<void> {
    const currentImage = await this.transformer.transform(after);
    const beforeImage = before ? await this.transformer.transform(before) : undefined;
    await this.sendCudDataEvent({
      ...(beforeImage !== undefined && { beforeImage }),
      currentImage,
      operation: 'Update',
    });
  }

  async handleDeleted({ workOrder }: WorkOrderDeletedEvent): Promise<void> {
    const beforeImage = await this.transformer.transform(workOrder);
    await this.sendCudDataEvent({ beforeImage, operation: 'Delete' });
  }

  private async sendCudDataEvent(params: {
    beforeImage?: any;
    currentImage?: any;
    operation: 'Create' | 'Update' | 'Delete';
  }): Promise<void> {
    if (!this.validateConfig()) return;

    const dataRequestId = uuidv4();
    const dataObject: any = {
      dataRequestId,
      entityFullName: this.entityFullName,
      serviceFullName: this.serviceFullName,
      type: 'DATA',
    };

    if (params.operation === 'Create') {
      dataObject.currentImage = params.currentImage;
    } else if (params.operation === 'Delete') {
      dataObject.beforeImage = params.beforeImage;
    } else {
      dataObject.beforeImage = params.beforeImage;
      dataObject.currentImage = params.currentImage;
    }

    const payload: CudEvent = {
      id: uuidv4(),
      subject: params.currentImage?.id || params.beforeImage?.id,
      type: `customer.ssc.workorderservice.event.workOrder${params.operation}`,
      specversion: '0.2',
      source: this.sourceId,
      time: new Date().toISOString(),
      datacontenttype: 'application/json',
      data: dataObject,
    };

    await this.eventServiceClient.sendEvent(payload, this.destination);
    this.logger.log(
      `[CUD Event] Sent for record: ${params.currentImage?.id || params.beforeImage?.id}, ` +
        `operation: ${params.operation}, source: ${payload.source}`,
    );
  }
}
