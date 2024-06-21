package com.sap.extensionmodules.repository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sap.extensionmodules.commons.JCStatus;
import com.sap.extensionmodules.commons.ServiceStatus;
import com.sap.extensionmodules.dtos.*;
import com.sap.extensionmodules.exception.CustomNotFoundException;
import com.sap.extensionmodules.entity.JobCard;
import com.sap.extensionmodules.entity.JobCardServices;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

public class JobCardServicesRepositoryTest {
    @InjectMocks
    private JobCardServicesRepository jobCardServicesRepository;
    @Mock
    private JobCardServicesRepositoryInterface jobCardServicesRepositoryInterface;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    JobCardServicesDto jobCardServicesDto1 = JobCardServicesDto.builder()
            .id("5d876d79-caf6-421b-8b2c-190cea9a137e")
            .service("Brake pad replacement")
            .price("99.99")
            .technician(null)
            .status(ServiceStatus.Z21.toString())
            .startTime(null)
            .endTime(null)
            .notes("A2    ")
            .observation(null)
            .adminData(AdminData.builder()
                    .createdOn("2022-05-10T11:55:47.397Z")
                    .updatedOn("2023-04-10T11:55:47.397Z")
                    .createdBy("34042340-3a8b-42b3-b983-5db33caa331d")
                    .updatedBy("34042340-3a8b-42b3-b983-5db33caa331d")
                    .build())
            .build();
    JobCardServicesDto jobCardServicesDto2 = JobCardServicesDto.builder()
            .id("a9cd57cd-f61a-4d7f-9f87-dc031d5b95fb")
            .service("Air filter replacement")
            .price("49.99")
            .status(ServiceStatus.Z21.toString())
            .startTime(null)
            .endTime(null)
            .notes("B2    ")
            .observation(null)
            .adminData(AdminData.builder()
                    .createdOn("2022-05-10T11:55:47.397Z")
                    .updatedOn("2023-04-10T11:55:47.397Z")
                    .createdBy("34042340-3a8b-42b3-b983-5db33caa331d")
                    .updatedBy("34042340-3a8b-42b3-b983-5db33caa331d")
                    .build())
            .build();

    public List<JobCardServicesDto> jobCardServicesDtoList1() {
        List<JobCardServicesDto> jobCardServicesDtoList = new ArrayList<>();
        jobCardServicesDtoList.add(jobCardServicesDto1);
        jobCardServicesDtoList.add(jobCardServicesDto2);
        return jobCardServicesDtoList;
    }

    public List<JobCardServicesDto> jobCardServicesDtoList2() {
        List<JobCardServicesDto> jobCardServicesDtoList = new ArrayList<>();
        jobCardServicesDtoList.add(jobCardServicesDto2);
        return jobCardServicesDtoList;
    }

    JobCardDto jobCardDto1 = JobCardDto.builder()
            .id("16da4bc2-a8cc-4ba6-a7a5-ef69802ce177")
            .displayId(1)
            .caseId("d886b468-ed95-11ed-a6bd-5354a6389ba0")
            .caseDisplayId("536")
            .status(JCStatus.Z13.toString())
            .registeredProduct(RegisteredProduct.builder()
                    .vehicleNumber("KA01MJ5010")
                    .dateOfPurchase("2023-04-14T00:00:00Z")
                    .model("TATA Nexon XMA")
                    .build())
            .customerComplaints(List.of("item1", "item2", "item3"))
            .milometer(4863)
            .serviceAdvisor("Sandra Webber")
            .customerDetails(CustomerDetails.builder()
                    .name("Mathew Jonas")
                    .contactNumber("1234567890")
                    .build())
            .estimatedCompletionDate("2023-05-10T11:55:47.397Z")
            .adminData(AdminData.builder()
                    .createdOn("2022-05-10T11:55:47.397Z")
                    .updatedOn("2023-04-10T11:55:47.397Z")
                    .createdBy("34042340-3a8b-42b3-b983-5db33caa331d")
                    .updatedBy("34042340-3a8b-42b3-b983-5db33caa331d")
                    .build())
            .servicesSelected(jobCardServicesDtoList1())
            .build();

    JobCardDto jobCardDto2 = JobCardDto.builder()
            .id("c7e9469a-1b6b-42c6-9580-28ed4a994346")
            .displayId(2)
            .caseId("2bfdd60f-da14-11ed-bf97-bb732c681de4")
            .caseDisplayId("451")
            .status(JCStatus.Z13.toString())
            .registeredProduct(RegisteredProduct.builder()
                    .vehicleNumber("KA01MJ5010")
                    .dateOfPurchase("2023-04-14T00:00:00Z")
                    .model("AHT Combi 110e")
                    .build())
            .customerComplaints(List.of("item1", "item2", "item3"))
            .milometer(3400)
            .serviceAdvisor("Sandra Webber")
            .customerDetails(CustomerDetails.builder()
                    .name("Andrew Jonas")
                    .contactNumber("1234567890")
                    .build())
            .estimatedCompletionDate("2023-05-10T11:55:47.397Z")
            .adminData(AdminData.builder()
                    .createdOn("2023-05-10T11:55:47.397Z")
                    .updatedOn("2023-04-10T11:55:47.397Z")
                    .createdBy("b4042340-3a8b-42b3-b983-5db33caa331d")
                    .updatedBy("b4042340-3a8b-42b3-b983-5db33caa331d")
                    .build())
            .servicesSelected(jobCardServicesDtoList2())
            .build();

    public List<JobCardDto> jobCardDtoList() {
        List<JobCardDto> jobCardDtoList = new ArrayList<>();
        jobCardDtoList.add(jobCardDto1);
        jobCardDtoList.add(jobCardDto2);
        return jobCardDtoList;
    }

