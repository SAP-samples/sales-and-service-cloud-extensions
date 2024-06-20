package com.sap.extensionmodules.repository;

import com.sap.extensionmodules.Utils.EmployeeSpecification;
import com.sap.extensionmodules.commons.Constants;
import com.sap.extensionmodules.entity.Employee;
import com.sap.extensionmodules.exception.CustomNotFoundException;
import javassist.NotFoundException;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.test.context.ContextConfiguration;

import java.util.ArrayList;
import java.util.List;

import static com.sap.extensionmodules.commons.RoleCodes.R22;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
@ContextConfiguration(classes = {EmployeesRepository.class})
@ExtendWith(MockitoExtension.class)
public class EmployeesRepositoryTest {

    @InjectMocks
    private EmployeesRepository employeesRepository;

    @Mock
    private EmployeeRepositoryInterface employeeRepositoryInterface;

    @Test
    void testCreate() {
        Employee employee = createSampleEmployeeEntity();
        when(employeeRepositoryInterface.save(Mockito.any())).thenReturn(employee);

        Employee entity = createSampleEmployeeEntity();

        Employee actualCreateResult = employeesRepository.create(entity);

        verify(employeeRepositoryInterface).save(Mockito.any());
        assertSame(employee, actualCreateResult);
    }

    @Test
    void testCreate_DataIntegrityViolationException() {
        when(employeeRepositoryInterface.save(Mockito.any()))
                .thenThrow(new DataIntegrityViolationException("Msg"));

        Employee entity = createSampleEmployeeEntity();

        assertThrows(CustomNotFoundException.class, () -> employeesRepository.create(entity));
        verify(employeeRepositoryInterface).save(Mockito.any());
    }

    @Test
    void testCreate_DataAccessException() {
        when(employeeRepositoryInterface.save(Mockito.any()))
                .thenThrow(new CustomNotFoundException(1, "An error occurred"));

        Employee entity = createSampleEmployeeEntity();

        assertThrows(CustomNotFoundException.class, () -> employeesRepository.create(entity));
        verify(employeeRepositoryInterface).save(Mockito.any());
    }

    @Test
    void testCreate_CustomNotFoundException() {
        when(employeeRepositoryInterface.save(Mockito.any()))
                .thenThrow(new EmptyResultDataAccessException(3));

        Employee entity = createSampleEmployeeEntity();

        assertThrows(CustomNotFoundException.class, () -> employeesRepository.create(entity));
        verify(employeeRepositoryInterface).save(Mockito.any());
    }

    @Test
    void testFindAll_Success() {
        EmployeeSpecification spec = mock(EmployeeSpecification.class);
        when(employeeRepositoryInterface.findAll(spec)).thenReturn(new ArrayList<>());

        List<Employee> actualResult = employeesRepository.findAll(spec);

        verify(employeeRepositoryInterface).findAll(spec);
        assertTrue(actualResult.isEmpty());
    }

    @Test
    void testFindAll_DataAccessException() {
        EmployeeSpecification spec = mock(EmployeeSpecification.class);
        when(employeeRepositoryInterface.findAll(spec)).thenThrow(new DataAccessException("Msg") {});

        assertThrows(CustomNotFoundException.class, () -> employeesRepository.findAll(spec));
        verify(employeeRepositoryInterface).findAll(spec);
    }

    @Test
    void testFindAll_CustomNotFoundException() {
        EmployeeSpecification spec = mock(EmployeeSpecification.class);

        when(employeeRepositoryInterface.findAll(spec)).thenThrow(new CustomNotFoundException(1, "An error occurred"));

        assertThrows(CustomNotFoundException.class, () -> employeesRepository.findAll(spec));
        verify(employeeRepositoryInterface).findAll(spec);
    }

    @Test
    void testFindById_Success() throws NotFoundException {
        Employee employee = createSampleEmployeeEntity();
        when(employeeRepositoryInterface.findById(Mockito.<String>any())).thenReturn(employee);

        Employee actualFindByIdResult = employeesRepository.findById("42");

        verify(employeeRepositoryInterface).findById(Mockito.<String>any());
        assertSame(employee, actualFindByIdResult);
    }

