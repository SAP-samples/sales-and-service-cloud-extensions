import { UnauthorizedException } from '@nestjs/common';
import { SESSION } from '../constants';
import { SessionMiddleware } from './session.middleware';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomLogger } from '../../logger/logger.service';
import { ConfigService } from '@nestjs/config';

describe('SessionMiddleware', () => {
  let sessionMiddleware: SessionMiddleware;
  const next = jest.fn();
  const mockCustomLogger = {
    setClassName: jest.fn(),
    log: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  };
  const mockConfigService = {
    get: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionMiddleware,
        { provide: CustomLogger, useValue: mockCustomLogger },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();
    sessionMiddleware = module.get<SessionMiddleware>(SessionMiddleware);
  });

  it('should be defined', () => {
    expect(sessionMiddleware).toBeDefined();
  });

  it('should set hardcoded session data for LOCALHOST when jwt token is not passed and not port forwarded', () => {
    const req = {
      hostname: 'LOCALHOST',
      headers: {
        'accept-language': 'es',
        Authorization:
          'Bearer ****',
      },
    };
    sessionMiddleware.use(req as any, {} as any, next);
    expect(req[SESSION].language).toEqual(req.headers['accept-language']);
  });

  it('should handle when there is no authorization header', () => {
    try {
      const req = {
        hostname: 'LOCALHOST',
        headers: {
          'accept-language': 'es',
        },
      };
      sessionMiddleware.use(req as any, {} as any, next);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }
  });

  it('should throw unauthorized error when no scopes defined for the user', () => {
    try {
      const req = {
        hostname: 'LOCALHOST',
        headers: {
          'accept-language': 'es',
          Authorization:
            'Bearer ****',
        },
      };
      sessionMiddleware.use(req as any, {} as any, next);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }
  });

  it('Should handle external hooks requests', () => {
    const req = {
      hostname: 'LOCALHOST',
      headers: {
        'accept-language': 'es',
        Authorization:
          'Bearer ****',
      },
    };
    sessionMiddleware.use(req as any, {} as any, next);
  });
});
