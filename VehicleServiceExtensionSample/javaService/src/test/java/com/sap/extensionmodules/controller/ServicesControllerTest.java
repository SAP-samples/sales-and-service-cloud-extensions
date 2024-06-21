package com.sap.extensionmodules.controller;

import com.sap.extensionmodules.dtos.AdminData;
import com.sap.extensionmodules.dtos.ServicesDto;
import com.sap.extensionmodules.exception.APIExceptionHandler;
import com.sap.extensionmodules.exception.ErrorResponse;
import com.sap.extensionmodules.service.ServicesService;
import javassist.NotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.*;

import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class ServicesControllerTest {

    @Mock
    private ServicesService servicesService;

    @InjectMocks
    private ServicesController servicesController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreate_Success() {
        // Arrange
        ServicesDto inputDto = new ServicesDto(
                "245fe633-ed8d-44c1-9f87-28cae09abe06",
                "Shockup Replacement",
                "3500",
                1000,
                6000,
                false,
                createSampleAdminData()
        );
        ServicesDto outputDto = createSampleServicesDto();
        when(servicesService.create(inputDto)).thenReturn(outputDto);

        // Act
        ResponseEntity<?> response = servicesController.create(inputDto);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertTrue(response.getBody() instanceof ServicesDto);
        ServicesDto responseBody = (ServicesDto) response.getBody();
        assertEquals(outputDto, responseBody);
        verify(servicesService).create(inputDto);
    }

    private ServicesDto createSampleServicesDto() {
        return new ServicesDto(
                "245fe633-ed8d-44c1-9f87-28cae09abe06",
                "Shockup Replacement",
                "3500",
                1000,
                6000,
                false,
                createSampleAdminData()
        );
    }

    @Test
    void testFindAll_Success() {
        // Arrange
        List<ServicesDto> outputDtoList = Arrays.asList(createSampleServicesDto(), createSampleServicesDto());
        when(servicesService.findAll()).thenReturn(outputDtoList);

        // Act
        ResponseEntity<?> response = servicesController.findAll();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof List);
        List<ServicesDto> responseBody = (List<ServicesDto>) response.getBody();
        assertEquals(outputDtoList, responseBody);
        verify(servicesService).findAll();
    }

    @Test
    void testFindById_Success() throws NotFoundException {
        // Arrange
        String serviceId = "245fe633-ed8d-44c1-9f87-28cae09abe06";
        ServicesDto outputDto = createSampleServicesDto();
        when(servicesService.findById(serviceId)).thenReturn(outputDto);

        // Act
        ResponseEntity<?> response = servicesController.findById(serviceId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof ServicesDto);
        ServicesDto responseBody = (ServicesDto) response.getBody();
        assertEquals(outputDto, responseBody);
        verify(servicesService).findById(serviceId);
    }

    @Test
    void testUpdate_Success() throws NotFoundException {
        // Arrange
        String serviceId = "245fe633-ed8d-44c1-9f87-28cae09abe06";
        ServicesDto inputDto = createSampleServicesDto();
        ServicesDto outputDto = createSampleServicesDto();
        String ifMatch = "someIfMatchValue";

        when(servicesService.update(serviceId, inputDto, ifMatch)).thenReturn(outputDto);

        // Act
        ResponseEntity<?> response = servicesController.update(serviceId, inputDto, ifMatch);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof ServicesDto);
        ServicesDto responseBody = (ServicesDto) response.getBody();
        assertEquals(outputDto, responseBody);
        verify(servicesService).update(serviceId, inputDto, ifMatch);
    }

    @Test
    void testDelete_Success() throws NotFoundException {
        String serviceId = "some-id";

        ResponseEntity<?> response = servicesController.delete(serviceId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof Map);

        Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
        assertNotNull(responseBody);
        assertEquals(Collections.emptyList(), responseBody.get("raw"));
        assertEquals(1, responseBody.get("affected"));

        verify(servicesService).delete(serviceId);
    }
    // Utility method to create a sample AdminData
    private AdminData createSampleAdminData() {
        return new AdminData(
                "2024-01-02 11:05:05.242000000",
                "2024-01-02 11:05:05.242000000",
                "e12ed5b2-a3d9-439e-b689-b85775f3936e",
                "e12ed5b2-a3d9-439e-b689-b85775f3936e"
        );
    }
}
