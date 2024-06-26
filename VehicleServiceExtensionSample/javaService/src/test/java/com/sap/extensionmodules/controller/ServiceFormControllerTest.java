package com.sap.extensionmodules.controller;

import com.sap.cloud.sdk.services.openapi.core.OpenApiRequestException;
import com.sap.extensionmodules.dtos.ServiceFormDto;
import com.sap.extensionmodules.dtos.StatusDto;
import com.sap.extensionmodules.exception.APIExceptionHandler;
import com.sap.extensionmodules.exception.ErrorResponse;
import com.sap.extensionmodules.service.ServiceFormService;
import com.sap.extensionmodules.Utils.StatusUtil;
import com.sap.extensionmodules.commons.SFStatus;
import javassist.NotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import java.rmi.ServerException;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class ServiceFormControllerTest {

    @Mock
    private ServiceFormService serviceFormService;

    @Mock
    private StatusUtil statusUtil;

    @InjectMocks
    private ServiceFormController serviceFormController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreate_Success() throws Exception {
        ServiceFormDto inputDto = createSampleServiceFormDto();
        ServiceFormDto outputDto = createSampleServiceFormDto();
        when(serviceFormService.create(inputDto)).thenReturn(outputDto);

        ResponseEntity<?> response = serviceFormController.create(inputDto);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertTrue(response.getBody() instanceof ServiceFormDto);
        ServiceFormDto responseBody = (ServiceFormDto) response.getBody();
        assertEquals(outputDto, responseBody);
        verify(serviceFormService).create(inputDto);
    }

    @Test
    void testCreate_OpenApiRequestException() throws Exception {
        ServiceFormDto serviceFormDto = createSampleServiceFormDto();
        when(serviceFormService.create(eq(serviceFormDto))).thenThrow(new OpenApiRequestException("Test exception"));

        //ResponseEntity<?> response = serviceFormController.create(serviceFormDto);
        assertThrows(OpenApiRequestException.class, () -> serviceFormController.create(serviceFormDto));

       verify(serviceFormService, times(1)).create(eq(serviceFormDto));
    }

//    @Test
//    void testCreate_ServerException() throws Exception {
//        ServiceFormDto serviceFormDto = createSampleServiceFormDto();
//        when(serviceFormService.create(eq(serviceFormDto))).thenThrow(new ServerException("Test exception"));
//
//        assertThrows(ResponseStatusException.class, () -> serviceFormController.create(serviceFormDto));
//        verify(serviceFormService, times(1)).create(eq(serviceFormDto));
//    }

    @Test
    void testCreate_UnexpectedException() throws Exception {
        ServiceFormDto serviceFormDto = createSampleServiceFormDto();
        when(serviceFormService.create(eq(serviceFormDto))).thenThrow(new RuntimeException("Test exception"));

        assertThrows(RuntimeException.class, () -> serviceFormController.create(serviceFormDto));
        verify(serviceFormService, times(1)).create(eq(serviceFormDto));
    }

    @Test
    public void testFindAllWithoutLanguageAndCaseId() {
        List<ServiceFormDto> serviceFormDtoList = createSampleServiceFormDtoList();
        when(serviceFormService.findAll(Optional.empty())).thenReturn(serviceFormDtoList);

        ResponseEntity<?> response = serviceFormController.findAll(null, Optional.empty());

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(serviceFormDtoList, response.getBody());

    }

    @Test
    public void testFindAllWithLanguageAndCaseId() {
        List<ServiceFormDto> serviceFormDtoList = createSampleServiceFormDtoList();
        Optional<String> filter = Optional.empty();
        when(serviceFormService.findAll(filter)).thenReturn(serviceFormDtoList);


        ResponseEntity<?> response = serviceFormController.findAll("en-GB", filter);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(serviceFormDtoList, response.getBody());

    }

    @Test
    public void testFindAllWithLanguageAndNoCaseId() {

        List<ServiceFormDto> serviceFormDtoList = createSampleServiceFormDtoList();
        when(serviceFormService.findAll(Optional.empty())).thenReturn(serviceFormDtoList);
        ResponseEntity<?> response = serviceFormController.findAll("fr-FR", Optional.empty());

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(serviceFormDtoList, response.getBody());

    }

    @Test
    public void testFindAllException() {
        when(serviceFormService.findAll(any(Optional.class))).thenThrow(new RuntimeException("Simulated exception"));

        assertThrows(RuntimeException.class, () -> serviceFormController.findAll("en-US", Optional.empty()));
    }

    @Test
    public void testUpdate_Success() throws Exception {
        String id = "24ec9136-f3e5-4704-bd49-459506f687fc";
        ServiceFormDto inputDto = createSampleServiceFormDto();
        ServiceFormDto outputDto = createSampleServiceFormDto();
        String ifMatch = "12345";

        when(serviceFormService.update(eq(id), eq(inputDto), eq(ifMatch))).thenReturn(outputDto);

        ResponseEntity<?> response = serviceFormController.update(id, inputDto, ifMatch);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(outputDto, response.getBody());
        verify(serviceFormService, times(1)).update(eq(id), eq(inputDto), eq(ifMatch));
    }

    @Test
    public void testUpdate_NotFoundException() throws Exception {
        String id = "24ec9136-f3e5-4704-bd49-459506f687fc";
        ServiceFormDto inputDto = createSampleServiceFormDto();
        String ifMatch = "12345";
        NotFoundException notFoundException = new NotFoundException("Service form not found");

        when(serviceFormService.update(eq(id), eq(inputDto), eq(ifMatch))).thenThrow(notFoundException);
        assertThrows(NotFoundException.class, () -> serviceFormController.update(id, inputDto, ifMatch));
        verify(serviceFormService, times(1)).update(eq(id), eq(inputDto), eq(ifMatch));
    }

    @Test
    public void testUpdate_Exception() throws Exception {
        String id = "24ec9136-f3e5-4704-bd49-459506f687fc";
        ServiceFormDto inputDto = createSampleServiceFormDto();
        String ifMatch = "12345";
        RuntimeException exception = new RuntimeException("Internal server error");

        doThrow(exception).when(serviceFormService).update(eq(id), eq(inputDto), eq(ifMatch));
        assertThrows(RuntimeException.class, () -> serviceFormController.update(id, inputDto, ifMatch));
        verify(serviceFormService, times(1)).update(eq(id), eq(inputDto), eq(ifMatch));
    }

    @Test
    void testDelete_Success() throws NotFoundException {
        String id = "24ec9136-f3e5-4704-bd49-459506f687fc";

        ResponseEntity<?> response = serviceFormController.delete(id);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
        assertNotNull(responseBody);
        assertEquals(Collections.emptyList(), responseBody.get("raw"));
        assertEquals(1, responseBody.get("affected"));
        verify(serviceFormService, times(1)).delete(id);
    }

    @Test
    void testDelete_NotFound() throws NotFoundException {
        String id = "24ec9136-f3e5-4704-bd49-459506f687fc";
        NotFoundException exception = new NotFoundException("Service form not found");

        doThrow(exception).when(serviceFormService).delete(id);
        assertThrows(NotFoundException.class, () -> serviceFormController.delete(id));
        verify(serviceFormService, times(1)).delete(id);
    }

    @Test
    void testDelete_Exception() throws NotFoundException {
        String id = "sampleId";
        doThrow(new RuntimeException("Test exception")).when(serviceFormService).delete(id);

        assertThrows(RuntimeException.class, () -> serviceFormController.delete(id));
        verify(serviceFormService).delete(id);
    }


    private ServiceFormDto createSampleServiceFormDto() {
        ServiceFormDto serviceFormDto = new ServiceFormDto();
        serviceFormDto.setId("24ec9136-f3e5-4704-bd49-459506f687fc");
        serviceFormDto.setStatus(SFStatus.Z01.name());
        return serviceFormDto;
    }

    private List<ServiceFormDto> createSampleServiceFormDtoList() {
        List<ServiceFormDto> serviceFormDtoList = new ArrayList<>();
        serviceFormDtoList.add(createSampleServiceFormDto());
        return serviceFormDtoList;
    }
}
