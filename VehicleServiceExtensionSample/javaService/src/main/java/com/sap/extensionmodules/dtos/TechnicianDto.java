package com.sap.extensionmodules.dtos;

import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TechnicianDto {
    private String btpUserId = "";
    private String name = "";
}
