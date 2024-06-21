package com.sap.extensionmodules.security;

import com.sap.cloud.sdk.cloudplatform.connectivity.DefaultHttpDestination;
import com.sap.extensionmodules.commons.Constants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class RequestContext {
    private String authToken;
    private String userId;
    private String userToken;
    private DefaultHttpDestination destination;
    private String language;
    private Constants.CaseStatus caseStatus;
    private Constants.ExtensionFields extensionFields;
    private List<String> roles;
    private List<String> scopes;
    private String userName;
}