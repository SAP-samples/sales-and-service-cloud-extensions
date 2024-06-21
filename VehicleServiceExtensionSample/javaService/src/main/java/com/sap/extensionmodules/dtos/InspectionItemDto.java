package com.sap.extensionmodules.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.sap.extensionmodules.commons.APIConstants;
import lombok.*;


@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class InspectionItemDto {
    private String id;
    private String description;
    private Boolean isSelected = false;
    private AdminData adminData;
//    private AdminData adminData;
    public InspectionItemDto(String id, String description, Boolean isSelected){
        this.id = id;
        this.description = description;
        this.isSelected = isSelected;
    }
}
