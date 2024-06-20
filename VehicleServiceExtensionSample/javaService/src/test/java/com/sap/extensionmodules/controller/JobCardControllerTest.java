package com.sap.extensionmodules.controller;

import com.sap.cloud.sdk.services.openapi.core.OpenApiRequestException;
import com.sap.extensionmodules.Utils.StatusUtil;
import com.sap.extensionmodules.commons.Constants;
import com.sap.extensionmodules.commons.JCStatus;
import com.sap.extensionmodules.commons.ServiceStatus;
import com.sap.extensionmodules.dtos.*;
import com.sap.extensionmodules.exception.APIExceptionHandler;
import com.sap.extensionmodules.exception.CustomNotFoundException;
import com.sap.extensionmodules.exception.CustomValidationException;
import com.sap.extensionmodules.exception.ErrorResponse;
import com.sap.extensionmodules.service.JobCardService;
import javassist.NotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.rmi.ServerException;
import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

public class JobCardControllerTest {
    @Mock
    private JobCardService jobCardService;
    @InjectMocks
    private JobCardController jobCardController;
    @Mock
    private StatusUtil statusUtil;
    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }
         JobCardServicesDto jobCardServicesDto1 = JobCardServicesDto.builder()
                .id("5d876d79-caf6-421b-8b2c-190cea9a137e")
                .service("Brake pad replacement")
                .price("99.99")
                .technician(null)
                .status(ServiceStatus.Z21.toString())
                .startTime(null)
                .endTime(null)
                .notes(null)
                .observation(null)
                 .adminData(AdminData.builder()
                         .createdOn("2022-05-10T11:55:47.397Z")
                         .updatedOn("2023-04-10T11:55:47.397Z")
                         .createdBy("34042340-3a8b-42b3-b983-5db33caa331d")
                         .updatedBy("34042340-3a8b-42b3-b983-5db33caa331d")
                         .build())
                .build();
        JobCardServicesDto jobCardServicesDto2 = JobCardServicesDto.builder()
                .id("a9cd57cd-f61a-4d7f-9f87-dc031d5b95fb")
                .service("Air filter replacement")
                .price("49.99")
                .status(ServiceStatus.Z21.toString())
                .startTime(null)
                .endTime(null)
                .notes(null)
                .observation(null)
                .adminData(AdminData.builder()
                        .createdOn("2022-05-10T11:55:47.397Z")
                        .updatedOn("2023-04-10T11:55:47.397Z")
                        .createdBy("34042340-3a8b-42b3-b983-5db33caa331d")
                        .updatedBy("34042340-3a8b-42b3-b983-5db33caa331d")
                        .build())
                .build();
    public List<JobCardServicesDto> jobCardServicesDtoList1() {
        List<JobCardServicesDto> jobCardServicesDtoList = new ArrayList<>();
        jobCardServicesDtoList.add(jobCardServicesDto1);
        jobCardServicesDtoList.add(jobCardServicesDto2);
        return jobCardServicesDtoList;
    }
    public List<JobCardServicesDto> jobCardServicesDtoList2() {
        List<JobCardServicesDto> jobCardServicesDtoList = new ArrayList<>();
        jobCardServicesDtoList.add(jobCardServicesDto2);
        return jobCardServicesDtoList;
    }
        JobCardDto jobCardDto1 = JobCardDto.builder()
                .id("16da4bc2-a8cc-4ba6-a7a5-ef69802ce177")
                .displayId(1)
                .caseId("d886b468-ed95-11ed-a6bd-5354a6389ba0")
                .caseDisplayId("536")
                .status(JCStatus.Z13.toString())
                .registeredProduct(RegisteredProduct.builder()
                        .vehicleNumber("KA01MJ5010")
                        .dateOfPurchase("2023-04-14T00:00:00Z")
                        .model("TATA Nexon XMA")
                        .build())
                .customerComplaints(Arrays.asList("abcd", "cdef"))
                .milometer(4863)
                .serviceAdvisor("Sandra Webber")
                .customerDetails(CustomerDetails.builder()
                        .name("Mathew Jonas")
                        .contactNumber("1234567890")
                        .build())
                .estimatedCompletionDate("2023-05-10T11:55:47.397Z")
                .adminData(AdminData.builder()
                        .createdOn("2022-05-10T11:55:47.397Z")
                        .updatedOn("2023-04-10T11:55:47.397Z")
                        .createdBy("34042340-3a8b-42b3-b983-5db33caa331d")
                        .updatedBy("34042340-3a8b-42b3-b983-5db33caa331d")
                        .build())
                .servicesSelected(jobCardServicesDtoList1())
        .build();

    JobCardDto jobCardDto2 = JobCardDto.builder()
            .id("c7e9469a-1b6b-42c6-9580-28ed4a994346")
            .displayId(2)
            .caseId("2bfdd60f-da14-11ed-bf97-bb732c681de4")
            .caseDisplayId("451")
            .status(JCStatus.Z13.toString())
            .registeredProduct(RegisteredProduct.builder()
                    .vehicleNumber("KA01MJ5010")
                    .dateOfPurchase("2023-04-14T00:00:00Z")
                    .model("AHT Combi 110e")
                    .build())
            .customerComplaints(Arrays.asList("PQR", "XYX"))
            .milometer(3400)
            .serviceAdvisor("Sandra Webber")
            .customerDetails(CustomerDetails.builder()
                    .name("Andrew Jonas")
                    .contactNumber("1234567890")
                    .build())
            .estimatedCompletionDate("2023-05-10T11:55:47.397Z")
