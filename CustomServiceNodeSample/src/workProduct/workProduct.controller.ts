import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
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
import { WorkProductService } from './workProduct.service';
import { WorkProductDTO } from '../dto/workProduct.dto';
import { EtagInterceptor } from '../common/interceptor/etag.interceptor';

// Nested endpoint controller
@Controller('/work-order-service/workOrders/:workOrderId/workProducts')
export class WorkProductNestedController {
  constructor(
    private readonly workProductService: WorkProductService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllWorkProducts(
    @Param('workOrderId') workOrderId: string,
    @Query('$top', new DefaultValuePipe(50), ParseIntPipe) top?: number,
    @Query('$skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
    @Query('$count', new DefaultValuePipe(false), ParseBoolPipe) count?: boolean,
    @Query('$orderby') orderBy?: string,
    @Query('$filter') filter?: string,
    @Query('$search') search?: string,
  ): Promise<{ value: any[]; count?: number }> {
    return this.workProductService.findByWorkOrderId(
      workOrderId,
      top,
      skip,
      count,
      orderBy,
      filter,
      search,
    );
  }

  @Get('/:workProductId')
  @UseInterceptors(new EtagInterceptor())
  @HttpCode(HttpStatus.OK)
  async getWorkProduct(
    @Param('workOrderId') workOrderId: string,
    @Param('workProductId') workProductId: string,
  ) {
    return this.workProductService.findOne(workProductId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createWorkProduct(
    @Param('workOrderId') workOrderId: string,
    @Body() workProductDto: WorkProductDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const dto = { ...workProductDto, workOrderId };
    const workProduct = await this.workProductService.create(dto);
    // Set Location header as per guidelines for 201 Created
    res.header('Location', `/work-order-service/workOrders/${workOrderId}/workProducts/${workProduct.value[0].id}`);
    return workProduct;
  }

  @Patch('/:workProductId')
  @UseInterceptors(new EtagInterceptor())
  @HttpCode(HttpStatus.OK)
  async updateWorkProduct(
    @Param('workOrderId') workOrderId: string,
    @Param('workProductId') workProductId: string,
    @Body() workProductDto: WorkProductDTO,
  ) {
    return this.workProductService.update(workProductId, workProductDto);
  }

  @Delete('/:workProductId')
  @HttpCode(HttpStatus.OK)
  async deleteWorkProduct(
    @Param('workOrderId') workOrderId: string,
    @Param('workProductId') workProductId: string,
  ) {
    return this.workProductService.delete(workProductId);
  }
}
