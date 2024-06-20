package com.sap.extensionmodules.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.sap.extensionmodules.commons.APIConstants;
import lombok.*;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import java.util.List;


@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
//@JsonInclude(JsonInclude.Include.NON_NULL)
public class JobCardDto {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;
    private int displayId;
    private String caseId;
    private String caseDisplayId;
    private RegisteredProduct  registeredProduct; //RegisteredProduct
    private List<String> customerComplaints;
    private int milometer;
    private List<JobCardServicesDto> servicesSelected;
    private String status; //Status
    private String estimatedCompletionDate;
    private AdminData adminData;
    private String statusDescription;
    private String model;
    private String vehicleNumber;
    private final String source = APIConstants.JAVA_SERVICE;


//    private RegisteredProduct  registeredProduct; //RegisteredProduct
//    private List<String> customerComplaints;
//    private int milometer;
    private String serviceAdvisor;
    private CustomerDetails customerDetails; //CustomerDetails
//    @Nullable
//    private String estimatedCompletionDate;
//    private String createdOn;
//    private String updatedOn;
//    private String createdBy;
//    private String updatedBy;
//    private List<JobCardServicesDto> servicesSelected;



}
