package com.sap.extensionmodules.dtos;

import lombok.*;

import java.util.List;
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private String userName;
    private String userId;
    private List<String> scopes;
}