    public JobCard jobCardEntity(JobCardDto jobCardDto) throws JsonProcessingException {
        JobCard entity = new JobCard();
        entity.setId(jobCardDto.getId());
        entity.setDisplayId(jobCardDto.getDisplayId());
        entity.setCaseId(jobCardDto.getCaseId());
        entity.setCaseDisplayId(jobCardDto.getCaseDisplayId());
        entity.setStatus(jobCardDto.getStatus());
        entity.setRegisteredProduct(jobCardDto.getRegisteredProduct());
        entity.setCustomerComplaints(new ObjectMapper().writeValueAsString(jobCardDto.getCustomerComplaints()));
        entity.setMilometer(jobCardDto.getMilometer());

        entity.setEstimatedCompletionDate(jobCardDto.getEstimatedCompletionDate());
        entity.setCreatedOn(jobCardDto.getAdminData().getCreatedOn());
        entity.setUpdatedOn(jobCardDto.getAdminData().getUpdatedOn());
        entity.setCreatedBy(jobCardDto.getAdminData().getCreatedBy());
        entity.setUpdatedBy(jobCardDto.getAdminData().getUpdatedBy());

        List<JobCardServicesDto> servicesDtos = jobCardDto.getServicesSelected();
        List<JobCardServices> jobCardServicesList = new ArrayList<>();
        for (JobCardServicesDto serviceDto : servicesDtos) {
            jobCardServicesList.add(jobCardServicesEntity(serviceDto));
        }
        entity.setServicesSelected(jobCardServicesList);
        return entity;
    }

    public JobCardServices jobCardServicesEntity(JobCardServicesDto jobCardServicesDto) throws JsonProcessingException {
        JobCardServices jobCardServices = new JobCardServices();
        jobCardServices.setId(jobCardServicesDto.getId());
        jobCardServices.setService(jobCardServicesDto.getService());
        jobCardServices.setPrice(jobCardServicesDto.getPrice());
        jobCardServices.setStatus(jobCardServicesDto.getStatus());
        jobCardServices.setStartTime(jobCardServicesDto.getStartTime());
        jobCardServices.setEndTime(jobCardServicesDto.getEndTime());
        jobCardServices.setNotes(new ObjectMapper().writeValueAsString(jobCardServicesDto.getNotes()));
        jobCardServices.setObservation(jobCardServicesDto.getObservation());
        jobCardServices.setCreatedOn(jobCardServicesDto.getAdminData().getCreatedOn());
        jobCardServices.setUpdatedOn(jobCardServicesDto.getAdminData().getUpdatedOn());
        jobCardServices.setCreatedBy(jobCardServicesDto.getAdminData().getCreatedBy());
        jobCardServices.setUpdatedBy(jobCardServicesDto.getAdminData().getUpdatedBy());

        return jobCardServices;
    }

    @Test
    void testFindOneBy_Success() throws JsonProcessingException {
        String jobCardServiceId = "5d876d79-caf6-421b-8b2c-190cea9a137e";
        JobCardServices mockEntity = jobCardServicesEntity(jobCardServicesDto1);
        when(jobCardServicesRepositoryInterface.findById(jobCardServiceId)).thenReturn(mockEntity);
        JobCardServices result = jobCardServicesRepository.findOneBy(jobCardServiceId);
        assertEquals(mockEntity, result);
        verify(jobCardServicesRepositoryInterface, times(1)).findById(jobCardServiceId);
    }

    @Test
    void testFindOneBy_NotFound() {

        String jobCardServiceId = "123";
        when(jobCardServicesRepositoryInterface.findById(jobCardServiceId)).thenReturn(null);
        assertThrows(CustomNotFoundException.class, () -> jobCardServicesRepository.findOneBy(jobCardServiceId));
        verify(jobCardServicesRepositoryInterface, times(1)).findById(jobCardServiceId);
    }

    @Test
    void testFindOneBy_DataAccessException() {

        String jobCardServiceId = "123";
        when(jobCardServicesRepositoryInterface.findById(jobCardServiceId)).thenThrow(new DataAccessException("") {
        });
        assertThrows(CustomNotFoundException.class, () -> jobCardServicesRepository.findOneBy(jobCardServiceId));
        verify(jobCardServicesRepositoryInterface, times(1)).findById(jobCardServiceId);
    }

    @Test
    void testUpdate_Success() {

        JobCardServices jobCardServices = new JobCardServices();
        when(jobCardServicesRepositoryInterface.save(jobCardServices)).thenReturn(jobCardServices);
        JobCardServices result = jobCardServicesRepository.update(jobCardServices);
        assertEquals(jobCardServices, result);
        verify(jobCardServicesRepositoryInterface, times(1)).save(jobCardServices);
    }

    @Test
    void testUpdate_DataIntegrityViolationException() {

        JobCardServices jobCardServices = new JobCardServices();
        when(jobCardServicesRepositoryInterface.save(jobCardServices)).thenThrow(new DataIntegrityViolationException(""));
        assertThrows(CustomNotFoundException.class, () -> jobCardServicesRepository.update(jobCardServices));
        verify(jobCardServicesRepositoryInterface, times(1)).save(jobCardServices);
    }

    @Test
    void testUpdate_DataAccessException() {

        JobCardServices jobCardServices = new JobCardServices();
        when(jobCardServicesRepositoryInterface.save(jobCardServices)).thenThrow(new DataAccessException("") {
        });
        assertThrows(CustomNotFoundException.class, () -> jobCardServicesRepository.update(jobCardServices));
        verify(jobCardServicesRepositoryInterface, times(1)).save(jobCardServices);
    }


}
