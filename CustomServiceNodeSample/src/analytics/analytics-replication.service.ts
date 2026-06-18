import { Injectable, Logger, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { WorkOrder } from '../entities/workOrder.entity';
import { EventServiceClient } from './event-service.client';
import { CloudEvent } from './interfaces/cloud-event.interface';
import { EmployeeService } from '../employee/employee.service';
import { AccountService } from '../account/account.service';
import { SESSION } from '../common/constants/constants';

@Injectable({ scope: Scope.REQUEST })
export class AnalyticsReplicationService {
  private readonly logger = new Logger(AnalyticsReplicationService.name);

  constructor(
    @InjectRepository(WorkOrder)
    private workOrderRepository: Repository<WorkOrder>,
    private eventServiceClient: EventServiceClient,
    private employeeService: EmployeeService,
    private accountService: AccountService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  private get analyticsSourceId(): string {
    const id = this.request[SESSION]?.analyticsSourceId;
    this.logger.log(`[Analytics] Resolved analyticsSourceId: ${id ?? 'undefined'}`);
    return id;
  }

  private get analyticsDestination(): string {
    const dest = this.request[SESSION]?.analyticsDestination;
    this.logger.log(`[Analytics] Resolved analyticsDestination: ${dest ?? 'undefined'}`);
    return dest;
  }

  /**
   * Validates that tenant analytics config is fully resolved before firing any event.
   * Returns false (and logs a warning) if sourceId or destination are missing,
   * so callers can skip silently rather than sending corrupt/undefined payloads.
   */
  private validateTenantConfig(): boolean {
    const sourceId = this.analyticsSourceId;
    const destination = this.analyticsDestination;

    if (!sourceId || !destination) {
      this.logger.warn(
        `[Analytics] Event skipped — analytics config incomplete. ` +
        `sourceId: ${sourceId ?? 'MISSING'}, destination: ${destination ?? 'MISSING'}. ` +
        `Check SSC_TENANT_SOURCE_ID and SSC_ANALYTICS_DESTINATION env vars.`,
      );
      return false;
    }

    return true;
  }

  /**
   * Starts the analytics data export process
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
      // Count total records (for PLAN event)
      const totalCount = await this.workOrderRepository.count();

      this.logger.log(`Total records to export: ${totalCount}`);

      // Send PLAN event
      await this.sendPlanEvent({
        dataRequestId,
        entityFullName,
        serviceFullName,
        count: totalCount,
      });

      // Fetch all records with related entities
      const allRecords = await this.workOrderRepository.find({
        relations: ['workProducts', 'workProducts.scheduleLines'],
      });

      let processedCount = 0;

      // Send DATA event for each record (one at a time)
      for (const record of allRecords) {
        // Transform record to include expanded data
        const transformedRecord = await this.transformWorkOrderForAnalytics(
          record,
        );

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

      // Send SUMMARY event with SUCCESS
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
      this.logger.error(
        `Analytics data export failed: ${error.message}`,
        error.stack,
      );

      // Send SUMMARY event with ABORTED status
      try {
        await this.sendSummaryEvent({
          dataRequestId,
          entityFullName,
          serviceFullName,
          status: 'ABORTED',
          count: 0,
          errorMessage: error.message,
          errorCode: 'DATA_EXPORT_ERROR',
        });
      } catch (summaryError) {
        this.logger.error(
          `Failed to send ABORTED summary: ${summaryError.message}`,
          summaryError.stack,
        );
      }

      throw error;
    }
  }

  /**
   * Transforms WorkOrder entity to include expanded associations for analytics
   */
  private async transformWorkOrderForAnalytics(
    workOrder: WorkOrder,
  ): Promise<any> {
    const { projectLeadId, accountId, workProducts, currencyCode, content, startDate, endDate, ...rest } = workOrder;

    // Fetch project lead details if available
    let projectLead = null;
    if (projectLeadId) {
      try {
        projectLead = await this.employeeService.getEmployeeById(projectLeadId);
      } catch (error) {
        this.logger.warn(
          `Failed to fetch project lead ${projectLeadId}: ${error.message}`,
        );
      }
    }

    // Fetch account details if available
    let account = null;
    if (accountId) {
      try {
        account = await this.accountService.getAccountById(accountId);
      } catch (error) {
        this.logger.warn(
          `Failed to fetch account ${accountId}: ${error.message}`,
        );
      }
    }

    // Helper function to convert date to ISO datetime format
    const formatDateTime = (date: Date | string | null | undefined): string | undefined => {
      if (!date) return undefined;
      const dateObj = date instanceof Date ? date : new Date(date);
      return dateObj.toISOString();
    };

    const transformed: any = {
      ...rest,
      // Convert dates to ISO datetime format if present
      ...(startDate && { startDate: formatDateTime(startDate) }),
      ...(endDate && { endDate: formatDateTime(endDate) }),
      workProducts: workProducts
        ? workProducts.map((wp) => {
            const { currencyCode: wpCurrency, content: wpContent, workOrderId, scheduleLines, ...wpRest } = wp;
            return {
              ...wpRest,
              estimatedRevenue:
                wpCurrency && wpContent
                  ? {
                      currencyCode: wpCurrency,
                      content: Number(wpContent),
                    }
                  : undefined, // Use undefined instead of null
              scheduleLines: scheduleLines 
                ? scheduleLines.map((sl) => {
                    const { workProductId, createdAt, updatedAt, date, requestedEndDate, requestedQuantity, confirmedQuantity, ...slRest } = sl;
                    return {
                      ...slRest,
                      // Convert dates to ISO datetime format
                      ...(date && { date: formatDateTime(date) }),
                      ...(requestedEndDate && { requestedEndDate: formatDateTime(requestedEndDate) }),
                      // Ensure quantities are numbers, not strings
                      requestedQuantity: requestedQuantity ? Number(requestedQuantity) : requestedQuantity,
                      ...(confirmedQuantity !== null && confirmedQuantity !== undefined && { 
                        confirmedQuantity: Number(confirmedQuantity) 
                      }),
                    };
                  })
                : [],
            };
          })
        : [],
    };

    // Only include projectLead if it exists (omit if null)
    if (projectLead) {
      transformed.projectLead = {
        id: projectLead.id,
        formattedName: projectLead.formattedName,
        displayId: projectLead.displayId,
      };
    }

    // Only include account if it exists (omit if null)
    if (account) {
      transformed.account = {
        id: account.id,
        formattedName: account.formattedName,
        displayId: account.displayId,
      };
    }

    // Only include estimatedRevenue if it exists (omit if null)
    if (currencyCode && content) {
      transformed.estimatedRevenue = {
        currencyCode: currencyCode,
        content: Number(content),
      };
    }

    return transformed;
  }

  /**
   * Sends PLAN event to Analytics Event Service
   */
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
      source: this.analyticsSourceId,
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

    await this.eventServiceClient.sendEvent(payload, this.analyticsDestination);
    this.logger.log(
      `[PLAN Event] Sent for dataRequestId: ${params.dataRequestId}, count: ${params.count}, source (analyticsSourceId): ${payload.source}`,
    );
  }

  /**
   * Sends DATA event to Event Service
   */
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
      source: this.analyticsSourceId,
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

    await this.eventServiceClient.sendEvent(payload, this.analyticsDestination);
    this.logger.log(`[DATA Event] Sent for record: ${params.currentImage.id}, source (analyticsSourceId): ${payload.source}`);
  }

  /**
   * Sends SUMMARY event to Event Service
   */
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
      source: this.analyticsSourceId,
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

    await this.eventServiceClient.sendEvent(payload, this.analyticsDestination);
    this.logger.log(
      `[SUMMARY Event] Sent for dataRequestId: ${params.dataRequestId}, status: ${params.status}, count: ${params.count}, source (analyticsSourceId): ${payload.source}`,
    );
  }



  /**
   * Sends DATA event for CUD operations
   * @param beforeImage - undefined for CREATE, contains old data for UPDATE and DELETE
   * @param currentImage - contains new data for CREATE and UPDATE, undefined for DELETE
   */
  async sendCudDataEvent(params: {
    entityFullName: string;
    serviceFullName: string;
    beforeImage?: any;
    currentImage?: any;
    operation: 'Create' | 'Update' | 'Delete';
  }): Promise<void> {
    if (!this.validateTenantConfig()) return;

    const dataRequestId = uuidv4();
    // Build data object based on operation type
    let dataObject: any = {
      dataRequestId: dataRequestId,
      entityFullName: params.entityFullName,
      serviceFullName: params.serviceFullName,
      type: 'DATA',
    };

    // Create: only currentImage
    if (params.operation === 'Create') {
      dataObject.currentImage = params.currentImage;
    }
    // Delete: only beforeImage
    else if (params.operation === 'Delete') {
      dataObject.beforeImage = params.beforeImage;
    }
    // Update: both beforeImage and currentImage
    else {
      dataObject.beforeImage = params.beforeImage;
      dataObject.currentImage = params.currentImage;
    }

    const payload: CloudEvent = {
      id: uuidv4(),
      subject: params.currentImage?.id || params.beforeImage?.id,
      type: `customer.ssc.workorderservice.event.workOrder${params.operation}`,
      specversion: '0.2',
      source: this.analyticsSourceId,
      time: new Date().toISOString(),
      datacontenttype: 'application/json',
      data: dataObject,
    };

    await this.eventServiceClient.sendEvent(payload, this.analyticsDestination);
    this.logger.log(
      `[CUD DATA Event] Sent for record: ${params.currentImage?.id || params.beforeImage?.id}, operation: ${params.operation}`,
    );
  }



  /**
   * Transforms WorkOrder entity to include expanded associations for analytics
   * This is a public method that can be called from other services
   */
  async transformWorkOrderForCudAnalytics(
    workOrder: WorkOrder,
  ): Promise<any> {
    return this.transformWorkOrderForAnalytics(workOrder);
  }
}
