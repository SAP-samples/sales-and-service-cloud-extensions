package com.sap.extensionmodules.controller;

import com.sap.extensionmodules.dtos.ServicesDto;
import com.sap.extensionmodules.exception.APIExceptionHandler;
import com.sap.extensionmodules.exception.ErrorResponse;
import com.sap.extensionmodules.service.ServicesService;
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

import static com.sap.extensionmodules.commons.APIConstants.*;

@Controller
@Slf4j
@RequestMapping(SERVICE_PREFIX + REST_PATH_SERVICES)
public class ServicesController {

    @Autowired
    private ServicesService servicesService;

    @PostMapping
    @PreAuthorize("hasAuthority('MasterData')")
    public ResponseEntity<?> create(@RequestBody ServicesDto servicesDto) {
        servicesDto = servicesService.create(servicesDto);
        log.info("Service created successfully: {}", servicesDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(servicesDto);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('MasterData')")
    public ResponseEntity<?> findAll() {
        List<ServicesDto> dto = servicesService.findAll();
        log.info("Found {} services", dto.size());
        return ResponseEntity.status(HttpStatus.OK)
                .body(dto);
    }

    @GetMapping(REST_PATH_ID)
    @PreAuthorize("hasAuthority('MasterData')")
    public ResponseEntity<?> findById(@PathVariable String id) throws NotFoundException {
        ServicesDto dto = servicesService.findById(id);
        log.info("Found service by ID {}: {}", id, dto);
        return ResponseEntity.status(HttpStatus.OK)
                .body(dto);
    }

    @PatchMapping(REST_PATH_ID)
    @PreAuthorize("hasAuthority('MasterData')")
    public ResponseEntity<?> update(@PathVariable String id,
                                    @RequestBody ServicesDto servicesDto,
                                    @RequestHeader(name = HttpHeaders.IF_MATCH, required = false) String ifMatch) throws NotFoundException {
        ServicesDto result = servicesService.update(id, servicesDto, ifMatch);
        log.info("Service updated successfully: {}", result);
        return ResponseEntity.status(HttpStatus.OK)
                .body(result);
    }

    @DeleteMapping(REST_PATH_ID)
    @PreAuthorize("hasAuthority('MasterData')")
    public ResponseEntity<?> delete(@PathVariable String id) throws NotFoundException {
        servicesService.delete(id);
        log.info("Service deleted successfully with ID: {}", id);
        Map<String, Object> response = Map.of("raw", Collections.emptyList(), "affected", 1);
        return ResponseEntity.ok(response);
    }
}
