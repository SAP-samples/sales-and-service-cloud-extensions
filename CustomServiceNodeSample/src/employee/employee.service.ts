import { Injectable, Logger, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Employee } from '../interface/Employee.interface';
import { SESSION } from '../common/constants/constants';
import { EmployeeApi } from './open-api/client/SalesSvcCloudV2_employeeService';

@Injectable({ scope: Scope.REQUEST })
export class EmployeeService {
  private readonly logger = new Logger(EmployeeService.name);
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
      throw new Error('Session is required to access SSC Employee API');
    }
  }

  async getEmployeeById(employeeId: string): Promise<Employee | null> {
    try {
      this.logger.log(`Fetching employee with ID: ${employeeId}`);
      
      if (!this.userToken) {
        this.logger.warn('No JWT token available for employee API call');
        return null;
      }
      
      const responseData = await EmployeeApi.queryemployeeserviceEmployee({
        $filter: `id eq '${employeeId}'`
      }).execute({
        destinationName: this.sscDestination,
        jwt: this.userToken,
      });

      if (responseData.value && responseData.value.length > 0) {
        const employee = responseData.value[0];
        this.logger.log(`Employee found: ${employee.formattedName}`);
        
        return {
          id: employee.id,
          formattedName: employee.formattedName,
          displayId: employee.displayId || employee.employeeDisplayId,
        };
      }

      this.logger.warn(`Employee with ID ${employeeId} not found`);
      return null;
    } catch (error) {
      this.logger.error(`Error fetching employee ${employeeId}: ${error.message}`);
      if (error.response) {
        this.logger.error(`Response status: ${error.response.status}`);
      }
      return null;
    }
  }

  async getAllEmployees(): Promise<Employee[]> {
    try {
      this.logger.log('Fetching all employees');
      
      if (!this.userToken) {
        this.logger.warn('No JWT token available for employee API call');
        return [];
      }
      
      const responseData = await EmployeeApi.queryemployeeserviceEmployee({
        $top: 50,
        $skip: 0,
      }).execute({
        destinationName: this.sscDestination,
        jwt: this.userToken,
      });

      if (responseData.value) {
        this.logger.log(`Found ${responseData.value.length} employees`);
        return responseData.value.map(employee => ({
          id: employee.id,
          formattedName: employee.formattedName,
          displayId: employee.displayId || employee.employeeDisplayId,
        }));
      }

      return [];
    } catch (error) {
      this.logger.error(`Error fetching employees: ${error.message}`);
      return [];
    }
  }
}
