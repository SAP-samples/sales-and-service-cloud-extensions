package com.sap.extensionmodules.service;

import com.sap.cloud.sdk.cloudplatform.connectivity.HttpDestination;
import com.sap.cloud.sdk.services.openapi.core.OpenApiRequestException;
import com.sap.cnsmodules.api.RegisteredProductApi;
import com.sap.cnsmodules.model.RegisteredProductfile;
import com.sap.extensionmodules.security.RequestContextProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.rmi.ServerException;
import java.util.UUID;

@Service
public class RegisteredProductsService {
    @Autowired
    Environment env;

    @Autowired
    RequestContextProvider requestContextProvider;

    public RegisteredProductfile readRegisteredProductById(UUID caseId) {
        final HttpDestination destination = requestContextProvider.getRequestContext().getDestination();
        RegisteredProductApi service = new RegisteredProductApi(destination);
        String authToken = requestContextProvider.getRequestContext().getAuthToken();
        try{
            RegisteredProductfile result = service.readregisteredproductservice(authToken, caseId);
            return result;
        }
        catch(OpenApiRequestException e){
            e.printStackTrace();
            throw new OpenApiRequestException("Cannot read Registered Product", e);
        }
    }
}
