package com.sap.extensionmodules.security;

import com.sap.extensionmodules.commons.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.HandlerInterceptor;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.sap.cloud.security.token.Token;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class SessionInterceptor implements HandlerInterceptor {
    @Autowired RequestContextProvider requestContextProvider;

    @Value("${case_status_booked}")
    private String caseStatusBooked;
    @Value("${case_status_closed}")
    private String caseStatusClosed;
    @Value("${case_status_completed}")
    private String caseStatusCompleted;
    @Value("${case_status_service_completed}")
    private String caseStatusServiceCompleted;
    @Value("${case_status_service_in_process}")
    private String caseStatusServiceInProcess;
    @Value("${extension_field_jobcard_id}")
    private String extensionFieldJobCardId;
    @Value("${extension_field_milometer}")
    private String extensionFieldMilometer;
    @Value("${extension_field_vehicle_number}")
    private String extensionFieldVehicleNumber;
    @Value("${extension_field_service_form_id}")
    private String extensionFieldServiceFormId;
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String authToken = request.getHeader("Authorization");
        if(authToken==null){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        Token token = Token.create(authToken);// This code snippet decodes a given JSON Web Token (JWT) and extracts its JSON header and payload
        String value = token.getTokenValue();

        //Fetching case statuses from environment variables
        Constants.CaseStatus.BOOKED = caseStatusBooked;
        Constants.CaseStatus.CLOSED = caseStatusClosed;
        Constants.CaseStatus.COMPLETED = caseStatusCompleted;
        Constants.CaseStatus.SERVICE_COMPLETED = caseStatusServiceCompleted;
        Constants.CaseStatus.SERVICE_IN_PROCESS = caseStatusServiceInProcess;

        //Fetching extension fields from environment variables
        Constants.ExtensionFields.JOBCARD_ID = extensionFieldJobCardId;
        Constants.ExtensionFields.MILOMETER = extensionFieldMilometer;
        Constants.ExtensionFields.VEHICLE_NUMBER = extensionFieldVehicleNumber;
        Constants.ExtensionFields.SERVICE_FORM_ID = extensionFieldServiceFormId;
        String userName = String.join(" ", token.getClaimAsString("given_name"), token.getClaimAsString("family_name"));
        RequestContext requestContext = RequestContext.builder()
                .language(request.getHeader("accept-language")!=null ? request.getHeader("accept-language") : "en-US")
                .userId(token.getClaimAsString("user_id"))
                .userToken(value)
                .roles(fetchPrivileges(token.getClaimAsStringList("scope")))
                .scopes(token.getClaimAsStringList("scope"))
                .userName(userName).build();

        requestContextProvider.setRequestContext(requestContext);
        return true;
    }

    public List<String> fetchPrivileges(List<String> roles){

        List<String> privileges = roles.stream().map(s-> {
            if(s.contains(".")) {
                return s.split("[.]")[1];
            } else
                return s;
        }).collect(Collectors.toList());
        return privileges;
    }
}
