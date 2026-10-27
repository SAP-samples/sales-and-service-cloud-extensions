import { Injectable, Logger, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { WorkOrder } from '../entities/workOrder.entity';
import { EventServiceClient } from '../events/event-service.client';
import { CloudEvent } from './interfaces/cloud-event.interface';
import { WorkOrderEventTransformer } from '../events/workOrder-event.transformer';
import { SESSION } from '../common/constants/constants';

/**
 * Handles the analytics data export flow (PLAN/DATA/SUMMARY bulk export).
 * CUD events for individual work order changes are handled by WorkOrderCudEventService.
 */
@Injectable({ scope: Scope.REQUEST })
export class AnalyticsReplicationService {
  private readonly logger = new Logger(AnalyticsReplicationService.name);

  constructor(
    @InjectRepository(WorkOrder)
    private workOrderRepository: Repository<WorkOrder>,
    private eventServiceClient: EventServiceClient,
    private transformer: WorkOrderEventTransformer,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  private get sourceId(): string {
    return this.request[SESSION]?.sourceId;
  }

  private get btpDestination(): string {
    return this.request[SESSION]?.btpDestination;
  }

  /**
   * Validates that analytics config is fully resolved before firing any event.
   * Returns false (and logs a warning) if sourceId or destination are missing,
   * so callers can skip silently rather than sending corrupt/undefined payloads.
   */
  private validateTenantConfig(): boolean {
    const sourceId = this.sourceId;
    const destination = this.btpDestination;

    if (!sourceId || !destination) {
      this.logger.warn(
        `[Analytics] Event skipped — analytics config incomplete. ` +
        `sourceId: ${sourceId ?? 'MISSING'}, destination: ${destination ?? 'MISSING'}. ` +
        `Check SSC_TENANT_SOURCE_ID and SSC_BTP_DESTINATION env vars.`,
      );
      return false;
    }

    return true;
  }

  /**
   * Starts the analytics data export process.
   * 1. Sends PLAN event with total count
   * 2. Fetches records in batches and sends DATA events
   * 3. Sends SUMMARY event (SUCCESS or ABORTED)
   */
  async startDataExport(
    dataRequestId: string,
    serviceFullName: string,
    entityFullName: string,
  ): Promise<void> {
    if (!this.validateTenantConfig()) return;

    this.logger.log(
      `Starting analytics data export for dataRequestId: ${dataRequestId}`,
    );

    try {
      const totalCount = await this.workOrderRepository.count();

      this.logger.log(`Total records to export: ${totalCount}`);

      await this.sendPlanEvent({
        dataRequestId,
        entityFullName,
        serviceFullName,
        count: totalCount,
      });

      const allRecords = await this.workOrderRepository.find({
        relations: ['workProducts', 'workProducts.scheduleLines'],
      });

      let processedCount = 0;

      for (const record of allRecords) {
        const transformedRecord = await this.transformer.transform(record);

        await this.sendDataEvent({
          dataRequestId,
          entityFullName,
          serviceFullName,
          currentImage: transformedRecord,
        });

        processedCount++;

        if (processedCount % 10 === 0) {
          this.logger.log(
            `Processed ${processedCount}/${totalCount} records`,
          );
        }
      }

      this.logger.log(
        `Data export completed successfully. Total records: ${processedCount}`,
      );

      await this.sendSummaryEvent({
        dataRequestId,
        entityFullName,
        serviceFullName,
        status: 'SUCCESS',
        count: processedCount,
      });
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Analytics data export failed: ${err.message}`,
        err.stack,
      );

      try {
        await this.sendSummaryEvent({
          dataRequestId,
          entityFullName,
          serviceFullName,
          status: 'ABORTED',
          count: 0,
          errorMessage: err.message,
          errorCode: 'REPLICATION_ERROR',
        });
      } catch (summaryError) {
        const sumErr = summaryError as Error;
        this.logger.error(
          `Failed to send ABORTED summary: ${sumErr.message}`,
          sumErr.stack,
        );
      }

      throw error;
    }
  }

  private async sendPlanEvent(params: {
    dataRequestId: string;
    entityFullName: string;
    serviceFullName: string;
    count: number;
  }): Promise<void> {
    const payload: CloudEvent = {
      id: uuidv4(),
      subject: params.dataRequestId,
      type: 'customer.ssc.workorderservice.event.workOrderCurrentImageData',
      specversion: '0.2',
      source: this.sourceId,
      time: new Date().toISOString(),
      datacontenttype: 'application/json',
      data: {
        dataRequestId: params.dataRequestId,
        entityFullName: params.entityFullName,
        serviceFullName: params.serviceFullName,
        type: 'PLAN',
        count: params.count,
      },
    };

    await this.eventServiceClient.sendEvent(payload, this.btpDestination);
    this.logger.log(
      `[PLAN Event] Sent for dataRequestId: ${params.dataRequestId}, count: ${params.count}, source: ${payload.source}`,
    );
  }

  private async sendDataEvent(params: {
    dataRequestId: string;
    entityFullName: string;
    serviceFullName: string;
    currentImage: any;
  }): Promise<void> {
    const payload: CloudEvent = {
      id: uuidv4(),
      subject: params.currentImage.id,
      type: 'customer.ssc.workorderservice.event.workOrderCurrentImageData',
      specversion: '0.2',
      source: this.sourceId,
      time: new Date().toISOString(),
      datacontenttype: 'application/json',
      data: {
        dataRequestId: params.dataRequestId,
        entityFullName: params.entityFullName,
        serviceFullName: params.serviceFullName,
        type: 'DATA',
        currentImage: params.currentImage,
      },
    };

    await this.eventServiceClient.sendEvent(payload, this.btpDestination);
    this.logger.log(`[DATA Event] Sent for record: ${params.currentImage.id}, source: ${payload.source}`);
  }

  private async sendSummaryEvent(params: {
    dataRequestId: string;
    entityFullName: string;
    serviceFullName: string;
    status: 'SUCCESS' | 'ABORTED';
    count: number;
    errorMessage?: string;
    errorCode?: string;
  }): Promise<void> {
    const payload: CloudEvent = {
      id: uuidv4(),
      subject: params.dataRequestId,
      type: 'customer.ssc.workorderservice.event.workOrderCurrentImageData',
      specversion: '0.2',
      source: this.sourceId,
      time: new Date().toISOString(),
      datacontenttype: 'application/json',
      data: {
        dataRequestId: params.dataRequestId,
        entityFullName: params.entityFullName,
        serviceFullName: params.serviceFullName,
        type: 'SUMMARY',
        status: params.status,
        count: params.count,
        ...(params.errorMessage && { errorMessage: params.errorMessage }),
        ...(params.errorCode && { errorCode: params.errorCode }),
      },
    };

    await this.eventServiceClient.sendEvent(payload, this.btpDestination);
    this.logger.log(
      `[SUMMARY Event] Sent for dataRequestId: ${params.dataRequestId}, status: ${params.status}, count: ${params.count}, source: ${payload.source}`,
    );
  }
}
