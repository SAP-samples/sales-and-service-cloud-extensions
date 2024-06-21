package com.sap.extensionmodules.service;

import static org.mockito.Mockito.*;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.pdf.PdfWriter;
import com.sap.cloud.sdk.cloudplatform.connectivity.DefaultHttpDestination;
import com.sap.cnsmodules.document.model.DocumentPostResponseValue;
import com.sap.cnsmodules.model.CasePatchResponse;
import com.sap.cnsmodules.model.CaseReadResponse;
import com.sap.cnsmodules.model.CaseReadResponseValue;
import com.sap.cnsmodules.model.CaseReadResponseValueAdminData;
import com.sap.extensionmodules.dtos.*;
import com.sap.extensionmodules.security.RequestContext;
import com.sap.extensionmodules.security.RequestContextProvider;
import com.sap.extensionmodules.mappers.VehicleServiceMapper;
import com.sap.cnsmodules.document.api.DocumentApi;
import com.sap.cnsmodules.document.model.DocumentCreateRequest;
import com.sap.cnsmodules.document.model.DocumentPostResponse;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.ProtocolVersion;
import org.apache.http.StatusLine;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.junit.jupiter.api.*;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.core.env.Environment;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.rmi.ServerException;
import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@Slf4j
@RunWith(MockitoJUnitRunner.class)
class InvoiceServiceTest {
    @Mock
    CloseableHttpClient httpClient;
    @Mock
    private HttpPut mockHttpPut;

    @Mock
    private CloseableHttpResponse mockResponse;

    @Mock
    private CaseService caseService;
    @Mock
    VehicleServiceMapper mapper;

    @Mock
    Environment env;

    @Mock DocumentApi documentApi;

    @Mock
    RequestContextProvider requestContextProvider;

    @InjectMocks
    InvoiceService invoiceService;

