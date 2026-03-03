import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleLine } from '../entities/scheduleLine.entity';
import { ScheduleLineDto } from '../dto/scheduleLine.dto';
import { UpdateScheduleLineDto } from '../dto/updateScheduleLine.dto';
import { BadRequestException, NotFoundException } from '../common/exceptions/custom.exceptions';

@Injectable({ scope: Scope.REQUEST })
export class ScheduleLineService {
  constructor(
    @InjectRepository(ScheduleLine)
    private scheduleLineRepository: Repository<ScheduleLine>,
  ) {}

  async findAll(workProductId?: string, orderBy?: string): Promise<{ value: ScheduleLine[] }> {
    const query = this.scheduleLineRepository.createQueryBuilder('scheduleLine');
    
    if (workProductId) {
      query.where('scheduleLine.workProductId = :workProductId', { workProductId });
    }
    
    // Apply sorting
    if (orderBy) {
      this.applySorting(query, orderBy);
    } else {
      // Default sort by date
      query.orderBy('scheduleLine.date', 'ASC');
    }
    
    const scheduleLines = await query.getMany();
    return { value: scheduleLines };
  }

  async findOne(id: string): Promise<{ value: ScheduleLine }> {
    const scheduleLine = await this.scheduleLineRepository.findOne({
      where: { id },
    });

    if (!scheduleLine) {
      throw new NotFoundException(`Schedule line with ID ${id} not found`);
    }

    return { value: scheduleLine };
  }

  async create(scheduleLineDto: ScheduleLineDto): Promise<{ value: ScheduleLine[] }> {
    const scheduleLine = new ScheduleLine();
    Object.assign(scheduleLine, scheduleLineDto);
    
    const savedScheduleLine = await this.scheduleLineRepository.save(scheduleLine);
    // Create returns array format
    return { value: [savedScheduleLine] };
  }

  async update(id: string, updateDto: any): Promise<{ value: ScheduleLine }> {
    const result = await this.findOne(id);
    const scheduleLine = result.value;
    
    // Update only provided fields
    if (updateDto.displayId !== undefined) scheduleLine.displayId = updateDto.displayId;
    if (updateDto.scheduleLineName !== undefined) scheduleLine.scheduleLineName = updateDto.scheduleLineName;
    if (updateDto.date !== undefined) scheduleLine.date = updateDto.date;
    if (updateDto.requestedQuantity !== undefined) scheduleLine.requestedQuantity = updateDto.requestedQuantity;
    if (updateDto.confirmedQuantity !== undefined) scheduleLine.confirmedQuantity = updateDto.confirmedQuantity;
    if (updateDto.requestedEndDate !== undefined) scheduleLine.requestedEndDate = updateDto.requestedEndDate;
    if (updateDto.status !== undefined) scheduleLine.status = updateDto.status;
    if (updateDto.workProductId !== undefined) scheduleLine.workProductId = updateDto.workProductId;
    
    await this.scheduleLineRepository.save(scheduleLine);
    return this.findOne(id);
  }

  private applySorting(query: any, orderBy: string): void {
    const parts = orderBy.trim().split(' ');
    const field = parts[0];
    const direction = parts[1]?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const sortableFields: { [key: string]: string } = {
      'displayId': 'scheduleLine.displayId',
      'scheduleLineName': 'scheduleLine.scheduleLineName',
      'date': 'scheduleLine.date',
      'requestedQuantity': 'scheduleLine.requestedQuantity',
      'confirmedQuantity': 'scheduleLine.confirmedQuantity',
      'requestedEndDate': 'scheduleLine.requestedEndDate',
      'status': 'scheduleLine.status',
    };

    if (sortableFields[field]) {
      query.orderBy(sortableFields[field], direction, 'NULLS LAST');
    } else {
      throw new BadRequestException(
        `Unsupported sort field: ${field}`,
        `orderby=${orderBy}`
      );
    }
  }

  async delete(id: string): Promise<{ value: any[] }> {
    const result = await this.scheduleLineRepository.delete({ id });
    
    if (result.affected === 0) {
      throw new NotFoundException(`Schedule line with ID ${id} not found`);
    }
    
    return {
      value: [{
        id: id,
        status: 'deleted'
      }]
    };
  }
}
