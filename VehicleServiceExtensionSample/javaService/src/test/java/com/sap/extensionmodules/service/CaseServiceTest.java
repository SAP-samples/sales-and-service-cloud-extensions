package com.sap.extensionmodules.service;

import static org.mockito.Mockito.*;

import com.sap.cloud.sdk.cloudplatform.connectivity.DefaultHttpDestination;
import com.sap.cloud.sdk.services.openapi.core.OpenApiRequestException;
import com.sap.cloud.sdk.testutil.MockUtil;
import com.sap.cnsmodules.api.CaseApi;
import com.sap.cnsmodules.model.*;
import com.sap.extensionmodules.dtos.CaseServiceDto;
import com.sap.extensionmodules.security.RequestContext;
import com.sap.extensionmodules.security.RequestContextProvider;
import org.junit.Rule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.mockito.junit.MockitoJUnit;
import org.mockito.junit.MockitoJUnitRunner;
import org.mockito.junit.MockitoRule;
import org.mockito.junit.jupiter.MockitoExtension;

import java.rmi.ServerException;
import java.time.OffsetDateTime;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;


@RunWith(MockitoJUnitRunner.class)
@ExtendWith(MockitoExtension.class)
class CaseServiceTest {

    @Mock
    private CaseApi caseApi;

    @Rule
    public MockitoRule rule = MockitoJUnit.rule();

    private MockUtil mockUtil = new MockUtil();
    @Mock
    RequestContextProvider requestContextProvider;

    @InjectMocks
    private com.sap.extensionmodules.service.CaseService caseService;



    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

    }

    @Test
    @DisplayName("GetCaseById")
    public void testGetCaseById() throws Exception {
        String dummyToken = "abcd";
        DefaultHttpDestination destination = Mockito.mock(DefaultHttpDestination.class);
        RequestContext requestContext = RequestContext.builder()
                .authToken(dummyToken)
                .destination(destination).build();
        Mockito.when(requestContextProvider.getRequestContext())
                .thenReturn(requestContext);
        UUID caseId = UUID.randomUUID();
        CaseReadResponse readResponse = new CaseReadResponse();
        readResponse.setValue(new CaseReadResponseValue());

        com.sap.extensionmodules.service.CaseService serviceSpy = Mockito.spy(caseService);
        Mockito.doReturn(caseApi).when(serviceSpy).fetchCaseApi();

        when(caseApi.readcaseservicecase("abcd", caseId)).thenReturn(readResponse);

        CaseReadResponse result = serviceSpy.getCaseById(caseId);

        assertNotNull(result);
        assertNotNull(result.getValue());
        // Add more assertions as needed
    }

    @Test
    @DisplayName("GetCaseById: able to handle error")
    public void testGetCaseById_HandleError() throws Exception {
        String dummyToken = "abcd";
        DefaultHttpDestination destination = Mockito.mock(DefaultHttpDestination.class);
        RequestContext requestContext = RequestContext.builder()
                .authToken(dummyToken)
                .destination(destination).build();
        Mockito.when(requestContextProvider.getRequestContext())
                .thenReturn(requestContext);
        UUID caseId = UUID.randomUUID();
        //when(env.getProperty("destination1")).thenReturn("vlab");
        com.sap.extensionmodules.service.CaseService serviceSpy = Mockito.spy(caseService);
        Mockito.doReturn(caseApi).when(serviceSpy).fetchCaseApi();

        when(caseApi.readcaseservicecase("abcd", caseId)).thenThrow(OpenApiRequestException.class);

        assertThrows(OpenApiRequestException.class, () -> serviceSpy.getCaseById(caseId));
    }
