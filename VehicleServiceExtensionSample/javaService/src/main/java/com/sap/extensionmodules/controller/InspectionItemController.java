package com.sap.extensionmodules.controller;

import com.sap.extensionmodules.dtos.InspectionItemDto;
import com.sap.extensionmodules.exception.APIExceptionHandler;
import com.sap.extensionmodules.service.InspectionItemService;
import com.sap.extensionmodules.exception.ErrorResponse;
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
@RequestMapping(SERVICE_PREFIX + REST_PATH_INSPECTION_ITEMS)
public class InspectionItemController {

    @Autowired
    InspectionItemService inspectionItemService;

    @PostMapping()
    @PreAuthorize("hasAuthority('MasterData')")
    public ResponseEntity<?> create(@RequestBody InspectionItemDto inspectionItemDto) throws Exception{
        inspectionItemDto = inspectionItemService.create(inspectionItemDto);
        log.info("Inspection item created successfully: {}", inspectionItemDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                    .body(inspectionItemDto);
    }

    @GetMapping()
    @PreAuthorize("hasAuthority('MasterData')")
    public ResponseEntity<?> findAll() {
        List<InspectionItemDto> dtoList = inspectionItemService.findAll();
        log.info("Found {} inspection items", dtoList.size());
        return ResponseEntity.status(HttpStatus.OK)
                    .body(dtoList);
    }

    @GetMapping(REST_PATH_ID)
    @PreAuthorize("hasAuthority('MasterData')")
    public ResponseEntity<?> findById(@PathVariable String id) throws Exception {
        InspectionItemDto dto = inspectionItemService.findById(id);
        log.info("Found inspection item by ID {}: {}", id, dto);
        return ResponseEntity.status(HttpStatus.OK).body(dto);
    }

    @PatchMapping(REST_PATH_ID)
    @PreAuthorize("hasAuthority('MasterData')")
    public ResponseEntity<?> update(@PathVariable String id,
                                    @RequestBody InspectionItemDto dto,
                                    @RequestHeader(name = HttpHeaders.IF_MATCH, required = false) String ifMatch) throws Exception {
        InspectionItemDto result = inspectionItemService.update(id, dto, ifMatch);
        log.info("Inspection item updated successfully: {}", result);
        return ResponseEntity.status(HttpStatus.OK)
                    .body(result);
    }

    @DeleteMapping(REST_PATH_ID)
    @PreAuthorize("hasAuthority('MasterData')")
    public ResponseEntity<?> delete(@PathVariable String id) throws NotFoundException {
        inspectionItemService.delete(id);
        log.info("Inspection item deleted successfully with ID: {}", id);
        Map<String, Object> response = Map.of("raw", Collections.emptyList(), "affected", 1);
        return ResponseEntity.ok(response);
    }
}
