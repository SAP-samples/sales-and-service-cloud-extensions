package com.sap.extensionmodules.repository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sap.extensionmodules.Utils.JobCardSpecification;
import com.sap.extensionmodules.commons.Constants.Messages;
import com.sap.extensionmodules.commons.JCStatus;
import com.sap.extensionmodules.commons.ServiceStatus;
import com.sap.extensionmodules.dtos.*;
import com.sap.extensionmodules.exception.CustomNotFoundException;
import com.sap.extensionmodules.mappers.VehicleServiceMapper;
import com.sap.extensionmodules.entity.JobCard;
import com.sap.extensionmodules.entity.JobCardServices;
import com.sap.extensionmodules.service.JobCardService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class JobCardRepositoryTest {
    @Mock
    private JobCardRepositoryInterface jobCardRepositoryInterface;
    @InjectMocks
    private JobCardRepository jobCardRepository;

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
    public void testFindAllBy_Success() throws JsonProcessingException {
        JobCardSpecification spec = mock(JobCardSpecification.class);
        List<JobCard> entityList = new ArrayList<>();
        JobCard entity1 = jobCardEntity(jobCardDto1);
        entityList.add(entity1);
        JobCard entity2 = jobCardEntity(jobCardDto2);
        entityList.add(entity2);
        List<JobCard> mockJobCards = Arrays.asList(entity1, entity2);
        Pageable page = mock(Pageable.class);
        when(jobCardRepositoryInterface.findAll(spec, page)).thenReturn(new PageImpl<>(mockJobCards));

        List<JobCard> result = jobCardRepository.findAllBy(spec, page);

        assertEquals(mockJobCards, result);
        verify(jobCardRepositoryInterface).findAll(spec, page);
    }

    @Test
    public void testFindAllBy_Exception() {

        JobCardSpecification spec = mock(JobCardSpecification.class);
        Pageable page = mock(Pageable.class);
        when(jobCardRepositoryInterface.findAll(spec, page)).thenThrow(new DataAccessException("Mocked exception") {
        });

        try {
            jobCardRepository.findAllBy(spec, page);
            fail("Expected CustomNotFoundException, but no exception was thrown.");
        } catch (CustomNotFoundException e) {
            assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getCode());
            assertEquals(Messages.DB_ERROR, e.getMessage());
        }

        verify(jobCardRepositoryInterface).findAll(spec, page);
    }

    @Test
    public void testFindOneBy_Success() throws JsonProcessingException {
        String jobId = "16da4bc2-a8cc-4ba6-a7a5-ef69802ce177";
        JobCard entity1 = jobCardEntity(jobCardDto1);
        when(jobCardRepositoryInterface.findById(jobId)).thenReturn(entity1);

        JobCard result = jobCardRepository.findOneBy(jobId);

        assertEquals(entity1, result);
        verify(jobCardRepositoryInterface).findById(jobId);
    }

    @Test
    public void testFindOneBy_Exception() {
        String jobId = "16da4bc2-a8cc-4ba6-a7a5-ef69802ce177";
        when(jobCardRepositoryInterface.findById(jobId)).thenThrow(new DataAccessException("Mocked exception") {
        });
        try {
            jobCardRepository.findOneBy(jobId);

            fail("Expected CustomNotFoundException, but no exception was thrown.");
        } catch (CustomNotFoundException e) {
            assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getCode());
            assertEquals(Messages.DB_ERROR, e.getMessage());
        }
        verify(jobCardRepositoryInterface).findById(jobId);

    }

    @Test
    public void testFindOneBy_NotFound() {
        String jobId = "456";
        when(jobCardRepositoryInterface.findById(jobId)).thenReturn(null);

        try {
            jobCardRepository.findOneBy(jobId);

            fail("Expected CustomNotFoundException, but no exception was thrown.");
        } catch (CustomNotFoundException e) {
            assertEquals(HttpStatus.NOT_FOUND.value(), e.getCode());
            assertEquals(Messages.JOBCARD_ID_NOT_FOUND, e.getMessage());
        }

        verify(jobCardRepositoryInterface).findById(jobId);
    }

    @Test
    public void testFindOneByCaseId_Success() throws JsonProcessingException {
        String caseId = "d886b468-ed95-11ed-a6bd-5354a6389ba0";
        JobCard entity1 = jobCardEntity(jobCardDto1);
        when(jobCardRepositoryInterface.findByCaseId(caseId)).thenReturn(entity1);

        JobCard result = jobCardRepository.findOneByCaseId(caseId);

        assertEquals(entity1, result);
        verify(jobCardRepositoryInterface).findByCaseId(caseId);
    }

    @Test
    public void testFindOneByCaseId_NotFound() {
        String caseId = "456";

        when(jobCardRepositoryInterface.findByCaseId(caseId)).thenReturn(null);

        try {
            jobCardRepository.findOneByCaseId(caseId);

            fail("Expected CustomNotFoundException, but no exception was thrown.");
        } catch (CustomNotFoundException e) {
            assertEquals(HttpStatus.NOT_FOUND.value(), e.getCode());
            assertEquals(Messages.JOBCARD_ID_NOT_FOUND, e.getMessage());
        }
        verify(jobCardRepositoryInterface).findByCaseId(caseId);
    }

    @Test
    public void testFindOneByCaseId_Exception() {
        String caseId = "789";
        when(jobCardRepositoryInterface.findByCaseId(caseId)).thenThrow(new DataAccessException("Mocked exception") {
        });

        try {
            jobCardRepository.findOneByCaseId(caseId);
            fail("Expected CustomNotFoundException, but no exception was thrown.");
        } catch (CustomNotFoundException e) {
            assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getCode());
            assertEquals(Messages.DB_ERROR, e.getMessage());
        }

        verify(jobCardRepositoryInterface).findByCaseId(caseId);
    }

    @Test
    public void testCreate_Success() throws JsonProcessingException {
        JobCard inputJobCard = jobCardEntity(jobCardDto1);
        JobCard savedJobCard = jobCardEntity(jobCardDto1);
        when(jobCardRepositoryInterface.save(inputJobCard)).thenReturn(savedJobCard);

        JobCard result = jobCardRepository.create(inputJobCard);
        assertEquals(savedJobCard, result);
        verify(jobCardRepositoryInterface).save(inputJobCard);
    }

    @Test
    void testCreateJobCard_DataAccessException() {

        JobCard jobCard = new JobCard();
        when(jobCardRepositoryInterface.save(any(JobCard.class))).thenThrow(new DataAccessException("") {
        });

        assertThrows(CustomNotFoundException.class, () -> jobCardRepository.create(jobCard));
        verify(jobCardRepositoryInterface, times(1)).save(jobCard);
    }

    @Test
    void testCreateJobCard_DataIntegrityViolationException() {
        JobCard jobCard = new JobCard();
        when(jobCardRepositoryInterface.save(any(JobCard.class))).thenThrow(new DataIntegrityViolationException("") {
        });
        assertThrows(CustomNotFoundException.class, () -> jobCardRepository.create(jobCard));
        verify(jobCardRepositoryInterface, times(1)).save(jobCard);
    }

    @Test
    void testDelete_Success() {
        JobCard jobCard = new JobCard();
        jobCardRepository.delete(jobCard);
        verify(jobCardRepositoryInterface, times(1)).delete(jobCard);
    }

    @Test
    void testDelete_NullEntity() {
        assertThrows(CustomNotFoundException.class, () -> jobCardRepository.delete(null));
        verify(jobCardRepositoryInterface, never()).delete(any());
    }

    @Test
    void testDelete_DataAccessException() {
        JobCard jobCard = new JobCard();
        doThrow(new DataAccessException("") {
        }).when(jobCardRepositoryInterface).delete(jobCard);
        assertThrows(CustomNotFoundException.class, () -> jobCardRepository.delete(jobCard));
        verify(jobCardRepositoryInterface, times(1)).delete(jobCard);
    }
}
