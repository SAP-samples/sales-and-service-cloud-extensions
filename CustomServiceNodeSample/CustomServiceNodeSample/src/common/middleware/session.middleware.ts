import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { retrieveJwt, decodeJwt } from '@sap-cloud-sdk/connectivity';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { SESSION } from '../constants/constants';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  private readonly logger = new Logger(SessionMiddleware.name);

  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    try {
      let userToken: string = retrieveJwt(req);

      // Development mode: Allow test token from environment variable
      if (!userToken && this.configService.get('NODE_ENV') === 'development') {
        const useTestToken = this.configService.get('USE_TEST_TOKEN') === 'true';
        const testToken = this.configService.get('TEST_JWT_TOKEN');

        if (useTestToken && testToken) {
          userToken = testToken;
          this.logger.warn('Using test JWT token for local development');
        }
      }

      if (!userToken) {
        throw new Error('No JWT token found in Authorization header');
      }

      const decodedToken = decodeJwt(userToken);
      const analyticsSourceId = process.env.SSC_TENANT_SOURCE_ID;
      const analyticsDestination = process.env.SSC_ANALYTICS_DESTINATION;

      req[SESSION] = {
        requestId: uuidv4(),
        userToken,
        userId: decodedToken.user_id || decodedToken.sub,
        tenantId: decodedToken.zid as string,
        analyticsSourceId,
        analyticsDestination,
        sscDestination: this.configService.get('SSC_DESTINATION') || process.env.SSC_DESTINATION,
        language: decodedToken.language || decodedToken.locale || 'en',
      };

      if (!req[SESSION].sscDestination) {
        throw new Error('SSC_DESTINATION environment variable is not configured');
      }

      this.logger.log(`Session created for user: ${req[SESSION].userId}`);
    } catch (error) {
      this.logger.error(`Failed to initialize session: ${error.message}`);

      const isDevelopment = this.configService.get('NODE_ENV') === 'development';

      if (isDevelopment) {
        this.logger.warn('Development mode - creating mock session');
        const sscDestination = this.configService.get('SSC_DESTINATION') || process.env.SSC_DESTINATION;

        if (!sscDestination) {
          this.logger.error('SSC_DESTINATION environment variable is not configured');
          return res.status(500).json({
            error: 'Configuration Error',
            message: 'SSC_DESTINATION environment variable is required',
          });
        }

        const analyticsSourceId = process.env.SSC_TENANT_SOURCE_ID;
        const analyticsDestination = process.env.SSC_ANALYTICS_DESTINATION;

        req[SESSION] = {
          requestId: uuidv4(),
          userToken: null,
          userId: 'dev-user',
          tenantId: process.env.DEV_TENANT_ID || 'dev-tenant',
          analyticsSourceId,
          analyticsDestination,
          sscDestination: sscDestination,
          language: 'en',
        };
      } else {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'No valid JWT token provided',
        });
      }
    }

    next();
  }
}
