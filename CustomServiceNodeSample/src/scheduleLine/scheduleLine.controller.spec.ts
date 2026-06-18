import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleLineNestedController } from './scheduleLine.controller';
import { ScheduleLineService } from './scheduleLine.service';

describe('ScheduleLineNestedController', () => {
  let controller: ScheduleLineNestedController;
  let service: jest.Mocked<ScheduleLineService>;

  const mockScheduleLine = {
    id: 'sl-123',
    displayId: 'SL-001',
    scheduleLineName: 'Test Line',
    date: new Date('2024-01-01'),
    requestedQuantity: 10,
    confirmedQuantity: 8,
    requestedEndDate: new Date('2024-01-31'),
    status: 'CONFIRMED',
    workProductId: 'wp-123',
    workProduct: {} as any,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleLineNestedController],
      providers: [
        {
          provide: ScheduleLineService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ScheduleLineNestedController>(ScheduleLineNestedController);
    service = module.get(ScheduleLineService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllScheduleLines', () => {
    it('should return schedule lines with pagination params', async () => {
      service.findAll.mockResolvedValue({ value: [mockScheduleLine] });

      const result = await controller.getAllScheduleLines('wo-123', 'wp-123', undefined, undefined, undefined, undefined);

      expect(service.findAll).toHaveBeenCalledWith('wp-123', undefined, undefined, undefined, undefined);
      expect(result.value).toHaveLength(1);
    });

    it('should pass top/skip/count/orderby to service', async () => {
      service.findAll.mockResolvedValue({ value: [mockScheduleLine], count: 1 });

      await controller.getAllScheduleLines('wo-123', 'wp-123', 10, 5, true, 'date desc');

      expect(service.findAll).toHaveBeenCalledWith('wp-123', 10, 5, true, 'date desc');
    });
  });

  describe('getScheduleLine', () => {
    it('should return one schedule line with workProductId validation', async () => {
      service.findOne.mockResolvedValue({ value: mockScheduleLine });

      const result = await controller.getScheduleLine('wo-123', 'wp-123', 'sl-123');

      expect(service.findOne).toHaveBeenCalledWith('sl-123', 'wp-123');
      expect(result.value.id).toBe('sl-123');
    });
  });

  describe('createScheduleLine', () => {
    it('should create a schedule line and set Location header', async () => {
      const mockRes = { header: jest.fn() } as any;
      service.create.mockResolvedValue({ value: [mockScheduleLine] });

      const result = await controller.createScheduleLine('wo-123', 'wp-123', { date: new Date(), requestedQuantity: 10 } as any, mockRes);

      expect(mockRes.header).toHaveBeenCalledWith('Location', expect.stringContaining('/scheduleLines/sl-123'));
      expect(result.value).toHaveLength(1);
    });
  });

  describe('updateScheduleLine', () => {
    it('should update a schedule line with workProductId validation', async () => {
      service.update.mockResolvedValue({ value: mockScheduleLine });

      await controller.updateScheduleLine('wo-123', 'wp-123', 'sl-123', {});

      expect(service.update).toHaveBeenCalledWith('sl-123', {}, 'wp-123');
    });
  });

  describe('deleteScheduleLine', () => {
    it('should delete a schedule line with workProductId validation', async () => {
      service.delete.mockResolvedValue({ value: [{ id: 'sl-123', status: 'deleted' }] });

      const result = await controller.deleteScheduleLine('wo-123', 'wp-123', 'sl-123');

      expect(service.delete).toHaveBeenCalledWith('sl-123', 'wp-123');
      expect(result.value[0].status).toBe('deleted');
    });
  });
});
