import { Test, TestingModule } from '@nestjs/testing';
import { WorkProductNestedController } from './workProduct.controller';
import { WorkProductService } from './workProduct.service';

describe('WorkProductNestedController', () => {
  let controller: WorkProductNestedController;
  let service: jest.Mocked<WorkProductService>;

  const mockWorkProduct = {
    id: 'wp-123',
    workProductId: 'WP-001',
    workProductName: 'Test Product',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkProductNestedController],
      providers: [
        {
          provide: WorkProductService,
          useValue: {
            getAllWorkProducts: jest.fn(),
            findByWorkOrderId: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<WorkProductNestedController>(WorkProductNestedController);
    service = module.get(WorkProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllWorkProducts', () => {
    it('should return all work products for a work order', async () => {
      service.findByWorkOrderId.mockResolvedValue({ value: [mockWorkProduct] });

      const result = await controller.getAllWorkProducts('wo-123', 50, 0, false, undefined, undefined, undefined);

      expect(service.findByWorkOrderId).toHaveBeenCalledWith('wo-123', 50, 0, false, undefined, undefined, undefined);
      expect(result.value).toHaveLength(1);
    });
  });

  describe('getWorkProduct', () => {
    it('should return one work product with workOrderId validation', async () => {
      service.findOne.mockResolvedValue({ value: mockWorkProduct });

      const result = await controller.getWorkProduct('wo-123', 'wp-123');

      expect(service.findOne).toHaveBeenCalledWith('wp-123', 'wo-123');
      expect(result.value.id).toBe('wp-123');
    });
  });

  describe('createWorkProduct', () => {
    it('should create a work product and set Location header', async () => {
      const mockRes = { header: jest.fn() } as any;
      service.create.mockResolvedValue({ value: [mockWorkProduct] });

      const result = await controller.createWorkProduct('wo-123', {} as any, mockRes);

      expect(mockRes.header).toHaveBeenCalledWith('Location', expect.stringContaining('/workProducts/wp-123'));
      expect(result.value).toHaveLength(1);
    });
  });

  describe('updateWorkProduct', () => {
    it('should update a work product with workOrderId validation', async () => {
      service.update.mockResolvedValue({ value: mockWorkProduct });

      await controller.updateWorkProduct('wo-123', 'wp-123', {} as any);

      expect(service.update).toHaveBeenCalledWith('wp-123', {}, 'wo-123');
    });
  });

  describe('deleteWorkProduct', () => {
    it('should delete a work product with workOrderId validation', async () => {
      service.delete.mockResolvedValue({ value: [{ id: 'wp-123', status: 'deleted' }] });

      const result = await controller.deleteWorkProduct('wo-123', 'wp-123');

      expect(service.delete).toHaveBeenCalledWith('wp-123', 'wo-123');
      expect(result.value[0].status).toBe('deleted');
    });
  });
});
