package com.sap.extensionmodules.dtos;
import com.sap.cnsmodules.model.RegisteredProductqueryresponseValueInnerServiceTechnician;
import com.sap.extensionmodules.commons.APIConstants;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;


@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
//@JsonInclude(JsonInclude.Include.NON_NULL)
public class JobCardServicesDto {
//    private String createdOn;
//    private String updatedOn;
//    private String createdBy;
//    private String updatedBy;
    private String id;
    private String service;
    private String price;
    private TechnicianDto technician;
    private String status;
    private String startTime;
    private String endTime;
    private String notes;
    private String observation;
    private String statusDescription;
    private com.sap.extensionmodules.dtos.AdminData adminData;

    private final String source = APIConstants.JAVA_SERVICE;
//    private AdminData adminData;
}
