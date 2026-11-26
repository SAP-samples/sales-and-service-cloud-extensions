import { Test, TestingModule } from '@nestjs/testing';
import { AnyExceptionFilter } from './any-exception.filter';
import { ServerException } from './server-exception';
import { TypeORMError } from 'typeorm';
import { ValidationException } from '../validations/validation.exception';
import { ValidationError } from 'class-validator';

const oMockContext: any = {
  switchToHttp: () => ({
    getRequest: () => ({
      url: 'mock-url',
    }),
    getResponse: () => {
      const response = {
        code: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      return response;
    },
  }),
};

describe('AnyExceptionFilter', () => {
  let exceptionFilter: AnyExceptionFilter<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnyExceptionFilter],
    }).compile();
    exceptionFilter = module.get<AnyExceptionFilter<any>>(AnyExceptionFilter);
  });
  it('should be defined', () => {
    expect(exceptionFilter).toBeDefined();
  });

  it('should handle ServerException', async () => {
    try {
      const dummyServerException = new ServerException(
        new Error('Custom Error'),
        'AnyExceptionFilter',
        'catch',
      );

      await exceptionFilter.catch(dummyServerException, oMockContext);
      expect(
        oMockContext.switchToHttp().getResponse().status().status,
      ).toBeCalled();
    } catch (error) {
      expect(error).toBe(undefined);
    }
  });

  describe('TypeORMError', () => {
    it('should handle TypeORMError', async () => {
      try {
        const oTypeOrmError = new TypeORMError('DB Error');
        const dummyServerException = new ServerException(
          oTypeOrmError,
          'AnyExceptionFilter',
          'catch',
        );

        await exceptionFilter.catch(dummyServerException, oMockContext);
        expect(
          oMockContext.switchToHttp().getResponse().status().status,
        ).toBeCalled();
      } catch (error) {
        expect(error).toBe(undefined);
      }
    });
  });

  describe('ValidationException', () => {
    it('should format the error response for validation error', async () => {
      try {
        const dummyValidationError = new ValidationException([]);

        await exceptionFilter.catch(dummyValidationError, oMockContext);
        expect(
          oMockContext.switchToHttp().getResponse().status().status,
        ).toBeCalled();
      } catch (error) {
        expect(error).toBe(undefined);
      }
    });

    it('getCustomValidationErrors should format the validation errors', async () => {
      const errors: ValidationError[] = [];
      const error1 = new ValidationError();
      const error2 = new ValidationError();
      const error3 = new ValidationError();

      // 1st error with 2 validations failed
      error1.value = '';
      error1.property = 'name';
      error1.constraints = {
        length: 'Content.INVALID_LENGTH.text',
        isStringValid: 'Content.INVALID_STRING.text',
      };
      errors.push(error1);

      // 2nd error with 1 failed children
      error2.value = '1';
      error2.property = 'type';
      //child error
      error3.value = '';
      error3.property = 'key';
      error3.constraints = {
        length: 'Content.INVALID_LENGTH.text',
      };
      error2.children = [error3];
      errors.push(error2);

      const response = [
        {
          message: 'Content.INVALID_LENGTH.text',
          target: 'type.key',
          value: '',
        },
        {
          message: 'Content.INVALID_LENGTH.text.Content.INVALID_STRING.text',
          target: 'name',
          value: '',
        },
      ];
      expect(
        await exceptionFilter.getCustomValidationErrors(errors),
      ).toStrictEqual(response);
    });

    it('getCustomValidationErrors should format the validation errors for multi level children', async () => {
      const errors: ValidationError[] = [];
      const error1 = new ValidationError();
      const error2 = new ValidationError();
      const error3 = new ValidationError();

      error1.value = '';
      error1.property = 'name';
      error2.value = '1';
      error2.property = 'type';
      //child error
      error3.value = '';
      error3.property = 'key';
      error3.constraints = {
        length: 'Content.INVALID_LENGTH.text',
      };
      error2.children = [error3];
      error1.children = [error2];
      errors.push(error1);

      const response = [
        {
          message: 'Content.INVALID_LENGTH.text',
          target: 'name.type.key',
          value: '',
        },
      ];
      expect(
        await exceptionFilter.getCustomValidationErrors(errors),
      ).toStrictEqual(response);
    });

    it('getStatus function - return 500 by default when nothing is set', async () => {
      const status = await exceptionFilter.getStatus({});
      expect(status).toEqual(500);
    });
  });

  it('Should extract key for Unique Key Constraint error', () => {
    const sErrorMsg = ` QueryFailedError: unique constraint violated: Table(service_form), Index(IDX_c939ceb0a47080eadc599f4e4f) with error: unique constraint violation for table EXFS_DB_EXPLORER:service_form$delta_1$en, constraint='caseId', key value='****', pos=0; indexname=IDX_c939ceb0a47080eadc599f4e4f`;
    const sExpectedMsg = `Record with the given caseId already exists`;
    const sResult = exceptionFilter.extractConstraintKey(sErrorMsg);
    expect(sResult).toBe(sExpectedMsg);
  });
});
