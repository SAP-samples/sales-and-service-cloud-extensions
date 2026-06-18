import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  ParseBoolPipe,
  HttpCode,
  HttpStatus,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { WorkOrderService } from './workOrder.service';
import { WorkOrder } from '../entities/workOrder.entity';
import { WorkOrderDto } from '../dto/workOrder.dto';
import { UpdateWorkOrderDto } from '../dto/updateWorkOrder.dto';
import { EtagInterceptor } from '../common/interceptor/etag.interceptor';
import { ReplicateDataDto as DataExportRequestDto } from '../analytics/dto/replicate-data.dto';
import { AnalyticsReplicationService } from '../analytics/analytics-replication.service';

@Controller('/work-order-service/workOrders')
export class WorkOrderController {
  constructor(
    private readonly workOrderService: WorkOrderService,
    private readonly analyticsReplicationService: AnalyticsReplicationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createWorkOrder(
    @Body() workOrderDto: WorkOrderDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const workOrder = await this.workOrderService.createWorkOrder(workOrderDto);
    // Set Location header as per guidelines for 201 Created
    res.header('Location', `/work-order-service/workOrders/${workOrder.value[0].id}`);
    return workOrder;
  }

  @Get()
  @HttpCode(HttpStatus.OK) 
  async getWorkOrders(
    @Query('$top', new DefaultValuePipe(50), ParseIntPipe) top?: number,
    @Query('$skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
    @Query('$count', new DefaultValuePipe(false), ParseBoolPipe) count?: boolean,
    @Query('$orderby') orderBy?: string,
    @Query('$filter') filter?: string,
    @Query('$search') search?: string,
  ): Promise<{ value: any[]; count?: number }> {
    return this.workOrderService.getWorkOrders(
      top,
      skip,
      count,
      orderBy,
      filter,
      search,
    );
  }

  @Get('/:workOrderId')
  @UseInterceptors(new EtagInterceptor())
  @HttpCode(HttpStatus.OK) 
  async getWorkOrderById(
    @Param('workOrderId') workOrderId: string,
  ): Promise<WorkOrder> {
    return this.workOrderService.getWorkOrderById(workOrderId);
  }

  @Patch('/:workOrderId')
  @UseInterceptors(new EtagInterceptor())
  @HttpCode(HttpStatus.OK) 
  async updateWorkOrder(
    @Param('workOrderId') workOrderId: string,
    @Body() updateWorkOrderDto: UpdateWorkOrderDto,
  ) {
    return this.workOrderService.updateWorkOrder(
      workOrderId,
      updateWorkOrderDto,
    );
  }

  @Delete('/:workOrderId')
  @HttpCode(HttpStatus.OK) 
  async deleteWorkOrder(@Param('workOrderId') workOrderId: string) {
    return this.workOrderService.deleteWorkOrder(workOrderId);
  }

  /**
   * Analytics data export endpoint
   * Triggered by UI to start data export process
   *
   * POST /work-order-service/workOrders/dataExportRequest
   * Request Body: { dataRequestId, serviceFullName, entityFullName }
   * Success: 204 No Content
   * Errors: 400 Bad Request, 500 Internal Server Error
   */
  @Post('/dataExportRequest')
  @HttpCode(HttpStatus.NO_CONTENT)
  async dataExportRequest(@Body() dataExportRequestDto: DataExportRequestDto): Promise<void> {
    const { dataRequestId, serviceFullName, entityFullName } = dataExportRequestDto;

    // Start data export asynchronously (fire and forget)
    this.analyticsReplicationService
      .startDataExport(dataRequestId, serviceFullName, entityFullName)
      .catch((error) => {
        // Errors are already logged in the service, just catch to prevent unhandled rejection
      });

    // Return 204 No Content immediately
    return;
  }
}

