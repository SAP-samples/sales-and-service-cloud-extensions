package com.sap.extensionmodules.dtos;

import lombok.*;

import javax.persistence.Embeddable;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class RegisteredProduct implements Serializable {

    private String vehicleNumber;

    private String dateOfPurchase;

    private String model;
}
