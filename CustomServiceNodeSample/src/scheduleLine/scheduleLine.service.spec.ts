import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleLineService } from './scheduleLine.service';
import { ScheduleLine } from '../entities/scheduleLine.entity';
import { BadRequestException, NotFoundException } from '../common/exceptions/custom.exceptions';

describe('ScheduleLineService', () => {
  let service: ScheduleLineService;
  let repository: jest.Mocked<Repository<ScheduleLine>>;

  const mockScheduleLine = {
    id: 'sl-123',
    displayId: 'SL-001',
    scheduleLineName: 'Test Schedule Line',
    date: new Date('2024-06-01'),
    requestedQuantity: 10,
    confirmedQuantity: 8,
    requestedEndDate: new Date('2024-06-30'),
    status: 'CONFIRMED',
    workProductId: 'wp-123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ScheduleLineService,
          useFactory: (repo) => new ScheduleLineService(repo),
          inject: [getRepositoryToken(ScheduleLine)],
        },
        {
          provide: getRepositoryToken(ScheduleLine),
          useValue: {
            createQueryBuilder: jest.fn(() => mockQueryBuilder),
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ScheduleLineService>(ScheduleLineService);
    repository = module.get(getRepositoryToken(ScheduleLine));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all schedule lines', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockScheduleLine]);

      const result = await service.findAll();

      expect(result.value).toHaveLength(1);
      expect(result.value[0].id).toBe('sl-123');
    });

    it('should filter by workProductId', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockScheduleLine]);

      await service.findAll('wp-123');

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'scheduleLine.workProductId = :workProductId',
        { workProductId: 'wp-123' }
      );
    });

    it('should apply default sorting by date', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockScheduleLine]);

      await service.findAll();

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('scheduleLine.date', 'ASC');
    });

    it('should apply custom sorting', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockScheduleLine]);

      await service.findAll(undefined, 'scheduleLineName desc');

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('scheduleLine.scheduleLineName', 'DESC', 'NULLS LAST');
    });

    it('should sort by displayId ascending', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockScheduleLine]);

      await service.findAll(undefined, 'displayId asc');

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('scheduleLine.displayId', 'ASC', 'NULLS LAST');
    });

    it('should sort by requestedQuantity descending', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockScheduleLine]);

      await service.findAll(undefined, 'requestedQuantity desc');

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('scheduleLine.requestedQuantity', 'DESC', 'NULLS LAST');
    });

    it('should sort by confirmedQuantity ascending', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockScheduleLine]);

      await service.findAll(undefined, 'confirmedQuantity asc');

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('scheduleLine.confirmedQuantity', 'ASC', 'NULLS LAST');
    });

    it('should sort by requestedEndDate descending', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockScheduleLine]);

      await service.findAll(undefined, 'requestedEndDate desc');

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('scheduleLine.requestedEndDate', 'DESC', 'NULLS LAST');
    });

    it('should sort by status ascending', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockScheduleLine]);

      await service.findAll(undefined, 'status asc');

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('scheduleLine.status', 'ASC', 'NULLS LAST');
    });

    it('should throw BadRequestException for unsupported sort field', async () => {
      await expect(service.findAll(undefined, 'invalidField asc')).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return a schedule line by id', async () => {
      repository.findOne = jest.fn().mockResolvedValue(mockScheduleLine);

      const result = await service.findOne('sl-123');

      expect(result.value.id).toBe('sl-123');
    });

    it('should throw NotFoundException when not found', async () => {
      repository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a schedule line', async () => {
      const dto: any = {
        displayId: 'SL-002',
        date: new Date('2024-07-01'),
        requestedQuantity: 15,
        workProductId: 'wp-123',
      };

      repository.save = jest.fn().mockResolvedValue({ ...mockScheduleLine, ...dto });

      const result = await service.create(dto);

      expect(result.value).toHaveLength(1);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a schedule line', async () => {
      repository.findOne = jest.fn()
        .mockResolvedValueOnce(mockScheduleLine)
        .mockResolvedValueOnce({ ...mockScheduleLine, requestedQuantity: 20 });
      repository.save = jest.fn().mockResolvedValue({ ...mockScheduleLine, requestedQuantity: 20 });

      const result = await service.update('sl-123', { requestedQuantity: 20 });

      expect(repository.save).toHaveBeenCalled();
      expect(result.value.id).toBe('sl-123');
    });

    it('should throw NotFoundException when updating non-existent line', async () => {
      repository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.update('invalid-id', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a schedule line', async () => {
      repository.findOne = jest.fn().mockResolvedValue(mockScheduleLine);
      repository.delete = jest.fn().mockResolvedValue({ affected: 1 });

      const result = await service.delete('sl-123');

      expect(result.value[0].status).toBe('deleted');
    });
  });
});
