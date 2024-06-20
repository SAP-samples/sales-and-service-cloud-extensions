package com.sap.extensionmodules.controller;

import com.sap.extensionmodules.commons.Constants;
import com.sap.extensionmodules.dtos.EmployeeDto;
import com.sap.extensionmodules.dtos.UserDto;
import com.sap.extensionmodules.exception.APIExceptionHandler;
import com.sap.extensionmodules.exception.ErrorResponse;
import com.sap.extensionmodules.service.EmployeesService;
import javassist.NotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static com.sap.extensionmodules.commons.APIConstants.*;

@Controller
@Slf4j
@RequestMapping(SERVICE_PREFIX + REST_PATH_EMPLOYEES)
public class EmployeesController {

    @Autowired
    private EmployeesService employeesService;

    @PostMapping
    @PreAuthorize("hasAuthority('MasterData')")
    public ResponseEntity<?> create(@RequestBody EmployeeDto employeeDto) throws Exception{
        employeeDto = employeesService.create(employeeDto);
        log.info("Employee created successfully: {}", employeeDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                    .body(employeeDto);

    }

    @GetMapping
    public ResponseEntity<?> findAll(@RequestParam(value = Constants.QUERY_OPTION_FILTER, required = false)
                                     Optional<String> filter) {
        List<EmployeeDto> dto = employeesService.findAll(filter);
        log.info("Found {} employees", dto.size());
        return ResponseEntity.status(HttpStatus.OK)
                    .body(dto);
    }

    @GetMapping(REST_PATH_ID)
    @PreAuthorize("hasAuthority('MasterData')")
    public ResponseEntity<?> findById(@PathVariable String id) throws NotFoundException{

        EmployeeDto dto = employeesService.findById(id);
        log.info("Found employee by ID {}: {}", id, dto);
        return ResponseEntity.status(HttpStatus.OK)
                    .body(dto);
    }

    @PatchMapping(REST_PATH_ID)
    @PreAuthorize("hasAuthority('MasterData')")
    public ResponseEntity<?> update(@PathVariable String id,
                                    @RequestBody EmployeeDto employeeDto,
                                    @RequestHeader(name = HttpHeaders.IF_MATCH, required = false) String ifMatch) throws Exception{
        EmployeeDto result = employeesService.update(id, employeeDto, ifMatch);
        log.info("Employee updated successfully: {}", result);
        return ResponseEntity.status(HttpStatus.OK)
                .body(result);

    }

    @DeleteMapping(REST_PATH_ID)
    @PreAuthorize("hasAuthority('MasterData')")
    public ResponseEntity<?> delete(@PathVariable String id) throws Exception {
        employeesService.delete(id);
        log.info("Employee deleted successfully with ID: {}", id);
        Map<String, Object> response = Map.of("raw", Collections.emptyList(), "affected", 1);
        return ResponseEntity.ok(response);
    }
    @GetMapping("currentUserInfo")
    public ResponseEntity<?> findCurrentUser() {
        UserDto result = employeesService.getCurrentUser();
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
}
