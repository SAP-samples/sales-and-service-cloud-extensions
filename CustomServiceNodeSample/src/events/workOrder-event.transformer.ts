import { Injectable, Logger, Scope } from '@nestjs/common';
import { WorkOrder } from '../entities/workOrder.entity';
import { EmployeeService } from '../employee/employee.service';
import { AccountService } from '../account/account.service';

/**
 * Expands a WorkOrder entity into the full nested representation used in
 * CUD event payloads (project lead + account resolved, nested work products
 * and schedule lines, dates as ISO strings, monetary amounts as numbers).
 *
 * This transformer is shared between the CUD event publisher and the analytics
 * data-replication service — it is not tied to any single consumer.
 */
@Injectable({ scope: Scope.REQUEST })
export class WorkOrderEventTransformer {
  private readonly logger = new Logger(WorkOrderEventTransformer.name);

  constructor(
    private employeeService: EmployeeService,
    private accountService: AccountService,
  ) {}

  async transform(workOrder: WorkOrder): Promise<any> {
    const {
      projectLeadId,
      accountId,
      workProducts,
      currencyCode,
      content,
      startDate,
      endDate,
      ...rest
    } = workOrder;

    let projectLead = null;
    if (projectLeadId) {
      try {
        projectLead = await this.employeeService.getEmployeeById(projectLeadId);
      } catch (error) {
        this.logger.warn(`Failed to fetch project lead ${projectLeadId}: ${error.message}`);
      }
    }

    let account = null;
    if (accountId) {
      try {
        account = await this.accountService.getAccountById(accountId);
      } catch (error) {
        this.logger.warn(`Failed to fetch account ${accountId}: ${error.message}`);
      }
    }

    const formatDateTime = (date: Date | string | null | undefined): string | undefined => {
      if (!date) return undefined;
      const dateObj = date instanceof Date ? date : new Date(date);
      return dateObj.toISOString();
    };

    const transformed: any = {
      ...rest,
      ...(startDate && { startDate: formatDateTime(startDate) }),
      ...(endDate && { endDate: formatDateTime(endDate) }),
      workProducts: workProducts
        ? workProducts.map((wp) => {
            const {
              currencyCode: wpCurrency,
              content: wpContent,
              workOrderId,
              scheduleLines,
              ...wpRest
            } = wp;
            return {
              ...wpRest,
              estimatedRevenue:
                wpCurrency && wpContent
                  ? { currencyCode: wpCurrency, content: Number(wpContent) }
                  : undefined,
              scheduleLines: scheduleLines
                ? scheduleLines.map((sl) => {
                    const {
                      workProductId,
                      createdAt,
                      updatedAt,
                      date,
                      requestedEndDate,
                      requestedQuantity,
                      confirmedQuantity,
                      ...slRest
                    } = sl;
                    return {
                      ...slRest,
                      ...(date && { date: formatDateTime(date) }),
                      ...(requestedEndDate && { requestedEndDate: formatDateTime(requestedEndDate) }),
                      requestedQuantity: requestedQuantity
                        ? Number(requestedQuantity)
                        : requestedQuantity,
                      ...(confirmedQuantity !== null &&
                        confirmedQuantity !== undefined && {
                          confirmedQuantity: Number(confirmedQuantity),
                        }),
                    };
                  })
                : [],
            };
          })
        : [],
    };

    if (projectLead) {
      transformed.projectLead = {
        id: projectLead.id,
        formattedName: projectLead.formattedName,
        displayId: projectLead.displayId,
      };
    }

    if (account) {
      transformed.account = {
        id: account.id,
        formattedName: account.formattedName,
        displayId: account.displayId,
      };
    }

    if (currencyCode && content) {
      transformed.estimatedRevenue = {
        currencyCode,
        content: Number(content),
      };
    }

    return this.stripNulls(transformed);
  }

  /**
   * Recursively removes all null and undefined fields from an object tree.
   * Also converts Date objects to ISO strings to prevent [object Object] serialisation.
   * This prevents null enum fields from triggering SSCV2 validation errors.
   */
  private stripNulls(value: any): any {
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (Array.isArray(value)) {
      return value.map((item) => this.stripNulls(item));
    }
    if (value !== null && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value)
          .filter(([, v]) => v !== null && v !== undefined)
          .map(([k, v]) => [k, this.stripNulls(v)]),
      );
    }
    return value;
  }
}
