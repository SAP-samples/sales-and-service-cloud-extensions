package com.sap.extensionmodules.service;

import com.sap.extensionmodules.Utils.EmployeeSpecification;
import com.sap.extensionmodules.commons.Constants;
import com.sap.extensionmodules.dtos.AdminData;
import com.sap.extensionmodules.dtos.EmployeeDto;
import com.sap.extensionmodules.dtos.UserDto;
import com.sap.extensionmodules.dtos.query.QueryDTOHelper;
import com.sap.extensionmodules.dtos.query.QueryFilterOptions;
import com.sap.extensionmodules.dtos.query.QueryRequestDTO;
import com.sap.extensionmodules.entity.Employee;
import com.sap.extensionmodules.exception.SecurityContextNotFoundException;
import com.sap.extensionmodules.mappers.VehicleServiceMapper;
import com.sap.extensionmodules.repository.EmployeesRepository;

import com.sap.extensionmodules.security.RequestContext;
import com.sap.extensionmodules.security.RequestContextProvider;
import javassist.NotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.util.*;

import static com.sap.extensionmodules.commons.RoleCodes.R22;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.verify;

public class EmployeesServiceTest {

    @Mock
    private EmployeesRepository employeesRepository;

    @Mock
    RequestContextProvider requestContextProvider;

    @Mock
    private VehicleServiceMapper mapper;
    
    @InjectMocks
    private EmployeesService employeesService;

    @Mock
    private QueryDTOHelper queryDTOHelper;

    Constants.ExtensionFields extFields;

    Constants.CaseStatus caseStatus;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreate_Success() throws SecurityContextNotFoundException {
        Employee employee = getEmployees().get(0);

        when(employeesRepository.create(Mockito.any())).thenReturn(employee);

        Employee employee2 = getEmployees().get(0);

        EmployeeDto.EmployeeDtoBuilder builderResult = EmployeeDto.builder();
        AdminData adminData = AdminData.builder()
                .createdBy("b4042340-3a8b-42b3-b983-5db33caa331b")
                .createdOn("2024-01-09 10:45:27.445000000")
                .updatedBy("b4042340-3a8b-42b3-b983-5db33caa331b")
                .updatedOn("2024-01-09 10:45:27.445000000")
                .build();

        EmployeeDto buildResult = builderResult.adminData(adminData)
                .btpUserId("8f32e6e4-8bf2-411e-90a6-87e27f663f41")
                .id("3f32e6e4-8bf2-411e-90a6-87e27f663f4b")
                .email("employee@email.com")
                .name("Employee Name")
                .roleName("Service Advisor")
                .roleCode(R22)
                .build();

        when(mapper.EmployeeToDto(Mockito.any())).thenReturn(buildResult);
        when(mapper.EmployeeDtoToServices(Mockito.any()))
                .thenReturn(employee2);
        RequestContext.RequestContextBuilder authTokenResult = RequestContext.builder().authToken("ABC123");
        RequestContext.RequestContextBuilder destinationResult = authTokenResult.caseStatus(caseStatus)
                .destination(null);
        RequestContext buildResult2 = destinationResult.extensionFields(extFields)
                .language("en")
                .userId("3f32e6e4-8bf2-411e-90a6-87e27f663f4b")
                .userToken("ABC123")
                .build();
        when(requestContextProvider.getRequestContext()).thenReturn(buildResult2);
        EmployeeDto dto = new EmployeeDto();

        employeesService.create(dto);

        verify(mapper).EmployeeToDto(Mockito.any());
        verify(mapper).EmployeeDtoToServices(Mockito.any());
        verify(employeesRepository).create(Mockito.any());
        verify(requestContextProvider, atLeast(1)).getRequestContext();
        AdminData adminData2 = dto.getAdminData();
        assertEquals("3f32e6e4-8bf2-411e-90a6-87e27f663f4b", adminData2.getCreatedBy());
        assertEquals("3f32e6e4-8bf2-411e-90a6-87e27f663f4b", adminData2.getUpdatedBy());
    }

