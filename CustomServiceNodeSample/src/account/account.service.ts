import { Injectable, Logger, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Account } from '../interface/Account.interface';
import { SESSION } from '../common/constants/constants';
import { AccountApi } from './open-api/client/SalesSvcCloudV2_accountService';

@Injectable({ scope: Scope.REQUEST })
export class AccountService {
  private readonly logger = new Logger(AccountService.name);
  private readonly sscDestination: string;
  
  private userToken: string;
  private requestId: string;
  private userId: string;

  constructor(@Inject(REQUEST) private readonly request: Request) {
    const session = this.request[SESSION];
    
    if (session) {
      this.userToken = session.userToken;
      this.requestId = session.requestId;
      this.userId = session.userId;
      this.sscDestination = session.sscDestination;
    } else {
      this.logger.error('No session found in request - SSC destination cannot be determined');
      throw new Error('Session is required to access SSC Account API');
    }
  }

  async getAccountById(accountId: string): Promise<Account | null> {
    try {
      this.logger.log(`Fetching account with ID: ${accountId}`);
      
      if (!this.userToken) {
        this.logger.warn('No JWT token available for account API call');
        return null;
      }
      
      const responseData = await AccountApi.queryaccountserviceAccount({
        $filter: `id eq '${accountId}'`
      }).execute({
        destinationName: this.sscDestination,
        jwt: this.userToken,
      });

      if (responseData.value && responseData.value.length > 0) {
        const account = responseData.value[0];
        this.logger.log(`Account found: ${account.formattedName}`);
        
        return {
          id: account.id,
          formattedName: account.formattedName,
          displayId: account.displayId,
        };
      }

      this.logger.warn(`Account with ID ${accountId} not found`);
      return null;
    } catch (error) {
      this.logger.error(`Error fetching account ${accountId}: ${error.message}`);
      if (error.response) {
        this.logger.error(`Response status: ${error.response.status}`);
      }
      return null;
    }
  }

  async getAccountByDisplayId(displayId: string): Promise<Account | null> {
    try {
      if (!this.userToken) return null;

      const responseData = await AccountApi.queryaccountserviceAccount({
        $filter: `displayId eq '${displayId}'`
      }).execute({
        destinationName: this.sscDestination,
        jwt: this.userToken,
      });

      if (responseData.value && responseData.value.length > 0) {
        const account = responseData.value[0];
        return {
          id: account.id,
          formattedName: account.formattedName,
          displayId: account.displayId,
        };
      }
      return null;
    } catch (error) {
      this.logger.error(`Error fetching account by displayId ${displayId}: ${error.message}`);
      return null;
    }
  }

  async searchAccountsByDisplayId(search: string): Promise<Account[]> {
    try {
      if (!this.userToken) return [];

      const responseData = await AccountApi.queryaccountserviceAccount({
        $filter: `displayId eq '${search}'`
      }).execute({
        destinationName: this.sscDestination,
        jwt: this.userToken,
      });

      if (responseData.value) {
        return responseData.value.map(account => ({
          id: account.id,
          formattedName: account.formattedName,
          displayId: account.displayId,
        }));
      }
      return [];
    } catch (error) {
      this.logger.error(`Error searching accounts by displayId ${search}: ${error.message}`);
      return [];
    }
  }

  async getAllAccounts(): Promise<Account[]> {
    try {
      this.logger.log('Fetching all accounts');
      
      if (!this.userToken) {
        this.logger.warn('No JWT token available for account API call');
        return [];
      }
      
      const responseData = await AccountApi.queryaccountserviceAccount({
        $top: 50,
        $skip: 0,
      }).execute({
        destinationName: this.sscDestination,
        jwt: this.userToken,
      });

      if (responseData.value) {
        this.logger.log(`Found ${responseData.value.length} accounts`);
        return responseData.value.map(account => ({
          id: account.id,
          formattedName: account.formattedName,
          displayId: account.displayId,
        }));
      }

      return [];
    } catch (error) {
      this.logger.error(`Error fetching accounts: ${error.message}`);
      return [];
    }
  }
}
