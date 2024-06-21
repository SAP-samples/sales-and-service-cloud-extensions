package com.sap.extensionmodules.controller;

import com.sap.cloud.sdk.services.openapi.core.OpenApiRequestException;
import com.sap.extensionmodules.Utils.StatusUtil;
import com.sap.extensionmodules.commons.Constants;
import com.sap.extensionmodules.commons.JCStatus;
import com.sap.extensionmodules.commons.ServiceStatus;
import com.sap.extensionmodules.dtos.*;
import com.sap.extensionmodules.exception.APIExceptionHandler;
import com.sap.extensionmodules.exception.CustomNotFoundException;
import com.sap.extensionmodules.exception.CustomValidationException;
import com.sap.extensionmodules.exception.ErrorResponse;
import javassist.NotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.sap.extensionmodules.service.JobCardService;

import java.rmi.ServerException;
import java.util.*;

import static com.sap.extensionmodules.commons.APIConstants.*;

@RestController
@Slf4j
@RequestMapping(SERVICE_PREFIX + REST_PATH_JOBCARDS)
public class JobCardController {
    @Autowired
    JobCardService jobCardService;
    @Autowired
    StatusUtil statusUtil;

    @PostMapping()
    @PreAuthorize("hasAuthority('CreateJobCard')")
    public ResponseEntity<?> createJobCard(@RequestParam String sourceid,
                                           @RequestParam String sourceType) throws Exception {

        log.info("Creating job card for service form with id {}",sourceid);
        JobCardDto dto = jobCardService.createJobCard(sourceid, sourceType);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    //find all job cards or find by case ID
    @GetMapping()
    @PreAuthorize("hasAuthority('ViewJobCard')")
    public ResponseEntity<?> findAll
    (@RequestParam(value = Constants.QUERY_OPTION_FILTER, required = false)
     Optional<String> filter,
     @RequestParam(value = Constants.QUERY_OPTION_SEARCH, required = false)
     Optional<String> search,
     @RequestParam(value = Constants.QUERY_OPTION_TOP, required = false)
     Optional<Integer> top,
     @RequestParam(value = Constants.QUERY_OPTION_SKIP, required = false)
     Optional<Integer> skip,
     @RequestHeader(value = HttpHeaders.ACCEPT_LANGUAGE, required = false) String
             language) {
            List<JobCardDto> dtoList = jobCardService.findAll(filter, search, top, skip);
            String lang = (language != null) ? language : "en-US";
            for (JobCardDto dto : dtoList) {
                statusUtil.addStatusDescription(dto, lang);
            }
            log.info("Found {} job cards", dtoList.size());
            long count = jobCardService.getCount();
            return ResponseEntity.status(HttpStatus.OK).body(VehicleServiceResponseEntity.builder().value(dtoList).count(count).build());
    }

    @GetMapping("/{jobCardId}")
    @PreAuthorize("hasAuthority('ViewJobCard')")
    public ResponseEntity<?> findOne(@PathVariable String
                                             jobCardId, @RequestHeader(value = HttpHeaders.ACCEPT_LANGUAGE, required = false) String language) {

        JobCardDto dto = jobCardService.findOne(jobCardId);
        String lang = (language != null) ? language : "en-US";
        statusUtil.addStatusDescription(dto, lang);
        log.info("Found job card with ID {}: {}", jobCardId, dto);
        return ResponseEntity.status(HttpStatus.OK).body(dto);
    }

    //   PATCH request with ifMatch
    @PatchMapping("/{jobCardId}/services/{jobCardServiceId}")
    @PreAuthorize("hasAnyAuthority('EditJobCardService', 'EditTask')")
    public ResponseEntity<?> updateJobCardService(@PathVariable String jobCardId,
                                                  @PathVariable String jobCardServiceId,
                                                  @RequestBody JobCardServicesUpdateDto jobCardServicesUpdateDto,
                                                  @RequestHeader(name = HttpHeaders.IF_MATCH, required = false) String ifMatch) throws Exception{

        JobCardServicesDto dto = jobCardService.updateJobCardService(jobCardId, jobCardServiceId, jobCardServicesUpdateDto, ifMatch);
        log.info("Job card updated successfully: {}", dto);
        return ResponseEntity.status(HttpStatus.OK).body(dto);

    }

    @DeleteMapping("/{jobCardId}")
    @PreAuthorize("hasAuthority('DeleteJobCard')")
    public ResponseEntity<?> remove(@PathVariable String jobCardId) throws Exception {
        jobCardService.remove(jobCardId);
        Map<String, Object> response = Map.of("raw", Collections.emptyList(), "affected", 1);
        log.info("Job card deleted successfully with ID: {}", jobCardId);
        return ResponseEntity.ok(response);

    }

    @PostMapping("/validations")
    public ResponseEntity<?> findValidationStatus(@RequestBody Map<String, Object> body) {
            log.info("Calling job card validation service.");
            String entityName = (String) body.get("entity");
            Map<String, Object> sCompleteAggregateEntity = (Map<String, Object>) body.get("currentImage");
            JobCardValidationResponse response = jobCardService.findValidationStatusService(entityName, sCompleteAggregateEntity);
            return ResponseEntity.status(HttpStatus.OK).body(response);
    }

}