    @Test
    public void testFindAll_WithFilter() {
        Employee entity = getEmployees().get(0);
        QueryFilterOptions filterOptions = new QueryFilterOptions(
                "btpUserId", QueryFilterOptions.QueryFilterOperator.EQ, "8f32e6e4-8bf2-411e-90a6-87e27f663f41", false, null, false);
        List<QueryFilterOptions> filterList = Arrays.asList(filterOptions);
        QueryRequestDTO queryRequestDTO = QueryRequestDTO.builder()
                .filterOptions(filterList)
                .build();

        when(queryDTOHelper.buildRequestDTO(Optional.of("someFilter"))).thenReturn(queryRequestDTO);

        List<Employee> entityList = List.of(entity);
        when(employeesRepository.findAll(any(EmployeeSpecification.class))).thenReturn(entityList);

        AdminData adminData = AdminData.builder()
                .createdOn("2024-01-09 10:45:27.445000000")
                .updatedOn("2024-01-10 04:05:10.101000000")
                .createdBy("b4042340-3a8b-42b3-b983-5db33caa331b")
                .updatedBy("b4042340-3a8b-42b3-b983-5db33caa331b")
                .build();
        EmployeeDto dto = new EmployeeDto("3f32e6e4-8bf2-411e-90a6-87e27f663f4b",
                "Employee Name",
                "8f32e6e4-8bf2-411e-90a6-87e27f663f41",
                "employee@email.com",
                R22,
                "Service Advisor",adminData);

        when(mapper.EmployeeToDto(any())).thenReturn(dto);

        List<EmployeeDto> result = employeesService.findAll(Optional.of("someFilter"));

        assertEquals(1, result.size());
        assertEquals(dto, result.get(0));

        verify(queryDTOHelper).buildRequestDTO(Optional.of("someFilter"));
        verify(employeesRepository).findAll(any(EmployeeSpecification.class));
        verify(mapper).EmployeeToDto(any());
    }

    @Test
    public void testFindAll_WithoutFilter() {
        QueryRequestDTO queryRequestDTO = QueryRequestDTO.builder().build();
        when(queryDTOHelper.buildRequestDTO(Optional.empty())).thenReturn(queryRequestDTO);

        Employee entity = getEmployees().get(0);

        List<Employee> entityList = Collections.singletonList(entity);
        when(employeesRepository.findAll(null)).thenReturn(entityList);

        AdminData adminData = AdminData.builder()
                .createdOn("2024-01-09 10:45:27.445000000")
                .updatedOn("2024-01-10 04:05:10.101000000")
                .createdBy("b4042340-3a8b-42b3-b983-5db33caa331b")
                .updatedBy("b4042340-3a8b-42b3-b983-5db33caa331b")
                .build();
        EmployeeDto dto = new EmployeeDto("3f32e6e4-8bf2-411e-90a6-87e27f663f4b",
                "Employee Name",
                "8f32e6e4-8bf2-411e-90a6-87e27f663f41",
                "employee@email.com",
                R22,
                "Service Advisor",adminData);
        
        when(mapper.EmployeeToDto(entity)).thenReturn(dto);

        List<EmployeeDto> result = employeesService.findAll(Optional.empty());

        assertEquals(1, result.size());
        assertEquals(dto, result.get(0));

        verify(queryDTOHelper).buildRequestDTO(Optional.empty());
        verify(employeesRepository).findAll(null);
        verify(mapper).EmployeeToDto(entity);
    }

    @Test
    void testFindById_Success() throws NotFoundException {
        Employee employee = getEmployees().get(0);
        when(employeesRepository.findById(Mockito.any())).thenReturn(employee);
        EmployeeDto.EmployeeDtoBuilder builderResult = EmployeeDto.builder();
        AdminData adminData = AdminData.builder()
                .createdBy("b4042340-3a8b-42b3-b983-5db33caa331b")
                .createdOn("2024-01-09 10:45:27.445000000")
                .updatedBy("b4042340-3a8b-42b3-b983-5db33caa331b")
                .updatedOn("2024-01-09 10:45:27.445000000")
                .build();
        EmployeeDto buildResult = builderResult.adminData(adminData)
                .btpUserId("8f32e6e4-8bf2-411e-90a6-87e27f663f41")
                .id("3f32e6e4-8bf2-411e-90a6-87e27f663f4b")
                .email("employee@email.com")
                .name("Employee Name")
                .roleName("Service Advisor")
                .roleCode(R22)
                .build();
        when(mapper.EmployeeToDto(Mockito.any())).thenReturn(buildResult);

        employeesService.findById("3f32e6e4-8bf2-411e-90a6-87e27f663f4b");

        verify(mapper).EmployeeToDto(Mockito.any());
        verify(employeesRepository).findById(Mockito.any());
    }

