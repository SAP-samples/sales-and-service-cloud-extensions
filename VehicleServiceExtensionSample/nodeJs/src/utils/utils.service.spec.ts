import { TestingModule, Test } from '@nestjs/testing';
import { I18nService } from 'nestjs-i18n';
import { UtilsService } from './utils.service';
import { REQUEST } from '@nestjs/core';
import { MESSAGES, CUSTOM_LOGIC_ERROR_CODE } from '../common/constants';
import { ServerException } from '../common/filters/server-exception';
import { RequestMock } from '../../test/mock-data/common.mock.data';

describe('UtilsService', () => {
  let service: UtilsService;

  const mockI18nService = {
    translate: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UtilsService,
        { provide: I18nService, useValue: mockI18nService },
        {
          provide: REQUEST,
          useValue: RequestMock,
        },
      ],
    }).compile();

    service = module.get<UtilsService>(UtilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCustomLogicErrorDetails', () => {
    let error;
    const target = 'd886b468-ed95-11ed-a6bd-5354a6389ba0';
    const message = MESSAGES.CASE_STATUS_DISABLED;
    let oExpectedError;
    beforeEach(() => {
      error = [];
      oExpectedError = [
        {
          code: `${CUSTOM_LOGIC_ERROR_CODE.CASE_SERVICE}.${target}`,
          message: MESSAGES.CASE_STATUS_DISABLED,
          target: `caseId/${target}`,
        },
      ];
    });
    afterEach(() => {
      error = oExpectedError = undefined;
    });
    it('should return error', () => {
      const oError = service.getCustomLogicErrorDetails(error, target, message);
      expect(oError).toEqual(oExpectedError);
    });
    it('should handle when there is no message', () => {
      const oError = service.getCustomLogicErrorDetails(
        error,
        target,
        undefined,
      );
      expect(oError[0].message).toEqual(MESSAGES.CASE_STATUS_DISABLED);
    });
    it('should handle when there is no target', () => {
      const oError = service.getCustomLogicErrorDetails(
        error,
        undefined,
        message,
      );
      expect(oError[0].target).toEqual('');
    });
  });

  describe('stringifyServiceFormDto', () => {
    it('should stringifyServiceFormDto', () => {
      const oServiceForm = {
        servicesProposed: [
          {
            id: '87a68c40-85c9-4654-8816-2e0a53b4483d',
            service: 'Change Tyre',
            price: '2499',
            isSelected: false,
          },
          {
            id: 'd68e632d-3a3d-40c4-8428-217f94bf0f03',
            service: 'Brake pad replacement',
            price: '99.99',
            isSelected: true,
          },
        ],
        inspectionItems: [
          {
            id: '29375f72-a7a2-49b8-98f5-fa4adcdc2ba1',
            description: 'Check for toolkit',
            isSelected: false,
          },
          {
            id: 'a4db738c-3efd-4509-8e16-d9016339a1de',
            description: 'Check for any dents',
            isSelected: false,
          },
        ],
        notes: [' ', ' ', ' ', ' ', ' '],
        customerComplaints: ['', ''],
      };
      service.stringifyServiceFormDto(oServiceForm);
      expect(typeof oServiceForm.servicesProposed).toBe('string');
      expect(typeof oServiceForm.inspectionItems).toBe('string');
      expect(typeof oServiceForm.notes).toBe('string');
      expect(typeof oServiceForm.customerComplaints).toBe('string');
    });
  });

  describe('getDateTime', () => {
    it('should return date and time format', () => {
      const oResult = service.getDateTime('2023-05-10T11:55:47.397Z');
      expect(oResult).toBe('5/10/2023 5:25:47 PM');
    });

    it('should return - for null date', () => {
      const oResult = service.getDateTime('');
      expect(oResult).toBe('-');
    });
  });

  describe('parseFilterString', () => {
    it(`should be able to parse filters like 'caseId eq <UUID>'`, () => {
      const oFilter = `caseId eq 'b867087f-f3ba-11ed-95b1-4f6d461bbdcd'`;
      const oQuery = service.parseFilterString(oFilter);
      expect(oQuery).toEqual({
        caseId: `b867087f-f3ba-11ed-95b1-4f6d461bbdcd`,
      });
    });

    it(`should be able to parse filters like 'caseId ne <UUID>'`, () => {
      const oFilter = `caseId ne 'b867087f-f3ba-11ed-95b1-4f6d461bbdcd'`;
      const oQuery = service.parseFilterString(oFilter);
      expect(oQuery['caseId']._type).toBe('not');
    });

    it(`should be able to parse filters like 'vehicleNumber ct 'kh'`, () => {
      const oFilter = `vehicleNumber ct 'kh'`;
      const oQuery = service.parseFilterString(oFilter);
      expect(oQuery['vehicleNumber']._type).toBe('ilike');
    });

    it(`should handle when number is passed`, () => {
      const oFilter = `displayId eq '5'`;
      const oQuery = service.parseFilterString(oFilter);
      expect(oQuery).toEqual({
        displayId: 5,
      });
    });

    it(`should handle null is passed`, () => {
      const oFilter = `jobCard eq null`;
      const oQuery = service.parseFilterString(oFilter);
      expect(oQuery['jobCard']._type).toBe('isNull');
    });

    it(`should throw error when invalid filterString is passed`, () => {
      try {
        service.parseFilterString({} as string);
      } catch (error) {
        expect(error).toBeInstanceOf(ServerException);
      }
    });

    it('should call processNestedField() function', () => {
      const oFilter = `servicesSelected.technician eq '{"name":"Technician name","btpUserId":"28dc29c9-266a-4711-ae07-eea807d0a89f"}'`;
      const oQuery = service.parseFilterString(oFilter);
      expect(oQuery).toEqual({
        servicesSelected: {
          technician:
            '{"name":"Technician name","btpUserId":"28dc29c9-266a-4711-ae07-eea807d0a89f"}',
        },
      });
    });
  });

  describe('processNestedField', () => {
    it('should create a nested object', () => {
      const field = 'servicesSelected.technician';
      const value = JSON.stringify({
        name: 'Technician name',
        btpUserId: '28dc29c9-266a-4711-ae07-eea807d0a89f',
      });
      const oNestedObject = service.processNestedField(field, value);
      expect(oNestedObject).toStrictEqual({
        servicesSelected: {
          technician:
            '{"name":"Technician name","btpUserId":"28dc29c9-266a-4711-ae07-eea807d0a89f"}',
        },
      });
    });
  });

  describe('handleQueryParams', () => {
    it('should handle $filter ', () => {
      const oQuery = service.handleQueryParams(
        `caseId eq '0b38d95f-88e4-11ee-aa19-0f8a5b4f1b74'`,
        undefined,
      );
      expect(oQuery).toStrictEqual({
        caseId: `0b38d95f-88e4-11ee-aa19-0f8a5b4f1b74`,
      });
    });

    it('should handle $search ', () => {
      const oQuery = service.handleQueryParams(undefined, `kh`);
      expect(oQuery).toBeInstanceOf(Array);
      expect(oQuery[0]).toHaveProperty('displayId');
      expect(oQuery[1]).toHaveProperty('vehicleNumber');
      expect(oQuery[2]).toHaveProperty('model');
      expect(oQuery[3]).toHaveProperty('status');
    });

    it('should handle when $filter and $search is empty', () => {
      const oQuery = service.handleQueryParams(undefined, undefined);
      expect(oQuery).toStrictEqual({});
    });
  });

  describe('processSearchQuery', () => {
    it(`should handle $search query`, () => {
      const oQuery = service.processSearchQuery(`kh`);
      expect(oQuery).toBeInstanceOf(Array);
      expect(oQuery[0]).toHaveProperty('displayId');
      expect(oQuery[1]).toHaveProperty('vehicleNumber');
      expect(oQuery[2]).toHaveProperty('model');
      expect(oQuery[3]).toHaveProperty('status');
    });
  });

  describe('processFilterQuery', () => {
    it(`should handle or in query`, () => {
      const oQuery = service.processFilterQuery(
        `name ct 'exfs' or address ct 'exfs'`,
      );
      expect(oQuery).toBeInstanceOf(Array);
      expect(oQuery[0]).toHaveProperty(`name`);
      expect(oQuery[1]).toHaveProperty(`address`);
    });

    it(`should handle and in query`, () => {
      const oQuery = service.processFilterQuery(
        `name ct 'exfs' and address ct 'exfs'`,
      );
      expect(oQuery).toBeInstanceOf(Object);
      expect(oQuery).toHaveProperty(`name`);
      expect(oQuery).toHaveProperty(`address`);
    });
  });
});
