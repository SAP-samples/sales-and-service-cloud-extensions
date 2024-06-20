

package com.sap.cnsmodules.accounts.api;

import com.sap.cloud.sdk.services.openapi.core.OpenApiRequestException;
import com.sap.cloud.sdk.services.openapi.core.OpenApiResponse;
import com.sap.cloud.sdk.services.openapi.core.AbstractOpenApiService;
import com.sap.cloud.sdk.services.openapi.apiclient.ApiClient;

import com.sap.cnsmodules.accounts.model.AccountReadResponse ; //NOPMD
import com.sap.cnsmodules.accounts.model.GetAccountDetails500Response ; //NOPMD
import java.util.UUID ; //NOPMD

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import com.google.common.annotations.Beta;

import com.sap.cloud.sdk.cloudplatform.connectivity.HttpDestinationProperties;

/**
* Account Service in version 1.0.0.
*
* No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
*/

public class AccountApi extends AbstractOpenApiService {
    /**
    * Instantiates this API class to invoke operations on the Account Service.
    *
    * @param httpDestination The destination that API should be used with
    */
    public AccountApi( @Nonnull final HttpDestinationProperties httpDestination )
    {
        super(httpDestination);
    }

    /**
    * Instantiates this API class to invoke operations on the Account Service based on a given {@link ApiClient}.
    *
    * @param apiClient
    *            ApiClient to invoke the API on
    */
    @Beta
    public AccountApi( @Nonnull final ApiClient apiClient )
    {
         super(apiClient);
    }

        /**
    * <p>Read a specific data</p>
     *<p>Query the system for a specific Account using the account ID.</p>
     * <p><b>200</b> - Retrieved Account.
     * <p><b>401</b> - Unauthorized.  This error is caused when the request has not been applied because there are no valid authentication credentials for the target resource.
     * <p><b>403</b> - Forbidden  This client error code indicates that the server understood the request but refuses to authorize it.
     * <p><b>404</b> - Account not found.
     * <p><b>500</b> - Internal Server Error.  Failed to read the Account.
* @param xSapCrmToken
            The value for the parameter xSapCrmToken
* @param id
        Account ID
* @return AccountReadResponse
* @throws OpenApiRequestException if an error occurs while attempting to invoke the API
     */
    @Nullable   public AccountReadResponse getAccountDetails( @Nonnull final String xSapCrmToken,  @Nonnull final UUID id) throws OpenApiRequestException {
        final Object localVarPostBody = null;
        
        // verify the required parameter 'xSapCrmToken' is set
        if (xSapCrmToken == null) {
            throw new OpenApiRequestException("Missing the required parameter 'xSapCrmToken' when calling getAccountDetails");
        }
        
        // verify the required parameter 'id' is set
        if (id == null) {
            throw new OpenApiRequestException("Missing the required parameter 'id' when calling getAccountDetails");
        }
        
        // create path and map variables
        final Map<String, Object> localVarPathParams = new HashMap<String, Object>();
        localVarPathParams.put("id", id);
        final String localVarPath = UriComponentsBuilder.fromPath("/sap/c4c/api/v1/account-service/accounts/{id}").buildAndExpand(localVarPathParams).toUriString();

        final MultiValueMap<String, String> localVarQueryParams = new LinkedMultiValueMap<String, String>();
        final HttpHeaders localVarHeaderParams = new HttpHeaders();
        final MultiValueMap<String, Object> localVarFormParams = new LinkedMultiValueMap<String, Object>();

        if (xSapCrmToken != null)
        localVarHeaderParams.add("x-sap-crm-token", apiClient.parameterToString(xSapCrmToken));

        final String[] localVarAccepts = { 
            "application/json"
        };
        final List<MediaType> localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        final String[] localVarContentTypes = { };
        final MediaType localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

        final String[] localVarAuthNames = new String[] { "basicAuthentication" };

        final ParameterizedTypeReference<AccountReadResponse> localVarReturnType = new ParameterizedTypeReference<AccountReadResponse>() {};
        return apiClient.invokeAPI(localVarPath, HttpMethod.GET, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localVarReturnType);
    }
}
