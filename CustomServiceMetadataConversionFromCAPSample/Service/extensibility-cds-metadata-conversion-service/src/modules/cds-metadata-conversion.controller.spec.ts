import { Test, TestingModule } from '@nestjs/testing';
import { CdsMetadataConversionController } from './cds-metadata-conversion.controller';
import { CdsMetadataConversionService } from './cds-metadata-conversion.service';
import { cdsSchema } from '../common/constants';
import { convertedMetadata } from '../../test/mock/convertedMetadata';

describe('CdsMetadataConversionController', () => {
  let cdsMetadataConversionController: CdsMetadataConversionController;
  let cdsMetadataConversionService: CdsMetadataConversionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CdsMetadataConversionController],
      providers: [
        {
          provide: CdsMetadataConversionService,
          useValue: {
            convertMetadata: jest.fn(),
          },
        },
      ],
    }).compile();

    cdsMetadataConversionController =
      module.get<CdsMetadataConversionController>(
        CdsMetadataConversionController,
      );
    cdsMetadataConversionService = module.get<CdsMetadataConversionService>(
      CdsMetadataConversionService,
    );
  });

  describe('getFormattedMetadata', () => {
    it('should call convertMetadata with cdsSchema and return the result', async () => {
      const mockSchema = cdsSchema;
      const mockResult = convertedMetadata;
      (
        cdsMetadataConversionService.convertMetadata as jest.Mock
      ).mockResolvedValue(mockResult);
      const result =
        await cdsMetadataConversionController.getFormattedMetadata();
      expect(cdsMetadataConversionService.convertMetadata).toHaveBeenCalledWith(
        mockSchema,
      );
      expect(result).toBe(mockResult);
    });
  });

  describe('getConvertedMetadata', () => {
    it('should call convertMetadata with the provided cdsSchema and return the result', async () => {
      const mockSchema = cdsSchema;
      const mockResult = convertedMetadata;
      (
        cdsMetadataConversionService.convertMetadata as jest.Mock
      ).mockResolvedValue(mockResult);
      const result = await cdsMetadataConversionController.getConvertedMetadata(
        mockSchema,
      );
      expect(cdsMetadataConversionService.convertMetadata).toHaveBeenCalledWith(
        mockSchema,
      );
      expect(result).toBe(mockResult);
    });
  });
});
