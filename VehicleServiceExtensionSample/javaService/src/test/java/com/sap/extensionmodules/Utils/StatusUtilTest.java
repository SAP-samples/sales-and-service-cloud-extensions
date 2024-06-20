package com.sap.extensionmodules.Utils;

import com.sap.extensionmodules.dtos.JobCardDto;
import com.sap.extensionmodules.dtos.JobCardServicesDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.ArrayList;
import java.util.List;
import java.util.ResourceBundle;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;


@RunWith(MockitoJUnitRunner.class)
class StatusUtilTest {

    private ResourceBundle resourceBundle;

    @InjectMocks
    private StatusUtil statusUtil;

    @Spy
    StatusUtil utilSpy;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddStatusDescription() {
        JobCardDto dto = new JobCardDto();
        dto.setStatus("Z01");

        JobCardServicesDto service1 = new JobCardServicesDto();
        service1.setStatus("Z11");

        JobCardServicesDto service2 = new JobCardServicesDto();
        service2.setStatus("Z12");

        List<JobCardServicesDto> services = new ArrayList<>();
        services.add(service1);
        services.add(service2);

        dto.setServicesSelected(services);

       // when(utilSpy.getDescription("Z01", "en-US")).thenReturn("Draft");
        //when(resourceBundle.getString("Z11")).thenReturn("Booked");
        //when(resourceBundle.getString("Z12")).thenReturn("In Progress");

        JobCardDto resultDto = statusUtil.addStatusDescription(dto, "en_US");
        assertEquals("Draft", resultDto.getStatusDescription());

        for (JobCardServicesDto service : resultDto.getServicesSelected()) {
            assertNotNull(service.getStatusDescription());
        }
    }


    @Test
    void testGetDescription() {
        //when(utilSpy.getDescription("Z21", "en-US")).thenReturn("New");

        String description = statusUtil.getDescription("Z21", "en_US");

        assertEquals("New", description);
    }
}