    InvoiceService invoiceServiceSpy;


    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        invoiceServiceSpy = Mockito.spy(invoiceService);
        //httpClient = HttpClients.createDefault();
    }

    HttpPut createHttpPut(String url) {
        return new HttpPut(url);
    }

    @Test
    void testCreateInvoice() throws DocumentException, IOException {
        when(env.getProperty("sscDestination")).thenReturn("vlab");
        ByteArrayInputStream brr = new ByteArrayInputStream("Sample content".getBytes());
        when(invoiceServiceSpy.generateInvoice(createMockJobCardDto())).thenReturn(brr);
        DocumentCreateRequest req = Mockito.mock(DocumentCreateRequest.class);
        DocumentPostResponse res = new DocumentPostResponse();
        DocumentPostResponseValue val = new DocumentPostResponseValue();
        val.setUploadUrl("Sample.url");
        res.setValue(val);
        doReturn(res).when(invoiceServiceSpy).createDocument(any(DocumentCreateRequest.class));
        doReturn(200).when(invoiceServiceSpy).uploadDocument(any(ByteArrayInputStream.class),any(String.class));
        doReturn(new CasePatchResponse()).when(invoiceServiceSpy).updateCaseWithInvoice(any(String.class),any(DocumentPostResponse.class));
        invoiceServiceSpy.createInvoice(createMockJobCardDto());
        verify(invoiceServiceSpy, times(1)).updateCaseWithInvoice(any(String.class),any(DocumentPostResponse.class));
    }
    @Test
    void testGenerateInvoice() throws IOException, DocumentException {
        // Create mock data
        JobCardDto jobCardDto = createMockJobCardDto();

        // Test invoice generation
        ByteArrayInputStream inputStream = invoiceService.generateInvoice(jobCardDto);

        assertNotNull(inputStream);
    }
    @Test
    void testGenerateInvoice_DocumentException(){
        // Create mock data
        JobCardDto jobCardDto = createMockJobCardDto();
        try (MockedStatic mocked = mockStatic(PdfWriter.class)) {
            mocked.when(() ->PdfWriter.getInstance(any(),any())).thenThrow(DocumentException.class);
            ByteArrayInputStream inputStream = invoiceService.generateInvoice(jobCardDto);
        } catch (Exception e) {
            assertEquals(e.getClass(), RuntimeException.class);
        }

    }



    @Test
    void testUploadDocument() throws IOException {

        CloseableHttpClient client = Mockito.mock(CloseableHttpClient.class);
        try (MockedStatic<HttpClients> utilities = Mockito.mockStatic(HttpClients.class)) {
            utilities.when(() -> HttpClients.createDefault())
                    .thenReturn(client);
            Mockito.when(client.execute(Mockito.any(HttpPut.class))).thenReturn(mockResponse);
            when(mockResponse.getStatusLine()).thenReturn(createMockStatusLine(200));

            log.info("calling uploadDocument");
            int statusCode = invoiceService.uploadDocument(new ByteArrayInputStream("Sample content".getBytes()), "your_dynamic_url");

            assertEquals(200, statusCode);

        }

    }

    @Test
    void testUploadDocument_testIOException() throws IOException {
        InvoiceServiceTest testInstance = spy(new InvoiceServiceTest());
        doReturn(mockHttpPut).when(testInstance).createHttpPut(eq("your_dynamic_url"));
        //mockResponse.setStatusLine(createMockStatusLine(200));

        Mockito.when(httpClient.execute(Mockito.any())).thenThrow(new IOException());
        when(mockResponse.getStatusLine()).thenReturn(createMockStatusLine(200));

        log.info("calling uploadDocument");
        assertThrows(RuntimeException.class, () -> invoiceService.uploadDocument(new ByteArrayInputStream("Sample content".getBytes()), "your_dynamic_url"));
    }
    @Test
    void testUpdateCaseWithInvoice() throws ServerException, JsonProcessingException {

        DocumentPostResponse res = new DocumentPostResponse();
        DocumentPostResponseValue val = new DocumentPostResponseValue();
        val.setUploadUrl("Sample.url");
        val.setId(UUID.randomUUID());
        res.setValue(val);
        String uuid = UUID.randomUUID().toString();
        CaseReadResponse caseRes = new CaseReadResponse();
        CaseReadResponseValue caseVal = new CaseReadResponseValue();
        CaseReadResponseValueAdminData adminData = new CaseReadResponseValueAdminData();
        adminData.setUpdatedOn(OffsetDateTime.now().toString());
        caseVal.setAdminData(adminData);
        caseRes.setValue(caseVal);
        when(caseService.getCaseById(UUID.fromString(uuid))).thenReturn(caseRes);
        //when(mapper.CaseResponseValueToCasePatchUpdate()).
        CasePatchResponse patchRes = invoiceService.updateCaseWithInvoice(uuid, res);
        //verify(caseService)
    }

    @Test
    void testCreateDocument(){
        String dummyToken = "abcd";
        DefaultHttpDestination destination = Mockito.mock(DefaultHttpDestination.class);
        RequestContext requestContext = RequestContext.builder()
                .authToken(dummyToken)
                .destination(destination).build();
        Mockito.when(requestContextProvider.getRequestContext())
                .thenReturn(requestContext);

        doReturn(documentApi).when(invoiceServiceSpy).fetchDocumentApi();
        when(documentApi.createdocumentservicedocument(dummyToken, null)).thenReturn(createMockDocumentPostResponse());
        DocumentPostResponse res = invoiceServiceSpy.createDocument(any(DocumentCreateRequest.class));
        assertNotNull(res);
    }

    private JobCardDto createMockJobCardDto() {
        RegisteredProduct registeredProduct = new RegisteredProduct();
        registeredProduct.setVehicleNumber("KA12345L");
        registeredProduct.setDateOfPurchase("2023-06-28T00:00:00Z");
        registeredProduct.setModel("TATA Nexon");

        CustomerDetails customerDetails = new CustomerDetails();
        customerDetails.setName("Andrew Jonas");

        JobCardServicesDto service = new JobCardServicesDto();
        service.setId("4c7287fd-7a18-49b8-a441-03ee81800da6");
        service.setService("Brake pad replacement");
        service.setPrice("3450");
        service.setStatus("Z21");
        service.setTechnician(new TechnicianDto("", "sandra"));
        service.setAdminData(new AdminData("2023-08-03 07:12:51.769000000","2023-08-03 07:12:51.769000000","",""));


        return JobCardDto.builder()
                .id(UUID.randomUUID().toString())
                .displayId(1)
                .caseId(UUID.randomUUID().toString())
                .caseDisplayId("3213")
                .status("Z11")
                .statusDescription("Reservado")
                .registeredProduct(registeredProduct)
                .customerComplaints(null)
                .milometer(5000)
                .serviceAdvisor("Pavithra N")
                .customerDetails(customerDetails)
                .customerComplaints(Arrays.asList("brake failed"))
                .estimatedCompletionDate(null)
                .adminData(AdminData.builder()
                        .createdOn("2022-05-10T11:55:47.397Z")
                        .updatedOn("2023-04-10T11:55:47.397Z")
                        .createdBy("34042340-3a8b-42b3-b983-5db33caa331d")
                        .updatedBy("34042340-3a8b-42b3-b983-5db33caa331d")
                        .build())
                .servicesSelected(Collections.singletonList(service))
                .build();
    }

    private DocumentPostResponse createMockDocumentPostResponse() {
        DocumentPostResponse response = new DocumentPostResponse();
        DocumentPostResponseValue info = new DocumentPostResponseValue();
        info.setId(UUID.randomUUID());
        response.setValue(info);
        return response;
    }

    private StatusLine createMockStatusLine(int statusCode) {
        return new StatusLine() {
            @Override
            public ProtocolVersion getProtocolVersion() {
                return null;
            }

            @Override
            public int getStatusCode() {
                return statusCode;
            }

            @Override
            public String getReasonPhrase() {
                return null;
            }
        };
    }


}
