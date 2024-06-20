package com.sap.extensionmodules.controller;

import com.itextpdf.text.DocumentException;
import com.sap.extensionmodules.commons.APIConstants;
import com.sap.extensionmodules.commons.Constants;
import com.sap.extensionmodules.dtos.JobCardDto;
import com.sap.extensionmodules.service.InvoiceService;
import com.sap.extensionmodules.service.JobCardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Optional;

@RestController
public class InvoiceController {
    @Autowired
    JobCardService service;

    @Autowired InvoiceService invoiceService;
    @RequestMapping(value = APIConstants.SERVICE_PREFIX +"/generate-invoice", method = RequestMethod.GET, produces = MediaType.APPLICATION_PDF_VALUE)
    @PreAuthorize("hasAuthority('GenerateInvoice')")
    public ResponseEntity<InputStreamResource> generatePDF(@RequestParam(value = Constants.QUERY_OPTION_FILTER, required = false)
                                                               Optional<String> filter) throws DocumentException, IOException {

        String id = filter.get().split(Constants.SPACE_DELIMITER)[2].replace(Constants.QUOTES_DELIMITER, "")
                .replace(Constants.SINGLE_QUOTES_DELIMITER, "");
        JobCardDto dto = service.findByCaseId(id, true);
        ByteArrayInputStream bis =  invoiceService.generateInvoice(dto);
        invoiceService.createInvoice(dto);
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));

    }

}
