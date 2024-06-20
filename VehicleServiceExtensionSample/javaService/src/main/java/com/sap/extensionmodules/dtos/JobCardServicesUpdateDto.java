package com.sap.extensionmodules.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class JobCardServicesUpdateDto {
    private TechnicianDto technician;
    private String observation;
   // private String message = "Invalid Status";
    private String status;
    private String notes;
}