import { Test, TestingModule } from '@nestjs/testing';
import { CdsMetadataConversionService } from './cds-metadata-conversion.service';
import * as utils from '../common/utils';
import {
  eventFormat,
  TriggerType,
} from 'src/common/interfaces/elements.interface';

describe('CdsMetadataConversionService', () => {
  let service: CdsMetadataConversionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CdsMetadataConversionService],
    }).compile();
    service = module.get<CdsMetadataConversionService>(
      CdsMetadataConversionService,
    );
  });

  describe('convertMetadata', () => {
    it('should handle an empty cdsSchema.definitions object', async () => {
      const cdsSchema = { definitions: {} };
      const expectedResult = {
        service: {
          authorizationRelevant: true,
          description: '',
          label: '',
          technicalName: '',
        },
        entities: [],
        events: [],
        apis: [],
      };
      const result = await service.convertMetadata(cdsSchema);
      expect(result).toEqual(expectedResult);
    });

    it('should process service artifacts', async () => {
      const mockServiceName = 'ProjectOrderService';
      const cdsSchema = {
        definitions: {
          ProjectOrderService: { kind: 'service' },
        },
      };
      jest.spyOn(utils, 'getServiceName').mockReturnValue(mockServiceName); // Directly mock method on the service instance.
      const result = await service.convertMetadata(cdsSchema);
      expect(utils.getServiceName).toHaveBeenCalledWith(
        cdsSchema.definitions['ProjectOrderService'],
        'ProjectOrderService',
      );
      expect(result.service.technicalName).toBe('ProjectOrderService');
    });

    it('should process event artifacts', async () => {
      const mockEvent: eventFormat = {
        technicalName: 'ProjectOrderCreate',
        label: 'Project Order',
        entityReference: 'ProjectOrder',
        trigger: 'CREATE' as TriggerType,
      };
      const cdsSchema = {
        definitions: {
          'ProjectOrderService.customer.ssc.projectorderservice.event.projectOrderCreate':
            { kind: 'event' },
        },
      };
      jest.spyOn(service, 'buildEvent').mockReturnValue(mockEvent);
      const result = await service.convertMetadata(cdsSchema);
      expect(service.buildEvent).toHaveBeenCalledWith(
        'ProjectOrderService.customer.ssc.projectorderservice.event.projectOrderCreate',
      );
      expect(result.events).toContainEqual(mockEvent);
    });

    it('should process entity artifacts', async () => {
      const cdsSchema = {
        definitions: {
          ProjectOrderService: {
            kind: 'service',
            '@path': '/project-order-service',
          },
          'ProjectOrderService.projectOrder': { kind: 'entity' },
        },
      };
      const mockEntityDetails = {
        isEntity: true,
        entityFullName: 'ProjectOrderService.projectOrder',
        nameSpace: 'ProjectOrderService.projectOrder',
      };
      const mockEntityType = 'BUSINESS';
      const mockObjectTypeCode = '123';
      const mockAttributes = [{ name: 'Name', type: 'string' }];

      jest.spyOn(utils, 'getEntityDetails').mockReturnValue(mockEntityDetails);
      jest.spyOn(utils, 'getEntityType').mockReturnValue(mockEntityType);
      jest
        .spyOn(utils, 'generateObjectTypeCode')
        .mockReturnValue(mockObjectTypeCode);
      jest
        .spyOn(utils, 'isEntityCreateUpdateEnabled')
        .mockReturnValue({ creatable: true, updatable: false });
      jest.spyOn(utils, 'getLabel').mockReturnValue('Project Order');
      jest.spyOn(service, 'buildAttributes').mockResolvedValue(mockAttributes);

      const result = await service.convertMetadata(cdsSchema);

      expect(utils.getEntityDetails).toHaveBeenCalledWith(
        cdsSchema.definitions['ProjectOrderService.projectOrder'],
        'ProjectOrderService.projectOrder',
        'ProjectOrderService',
      );
      expect(utils.getEntityType).toHaveBeenCalledWith(
        cdsSchema.definitions['ProjectOrderService.projectOrder'],
      );
      expect(service.buildAttributes).toHaveBeenCalledWith(
        cdsSchema,
        cdsSchema.definitions['ProjectOrderService.projectOrder'],
        'ProjectOrderService.projectOrder',
        mockEntityDetails.entityFullName,
      );

      expect(result.entities).toHaveLength(1);
      expect(result.entities[0]).toEqual(
        expect.objectContaining({
          name: 'projectOrder',
          label: 'Project Order',
          entityType: mockEntityType,
          root: true,
          creatable: true,
          updatable: false,
          attributes: mockAttributes,
        }),
      );
    });
  });
});
