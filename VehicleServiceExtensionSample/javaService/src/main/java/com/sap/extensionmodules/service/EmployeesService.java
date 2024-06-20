package com.sap.extensionmodules.service;

import com.sap.extensionmodules.Utils.EmployeeSpecification;
import com.sap.extensionmodules.Utils.UpdateChecker;
import com.sap.extensionmodules.dtos.AdminData;
import com.sap.extensionmodules.dtos.EmployeeDto;
import com.sap.extensionmodules.dtos.UserDto;
import com.sap.extensionmodules.dtos.query.QueryDTOHelper;
import com.sap.extensionmodules.dtos.query.QueryRequestDTO;
import com.sap.extensionmodules.entity.Employee;
import com.sap.extensionmodules.mappers.VehicleServiceMapper;
import com.sap.extensionmodules.repository.EmployeesRepository;
import com.sap.extensionmodules.security.RequestContext;
import com.sap.extensionmodules.security.RequestContextProvider;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

import static com.sap.extensionmodules.commons.Constants.Messages.EMPLOYEE_RESOURCE_NOT_FOUND;

@Service
public class EmployeesService {

    @Autowired
    private EmployeesRepository employeesRepository;

    @Autowired
    RequestContextProvider requestContextProvider;

    @Autowired
    private VehicleServiceMapper mapper;

    @Autowired
    QueryDTOHelper queryDTOHelper;

    public EmployeeDto create(EmployeeDto employeeDto) {
        Date date = Calendar.getInstance().getTime();
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS000000");
        String strDate = dateFormat.format(date);
        AdminData adminData = new AdminData(
                strDate,strDate,requestContextProvider.getRequestContext().getUserId(),requestContextProvider.getRequestContext().getUserId());
        employeeDto.setAdminData(adminData);
        Employee entity = employeesRepository.create(mapper.EmployeeDtoToServices(employeeDto));
        return mapper.EmployeeToDto(entity);
    }

    public List<EmployeeDto> findAll(Optional<String> filter) {
        List<EmployeeDto> dtoList = new ArrayList<>();
        QueryRequestDTO queryRequestDTO = queryDTOHelper.buildRequestDTO(filter);
        EmployeeSpecification spec = null;
        if(queryRequestDTO.getFilterOptions() != null) {
            spec = new EmployeeSpecification(queryRequestDTO.getFilterOptions().get(0));
        }
        List<Employee> entity = employeesRepository.findAll(spec);
        for (Employee employee : entity) {
            EmployeeDto dto = mapper.EmployeeToDto(employee);
            dtoList.add(dto);
        }
        return dtoList;
    }

    public EmployeeDto findById(String id) throws NotFoundException {
        Employee entity = employeesRepository.findById(id);
        return mapper.EmployeeToDto(entity);
    }

    public EmployeeDto update(String id, EmployeeDto dto, String ifMatch) throws NotFoundException {
        Employee employee = new Employee();
        Date date = Calendar.getInstance().getTime();
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS000000");
        String strDate = dateFormat.format(date);
        EmployeeDto existingEmployee = mapper.EmployeeToDto(employeesRepository.findById(id));

        if(existingEmployee == null) {
            throw new NotFoundException(EMPLOYEE_RESOURCE_NOT_FOUND);
        } else {
            //UpdateChecker.isUpdateOnLatestData(ifMatch, existingEmployee.getAdminData().getUpdatedOn());
            AdminData adminData = new AdminData(
                    existingEmployee.getAdminData().getCreatedOn(), strDate,
                    existingEmployee.getAdminData().getCreatedBy(),
                    requestContextProvider.getRequestContext().getUserId());
            dto.setAdminData(adminData);

            mapper.updateEmployee(dto, employee);
            Employee entity = employeesRepository.update(employee);
            return mapper.EmployeeToDto(entity);
        }
    }

    public EmployeeDto delete(String id) throws NotFoundException {
        Employee entity = employeesRepository.findById(id);
        if (entity == null) {
            throw new NotFoundException(EMPLOYEE_RESOURCE_NOT_FOUND);
        }
        EmployeeDto employeeDto = mapper.EmployeeToDto(entity);
        employeesRepository.delete(entity);
        return employeeDto;
    }

    public UserDto getCurrentUser() {
        RequestContext context = requestContextProvider.getRequestContext();
        UserDto result = UserDto.builder()
                .userId(context.getUserId())
                .userName((context.getUserName()))
                .scopes(context.getScopes()).build();
        return result;
    }
}