//            .createdOn("2023-05-08T11:55:47.410Z")
            .adminData(AdminData.builder()
                    .createdOn("2023-05-10T11:55:47.397Z")
                    .updatedOn("2023-04-10T11:55:47.397Z")
                    .createdBy("b4042340-3a8b-42b3-b983-5db33caa331d")
                    .updatedBy("b4042340-3a8b-42b3-b983-5db33caa331d")
                    .build())
            .servicesSelected(jobCardServicesDtoList2())
            .build();
    public List<JobCardDto> jobCardDtoList()
    {
        List<JobCardDto> jobCardDtoList = new ArrayList<>();
        jobCardDtoList.add(jobCardDto1);
        jobCardDtoList.add(jobCardDto2);
        return jobCardDtoList;
    }
    public List<StatusDto> jobCardStatusDtoList()
    {
        List<StatusDto> mockDtoList = new ArrayList<>();
        mockDtoList.add(new StatusDto("Z11", "Booked"));
        mockDtoList.add(new StatusDto("Z12", "In Progress"));
        mockDtoList.add(new StatusDto("Z13", "Completed"));
        return mockDtoList;
    }
    public List<StatusDto> jobCardServiceStatusDtoList()
    {
        List<StatusDto> mockDtoList = new ArrayList<>();
        mockDtoList.add(new StatusDto("Z21", "Booked"));
        mockDtoList.add(new StatusDto("Z22", "In Progress"));
        mockDtoList.add(new StatusDto("Z23", "Completed"));
        return mockDtoList;
    }

    @Test
    @DisplayName("testFindAll")
    public void testFindAll()  {
        Optional<String> filter = Optional.empty();
        when(jobCardService.findAll(filter, null, null, null)).thenReturn(jobCardDtoList());
        //when(StatusUtil.getDescription(any(), anyString())).thenReturn("Test Description");
        ResponseEntity<?> response = jobCardController.findAll(filter,null, null, null,"en-US");
        assertEquals(HttpStatus.OK, response.getStatusCode());
        //assertEquals(jobCardDtoList(), response.getBody());
    }

    @Test
    @DisplayName("testFindAll_withoutLanguage")
    public void testFindAll_withoutLanguage() {
        Optional<String> filter = Optional.empty();
        when(jobCardService.findAll(filter,null, null, null)).thenReturn(jobCardDtoList());
        ResponseEntity<?> response = jobCardController.findAll(filter,null, null, null, null);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        //assertEquals(jobCardDtoList(), response.getBody());
    }
    @Test
    @DisplayName("testFindAll_Exception")
    public void testFindAll_Exception() {
        when(jobCardService.findAll(any(),any(), any(), any()))
                .thenThrow(new RuntimeException("Some unexpected exception"));

        assertThrows(RuntimeException.class, () -> jobCardController.findAll(Optional.empty(),null, null, null, null));

    }
    @Test
    @DisplayName("testFindOne")
    public void testFindOne() {

        String jobCardId = "c7e9469a-1b6b-42c6-9580-28ed4a994346";
        when(jobCardService.findOne(anyString())).thenReturn(jobCardDto2);
        ResponseEntity<?> response = jobCardController.findOne(jobCardId, "en-US");
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(jobCardDto2, response.getBody());

    }
    @Test
    @DisplayName("testFindOne_withoutLanguage")
    public void testFindOne_withoutLanguage() {

        String jobCardId = "c7e9469a-1b6b-42c6-9580-28ed4a994346";
        when(jobCardService.findOne(anyString())).thenReturn(jobCardDto2);
        ResponseEntity<?> response = jobCardController.findOne(jobCardId, null);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(jobCardDto2, response.getBody());

    }

    @Test
    @DisplayName("testFindOne_CustomNotFoundException")
    public void testFindOne_CustomNotFoundException() {

        String jobCardId = "id";
        when(jobCardService.findOne(eq(jobCardId))).thenThrow(new CustomNotFoundException(HttpStatus.NOT_FOUND.value(),
                "Test exception"));
        assertThrows(CustomNotFoundException.class, () -> jobCardController.findOne(jobCardId, null));

    }
    @Test
    @DisplayName("testFindOne_Exception")
    public void testFindOne_Exception() {

        String jobCardId = "id";
        when(jobCardService.findOne(eq(jobCardId))).thenThrow(new RuntimeException("Test exception"));
        assertThrows(RuntimeException.class, () -> jobCardController.findOne(jobCardId, "en-US"));

    }

