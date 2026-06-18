import { Controller, Get, Post, Patch, Delete, Body, Param, Query, HttpCode, HttpStatus, Res, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { ScheduleLineService } from './scheduleLine.service';
import { ScheduleLineDto } from '../dto/scheduleLine.dto';
import { UpdateScheduleLineDto } from '../dto/updateScheduleLine.dto';
import { EtagInterceptor } from '../common/interceptor/etag.interceptor';

// Nested endpoint controller
@Controller('/work-order-service/workOrders/:workOrderId/workProducts/:workProductId/scheduleLines')
export class ScheduleLineNestedController {
  constructor(private readonly scheduleLineService: ScheduleLineService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllScheduleLines(
    @Param('workOrderId') workOrderId: string,
    @Param('workProductId') workProductId: string,
    @Query('$top') top?: number,
    @Query('$skip') skip?: number,
    @Query('$count') count?: boolean,
    @Query('$orderby') orderBy?: string,
  ): Promise<{ value: any[]; count?: number }> {
    return this.scheduleLineService.findAll(workProductId, top, skip, count, orderBy);
  }

  @Get('/:scheduleLineId')
  @UseInterceptors(new EtagInterceptor())
  @HttpCode(HttpStatus.OK)
  async getScheduleLine(
    @Param('workOrderId') workOrderId: string,
    @Param('workProductId') workProductId: string,
    @Param('scheduleLineId') scheduleLineId: string,
  ) {
    return this.scheduleLineService.findOne(scheduleLineId, workProductId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createScheduleLine(
    @Param('workOrderId') workOrderId: string,
    @Param('workProductId') workProductId: string,
    @Body() scheduleLineDto: ScheduleLineDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const dto = { ...scheduleLineDto, workProductId };
    const scheduleLine = await this.scheduleLineService.create(dto);
    // Set Location header as per guidelines for 201 Created
    res.header('Location', `/work-order-service/workOrders/${workOrderId}/workProducts/${workProductId}/scheduleLines/${scheduleLine.value[0].id}`);
    return scheduleLine;
  }

  @Patch('/:scheduleLineId')
  @UseInterceptors(new EtagInterceptor())
  @HttpCode(HttpStatus.OK)
  async updateScheduleLine(
    @Param('workOrderId') workOrderId: string,
    @Param('workProductId') workProductId: string,
    @Param('scheduleLineId') scheduleLineId: string,
    @Body() updateDto: UpdateScheduleLineDto,
  ) {
    return this.scheduleLineService.update(scheduleLineId, updateDto, workProductId);
  }

  @Delete('/:scheduleLineId')
  @HttpCode(HttpStatus.OK)
  async deleteScheduleLine(
    @Param('workOrderId') workOrderId: string,
    @Param('workProductId') workProductId: string,
    @Param('scheduleLineId') scheduleLineId: string,
  ) {
    return this.scheduleLineService.delete(scheduleLineId, workProductId);
  }
}
