/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-cloud-sdk/openapi';
import type {
  Employeequeryresponse,
  Employeecreaterequest,
  Employeefile,
  Employeepatchupdaterequest
} from './schema';
/**
 * Representation of the 'EmployeeApi'.
 * This API is part of the 'SalesSvcCloudV2_employeeService' service.
 */
export const EmployeeApi = {
  _defaultBasePath: undefined,
  /**
   * Specify query parameters to return desired employee records from the system.
   * @param queryParameters - Object containing the following keys: $skip, $top, $search, $filter, $orderby, $select, $exclude, $count.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  queryemployeeserviceEmployee: (queryParameters?: {
    $skip?: number;
    $top?: number;
    $search?: string;
    $filter?: string;
    $orderby?: string;
    $select?: string;
    $exclude?: string;
    $count?: boolean;
  }) =>
    new OpenApiRequestBuilder<Employeequeryresponse>(
      'get',
      '/sap/c4c/api/v1/employee-service/employees',
      {
        queryParameters
      },
      EmployeeApi._defaultBasePath
    ),
  /**
   * Send employee information to the system to create a new employee.
   * @param body - Request body.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  createemployeeserviceEmployee: (body: Employeecreaterequest | undefined) =>
    new OpenApiRequestBuilder<Employeefile>(
      'post',
      '/sap/c4c/api/v1/employee-service/employees',
      {
        body
      },
      EmployeeApi._defaultBasePath
    ),
  /**
   * Read a specific employee using the employee ID.
   * @param id - Employee ID
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  reademployeeserviceEmployee: (id: string) =>
    new OpenApiRequestBuilder<Employeefile>(
      'get',
      '/sap/c4c/api/v1/employee-service/employees/{id}',
      {
        pathParameters: { id }
      },
      EmployeeApi._defaultBasePath
    ),
  /**
   * Update employee attributes in the system.
   * @param id - Employee ID
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: If-Match.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  partialupdateemployeeserviceEmployee: (
    id: string,
    body: Employeepatchupdaterequest | undefined,
    headerParameters: { 'If-Match': string }
  ) =>
    new OpenApiRequestBuilder<any>(
      'patch',
      '/sap/c4c/api/v1/employee-service/employees/{id}',
      {
        pathParameters: { id },
        body,
        headerParameters
      },
      EmployeeApi._defaultBasePath
    )
};