//    @Test
//    @DisplayName("testFindAllJobCardServices")
//    void testFindAllJobCardServices() {
//
//        String jobCardId = "16da4bc2-a8cc-4ba6-a7a5-ef69802ce177"; // Replace with the actual jobCardId
//        List<JobCardServicesDto> dtoList = jobCardServicesDtoList1();
//        when(jobCardService.findAllJobCardServices(jobCardId)).thenReturn(dtoList);
//        when(statusUtil.getDescription(any(), anyString())).thenReturn("Test Description");
//        ResponseEntity<?> response = jobCardController.findAllJobCardServices(jobCardId, "en-US");
//        assertEquals(HttpStatus.OK, response.getStatusCode());
//        assertEquals(dtoList, response.getBody());
//        verify(jobCardService, times(1)).findAllJobCardServices(jobCardId);
//        verify(statusUtil, times(dtoList.size())).getDescription(any(), anyString());
//
//    }
//
//    @Test
//    @DisplayName("testFindAllJobCardServices_withoutLanguage")
//    void testFindAllJobCardServices_withoutLanguage() {
//
//        String jobCardId = "16da4bc2-a8cc-4ba6-a7a5-ef69802ce177"; // Replace with the actual jobCardId
//        List<JobCardServicesDto> dtoList = jobCardServicesDtoList1();
//        when(jobCardService.findAllJobCardServices(jobCardId)).thenReturn(dtoList);
//        when(statusUtil.getDescription(any(), anyString())).thenReturn("Test Description");
//        ResponseEntity<?> response = jobCardController.findAllJobCardServices(jobCardId, null);
//        assertEquals(HttpStatus.OK, response.getStatusCode());
//        assertEquals(dtoList, response.getBody());
//        verify(jobCardService, times(1)).findAllJobCardServices(jobCardId);
//        verify(statusUtil, times(dtoList.size())).getDescription(any(), anyString());
//
//    }
//
//    @Test
//    @DisplayName("testFindAllJobCardServices_Exception")
//    public void testFindAllJobCardServices_Exception() {
//
//        String jobCardId = "id";
//        when(jobCardService.findAllJobCardServices(eq(jobCardId))).thenThrow(new RuntimeException("Test exception"));
//        assertThrows(RuntimeException.class, () -> jobCardController.findAllJobCardServices(jobCardId, "en-US"));
//
//    }
//
//    @Test
//    @DisplayName("testFindAllJobCardServices_CustomNotFoundException")
//    public void testFindAllJobCardServices_CustomNotFoundException() {
//
//        String jobCardId = "id";
//        when(jobCardService.findAllJobCardServices(eq(jobCardId))).thenThrow(
//                new CustomNotFoundException(HttpStatus.NOT_FOUND.value(),"Test exception"));
//        assertThrows(CustomNotFoundException.class, () -> jobCardController.findAllJobCardServices(jobCardId, "en-US"));
//
//    }
//
//    @Test
//    @DisplayName("testFindOneJobCardService")
//    public void testFindOneJobCardService() {
//        String jobCardId = "16da4bc2-a8cc-4ba6-a7a5-ef69802ce177";
//        String jobCardServiceId = "a9cd57cd-f61a-4d7f-9f87-dc031d5b95fb";
//        String language = "en-US";
//
//        when(jobCardService.findOneJobCardService(jobCardServiceId)).thenReturn(jobCardServicesDto2);
//        when(statusUtil.getDescription(any(), anyString())).thenReturn("Test Description");
//        ResponseEntity<?> response = jobCardController.findOneJobCardService(jobCardId, jobCardServiceId, language);
//        verify(statusUtil, times(1)).getDescription(any(), anyString());
//
//        assertEquals(HttpStatus.OK, response.getStatusCode());
//        assertEquals(jobCardServicesDto2, response.getBody());
//    }
//
//    @Test
//    @DisplayName("testFindOneJobCardService_withoutLanguage")
//    public void testFindOneJobCardService_withoutLanguage() {
//        String jobCardId = "16da4bc2-a8cc-4ba6-a7a5-ef69802ce177";
//        String jobCardServiceId = "a9cd57cd-f61a-4d7f-9f87-dc031d5b95fb";
//        String language = null;
//
//        when(jobCardService.findOneJobCardService(jobCardServiceId)).thenReturn(jobCardServicesDto2);
//        when(statusUtil.getDescription(any(), anyString())).thenReturn("Test Description");
//        ResponseEntity<?> response = jobCardController.findOneJobCardService(jobCardId, jobCardServiceId, language);
//        verify(statusUtil, times(1)).getDescription(any(), anyString());
//
//        assertEquals(HttpStatus.OK, response.getStatusCode());
//        assertEquals(jobCardServicesDto2, response.getBody());
//    }
//    @Test
//    @DisplayName("testFindOneJobCardService_Exception")
//    public void testFindOneJobCardService_Exception() {
//        String jobCardId = "16da4bc2-a8cc-4ba6-a7a5-ef69802ce177";
//        String jobCardServiceId = "a9cd57cd-f61a-4d7f-9f87-dc031d5b95fb";
//        String language = "en-US";
//        // Mocking jobCardService.findOneJobCardService() method
//        when(jobCardService.findOneJobCardService(jobCardServiceId)).thenThrow(new RuntimeException("test exception"));
//
//        assertThrows(RuntimeException.class, () -> jobCardController.findOneJobCardService(jobCardId, jobCardServiceId, language));
//
//    }
//
//    @Test
//    @DisplayName("testFindOneJobCardService_CustomNotFoundException")
//    public void testFindOneJobCardService_CustomNotFoundException() {
//        String jobCardId = "16da4bc2-a8cc-4ba6-a7a5-ef69802ce177";
//        String jobCardServiceId = "a9cd57cd-f61a-4d7f-9f87-dc031d5b95fb";
//        String language = "en-US";
//        when(jobCardService.findOneJobCardService(jobCardServiceId)).thenThrow(new CustomNotFoundException(
//                HttpStatus.NOT_FOUND.value(),"test exception"));
//        assertThrows(CustomNotFoundException.class, () -> jobCardController.findOneJobCardService(jobCardId, jobCardServiceId, language));
//
//    }
//    @Test
//    @DisplayName("testFindAllJCStatuses")
//    public void testFindAllJCStatuses() {
//
//        String language = "en-US";
//        List<StatusDto> mockDtoList = jobCardStatusDtoList();
//
//        when(statusUtil.getDescription(mockDtoList.get(0).getCode(), language)).thenReturn(mockDtoList.get(0).getDescription());
//        when(statusUtil.getDescription(mockDtoList.get(1).getCode(), language)).thenReturn(mockDtoList.get(1).getDescription());
//        when(statusUtil.getDescription(mockDtoList.get(2).getCode(), language)).thenReturn(mockDtoList.get(2).getDescription());
//
//        ResponseEntity<List<StatusDto>> response = jobCardController.findAllJCStatuses(language);
//        verify(statusUtil, times(JCStatus.values().length)).getDescription(anyString(), anyString());
//
//        assertEquals(HttpStatus.OK, response.getStatusCode());
//
//        assertEquals(mockDtoList.size(), response.getBody().size());
//        for (int i = 0; i < mockDtoList.size(); i++) {
//            assertEquals(mockDtoList.get(i).getCode(), response.getBody().get(i).getCode());
//            assertEquals(mockDtoList.get(i).getDescription(), response.getBody().get(i).getDescription());
//        }
//    }
//
//    @Test
//    @DisplayName("testFindAllJCStatuses_withoutLanguage")
//    public void testFindAllJCStatuses_withoutLanguage() {
//
//        String language = null;
//        List<StatusDto> mockDtoList = jobCardStatusDtoList();
//
//        when(statusUtil.getDescription(mockDtoList.get(0).getCode(), "en-US")).thenReturn(mockDtoList.get(0).getDescription());
//        when(statusUtil.getDescription(mockDtoList.get(1).getCode(), "en-US")).thenReturn(mockDtoList.get(1).getDescription());
//        when(statusUtil.getDescription(mockDtoList.get(2).getCode(), "en-US")).thenReturn(mockDtoList.get(2).getDescription());
//
//        ResponseEntity<List<StatusDto>> response = jobCardController.findAllJCStatuses(language);
//        verify(statusUtil, times(JCStatus.values().length)).getDescription(anyString(), anyString());
//
//        assertEquals(HttpStatus.OK, response.getStatusCode());
//
//        assertEquals(mockDtoList.size(), response.getBody().size());
//        for (int i = 0; i < mockDtoList.size(); i++) {
//            assertEquals(mockDtoList.get(i).getCode(), response.getBody().get(i).getCode());
//            assertEquals(mockDtoList.get(i).getDescription(), response.getBody().get(i).getDescription());
//        }
//    }
//    @Test
//    @DisplayName("testFindAllJCServiceStatuses")
//    public void testFindAllJCServiceStatuses() {
//
//        String language = "en-US";
//        List<StatusDto> mockDtoList = jobCardServiceStatusDtoList();
//        when(statusUtil.getDescription(mockDtoList.get(0).getCode(), language)).thenReturn(mockDtoList.get(0).getDescription());
//        when(statusUtil.getDescription(mockDtoList.get(1).getCode(), language)).thenReturn(mockDtoList.get(1).getDescription());
//        when(statusUtil.getDescription(mockDtoList.get(2).getCode(), language)).thenReturn(mockDtoList.get(2).getDescription());
//
//        ResponseEntity<List<StatusDto>> response = jobCardController.findAllJCServiceStatuses(language);
//        verify(statusUtil, times(ServiceStatus.values().length)).getDescription(anyString(), anyString());
//        assertEquals(HttpStatus.OK, response.getStatusCode());
//        assertEquals(mockDtoList.size(), response.getBody().size());
//        for (int i = 0; i < mockDtoList.size(); i++) {
//            assertEquals(mockDtoList.get(i).getCode(), response.getBody().get(i).getCode());
//            assertEquals(mockDtoList.get(i).getDescription(), response.getBody().get(i).getDescription());
//        }
//    }
//
//    @Test
//    @DisplayName("testFindAllJCServiceStatuses_withoutLanguage")
//    public void testFindAllJCServiceStatuses_withoutLanguage() {
//
//        String language = null;
//        List<StatusDto> mockDtoList = jobCardServiceStatusDtoList();
//        when(statusUtil.getDescription(mockDtoList.get(0).getCode(), "en-US")).thenReturn(mockDtoList.get(0).getDescription());
//        when(statusUtil.getDescription(mockDtoList.get(1).getCode(), "en-US")).thenReturn(mockDtoList.get(1).getDescription());
//        when(statusUtil.getDescription(mockDtoList.get(2).getCode(), "en-US")).thenReturn(mockDtoList.get(2).getDescription());
//
//        ResponseEntity<List<StatusDto>> response = jobCardController.findAllJCServiceStatuses(language);
//        verify(statusUtil, times(ServiceStatus.values().length)).getDescription(anyString(), anyString());
//        assertEquals(HttpStatus.OK, response.getStatusCode());
//        assertEquals(mockDtoList.size(), response.getBody().size());
//        for (int i = 0; i < mockDtoList.size(); i++) {
//            assertEquals(mockDtoList.get(i).getCode(), response.getBody().get(i).getCode());
//            assertEquals(mockDtoList.get(i).getDescription(), response.getBody().get(i).getDescription());
//        }
//    }

    @Test
    @DisplayName("testCreateJobCard_Success")
    public void testCreateJobCard_Success() throws Exception {

        JobCardDto mockedDto = new JobCardDto();
        mockedDto.setId("123");
        when(jobCardService.createJobCard("sourceId", "sourceType"))
                .thenReturn(mockedDto);
        ResponseEntity<?> response = jobCardController.createJobCard("sourceId", "sourceType");

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(mockedDto, response.getBody());
    }
    @Test
    @DisplayName("testCreateJobCard_CustomValidationException")
    public void testCreateJobCard_CustomValidationException() throws Exception {
        List<ErrorResponse.ErrorInfo> details = new ArrayList<>();
        when(jobCardService.createJobCard("sourceId", "sourceType"))
                .thenThrow(new CustomValidationException(HttpStatus.BAD_REQUEST.value(),
                        "Validation errors occurred.", details));
        assertThrows(CustomValidationException.class, () -> jobCardController.createJobCard("sourceId", "sourceType"));

    }

    @Test
    @DisplayName("testCreateJobCard_CustomNotFoundException")
    public void testCreateJobCard_CustomNotFoundException() throws Exception {
        when(jobCardService.createJobCard("sourceId", "sourceType"))
                .thenThrow(new CustomNotFoundException(HttpStatus.NOT_FOUND.value(),
                        Constants.Messages.JOBCARD_ID_NOT_FOUND));

        assertThrows(CustomNotFoundException.class, () -> jobCardController.createJobCard("sourceId", "sourceType"));

    }


    @Test
    @DisplayName("testUpdateJobCardService_Success")
    public void testUpdateJobCardService_Success() throws Exception {
        String jobCardId = "16da4bc2-a8cc-4ba6-a7a5-ef69802ce177";
        String jobCardServiceId = "a9cd57cd-f61a-4d7f-9f87-dc031d5b95fb";
        String ifMatch = "2023-07-03 09:36:53.872000000";
        JobCardServicesUpdateDto updateDto = new JobCardServicesUpdateDto();
        when(jobCardService.updateJobCardService(any(),any(),any(),any())).thenReturn(jobCardServicesDto2);

        ResponseEntity<?> response = jobCardController.updateJobCardService(eq(jobCardId), eq(jobCardServiceId), eq(updateDto),eq(ifMatch));

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(jobCardServicesDto2, response.getBody());

    }

    @Test
    @DisplayName("testRemove_Success")
    public void testRemove_Success() throws Exception {

        String jobCardId = "16da4bc2-a8cc-4ba6-a7a5-ef69802ce177";
        Map<String, Object> response = Map.of("raw", Collections.emptyList(), "affected", 1);

        ResponseEntity<?> result = jobCardController.remove(jobCardId);
        assertEquals(result.getBody(),response);

        verify(jobCardService, times(1)).remove(eq(jobCardId));
    }

    @Test
    @DisplayName("findValidationStatus_Success")
    void findValidationStatus_Success() {

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("entity", "sampleEntity");
        requestBody.put("currentImage", new HashMap<>());

        when(jobCardService.findValidationStatusService(any(), any()))
                .thenReturn(new JobCardValidationResponse());

        ResponseEntity<?> responseEntity = jobCardController.findValidationStatus(requestBody);
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
    }

}
