package com.sap.extensionmodules.controller;

import com.sap.cloud.sdk.services.openapi.core.OpenApiRequestException;
import com.sap.extensionmodules.Utils.StatusUtil;
import com.sap.extensionmodules.commons.Constants;
import com.sap.extensionmodules.commons.SFStatus;
import com.sap.extensionmodules.dtos.ServiceFormDto;
import com.sap.extensionmodules.dtos.StatusDto;
import com.sap.extensionmodules.exception.APIExceptionHandler;
import com.sap.extensionmodules.exception.ErrorResponse;
import com.sap.extensionmodules.service.ServiceFormService;
import javassist.NotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpSession;
import java.rmi.ServerException;
import java.util.*;

import static com.sap.extensionmodules.commons.APIConstants.*;

@RestController
@Slf4j
@RequestMapping(SERVICE_PREFIX + REST_PATH_SERVICE_FORM)
public class ServiceFormController {
    @Autowired
    private ServiceFormService serviceFormService;

    @Autowired
    StatusUtil statusUtil;

    @PostMapping
    @PreAuthorize("hasAuthority('CreateServiceForm')")
    public ResponseEntity<?> create(@RequestBody ServiceFormDto serviceFormDto) throws Exception {

        log.info("Creating service form: {}", serviceFormDto);
        serviceFormDto = serviceFormService.create(serviceFormDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(serviceFormDto);

    }

    @GetMapping
    @PreAuthorize("hasAuthority('ViewServiceForm')")
    public ResponseEntity<?> findAll(@RequestHeader(value = HttpHeaders.ACCEPT_LANGUAGE, required = false) String language,
                                     @RequestParam(value = Constants.QUERY_OPTION_FILTER, required = false)
                                     Optional<String> filter) {
        List<ServiceFormDto> dtoList = serviceFormService.findAll(filter);
        String lang = (language != null) ? language : "en-US";
        for (ServiceFormDto dto : dtoList) {
            dto.setStatusDescription(statusUtil.getDescription(dto.getStatus(), lang));
        }
        log.info("Found {} service forms", dtoList.size());
        return ResponseEntity.status(HttpStatus.OK)
                .body(dtoList);
    }

//    @GetMapping(REST_PATH_ID)
//    @PreAuthorize("hasAuthority('ViewServiceForm')")
//    public ResponseEntity<?> findById(@PathVariable String id, @RequestHeader(value = HttpHeaders.ACCEPT_LANGUAGE, required = false) String language) throws NotFoundException {
//        ServiceFormDto dto;
//        dto = serviceFormService.findById(id);
//        String lang = (language != null) ? language : "en-US";
//        dto.setStatusDescription(statusUtil.getDescription(dto.getStatus(), lang));
//        log.info("Found service form by ID {}: {}", id, dto);
//        return ResponseEntity.status(HttpStatus.OK)
//                .body(dto);
//    }


    @PatchMapping(REST_PATH_ID)
    @PreAuthorize("hasAuthority('UpdateServiceForm')")
    public ResponseEntity<?> update(@PathVariable String id,
                                                 @RequestBody ServiceFormDto dto,
                                                 @RequestHeader(name = HttpHeaders.IF_MATCH, required = false) String ifMatch) throws NotFoundException {
        ServiceFormDto result = serviceFormService.update(id, dto, ifMatch);
        log.info("Service form updated successfully: {}", result);
        return ResponseEntity.status(HttpStatus.OK)
                .body(result);
    }

    @DeleteMapping(REST_PATH_ID)
    @PreAuthorize("hasAuthority('DeleteServiceForm')")
    public ResponseEntity<?> delete(@PathVariable String id) throws NotFoundException {
        serviceFormService.delete(id);
        log.info("Service form deleted successfully with ID: {}", id);
        Map<String, Object> response = Map.of("raw", Collections.emptyList(), "affected", 1);
        return ResponseEntity.ok(response);
    }

//    @GetMapping(REST_PATH_SERVICES_STATUSES)
//    public ResponseEntity<?> findAllSFStatus(@RequestHeader(value = HttpHeaders.ACCEPT_LANGUAGE, required = false) String language) {
//        List<StatusDto> dtoList = new ArrayList<>();
//        String lang = (language != null) ? language : "en-US";
//        for (SFStatus s : SFStatus.values()) {
//            String desc = statusUtil.getDescription(s.toString(), lang);
//            StatusDto dto = new StatusDto(s.toString(), desc);
//            dtoList.add(dto);
//        }
//        log.info("Found {} service form statuses", dtoList.size());
//        return ResponseEntity.status(HttpStatus.OK).body(dtoList);
//    }
}
