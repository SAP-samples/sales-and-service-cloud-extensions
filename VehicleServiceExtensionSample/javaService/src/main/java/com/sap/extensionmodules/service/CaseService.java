package com.sap.extensionmodules.service;

import com.sap.cloud.sdk.cloudplatform.connectivity.*;
import com.sap.cloud.sdk.services.openapi.core.OpenApiRequestException;
import com.sap.cnsmodules.api.CaseApi;
import com.sap.cnsmodules.model.CasePatchResponse;
import com.sap.cnsmodules.model.CasePatchUpdateRequest;
import com.sap.cnsmodules.model.CaseReadResponse;
import com.sap.extensionmodules.security.RequestContextProvider;
import org.springframework.beans.factory.annotation.Autowired;
import com.sap.extensionmodules.dtos.CaseServiceDto;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.rmi.ServerException;
import java.time.OffsetDateTime;
import java.util.UUID;

@Service
public class CaseService {
    private DefaultHttpDestination destination;

    @Autowired
    RequestContextProvider requestContextProvider;

    public CaseApi fetchCaseApi(){
        destination = requestContextProvider.getRequestContext().getDestination();
        CaseApi service = new CaseApi(destination);
        return service;
    }
    public CaseReadResponse getCaseById(UUID caseId){

        CaseApi caseApi = fetchCaseApi();
        try {
            String authToken = requestContextProvider.getRequestContext().getAuthToken();
            final CaseReadResponse result = caseApi.readcaseservicecase(authToken, caseId);
            return result;
        } catch (OpenApiRequestException e) {
            e.printStackTrace();
            throw new OpenApiRequestException("Cannot read Case Data");
        }
    }

    public CasePatchResponse updateCase(OffsetDateTime ifMatch, UUID caseID, CasePatchUpdateRequest req) {
        CaseApi caseApi = fetchCaseApi();
        try {
            String authToken = requestContextProvider.getRequestContext().getAuthToken();
            return caseApi.modifycaseservicecase(authToken,ifMatch,caseID,req);
        } catch (OpenApiRequestException e) {
            e.printStackTrace();
            throw new OpenApiRequestException("Cannot update Case Data");
        }
    }

    public CaseServiceDto getCaseData(CaseReadResponse caseReadResponse)
    {
        JSONObject caseReadResponseValue = new JSONObject(caseReadResponse.getValue());
        CaseServiceDto caseServiceDto = new CaseServiceDto();
        caseServiceDto.setProcessor(caseReadResponse.getValue().getProcessor().getName());
        caseServiceDto.setEstimatedCompletionDate(caseReadResponse.getValue().getTimePoints().getResolutionDueOn());
        caseServiceDto.setCaseDisplayId(caseReadResponse.getValue().getDisplayId());
        if (caseReadResponseValue.has("individualCustomer")) {
            caseServiceDto.setCustomerName(caseReadResponse.getValue().getIndividualCustomer().getName());
        } else if (caseReadResponseValue.has("account")){
            caseServiceDto.setCustomerName(caseReadResponse.getValue().getAccount().getName());
        }
        if(caseReadResponseValue.has("contact")){
            caseServiceDto.setContactNumber(caseReadResponse.getValue().getContact().getPhoneNumber());
        }
        return caseServiceDto;
    }
}