//
    @Test
    @DisplayName("UpdateCase")
    public void testUpdateCase() throws ServerException {
        String dummyToken = "abcd";
        DefaultHttpDestination destination = Mockito.mock(DefaultHttpDestination.class);
        RequestContext requestContext = RequestContext.builder()
                .authToken(dummyToken)
                .destination(destination).build();
        Mockito.when(requestContextProvider.getRequestContext())
                .thenReturn(requestContext);
        OffsetDateTime ifmatch = OffsetDateTime.now();
        UUID caseID = UUID.randomUUID();
        CasePatchUpdateRequest req = new CasePatchUpdateRequest();
        CasePatchResponse patchResponse = new CasePatchResponse();
        com.sap.extensionmodules.service.CaseService serviceSpy = Mockito.spy(caseService);
        Mockito.doReturn(caseApi).when(serviceSpy).fetchCaseApi();
        when(caseApi.modifycaseservicecase("abcd", ifmatch, caseID, req)).thenReturn(patchResponse);

        CasePatchResponse result = serviceSpy.updateCase(ifmatch, caseID, req);

        assertNotNull(result);
    }

    @Test
    @DisplayName("UpdateCase: testing serverException")
    public void testUpdateCase_HandleError() throws ServerException {
        String dummyToken = "abcd";
        DefaultHttpDestination destination = Mockito.mock(DefaultHttpDestination.class);
        RequestContext requestContext = RequestContext.builder()
                .authToken(dummyToken)
                .destination(destination).build();
        Mockito.when(requestContextProvider.getRequestContext())
                .thenReturn(requestContext);
        OffsetDateTime ifmatch = OffsetDateTime.now();
        UUID caseID = UUID.randomUUID();
        CasePatchUpdateRequest req = new CasePatchUpdateRequest();
        com.sap.extensionmodules.service.CaseService serviceSpy = Mockito.spy(caseService);
        Mockito.doReturn(caseApi).when(serviceSpy).fetchCaseApi();

        when(caseApi.modifycaseservicecase("abcd", ifmatch, caseID, req)).thenThrow(OpenApiRequestException.class);

        assertThrows(OpenApiRequestException.class, () -> serviceSpy.updateCase(ifmatch, caseID, req));
    }
    @Test
    void testGetCaseData_WhenIndividualCustomer() {

        CaseReadResponse caseReadResponse = new CaseReadResponse();
        caseReadResponse.setValue(Mockito.mock(CaseReadResponseValue.class));
        CaseReadResponseValue value = new CaseReadResponseValue();
        CaseQueryResponseValueInnerIndividualCustomer individualCustomer = new CaseQueryResponseValueInnerIndividualCustomer();
        individualCustomer.setName("John Doe");
        CaseQueryResponseValueInnerIndividualCustomer processor = new  CaseQueryResponseValueInnerIndividualCustomer();
        processor.setName("Test");
        CaseQueryResponseValueInnerContact contact = new CaseQueryResponseValueInnerContact();
        contact.setPhoneNumber("1234567890");
        CaseReadResponseValueTimePoints timePoints = new CaseReadResponseValueTimePoints();
        timePoints.setResolutionDueOn("");
        value.setProcessor(processor);
        value.setTimePoints(timePoints);
        value.setDisplayId("1");
        value.setIndividualCustomer(individualCustomer);
        value.setContact(contact);
        caseReadResponse.setValue(value);

        CaseServiceDto result = caseService.getCaseData(caseReadResponse);

        assertNotNull(result);
    }

    @Test
    void testGetCaseData_WhenAccount() {

        CaseReadResponse caseReadResponse = new CaseReadResponse();
        caseReadResponse.setValue(Mockito.mock(CaseReadResponseValue.class));
        CaseReadResponseValue value = new CaseReadResponseValue();
        CaseQueryResponseValueInnerAccount account = new CaseQueryResponseValueInnerAccount();
        account.setName("Jane doe");
        CaseQueryResponseValueInnerIndividualCustomer processor = new  CaseQueryResponseValueInnerIndividualCustomer();
        processor.setName("Test");
        CaseQueryResponseValueInnerContact contact = new CaseQueryResponseValueInnerContact();
        contact.setPhoneNumber("1234567890");
        CaseReadResponseValueTimePoints timePoints = new CaseReadResponseValueTimePoints();
        timePoints.setResolutionDueOn("");
        value.setProcessor(processor);
        value.setTimePoints(timePoints);
        value.setDisplayId("1");
        value.setAccount(account);
        value.setContact(contact);
        caseReadResponse.setValue(value);

        CaseServiceDto result = caseService.getCaseData(caseReadResponse);

        assertNotNull(result);
    }


}