    @Test
    void testFindById_DataAccessException() {
        when(employeeRepositoryInterface.findById(Mockito.<String>any()))
                .thenThrow(new DataIntegrityViolationException("Employee Resource with the provided id not found"));

        assertThrows(CustomNotFoundException.class, () -> employeesRepository.findById("42"));
        verify(employeeRepositoryInterface).findById(Mockito.<String>any());
    }

    @Test
    void testFindById_NotFoundException() {
        String id = "42";
        NotFoundException exception = assertThrows(NotFoundException.class, () -> employeesRepository.findById(id));
        assertEquals(Constants.Messages.EMPLOYEE_RESOURCE_NOT_FOUND, exception.getMessage());
    }

    @Test
    void testUpdate_Success() {
        Employee employee = createSampleEmployeeEntity();
        when(employeeRepositoryInterface.save(Mockito.any())).thenReturn(employee);

        Employee entity = createSampleEmployeeEntity();

        Employee actualUpdateResult = employeesRepository.update(entity);

        verify(employeeRepositoryInterface).save(Mockito.any());
        assertSame(employee, actualUpdateResult);
    }

    @Test
    void testUpdate_DataAccessException() {
        when(employeeRepositoryInterface.save(Mockito.any()))
                .thenThrow(new DataIntegrityViolationException("Msg"));

        Employee entity = createSampleEmployeeEntity();

        assertThrows(CustomNotFoundException.class, () -> employeesRepository.update(entity));
        verify(employeeRepositoryInterface).save(Mockito.any());
    }

    @Test
    void testUpdate_NotFoundException() {
        when(employeeRepositoryInterface.save(Mockito.any()))
                .thenThrow(new CustomNotFoundException(1, "An error occurred"));

        Employee entity = createSampleEmployeeEntity();

        assertThrows(CustomNotFoundException.class, () -> employeesRepository.update(entity));
        verify(employeeRepositoryInterface).save(Mockito.any());
    }

    @Test
    void testDelete_Success() throws NotFoundException {
        doNothing().when(employeeRepositoryInterface).delete(Mockito.any());

        Employee entity = createSampleEmployeeEntity();

        employeesRepository.delete(entity);

        verify(employeeRepositoryInterface).delete(Mockito.any());
        assertEquals("e12ed5b2-a3d9-439e-b689-b85775f3936e", entity.getUpdatedBy());
        assertEquals("2024-01-02 11:05:05.242000000", entity.getUpdatedOn());
        assertEquals("3f32e6e4-8bf2-411e-90a6-87e27f663f4b", entity.getId());
        assertEquals("e12ed5b2-a3d9-439e-b689-b85775f3936e", entity.getCreatedBy());
        assertEquals("2024-01-02 11:05:05.242000000", entity.getCreatedOn());
    }

    @Test
    void testDelete_DataAccessException() {
        doThrow(new DataIntegrityViolationException("Msg")).when(employeeRepositoryInterface)
                .delete(Mockito.any());

        Employee entity = createSampleEmployeeEntity();

        assertThrows(CustomNotFoundException.class, () -> employeesRepository.delete(entity));
        verify(employeeRepositoryInterface).delete(Mockito.any());
    }

    @Test
    void testDelete_NotFoundException() {
        doThrow(new CustomNotFoundException(1, "An error occurred")).when(employeeRepositoryInterface)
                .delete(Mockito.any());

        Employee entity = createSampleEmployeeEntity();

        assertThrows(CustomNotFoundException.class, () -> employeesRepository.delete(entity));
        verify(employeeRepositoryInterface).delete(Mockito.any());
    }

    private Employee createSampleEmployeeEntity() {
        return new Employee("3f32e6e4-8bf2-411e-90a6-87e27f663f4b",
                "8f32e6e4-8bf2-411e-90a6-87e27f663f41",
                "employee@email.com",
                "Employee Name",
                "Service Advisor",
                R22,
                "2024-01-02 11:05:05.242000000",
                "2024-01-02 11:05:05.242000000",
                "e12ed5b2-a3d9-439e-b689-b85775f3936e",
                "e12ed5b2-a3d9-439e-b689-b85775f3936e");
    }
}