    @Test
    void testUpdate() throws NotFoundException {
        Employee employee = new Employee();
        String id = "3f32e6e4-8bf2-411e-90a6-87e27f663f4b";
        String ifMatch = "someIfMatchValue";
        AdminData adminData = AdminData.builder()
                .createdOn("2024-01-09 10:45:27.445000000")
                .updatedOn("2024-01-10 04:05:10.101000000")
                .createdBy("b4042340-3a8b-42b3-b983-5db33caa331b")
                .updatedBy("b4042340-3a8b-42b3-b983-5db33caa331b")
                .build();
        EmployeeDto dto = new EmployeeDto("3f32e6e4-8bf2-411e-90a6-87e27f663f4b",
                "Employee Name",
                "8f32e6e4-8bf2-411e-90a6-87e27f663f41",
                "employee@email.com",
                R22,
                "Service Advisor",adminData);

        Employee existingEmployee = getEmployees().get(0);

        when(mapper.EmployeeToDto(employeesRepository.findById(id))).thenReturn(dto).thenReturn(dto);
        when(requestContextProvider.getRequestContext()).thenReturn(RequestContext.builder().userId("someUserId").build());

        AdminData updatedAdminData = new AdminData();
        updatedAdminData.setUpdatedBy("someUserId");
        updatedAdminData.setUpdatedOn("currentTimestamp");

        dto.setAdminData(updatedAdminData);

        doNothing().when(mapper).updateEmployee(dto, employee);
        when(employeesRepository.update(employee)).thenReturn(existingEmployee);

        EmployeeDto result = employeesService.update(id, dto, ifMatch);

        assertNotNull(result);
        assertEquals(id, result.getId());
        assertEquals("someUserId", result.getAdminData().getUpdatedBy());
    }

    @Test
    public void testUpdate_InvalidId() throws NotFoundException {
        setUp();
        String id = "123";
        String ifMatch = "abc";
        EmployeeDto dto = new EmployeeDto();
        dto.setEmail("employee@email.com");

        when(employeesRepository.findById(id)).thenReturn(null);

        assertThrows(NotFoundException.class, () -> employeesService.update(id, dto, ifMatch));
    }

    @Test
    public void testUpdate_NullExistingEmployee() throws NotFoundException {
        setUp();
        String id = "123";
        String ifMatch = "abc";
        EmployeeDto dto = new EmployeeDto();
        dto.setEmail("employee@email.com");

        when(employeesRepository.findById(id)).thenReturn(null);

        assertThrows(NotFoundException.class, () -> employeesService.update(id, dto, ifMatch));
    }

    @Test
    public void testUpdate_NullUserId() throws NotFoundException {
        setUp();
        String id = "123";
        String ifMatch = "abc";
        EmployeeDto dto = new EmployeeDto();
        dto.setEmail("employee@email.com");

        Employee existingEmployee = new Employee();
        existingEmployee.setId(id);
        existingEmployee.setEmail("employee1@email.com");

        when(employeesRepository.findById(id)).thenReturn(existingEmployee);
        when(mapper.EmployeeToDto(existingEmployee)).thenReturn(dto);
        RequestContext.RequestContextBuilder authTokenResult = RequestContext.builder().authToken("ABC123");
        RequestContext.RequestContextBuilder destinationResult = authTokenResult.caseStatus(caseStatus)
                .destination(null);
        RequestContext buildResult2 = destinationResult.extensionFields(extFields)
                .language("en")
                .userId("3f32e6e4-8bf2-411e-90a6-87e27f663f4b")
                .userToken("ABC123")
                .build();
        when(requestContextProvider.getRequestContext()).thenReturn(buildResult2);

        assertThrows(Exception.class, () -> employeesService.update(id, dto, ifMatch));
    }

    @Test
    public void testUpdate_NullRepositoryResult() throws NotFoundException {
        setUp();
        String id = "123";
        String ifMatch = "abc";
        EmployeeDto dto = new EmployeeDto();
        dto.setEmail("employee@email.com");

        Employee existingEmployee = new Employee();
        existingEmployee.setId(id);
        existingEmployee.setEmail("employee1@email.com");

        when(employeesRepository.findById(id)).thenReturn(existingEmployee);
        when(mapper.EmployeeToDto(existingEmployee)).thenReturn(dto);
        RequestContext.RequestContextBuilder authTokenResult = RequestContext.builder().authToken("ABC123");
        RequestContext.RequestContextBuilder destinationResult = authTokenResult.caseStatus(caseStatus)
                .destination(null);
        RequestContext buildResult2 = destinationResult.extensionFields(extFields)
                .language("en")
                .userId("3f32e6e4-8bf2-411e-90a6-87e27f663f4b")
                .userToken("ABC123")
                .build();
        when(requestContextProvider.getRequestContext()).thenReturn(buildResult2);
        when(employeesRepository.update(any(Employee.class))).thenReturn(null);

        assertThrows(Exception.class, () -> employeesService.update(id, dto, ifMatch));
    }

