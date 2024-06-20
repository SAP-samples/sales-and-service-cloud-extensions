package com.sap.extensionmodules.controller;

import com.sap.cloud.sdk.services.openapi.core.OpenApiRequestException;
import com.sap.extensionmodules.dtos.EmployeeDto;
import com.sap.extensionmodules.dtos.UserDto;
import com.sap.extensionmodules.exception.APIExceptionHandler;
import com.sap.extensionmodules.security.RequestContext;
import com.sap.extensionmodules.security.RequestContextProvider;
import com.sap.extensionmodules.service.EmployeesService;
import javassist.NotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class EmployeesControllerTest {

    @Mock
    private EmployeesService employeesService;

    @Mock
    private RequestContextProvider requestContextProvider;

    @InjectMocks
    private EmployeesController employeesController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreate() throws Exception {
        EmployeeDto employeeDto = new EmployeeDto();

        when(employeesService.create(employeeDto)).thenReturn(employeeDto);

        ResponseEntity<?> response = employeesController.create(employeeDto);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(employeeDto, response.getBody());
    }

    @Test
    public void testCreateException() throws Exception {
        EmployeeDto employeeDto = new EmployeeDto();
        when(employeesService.create(employeeDto)).thenThrow(new RuntimeException("Error creating employee"));
        assertThrows(RuntimeException.class, () -> employeesController.create(employeeDto));
    }

    @Test
    public void testFindAll() {
        List<EmployeeDto> employeeDtoList = new ArrayList<>();

        when(employeesService.findAll(Optional.empty())).thenReturn(employeeDtoList);

        ResponseEntity<?> response = employeesController.findAll(Optional.empty());

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(employeeDtoList, response.getBody());
    }

    @Test
    public void testFindAllException() {
        when(employeesService.findAll(Optional.empty())).thenThrow(new RuntimeException("Error retrieving all employees"));

        assertThrows(RuntimeException.class, () -> employeesController.findAll(Optional.empty()));
    }

    @Test
    public void testFindByIdFound() throws NotFoundException {
        String id = "1";
        EmployeeDto employeeDto = new EmployeeDto();
        when(employeesService.findById(id)).thenReturn(employeeDto);

        ResponseEntity<?> response = employeesController.findById(id);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(employeeDto, response.getBody());
    }

    @Test
    public void testFindByIdNotFound() throws NotFoundException {
        String id = "1";
        when(employeesService.findById(id)).thenThrow(new NotFoundException("Employee not found"));

        assertThrows(NotFoundException.class, () -> employeesController.findById(id));

    }

    @Test
    public void testFindByIdException() throws NotFoundException {
        String id = "1";
        when(employeesService.findById(id)).thenThrow(new RuntimeException("Error retrieving employee by ID"));

        assertThrows(RuntimeException.class, () -> employeesController.findById(id));
    }

    @Test
    public void testUpdateSuccess() throws Exception {
        String id = "1";
        EmployeeDto employeeDto = new EmployeeDto();

        when(employeesService.update(id, employeeDto, null)).thenReturn(employeeDto);

        ResponseEntity<?> response = employeesController.update(id, employeeDto, null);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(employeeDto, response.getBody());
    }

    @Test
    public void testUpdateNotFound() throws Exception {
        String id = "1";
        EmployeeDto employeeDto = new EmployeeDto();
        when(employeesService.update(id, employeeDto, null)).thenThrow(new NotFoundException("Employee not found"));

        assertThrows(NotFoundException.class, () -> employeesController.update(id, employeeDto, null));
    }

    @Test
    public void testUpdateException() throws Exception {
        String id = "1";
        EmployeeDto employeeDto = new EmployeeDto();
        when(employeesService.update(id, employeeDto, null)).thenThrow(new RuntimeException("Error updating employee by ID"));

        assertThrows(RuntimeException.class, () -> employeesController.update(id, employeeDto, null));
    }

    @Test
    public void testDeleteSuccess() throws Exception {
        String id = "1";

        ResponseEntity<?> response = employeesController.delete(id);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    public void testDeleteNotFound() throws Exception {
        String id = "1";
        doThrow(new NotFoundException("Employee not found")).when(employeesService).delete(id);

        assertThrows(NotFoundException.class, () -> employeesController.delete(id));
    }

    @Test
    public void testDeleteException() throws Exception {
        String id = "1";
        doThrow(new RuntimeException("Error deleting employee by ID")).when(employeesService).delete(id);

        assertThrows(RuntimeException.class, () -> employeesController.delete(id));

    }
    @Test
    public void testCurrentUserInfo() {
        UserDto dto = mock(UserDto.class);
        when(employeesService.getCurrentUser()).thenReturn(dto);
        ResponseEntity<?> response = employeesController.findCurrentUser();
        assertEquals(response.getBody().getClass(), UserDto.class);

    }

}
