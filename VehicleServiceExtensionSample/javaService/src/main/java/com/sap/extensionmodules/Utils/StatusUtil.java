package com.sap.extensionmodules.Utils;

import com.sap.extensionmodules.dtos.JobCardDto;
import com.sap.extensionmodules.dtos.JobCardServicesDto;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.ResourceBundle;

@Service
public class StatusUtil {

    public static JobCardDto addStatusDescription(JobCardDto dto, String language){

        dto.setStatusDescription(getDescription(dto.getStatus(), language));
        for(JobCardServicesDto service:dto.getServicesSelected()){
            service.setStatusDescription(getDescription(service.getStatus(), language));
        }

        return dto;
    }

    public static String getDescription(String status, String language){
        Locale locale = new Locale(language);
        ResourceBundle rb = ResourceBundle.getBundle("Message", locale);
        return rb.getString(status);
    }
}
