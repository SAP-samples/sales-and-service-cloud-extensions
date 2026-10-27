import { OpenApiRequestBuilder } from '@sap-cloud-sdk/openapi';

/**
 * Account API for querying accounts from SAP Sales and Service Cloud V2
 */
export const AccountApi = {
  /**
   * Query accounts with filters
   */
  queryaccountserviceAccount: (queryParameters?: {
    $top?: number;
    $skip?: number;
    $filter?: string;
  }) =>
    new OpenApiRequestBuilder<any>(
      'get',
      '/sap/c4c/api/v1/account-service/accounts',
      {
        queryParameters,
      },
    ),

  /**
   * Get account by ID
   */
  getAccountDetails: (id: string) =>
    new OpenApiRequestBuilder<any>(
      'get',
      '/sap/c4c/api/v1/account-service/accounts/{id}',
      {
        pathParameters: { id },
      },
    ),
};
