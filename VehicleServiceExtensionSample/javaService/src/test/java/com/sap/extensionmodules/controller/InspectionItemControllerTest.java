package com.sap.extensionmodules.controller;

import com.sap.cloud.sdk.services.openapi.core.OpenApiRequestException;
import com.sap.extensionmodules.dtos.InspectionItemDto;
import com.sap.extensionmodules.exception.APIExceptionHandler;
import com.sap.extensionmodules.service.InspectionItemService;
import javassist.NotFoundException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

public class InspectionItemControllerTest {

    @Mock
    private InspectionItemService inspectionItemService;

    @InjectMocks
    private InspectionItemController inspectionItemController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreate() throws Exception {
        InspectionItemDto inspectionItemDto = new InspectionItemDto();

        when(inspectionItemService.create(inspectionItemDto)).thenReturn(inspectionItemDto);

        ResponseEntity<?> response = inspectionItemController.create(inspectionItemDto);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(inspectionItemDto, response.getBody());
    }

    @Test
    public void testCreateException() throws Exception {
        InspectionItemDto inspectionItemDto = new InspectionItemDto();
        when(inspectionItemService.create(inspectionItemDto)).thenThrow(new RuntimeException("Error creating inspection item"));

        assertThrows(RuntimeException.class, () -> inspectionItemController.create(inspectionItemDto));
    }

    @Test
    public void testFindAll() {

        List<InspectionItemDto> inspectionItemDtoList = new ArrayList<>();

        when(inspectionItemService.findAll()).thenReturn(inspectionItemDtoList);

        ResponseEntity<?> response = inspectionItemController.findAll();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(inspectionItemDtoList, response.getBody());
    }

    @Test
    public void testFindAllException() {
        when(inspectionItemService.findAll()).thenThrow(new RuntimeException("Error retrieving all inspection items"));

        assertThrows(RuntimeException.class, () -> inspectionItemController.findAll());
    }

    @Test
    public void testFindByIdFound() throws Exception {
        String id = "1";
        InspectionItemDto inspectionItemDto = new InspectionItemDto();

        when(inspectionItemService.findById(id)).thenReturn(inspectionItemDto);

        ResponseEntity<?> response = inspectionItemController.findById(id);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(inspectionItemDto, response.getBody());
    }

    @Test
    public void testFindByIdNotFound() throws Exception {
        String id = "1";
        when(inspectionItemService.findById(id)).thenThrow(new NotFoundException("Inspection item not found"));

        assertThrows(NotFoundException.class, () -> inspectionItemController.findById(id));
    }

    @Test
    public void testFindByIdException() throws Exception {
        String id = "1";

        when(inspectionItemService.findById(id)).thenThrow(new RuntimeException("Error retrieving inspection item by ID"));

        assertThrows(RuntimeException.class, () -> inspectionItemController.findById(id));
    }

    @Test
    public void testUpdateSuccess() throws Exception {
        String id = "1";
        InspectionItemDto inspectionItemDto = new InspectionItemDto();

        when(inspectionItemService.update(id, inspectionItemDto, null)).thenReturn(inspectionItemDto);

        ResponseEntity<?> response = inspectionItemController.update(id, inspectionItemDto, null);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(inspectionItemDto, response.getBody());
    }

    @Test
    public void testUpdateNotFound() throws Exception {
        String id = "1";
        InspectionItemDto inspectionItemDto = new InspectionItemDto();

        when(inspectionItemService.update(id, inspectionItemDto, null)).thenThrow(new NotFoundException("Inspection item not found"));

        assertThrows(NotFoundException.class, () -> inspectionItemController.update(id, inspectionItemDto, null));

    }

    @Test
    public void testUpdateException() throws Exception {
        String id = "1";
        InspectionItemDto inspectionItemDto = new InspectionItemDto();

        when(inspectionItemService.update(id, inspectionItemDto, null)).thenThrow(new RuntimeException("Error updating inspection item by ID"));
        assertThrows(RuntimeException.class, () -> inspectionItemController.update(id, inspectionItemDto, null));

    }

    @Test
    public void testDeleteSuccess() throws NotFoundException {
        String id = "1";
        InspectionItemDto inspectionItemDto = new InspectionItemDto();

        when(inspectionItemService.delete(id)).thenReturn(inspectionItemDto);

        ResponseEntity<?> response = inspectionItemController.delete(id);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Assertions.assertNotNull(response.getBody());
    }

    @Test
    public void testDeleteNotFound() throws NotFoundException {
        String id = "1";

        when(inspectionItemService.delete(id)).thenThrow(new NotFoundException("Inspection item not found"));

        assertThrows(NotFoundException.class, () -> inspectionItemController.delete(id));

    }

    @Test
    public void testDeleteException() throws NotFoundException {
        String id = "1";

        when(inspectionItemService.delete(id)).thenThrow(new RuntimeException("Error deleting inspection item by ID"));
        assertThrows(RuntimeException.class, () -> inspectionItemController.delete(id));

    }
}
