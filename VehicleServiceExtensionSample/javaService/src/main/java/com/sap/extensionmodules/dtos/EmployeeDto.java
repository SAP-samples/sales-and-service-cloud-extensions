package com.sap.extensionmodules.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.sap.extensionmodules.commons.APIConstants;
import com.sap.extensionmodules.commons.RoleCodes;
import javax.validation.constraints.NotNull;

import lombok.*;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EmployeeDto {
    private String id;
    private String name;
    private String btpUserId;
    private String email;
    private RoleCodes roleCode;
    private String roleName;

    private AdminData adminData;
    private final String source = APIConstants.JAVA_SERVICE;

    public EmployeeDto(String name, String btpUserId, String email, RoleCodes roleCode) {
        this.name = name;
        this.btpUserId = btpUserId;
        this.email = email;
        this.roleCode = roleCode;
    }
}