    @Test
    public void testUpdate_NullDtoResult() throws NotFoundException {
        setUp();
        String id = "123";
        String ifMatch = "abc";
        EmployeeDto dto = new EmployeeDto();
        dto.setEmail("employee@email.com");

        Employee existingEmployee = new Employee();
        existingEmployee.setId(id);
        existingEmployee.setEmail("employee1@email.com");

        Employee updatedEmployee = new Employee();
        updatedEmployee.setId(id);
        updatedEmployee.setEmail(dto.getEmail());

        when(employeesRepository.findById(id)).thenReturn(existingEmployee);
        when(mapper.EmployeeToDto(existingEmployee)).thenReturn(dto);
        RequestContext.RequestContextBuilder authTokenResult = RequestContext.builder().authToken("ABC123");
        RequestContext.RequestContextBuilder destinationResult = authTokenResult.caseStatus(caseStatus)
                .destination(null);
        RequestContext buildResult2 = destinationResult.extensionFields(extFields)
                .language("en")
                .userId("3f32e6e4-8bf2-411e-90a6-87e27f663f4b")
                .userToken("ABC123")
                .build();
        when(requestContextProvider.getRequestContext()).thenReturn(buildResult2);
        when(employeesRepository.update(any(Employee.class))).thenReturn(updatedEmployee);
        when(mapper.EmployeeToDto(updatedEmployee)).thenReturn(null);

        assertThrows(Exception.class, () -> employeesService.update(id, dto, ifMatch));
    }

    @Test
    void testDelete() throws NotFoundException {
        Employee employee = getEmployees().get(0);
        doNothing().when(employeesRepository).delete(Mockito.any());
        when(employeesRepository.findById(Mockito.any())).thenReturn(employee);
        EmployeeDto.EmployeeDtoBuilder builderResult = EmployeeDto.builder();
        AdminData adminData = AdminData.builder()
                .createdBy("b4042340-3a8b-42b3-b983-5db33caa331b")
                .createdOn("2024-01-09 10:45:27.445000000")
                .updatedBy("b4042340-3a8b-42b3-b983-5db33caa331b")
                .updatedOn("2024-01-09 10:45:27.445000000")
                .build();
        EmployeeDto buildResult = builderResult.adminData(adminData)
                .btpUserId("8f32e6e4-8bf2-411e-90a6-87e27f663f41")
                .id("3f32e6e4-8bf2-411e-90a6-87e27f663f4b")
                .email("employee@email.com")
                .name("Employee Name")
                .roleName("Service Advisor")
                .roleCode(R22)
                .build();
        when(mapper.EmployeeToDto(Mockito.any())).thenReturn(buildResult);

        employeesService.delete("3f32e6e4-8bf2-411e-90a6-87e27f663f4b");

        verify(mapper).EmployeeToDto(Mockito.any());
        verify(employeesRepository).delete(Mockito.any());
        verify(employeesRepository).findById(Mockito.any());
    }

    @Test
    void testDelete_DataAccessException() {
        String id = "42";
        NotFoundException exception = assertThrows(NotFoundException.class, () -> employeesService.delete(id));
        assertEquals(Constants.Messages.EMPLOYEE_RESOURCE_NOT_FOUND, exception.getMessage());
    }
    @Test
    void testGetCurrentUserInfo() {
        RequestContext context = getRequestContext();
        when(requestContextProvider.getRequestContext()).thenReturn(context);
        UserDto dto = employeesService.getCurrentUser();
        assertEquals(dto.getUserId(), "36addd73-5f39-11ea-9efa-9b0ce15ed32c");
        assertEquals(dto.getUserName(), "John Doe");
        assertTrue(dto.getScopes().contains("ViewJobCardService"));
    }

    private static List<Employee> getEmployees() {
        Employee employee = new Employee("3f32e6e4-8bf2-411e-90a6-87e27f663f4b",
                "8f32e6e4-8bf2-411e-90a6-87e27f663f41",
                "employee@email.com",
                "Employee Name",
                "Service Advisor",
                R22,
                "2024-01-02 11:05:05.242000000",
                "2024-01-02 11:05:05.242000000",
                "e12ed5b2-a3d9-439e-b689-b85775f3936e",
                "e12ed5b2-a3d9-439e-b689-b85775f3936e");

        List<Employee> employeeList = new ArrayList<>();
        employeeList.add(employee);
        return employeeList;
    }
    private RequestContext getRequestContext(){
        RequestContext requestContext =  RequestContext
                .builder()
                .userId("36addd73-5f39-11ea-9efa-9b0ce15ed32c")
                .userName("John Doe")
                .authToken("authToken")
                .language("en-us")
                .roles(Arrays.asList("ViewJobCardService", "EditTask"))
                .scopes(Arrays.asList("ViewJobCardService", "EditTask"))
                .build();
        return requestContext;
    }

}
