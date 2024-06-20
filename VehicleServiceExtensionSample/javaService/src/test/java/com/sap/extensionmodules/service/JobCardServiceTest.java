package com.sap.extensionmodules.service;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.sap.cnsmodules.model.*;
import com.sap.extensionmodules.Utils.JobCardSpecification;
import com.sap.extensionmodules.commons.Constants;
import com.sap.extensionmodules.commons.JCStatus;
import com.sap.extensionmodules.commons.SFStatus;
import com.sap.extensionmodules.commons.ServiceStatus;
import com.sap.extensionmodules.dtos.*;
import com.sap.extensionmodules.dtos.query.QueryDTOHelper;
import com.sap.extensionmodules.dtos.query.QueryFilterOptions;
import com.sap.extensionmodules.entity.JobCard;
import com.sap.extensionmodules.entity.JobCardServices;
import com.sap.extensionmodules.entity.ServiceForm;
import com.sap.extensionmodules.exception.CustomException;
import com.sap.extensionmodules.exception.CustomNotFoundException;
import com.sap.extensionmodules.exception.CustomValidationException;
import com.sap.extensionmodules.exception.ErrorResponse;
import com.sap.extensionmodules.mappers.VehicleServiceMapper;
import com.sap.extensionmodules.repository.JobCardRepository;
import com.sap.extensionmodules.repository.JobCardServicesRepository;
import com.sap.extensionmodules.repository.ServiceFormRepository;
import com.sap.extensionmodules.security.RequestContext;
import com.sap.extensionmodules.security.RequestContextProvider;
import javassist.NotFoundException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;

import static com.sap.extensionmodules.commons.Constants.ExtensionFields.JOBCARD_ID;
import static com.sap.extensionmodules.commons.Constants.ExtensionFields.MILOMETER;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import javax.persistence.EntityManager;

import java.rmi.ServerException;
import java.util.*;
import java.text.DateFormat;
import java.text.SimpleDateFormat;

public class JobCardServiceTest {
    QueryDTOHelper queryDTOHelper = new QueryDTOHelper();
    @Mock
    private JobCardRepository jobCardRepository;
    @Mock
    private EntityManager entityManager;
    @Mock
    private JobCardServicesRepository jobCardServicesRepository;
    @Mock
    private ServiceFormService serviceFormService;
    @Mock
    RequestContextProvider requestContextProvider;
    @Mock
    private CaseService caseService;
    @Mock
    private CustomerService customerService;
    @Mock
    private VehicleServiceMapper mapper;
    @Mock
    private ServiceFormRepository serviceFormRepository;
    @InjectMocks
    private JobCardService jobCardService;
    @Mock
    private ObjectMapper objectMapper;

    private MockedStatic<Constants.CaseStatus> caseStatusMock;
    private Gson gson = new Gson();

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @BeforeEach
    public void setup() {
        // Open a static mock before each test
        caseStatusMock = mockStatic(Constants.CaseStatus.class);
        Constants.CaseStatus.COMPLETED = "05";
        Constants.CaseStatus.CLOSED = "06";
        Constants.CaseStatus.SERVICE_COMPLETED = "Z3";
    }
    @AfterEach
    public void tearDown() {
        // Close the static mock after each test
        caseStatusMock.close();
    }
    JobCardServicesDto jobCardServicesDto1 = JobCardServicesDto.builder()
            .id("5d876d79-caf6-421b-8b2c-190cea9a137e")
            .service("Brake pad replacement")
            .price("99.99")
            .technician(new TechnicianDto("","sandra"))
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
            .technician(new TechnicianDto("","sandra"))
            .status(ServiceStatus.Z22.toString())
            .startTime("2023-07-03T04:06:51.874Z")
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
    JobCardServicesDto jobCardServicesDto3 = JobCardServicesDto.builder()
            .id("78cd57cd-f61a-4d7f-9f87-dc031d5b95fb")
            .service("Air filter replacement")
            .price("49.99")
            .technician(new TechnicianDto("","Jack"))
            .status(ServiceStatus.Z23.toString())
            .startTime("2023-07-03T04:06:51.874Z")
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
        return jobCardServicesDtoList;
    }

    public List<JobCardServicesDto> jobCardServicesDtoList2() {
        List<JobCardServicesDto> jobCardServicesDtoList = new ArrayList<>();
        jobCardServicesDtoList.add(jobCardServicesDto2);
        jobCardServicesDtoList.add(jobCardServicesDto3);
        return jobCardServicesDtoList;
    }

    JobCardDto jobCardDto1 = JobCardDto.builder()
            .id("16da4bc2-a8cc-4ba6-a7a5-ef69802ce177")
            .displayId(1)
            .caseId("d886b468-ed95-11ed-a6bd-5354a6389ba0")
            .caseDisplayId("536")
            .status(JCStatus.Z11.toString())
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
            .displayId(123)
            .caseId("2bfdd60f-da14-11ed-bf97-bb732c681de4")
            .caseDisplayId("451")
            .status(JCStatus.Z12.toString())
            .registeredProduct(RegisteredProduct.builder()
                    .vehicleNumber("KA01MJ5010")
                    .dateOfPurchase("2023-04-14T00:00:00Z")
                    .model("AHT Combi 110e")
                    .build())
            .customerComplaints(List.of("item1", "item2", "item3"))
            .milometer(3400)
            .serviceAdvisor("Sandra Webber")
            .customerDetails(null)
            .estimatedCompletionDate("2023-05-10T11:55:47.397Z")
            .adminData(AdminData.builder()
                    .createdOn("2023-05-10T11:55:47.397Z")
                    .updatedOn("2023-04-10T11:55:47.397Z")
                    .createdBy("b4042340-3a8b-42b3-b983-5db33caa331d")
                    .updatedBy("b4042340-3a8b-42b3-b983-5db33caa331d")
                    .build())
            .servicesSelected(jobCardServicesDtoList2())
            .build();

    private JobCard getJobCardEntity(JobCardDto jobCardDto) throws JsonProcessingException {
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

    private JobCardServices jobCardServicesEntity(JobCardServicesDto jobCardServicesDto) throws JsonProcessingException {
        JobCardServices jobCardServices = new JobCardServices();
        jobCardServices.setId(jobCardServicesDto.getId());
        jobCardServices.setService(jobCardServicesDto.getService());
        jobCardServices.setPrice(jobCardServicesDto.getPrice());
        jobCardServices.setTechnician(gson.toJson(jobCardServicesDto.getTechnician()));
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

    private ServiceFormDto createSampleServiceFormDto() {
        ServiceFormDto serviceFormDto = new ServiceFormDto();
        serviceFormDto.setId("f393b77d-cdcb-42d8-9e31-4fb26b7d0c87");
        serviceFormDto.setDisplayId(19);
        serviceFormDto.setCaseId(UUID.fromString("b867087f-f3ba-11ed-95b1-4f6d461bbdcd"));
        serviceFormDto.setCaseDisplayId("3251");

        RegisteredProduct registeredProduct = new RegisteredProduct();
        registeredProduct.setVehicleNumber("KA12345L");
        registeredProduct.setDateOfPurchase("2023-06-28T00:00:00Z");
        registeredProduct.setModel("TATA Nexon");
        serviceFormDto.setRegisteredProduct(registeredProduct);

        List<String> customerComplaints = new ArrayList<>();
        customerComplaints.add("Loose Clutch");
        serviceFormDto.setCustomerComplaints(customerComplaints);

        serviceFormDto.setMilometer(3457);

        List<ServicesDto> servicesProposed = new ArrayList<>();
        servicesProposed.add(new ServicesDto(
                "87a68c40-85c9-4654-8816-2e0a53b4483d",
                "Change Tyre",
                "2499",
                true
        ));

        servicesProposed.add(new ServicesDto(
                "d68e632d-3a3d-40c4-8428-217f94bf0f03",
                "Brake pad replacement",
                "99.99",
                true
        ));

        servicesProposed.add(new ServicesDto(
                "8633d063-6682-4685-bb1f-afde8c759950",
                "Air filter replacement",
                "49.99",
                false
        ));

        servicesProposed.add(new ServicesDto(
                "e3efc3c7-501a-4fac-847d-77a7ef414e6c",
                "Transmission fluid change",
                "89.99",
                false
        ));

        servicesProposed.add(new ServicesDto(
                "de919b3a-0a34-4228-88d6-ec090e960bb4",
                "Coolant flush",
                "79.99",
                false
        ));


        serviceFormDto.setServicesProposed(servicesProposed);

        List<InspectionItemDto> inspectionItems = new ArrayList<>();
        InspectionItemDto inspectionItem = new InspectionItemDto();
        inspectionItem.setId("52c10196-b5f0-4b5e-bab7-dd2ae5b62335");
        inspectionItem.setDescription("udpate");
        inspectionItem.setIsSelected(true);
        inspectionItems.add(inspectionItem);

        serviceFormDto.setInspectionItems(inspectionItems);

        List<String> notes = new ArrayList<>();
        notes.add("Brake Shoe Change");
        serviceFormDto.setNotes(notes);

        serviceFormDto.setStatus("Z02");
        serviceFormDto.setStatusDescription("Booked");
        AdminData adminData = new AdminData();
        adminData.setCreatedOn("2023-08-24 14:03:11.289000000");
        adminData.setUpdatedOn("2023-08-24 14:03:29.296000000");

        serviceFormDto.setAdminData(adminData);

        return serviceFormDto;
    }

    private CaseReadResponseValue getCaseReadResponse() {
        CaseReadResponseValue caseReadResponseValue = new CaseReadResponseValue();

        caseReadResponseValue.setId(UUID.fromString("b867087f-f3ba-11ed-95b1-4f6d461bbdcd"));
        caseReadResponseValue.setDisplayId("3259");
        caseReadResponseValue.setSubject("exfs_Test");
        caseReadResponseValue.setPriority("03");
        caseReadResponseValue.setPriorityDescription("Normal");
        caseReadResponseValue.origin("MANUAL_DATA_ENTRY");
        caseReadResponseValue.setCaseType("ZVSR");
        caseReadResponseValue.setCaseTypeDescription("Vehicle Service Case Type");
        caseReadResponseValue.setStatus("ZC");
        caseReadResponseValue.setStatusDescription("Service Completed");
        caseReadResponseValue.setEscalationStatus("NOT_ESCALATED");

        CaseQueryResponseValueInnerRegisteredProductsInner registeredProducts = new CaseQueryResponseValueInnerRegisteredProductsInner();
        registeredProducts.setId(UUID.fromString("baea13fb-2334-4206-9bf3-c457bb29e3f9"));
        registeredProducts.setDisplayId("161");
        registeredProducts.setSerialId("1001");
        List<CaseQueryResponseValueInnerRegisteredProductsInner> registeredProductsArray = new ArrayList<>();
        registeredProductsArray.add(registeredProducts);
        caseReadResponseValue.setRegisteredProducts(registeredProductsArray);

        caseReadResponseValue.setOrigin("MANUAL_DATA_ENTRY");
        caseReadResponseValue.setFunctionalLocations(new ArrayList<>());
        caseReadResponseValue.setProductInstallPoints(new ArrayList<>());
        caseReadResponseValue.setInstalledBases(new ArrayList<>());
        caseReadResponseValue.setProductInstallPoints(new ArrayList<>());
        Map<String, Object> extensions = new LinkedHashMap<>();
        extensions.put(JOBCARD_ID, 43);
        extensions.put(MILOMETER, 3457);
        caseReadResponseValue.setExtensions(extensions);
        caseReadResponseValue.setProcessor(getIndividualCustomer());
        caseReadResponseValue.setApprovers(new ArrayList<>());
        caseReadResponseValue.setServiceTeam(new CaseQueryResponseValueInnerServiceTeam());
        caseReadResponseValue.setDescription(new CaseQueryResponseValueInnerDescription());
        caseReadResponseValue.setRelatedObjects(new ArrayList<>());

        CaseReadResponseValueTimePoints timePoints = new CaseReadResponseValueTimePoints();
        timePoints.setReportedOn("2023-08-23T06:17:00.000Z");
        timePoints.setAssignedToProcessorOn("2023-08-23T06:17:35.918Z");
        timePoints.setInitialReviewCompletedOn("2023-08-24T05:24:08.673Z");

        caseReadResponseValue.setTimePoints(timePoints);
        caseReadResponseValue.setCategoryLevel1(new CaseQueryResponseValueInnerFunctionalLocationsInner());
        caseReadResponseValue.setCategoryLevel2(new CaseQueryResponseValueInnerFunctionalLocationsInner());
        caseReadResponseValue.setServiceLevelId(UUID.fromString("a10b6a88-ddcc-11ed-9415-877f034c77ee"));
        caseReadResponseValue.setServiceTeam(new CaseQueryResponseValueInnerServiceTeam());
        caseReadResponseValue.setIsRead(true);
        caseReadResponseValue.setIsDepersonalized(false);
        caseReadResponseValue.setIsEndOfPurpose(false);
        caseReadResponseValue.setAdminData(getAdminData());

        return caseReadResponseValue;

    }

    private CaseQueryResponseValueInnerIndividualCustomer getIndividualCustomer() {
        CaseQueryResponseValueInnerIndividualCustomer individualCustomer = new CaseQueryResponseValueInnerIndividualCustomer();
        individualCustomer.setName("John Doe");
        individualCustomer.setId(UUID.fromString("11eccc06-510b-a8ee-afdb-81c341010a00"));
        return individualCustomer;
    }

    private CaseReadResponseValueAdminData getAdminData() {
        CaseReadResponseValueAdminData adminData = new CaseReadResponseValueAdminData();
        adminData.setCreatedBy(UUID.fromString("9808336e-cc65-11ec-980b-7f14df82f69b"));
        adminData.setCreatedOn("2023-08-23T06:17:33.793Z");
        adminData.setCreatedByName("Abhimanyu Service Engineer");
        adminData.updatedBy(UUID.fromString("00000000-0000-0000-0000-000000000000"));
        adminData.setUpdatedByName("SAP_SYSTEM01");
        adminData.setUpdatedOn("2023-08-24T08:08:26.679Z");
        return adminData;
    }

    private CaseQueryResponseValueInnerAccount getAccount() {
        CaseQueryResponseValueInnerAccount account = new CaseQueryResponseValueInnerAccount();
        account.setId(UUID.fromString("00163e03-63a4-1ed2-8783-4df040ade600"));
        account.setName("John Doe");
        return account;
    }

    private CaseServiceDto getCaseServiceDto() {
        CaseServiceDto caseServiceDto = new CaseServiceDto(
                "Mathew Jonas",
                "2023-05-16T11:52:00Z",
                ". Ind Customer with ID",
                "CR64",
                null
        );
        return caseServiceDto;
    }
    private RequestContext getRequestContext(){
        RequestContext requestContext =  RequestContext
                .builder()
                .userId("36addd73-5f39-11ea-9efa-9b0ce15ed32c")
                .authToken("authToken")
                .language("en-us")
                .roles(Arrays.asList("ViewJobCardService", "EditTask", "EditJobCardService"))
                .build();
        return requestContext;
    }


//    Updating job card service start time

    @Test
    @DisplayName("testUpdateJobCardServiceStartTime")
    public void testUpdateJobCardServiceStartTime_Forbidden() throws Exception {

        String jobCardId = "16da4bc2-a8cc-4ba6-a7a5-ef69802ce177";
        String jobCardServiceId = "5d876d79-caf6-421b-8b2c-190cea9a137e";
        String ifMatch = "2023-07-03 09:36:53.872000000";
        RequestContext requestContext = getRequestContext();
        JobCard mockJobCard = getJobCardEntity(jobCardDto1);
        requestContext.setRoles(Arrays.asList("EditTask"));
        when(requestContextProvider.getRequestContext()).thenReturn(requestContext);
        when(jobCardServicesRepository.findOneBy(any())).thenReturn(mockJobCard.getServicesSelected().get(0));
        when(mapper.JobCardServicesToDto(any(JobCardServices.class))).thenReturn(jobCardServicesDto1);
        JobCardServicesUpdateDto jobCardServicesUpdateDto = new JobCardServicesUpdateDto();
        jobCardServicesUpdateDto.setStatus(ServiceStatus.Z22.toString());
        jobCardServicesUpdateDto.setNotes("Notes");

        assertThrows(CustomException.class, () ->jobCardService.updateJobCardService(jobCardId, jobCardServiceId, jobCardServicesUpdateDto,ifMatch));

    }
    @Test
    @DisplayName("testUpdateJobCardServiceStartTime")
    public void testUpdateJobCardServiceStartTime_UnAuthorizedFields() throws Exception {

        String jobCardId = "16da4bc2-a8cc-4ba6-a7a5-ef69802ce177";
        String jobCardServiceId = "5d876d79-caf6-421b-8b2c-190cea9a137e";
        String ifMatch = "2023-07-03 09:36:53.872000000";
        RequestContext requestContext = getRequestContext();
        JobCard mockJobCard = getJobCardEntity(jobCardDto1);
        requestContext.setRoles(Arrays.asList("EditTask"));
        jobCardServicesDto1.setTechnician(new TechnicianDto("36addd73-5f39-11ea-9efa-9b0ce15ed32c","John Doe"));

        when(requestContextProvider.getRequestContext()).thenReturn(requestContext);
        when(jobCardServicesRepository.findOneBy(any())).thenReturn(mockJobCard.getServicesSelected().get(0));
        when(mapper.JobCardServicesToDto(any(JobCardServices.class))).thenReturn(jobCardServicesDto1);
        JobCardServicesUpdateDto jobCardServicesUpdateDto = new JobCardServicesUpdateDto();
        jobCardServicesUpdateDto.setStatus(ServiceStatus.Z22.toString());
        jobCardServicesUpdateDto.setNotes("Notes");

        assertThrows(CustomException.class, () ->jobCardService.updateJobCardService(jobCardId, jobCardServiceId, jobCardServicesUpdateDto,ifMatch));

    }
    @Test
    @DisplayName("testUpdateJobCardServiceStartTime")
    public void testUpdateJobCardServiceStartTime() throws Exception {
        // Create test data
        String jobCardId = "16da4bc2-a8cc-4ba6-a7a5-ef69802ce177";
        String jobCardServiceId = "5d876d79-caf6-421b-8b2c-190cea9a137e";
        String ifMatch = "2023-07-03 09:36:53.872000000";
        RequestContext requestContext = getRequestContext();
        JobCard mockJobCard = getJobCardEntity(jobCardDto1);
        String caseId = jobCardDto1.getCaseId();

        JobCardServicesUpdateDto jobCardServicesUpdateDto = new JobCardServicesUpdateDto();
        jobCardServicesUpdateDto.setStatus(ServiceStatus.Z22.toString());
        jobCardServicesUpdateDto.setNotes("Notes");

        // Create a mock CaseReadResponse and CaseServiceDto for testing
        CaseReadResponse mockCaseReadResponse = new CaseReadResponse();
        CaseReadResponseValue caseValue = getCaseReadResponse();
        caseValue.setIndividualCustomer(getIndividualCustomer());
        mockCaseReadResponse.setValue(caseValue);
        CaseServiceDto mockCaseServiceDto = getCaseServiceDto();
        // Create a mock CustomerDetails for testing
        CustomerDetails mockCustomerDetails = new CustomerDetails();
        mockCustomerDetails.setName(mockCaseServiceDto.getProcessor());
        mockCustomerDetails.setContactNumber("1234567890");

        // Mock the behavior of caseService.getCaseById and caseService.getCaseData
        when(caseService.getCaseById(UUID.fromString(caseId))).thenReturn(mockCaseReadResponse);
        when(caseService.getCaseData(any(CaseReadResponse.class))).thenReturn(mockCaseServiceDto);

        // Mock dependencies
        when(mapper.JobCardToDto(any(JobCard.class))).thenReturn(jobCardDto1);
        when(mapper.JobCardServicesToDto(any(JobCardServices.class))).thenReturn(jobCardServicesDto1);
        when(customerService.getIndividualCustomerInfo(any(UUID.class))).thenReturn(mockCustomerDetails);
        when(customerService.getAccountInfo(any(UUID.class))).thenReturn(mockCustomerDetails);
        when(jobCardRepository.findOneBy(anyString())).thenReturn(mockJobCard);

        // Mock the mapper method
        doNothing().when(mapper).updateJobCardServicesDto(any(), any());
        doNothing().when(mapper).CaseResponseValueToCasePatchUpdate(any(),any());
        doNothing().when(mapper).updateJobCardServices(any(),any());
        doNothing().when(entityManager).flush();

        when(requestContextProvider.getRequestContext()).thenReturn(requestContext);
        when(jobCardServicesRepository.findOneBy(any())).thenReturn(mockJobCard.getServicesSelected().get(0));
       // when(mapper.JobCardServicesToDto(any())).thenReturn(jobCardServicesDto1);
        when(jobCardServicesRepository.update(any())).thenReturn(new JobCardServices());
        when(mapper.JobCardServicesDtoToJobCardServices(any())).thenReturn(mockJobCard.getServicesSelected().get(0));
        when(jobCardRepository.create(any())).thenReturn(mockJobCard);
        when(caseService.getCaseById(any())).thenReturn(mockCaseReadResponse);
        when(caseService.updateCase(any(), any(), any())).thenReturn(null);

        // Call the method to be tested
        JobCardServicesDto result = jobCardService.updateJobCardService(jobCardId, jobCardServiceId, jobCardServicesUpdateDto,ifMatch);

        JobCardServicesDto updatedService = jobCardServicesDto1;
        updatedService.setStatus(ServiceStatus.Z22.toString());

        Date date = Calendar.getInstance().getTime();
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
        String strDate = dateFormat.format(date);

        updatedService.setAdminData(new AdminData(jobCardServicesDto1.getAdminData().getCreatedOn(),
                strDate,
                jobCardServicesDto1.getAdminData().getCreatedBy(),
                requestContext.getUserId()));
        // Add your assertions here to verify the behavior and results of the method.
        verify(mapper, times(1)).CaseResponseValueToCasePatchUpdate(any(), any());
        assertEquals(updatedService, result);
    }

//  Updating job card service end time
    @Test
    @DisplayName("testUpdateJobCardServiceEndTime")
    public void testUpdateJobCardServiceEndTime() throws Exception {

        String jobCardId = jobCardDto2.getId();
        String jobCardServiceId = jobCardServicesDto2.getId();
        String ifMatch = "2023-04-10T11:55:47.397000000";
        RequestContext requestContext = getRequestContext();
        JobCard mockJobCard = getJobCardEntity(jobCardDto2);
        String caseId = jobCardDto2.getCaseId();

        JobCardServicesUpdateDto jobCardServicesUpdateDto = new JobCardServicesUpdateDto();
        jobCardServicesUpdateDto.setStatus(ServiceStatus.Z23.toString());
        jobCardServicesUpdateDto.setNotes("Notes");

        CaseReadResponse mockCaseReadResponse = new CaseReadResponse();
        CaseReadResponseValue caseValue = getCaseReadResponse();
        caseValue.setIndividualCustomer(getIndividualCustomer());
        mockCaseReadResponse.setValue(caseValue);
        CaseServiceDto mockCaseServiceDto = getCaseServiceDto();

        CustomerDetails mockCustomerDetails = new CustomerDetails();
        mockCustomerDetails.setName(mockCaseServiceDto.getProcessor());
        mockCustomerDetails.setContactNumber("1234567890");

        when(caseService.getCaseById(UUID.fromString(caseId))).thenReturn(mockCaseReadResponse);
        when(caseService.getCaseData(any(CaseReadResponse.class))).thenReturn(mockCaseServiceDto);

        when(mapper.JobCardToDto(any(JobCard.class))).thenReturn(jobCardDto2);
        when(mapper.JobCardServicesToDto(any(JobCardServices.class))).thenReturn(jobCardServicesDto2);
        when(customerService.getIndividualCustomerInfo(any(UUID.class))).thenReturn(mockCustomerDetails);
        when(customerService.getAccountInfo(any(UUID.class))).thenReturn(mockCustomerDetails);
        when(jobCardRepository.findOneBy(anyString())).thenReturn(mockJobCard);

        doNothing().when(mapper).updateJobCardServicesDto(any(), any());
        doNothing().when(mapper).CaseResponseValueToCasePatchUpdate(any(),any());
        doNothing().when(mapper).updateJobCardServices(any(),any());
        doNothing().when(entityManager).flush();

        when(requestContextProvider.getRequestContext()).thenReturn(requestContext);
        when(jobCardServicesRepository.findOneBy(any())).thenReturn(mockJobCard.getServicesSelected().get(0));
        when(mapper.JobCardServicesToDto(mockJobCard.getServicesSelected().get(0))).thenReturn(jobCardServicesDto2);
        when(mapper.JobCardServicesToDto(mockJobCard.getServicesSelected().get(1))).thenReturn(jobCardServicesDto3);
        when(jobCardServicesRepository.update(any())).thenReturn(new JobCardServices());
        when(mapper.JobCardServicesDtoToJobCardServices(any())).thenReturn(mockJobCard.getServicesSelected().get(0));
        when(jobCardRepository.create(any())).thenReturn(mockJobCard);
        when(caseService.getCaseById(any())).thenReturn(mockCaseReadResponse);
        when(caseService.updateCase(any(), any(), any())).thenReturn(null);

        JobCardServicesDto result = jobCardService.updateJobCardService(jobCardId, jobCardServiceId, jobCardServicesUpdateDto,ifMatch);

        JobCardServicesDto updatedService = jobCardServicesDto2;
        updatedService.setStatus(ServiceStatus.Z23.toString());

        Date date = Calendar.getInstance().getTime();
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
        String strDate = dateFormat.format(date);

        updatedService.setAdminData(new AdminData(jobCardServicesDto2.getAdminData().getCreatedOn(),
                strDate,
                jobCardServicesDto1.getAdminData().getCreatedBy(),
                requestContext.getUserId()));

        verify(mapper, times(1)).CaseResponseValueToCasePatchUpdate(any(), any());
        assertEquals(updatedService, result);
    }

    @Test
    @DisplayName("CreateJobCard")
    public void testCreateJobCard() throws Exception {

        ServiceFormDto mockServiceForm = createSampleServiceFormDto();
        String caseId = "b867087f-f3ba-11ed-95b1-4f6d461bbdcd";
        String sourceId = "96819e97-40d6-11ee-aab4-bdd391e6089d";
        JobCard mockJobCard = getJobCardEntity(jobCardDto1);

        CaseReadResponse mockCaseReadResponse = new CaseReadResponse();
        CaseReadResponseValue caseValue = getCaseReadResponse();

        mockCaseReadResponse.setValue(caseValue);
        CaseServiceDto mockCaseServiceDto = getCaseServiceDto();
        mockCaseServiceDto.setContactNumber("1234");

        when(serviceFormService.findById(any())).thenReturn(mockServiceForm);

        when(caseService.getCaseById(UUID.fromString(caseId))).thenReturn(mockCaseReadResponse);
        when(caseService.getCaseData(any(CaseReadResponse.class))).thenReturn(mockCaseServiceDto);

        RequestContext requestContext = getRequestContext();
        when(requestContextProvider.getRequestContext()).thenReturn(requestContext);

        CustomerDetails mockCustomerDetails = new CustomerDetails();
        mockCustomerDetails.setName(mockCaseServiceDto.getCustomerName());
        mockCustomerDetails.setContactNumber("1234");

        when(customerService.getIndividualCustomerInfo(any(UUID.class))).thenReturn(mockCustomerDetails);
        when(customerService.getAccountInfo(any(UUID.class))).thenReturn(mockCustomerDetails);

        when(serviceFormService.findById(any(String.class))).thenReturn(mockServiceForm);
        when(jobCardRepository.create(any())).thenReturn(mockJobCard);
        when(mapper.JobCardServicesDtoToJobCardServices(any())).thenReturn(mockJobCard.getServicesSelected().get(0));
        when(serviceFormRepository.findById(any())).thenReturn(new ServiceForm());
        when(mapper.JobCardToDto(any())).thenReturn(jobCardDto1);
        when(mapper.JobCardServicesToDto(any())).thenReturn(jobCardServicesDto1);

        doNothing().when(entityManager).flush();
        JobCardDto result = jobCardService.createJobCard(sourceId, "service-form");

        assertEquals(jobCardDto1, result);
        assertEquals(JCStatus.Z11.toString(), result.getStatus());
    }

    @Test
    @DisplayName("CreateJobCardException")
    public void testCreateJobCardException() throws Exception {
        String sourceType = "sourceType";
        String sourceid = "sourceid";
        List<ErrorResponse.ErrorInfo> details = new ArrayList<>();
        details.add(new ErrorResponse.ErrorInfo(
                Constants.Messages.INVALID_SOURCE_TYPE, "sourceType", sourceType));
        details.add(new ErrorResponse.ErrorInfo(
                Constants.Messages.INVALID_SOURCE_ID, "sourceid", sourceid));

        assertThrows(CustomValidationException.class, () -> {
            jobCardService.createJobCard(sourceid,sourceType);
        }, "Validation errors occurred.");

    }

    @Test
    @DisplayName("CreateJobCard_ServiceFormNotBooked")
    public void testCreateJobCard_ServiceFormNotBooked() throws NotFoundException {

        ServiceFormDto mockServiceForm = createSampleServiceFormDto();
        String caseId = "b867087f-f3ba-11ed-95b1-4f6d461bbdcd";
        String sourceId = "96819e97-40d6-11ee-aab4-bdd391e6089d";
        mockServiceForm.setStatus(SFStatus.Z01.toString());
        when(serviceFormService.findById(any())).thenReturn(mockServiceForm);
        assertThrows(CustomNotFoundException.class, () -> {
            jobCardService.createJobCard(sourceId,"service-form");
        }, Constants.Messages.SERVICE_FORM_NOT_BOOKED);

    }

    @Test
    @DisplayName("testCreateJobCard_NoServicesSelected")
    public void testCreateJobCard_NoServicesSelected() throws NotFoundException {

        ServiceFormDto mockServiceForm = createSampleServiceFormDto();
        String caseId = "b867087f-f3ba-11ed-95b1-4f6d461bbdcd";
        String sourceId = "96819e97-40d6-11ee-aab4-bdd391e6089d";
        mockServiceForm.getServicesProposed().get(0).setIsSelected(false);
        mockServiceForm.getServicesProposed().get(1).setIsSelected(false);

        when(serviceFormService.findById(any())).thenReturn(mockServiceForm);
        assertThrows(CustomNotFoundException.class, () -> {
            jobCardService.createJobCard(sourceId,"service-form");
        }, Constants.Messages.NO_SERVICES_SELECTED);

    }

    @Test
    @DisplayName("testCreateJobCard_CaseCompleted")
    public void testCreateJobCard_CaseCompleted() throws NotFoundException, ServerException {

        ServiceFormDto mockServiceForm = createSampleServiceFormDto();
        String caseId = "b867087f-f3ba-11ed-95b1-4f6d461bbdcd";
        String sourceId = "96819e97-40d6-11ee-aab4-bdd391e6089d";

        CaseReadResponse mockCaseReadResponse = new CaseReadResponse();
        CaseReadResponseValue caseValue = getCaseReadResponse();
        caseValue.setStatus(Constants.CaseStatus.COMPLETED);
        mockCaseReadResponse.setValue(caseValue);

        CaseServiceDto mockCaseServiceDto = getCaseServiceDto();
        mockCaseServiceDto.setContactNumber("1234");

        when(serviceFormService.findById(any())).thenReturn(mockServiceForm);

        when(caseService.getCaseById(UUID.fromString(caseId))).thenReturn(mockCaseReadResponse);
        when(caseService.getCaseData(any(CaseReadResponse.class))).thenReturn(mockCaseServiceDto);

        assertThrows(CustomNotFoundException.class, () -> {
            jobCardService.createJobCard(sourceId,"service-form");
        }, Constants.Messages.CASE_COMPLETED);

    }

    @Test
    @DisplayName("testCreateJobCard_NoEstimatedCompletionDate")
    public void testCreateJobCard_NoEstimatedCompletionDate() throws Exception {

        ServiceFormDto mockServiceForm = createSampleServiceFormDto();
        String caseId = "b867087f-f3ba-11ed-95b1-4f6d461bbdcd";
        String sourceId = "96819e97-40d6-11ee-aab4-bdd391e6089d";
        JobCard mockJobCard = getJobCardEntity(jobCardDto1);

        CaseReadResponse mockCaseReadResponse = new CaseReadResponse();
        CaseReadResponseValue caseValue = getCaseReadResponse();

        mockCaseReadResponse.setValue(caseValue);
        CaseServiceDto mockCaseServiceDto = getCaseServiceDto();
        mockCaseServiceDto.setContactNumber("1234");
        mockCaseServiceDto.setEstimatedCompletionDate(null);
        when(serviceFormService.findById(any())).thenReturn(mockServiceForm);

        when(caseService.getCaseById(UUID.fromString(caseId))).thenReturn(mockCaseReadResponse);
        when(caseService.getCaseData(any(CaseReadResponse.class))).thenReturn(mockCaseServiceDto);

        RequestContext requestContext = getRequestContext();
        when(requestContextProvider.getRequestContext()).thenReturn(requestContext);

        CustomerDetails mockCustomerDetails = new CustomerDetails();
        mockCustomerDetails.setName(mockCaseServiceDto.getCustomerName());
        mockCustomerDetails.setContactNumber("1234");

        when(customerService.getIndividualCustomerInfo(any(UUID.class))).thenReturn(mockCustomerDetails);
        when(customerService.getAccountInfo(any(UUID.class))).thenReturn(mockCustomerDetails);

        when(serviceFormService.findById(any(String.class))).thenReturn(mockServiceForm);
        when(jobCardRepository.create(any())).thenReturn(mockJobCard);
        when(mapper.JobCardServicesDtoToJobCardServices(any())).thenReturn(mockJobCard.getServicesSelected().get(0));
        when(serviceFormRepository.findById(any())).thenReturn(new ServiceForm());
        when(mapper.JobCardToDto(any())).thenReturn(jobCardDto1);
        when(mapper.JobCardServicesToDto(any())).thenReturn(jobCardServicesDto1);

        doNothing().when(entityManager).flush();
        JobCardDto result = jobCardService.createJobCard(sourceId, "service-form");

        assertEquals(jobCardDto1, result);
        assertEquals(JCStatus.Z11.toString(), result.getStatus());
    }
    @Test
    @DisplayName("FindAll Job Cards")
    public void testFindAll() throws JsonProcessingException {

        List<JobCard> mockJobCardList = new ArrayList<>();
        mockJobCardList.add(getJobCardEntity(jobCardDto2));

        List<JobCardDto> mockJobCardDtoList = new ArrayList<>();
        mockJobCardDtoList.add(jobCardDto2);

        Optional<String> filter = Optional.of("caseId eq c7e9469a-1b6b-42c6-9580-28ed4a994346 and true");
        Optional<String> search = Optional.empty();
        Optional<Integer> top = Optional.of(1000);
        Optional<Integer> skip = Optional.empty();
        Pageable page = PageRequest.of(0, 1000);
        QueryFilterOptions queryFilterOptions = QueryFilterOptions.builder().
                selectAttributeName("caseId")
                .selectValue("123")
                .operator(QueryFilterOptions.QueryFilterOperator.EQ)
                .build();
        ReflectionTestUtils.setField(jobCardService, "queryDTOHelper", queryDTOHelper);

        when(mapper.JobCardToDto(any(JobCard.class))).thenReturn(jobCardDto2);
        when(mapper.JobCardServicesToDto(any(JobCardServices.class))).thenReturn(jobCardServicesDto2);
        when(jobCardRepository.findAllBy(any(Specification.class), any(Pageable.class))).thenReturn(mockJobCardList);
        List<JobCardDto> result = jobCardService.findAll(filter,search, top, skip);

        assertEquals(mockJobCardDtoList, result);
        search = Optional.of("123");
        result = jobCardService.findAll(filter,search, top, skip);
        assertEquals(mockJobCardDtoList, result);

    }

    @Test
    @DisplayName("FindOne Job Card")
    public void testFindOne() throws JsonProcessingException, ServerException {

        JobCardDto mockJobCardDto = jobCardDto1;
        String caseId = "d886b468-ed95-11ed-a6bd-5354a6389ba0";
        JobCard mockJobCard = getJobCardEntity(jobCardDto1);

        CaseReadResponse mockCaseReadResponse = new CaseReadResponse();
        CaseReadResponseValue caseValue = getCaseReadResponse();
        caseValue.setIndividualCustomer(getIndividualCustomer());

        mockCaseReadResponse.setValue(caseValue);
        CaseServiceDto mockCaseServiceDto = getCaseServiceDto();

        when(caseService.getCaseById(UUID.fromString(caseId))).thenReturn(mockCaseReadResponse);
        when(caseService.getCaseData(any(CaseReadResponse.class))).thenReturn(mockCaseServiceDto);

        CustomerDetails mockCustomerDetails = new CustomerDetails();
        mockCustomerDetails.setName(mockCaseServiceDto.getProcessor());
        mockCustomerDetails.setContactNumber("1234567890");

        when(customerService.getIndividualCustomerInfo(any(UUID.class))).thenReturn(mockCustomerDetails);
        when(customerService.getAccountInfo(any(UUID.class))).thenReturn(mockCustomerDetails);

        when(jobCardRepository.findOneBy(anyString())).thenReturn(mockJobCard);

        when(mapper.JobCardToDto(any(JobCard.class))).thenReturn(jobCardDto1);
        when(mapper.JobCardServicesToDto(any(JobCardServices.class))).thenReturn(jobCardServicesDto1);

        JobCardDto result = jobCardService.findOne("16da4bc2-a8cc-4ba6-a7a5-ef69802ce177");

        assertEquals(mockJobCardDto, result);
    }

    @Test
    @DisplayName("FindByCaseId Job Card")
    public void testFindByCaseId() throws JsonProcessingException, ServerException {

        JobCard mockJobCard = getJobCardEntity(jobCardDto1);
        String caseId = "d886b468-ed95-11ed-a6bd-5354a6389ba0";

        CaseReadResponse mockCaseReadResponse = new CaseReadResponse();
        CaseReadResponseValue caseValue = getCaseReadResponse();
        caseValue.setAccount(getAccount());

        mockCaseReadResponse.setValue(caseValue);
        CaseServiceDto mockCaseServiceDto = getCaseServiceDto();

        when(caseService.getCaseById(UUID.fromString(caseId))).thenReturn(mockCaseReadResponse);
        when(caseService.getCaseData(any(CaseReadResponse.class))).thenReturn(mockCaseServiceDto);

        CustomerDetails mockCustomerDetails = new CustomerDetails();
        mockCustomerDetails.setName(mockCaseServiceDto.getProcessor());
        mockCustomerDetails.setContactNumber("1234567890");

        when(customerService.getIndividualCustomerInfo(any(UUID.class))).thenReturn(mockCustomerDetails);
        when(customerService.getAccountInfo(any(UUID.class))).thenReturn(mockCustomerDetails);

        when(jobCardRepository.findOneByCaseId(anyString())).thenReturn(mockJobCard);
        when(mapper.JobCardToDto(any(JobCard.class))).thenReturn(jobCardDto1);
        when(mapper.JobCardServicesToDto(any(JobCardServices.class))).thenReturn(jobCardServicesDto1);

        JobCardDto result = jobCardService.findByCaseId("d886b468-ed95-11ed-a6bd-5354a6389ba0", true);

        assertEquals(jobCardDto1, result);
    }

    @Test
    @DisplayName("FindAllJobCardServices")
    public void testFindAllJobCardServices() throws JsonProcessingException, ServerException {

        JobCard mockJobCard = getJobCardEntity(jobCardDto1);
        String caseId = "d886b468-ed95-11ed-a6bd-5354a6389ba0";
        List<JobCardServicesDto> mockServicesList = jobCardDto1.getServicesSelected();

        CaseReadResponse mockCaseReadResponse = new CaseReadResponse();
        CaseReadResponseValue caseValue = getCaseReadResponse();
        caseValue.setIndividualCustomer(getIndividualCustomer());

        mockCaseReadResponse.setValue(caseValue);
        CaseServiceDto mockCaseServiceDto = getCaseServiceDto();

        when(caseService.getCaseById(UUID.fromString(caseId))).thenReturn(mockCaseReadResponse);
        when(caseService.getCaseData(any(CaseReadResponse.class))).thenReturn(mockCaseServiceDto);

        CustomerDetails mockCustomerDetails = new CustomerDetails();
        mockCustomerDetails.setName(mockCaseServiceDto.getProcessor());
        mockCustomerDetails.setContactNumber("1234567890");

        when(customerService.getIndividualCustomerInfo(any(UUID.class))).thenReturn(mockCustomerDetails);
        when(customerService.getAccountInfo(any(UUID.class))).thenReturn(mockCustomerDetails);

        when(mapper.JobCardToDto(any(JobCard.class))).thenReturn(jobCardDto1);
        when(mapper.JobCardServicesToDto(any(JobCardServices.class))).thenReturn(jobCardServicesDto1);

        when(jobCardRepository.findOneBy(anyString())).thenReturn(mockJobCard);

        List<JobCardServicesDto> result = jobCardService.findAllJobCardServices("16da4bc2-a8cc-4ba6-a7a5-ef69802ce177");

        assertEquals(mockServicesList, result);
    }
    @Test
    @DisplayName("FindOneJobCardService")
    public void testFindOneJobCardService() throws JsonProcessingException {
        JobCard mockJobCard = getJobCardEntity(jobCardDto1);
        List<JobCardServices> mockJobCardServices = mockJobCard.getServicesSelected();

        when(mapper.JobCardServicesToDto(any())).thenReturn(jobCardServicesDto1);
        when(jobCardServicesRepository.findOneBy(any())).thenReturn(mockJobCardServices.get(0));

        JobCardServicesDto result = jobCardService.findOneJobCardService(any());

        assertEquals(jobCardServicesDto1, result);
    }

    @Test
    @DisplayName("Remove Job Card")
    public void testRemove() throws Exception {
        String id = "testId";
        when(jobCardRepository.findOneBy(any())).thenReturn(getJobCardEntity(jobCardDto1));
        jobCardService.remove(id);

        verify(jobCardRepository).delete(any(JobCard.class));
    }

    @Test
    @DisplayName("UpdateJobCard")
    public void testUpdateJobCard() throws JsonProcessingException {
        JobCardUpdateDto jobCardUpdateDto = new JobCardUpdateDto();
        jobCardUpdateDto.setStatus(JCStatus.Z13.toString());

        JobCard mockJobCard = getJobCardEntity(jobCardDto1);

        when(mapper.JobCardServicesDtoToJobCardServices(any())).thenReturn(mockJobCard.getServicesSelected().get(0));
        when(jobCardRepository.create(any(JobCard.class))).thenReturn(mockJobCard);
        when(mapper.JobCardToDto(any(JobCard.class))).thenReturn(jobCardDto1);

        JobCardDto result = jobCardService.updateJobCard(jobCardDto1);

        assertEquals(jobCardDto1, result);
    }

    //when no services are completed
    @Test
    @DisplayName("testFindValidationStatusService_noCompletedService")
    public void testFindValidationStatusService_noCompletedService() throws JsonProcessingException {

        String entityName = "sap.ssc.caseservice.entity.case";
        JobCard mockJobCard = getJobCardEntity(jobCardDto2);

        Map<String, Object> sCompleteAggregateEntity = new HashMap<>();
        sCompleteAggregateEntity.put("id", "123");
        sCompleteAggregateEntity.put("status", "05");
        sCompleteAggregateEntity.put("caseType", Constants.CaseType.VEHICLE_SERVICE_REQUEST);
        List<Map<String, Object>> infoList = new ArrayList<>();
        List<JobCardValidationError> errorList = new ArrayList<>();
        JobCardValidationError error = new JobCardValidationError("caseService_customLogic.123",
                "Status of the Case cannot be changed because all the tasks under the Job Card are not completed.",
                "caseId/123");
        errorList.add(error);

        when(jobCardRepository.findOneByCaseId(anyString())).thenReturn(mockJobCard);
        when(mapper.JobCardToDto(any(JobCard.class))).thenReturn(jobCardDto2);
        when(mapper.JobCardServicesToDto(mockJobCard.getServicesSelected().get(0))).thenReturn(jobCardServicesDto3);
        when(mapper.JobCardServicesToDto(mockJobCard.getServicesSelected().get(1))).thenReturn(jobCardServicesDto2);
        JobCardValidationResponse response = new JobCardValidationResponse();

        response.setData(sCompleteAggregateEntity);
        response.setInfo(infoList);
        response.setError(errorList);

        JobCardValidationResponse result = jobCardService.findValidationStatusService(entityName,sCompleteAggregateEntity );

        assertEquals(response.getData(),result.getData());
        assertEquals(response.getInfo(), result.getInfo());

        JobCardValidationError error1 = result.getError().get(0);

        assertEquals(error1.getCode(), error.getCode());
        assertEquals(error1.getTarget(),error.getTarget());
        assertEquals(error1.getMessage(), error.getMessage());

    }

    //when no services are selected
    @Test
    @DisplayName("testFindValidationStatusService_noServicesSelected")
    public void testFindValidationStatusService_noServicesSelected() throws JsonProcessingException {

        String entityName = "sap.ssc.caseservice.entity.case";
        JobCard mockJobCard = getJobCardEntity(jobCardDto1);
        mockJobCard.setServicesSelected(null);

        Map<String, Object> sCompleteAggregateEntity = new HashMap<>();
        sCompleteAggregateEntity.put("id", "123");
        sCompleteAggregateEntity.put("status", "06");
        sCompleteAggregateEntity.put("caseType", Constants.CaseType.VEHICLE_SERVICE_REQUEST);
        List<Map<String, Object>> infoList = new ArrayList<>();
        List<JobCardValidationError> errorList = new ArrayList<>();
        JobCardValidationError error = new JobCardValidationError("caseService_customLogic.123",
                "No Services selected in service form",
                "caseId/123");
        errorList.add(error);

        JobCardDto jobCardDto = jobCardDto1;
        jobCardDto.setServicesSelected(null);

        when(jobCardRepository.findOneByCaseId(anyString())).thenReturn(mockJobCard);
        when(mapper.JobCardToDto(any(JobCard.class))).thenReturn(jobCardDto);

        JobCardValidationResponse response = new JobCardValidationResponse();
        response.setData(sCompleteAggregateEntity);
        response.setInfo(infoList);
        response.setError(errorList);

        JobCardValidationResponse result = jobCardService.findValidationStatusService(entityName,sCompleteAggregateEntity );

        assertEquals(response.getData(),result.getData());
        assertEquals(response.getInfo(), result.getInfo());

        JobCardValidationError error1 = result.getError().get(0);

        assertEquals(error1.getCode(), error.getCode());
        assertEquals(error1.getTarget(),error.getTarget());
        assertEquals(error1.getMessage(), error.getMessage());

    }

    //when case id doesn't exist or case ID doesn't have any job cards
    @Test
    @DisplayName("testFindValidationStatusService_caseId")
    public void testFindValidationStatusService_caseId() throws JsonProcessingException {
        // Set up input data
        String entityName = "sap.ssc.caseservice.entity.case";
        JobCard mockJobCard = getJobCardEntity(jobCardDto1);
        mockJobCard.setServicesSelected(null);

        Map<String, Object> sCompleteAggregateEntity = new HashMap<>();
        sCompleteAggregateEntity.put("id", "123");
        sCompleteAggregateEntity.put("status", "Z3");
        sCompleteAggregateEntity.put("caseType", Constants.CaseType.VEHICLE_SERVICE_REQUEST);
        List<Map<String, Object>> infoList = new ArrayList<>();
        List<JobCardValidationError> errorList = new ArrayList<>();
        JobCardValidationError error = new JobCardValidationError("caseService_customLogic.123",
                "No jobcard found for selected Case",
                "caseId/123");
        errorList.add(error);
        JobCardValidationResponse response = new JobCardValidationResponse();
        response.setData(sCompleteAggregateEntity);
        response.setInfo(infoList);
        response.setError(errorList);

        when(jobCardRepository.findOneByCaseId(anyString())).thenThrow(new CustomNotFoundException(HttpStatus.NOT_FOUND.value(),
                Constants.Messages.JOBCARD_ID_NOT_FOUND));

        JobCardValidationResponse result = jobCardService.findValidationStatusService(entityName,sCompleteAggregateEntity );

        assertEquals(response.getData(),result.getData());
        assertEquals(response.getInfo(), result.getInfo());

        JobCardValidationError error1 = result.getError().get(0);

        assertEquals(error1.getCode(), error.getCode());
        assertEquals(error1.getTarget(),error.getTarget());
        assertEquals(error1.getMessage(), error.getMessage());
    }

    @Test
    @DisplayName("testEnhanceDto_WithoutCustomerDetails")
    public void testEnhanceDto_WithoutCustomerDetails() throws JsonProcessingException, ServerException {

        JobCard mockJobCard = getJobCardEntity(jobCardDto1);
        when(mapper.JobCardToDto(any())).thenReturn(jobCardDto1);
        when(mapper.JobCardServicesToDto(any())).thenReturn(jobCardServicesDto1);

        JobCardDto result = jobCardService.enhanceDto(mockJobCard, false);
        assertEquals(result, jobCardDto1);
        verify(caseService, never()).getCaseById(any());
        verify(caseService, never()).getCaseData(any());
    }
    @Test
    @DisplayName("testEnhanceDto_WithCustomerDetails")
    public void testEnhanceDto_WithCustomerDetails() throws JsonProcessingException, ServerException {

        JobCard mockJobCard = getJobCardEntity(jobCardDto1);
        when(mapper.JobCardToDto(any())).thenReturn(jobCardDto1);
        when(mapper.JobCardServicesToDto(any())).thenReturn(jobCardServicesDto1);

        CaseReadResponse mockCaseReadResponse = new CaseReadResponse();
        CaseReadResponseValue caseValue = getCaseReadResponse();
        caseValue.setIndividualCustomer(getIndividualCustomer());
        mockCaseReadResponse.setValue(caseValue);
        CaseServiceDto mockCaseServiceDto = getCaseServiceDto();

        when(caseService.getCaseById(any())).thenReturn(mockCaseReadResponse);
        when(caseService.getCaseData(any(CaseReadResponse.class))).thenReturn(mockCaseServiceDto);

        CustomerDetails mockCustomerDetails = new CustomerDetails();
        mockCustomerDetails.setName(mockCaseServiceDto.getProcessor());
        mockCustomerDetails.setContactNumber("1234567890");
        when(customerService.getIndividualCustomerInfo(any(UUID.class))).thenReturn(mockCustomerDetails);
        when(customerService.getAccountInfo(any(UUID.class))).thenReturn(mockCustomerDetails);

        JobCardDto result = jobCardService.enhanceDto(mockJobCard, true);
        assertEquals(result, jobCardDto1);

        verify(caseService, times(1)).getCaseById(any());
        verify(caseService, times(1)).getCaseData(any());
    }

    @Test
    @DisplayName("testEnhanceDto_RuntimeException")
    public void testEnhanceDto_RuntimeException() throws JsonProcessingException, ServerException {

        JobCard mockJobCard = getJobCardEntity(jobCardDto1);
        when(mapper.JobCardToDto(any())).thenReturn(jobCardDto1);
        when(mapper.JobCardServicesToDto(any())).thenReturn(jobCardServicesDto1);

        when(caseService.getCaseById(any())).thenThrow(new RuntimeException());
        assertThrows(RuntimeException.class, () -> {
            jobCardService.enhanceDto(mockJobCard, true);
        });
    }

    @Test
    @DisplayName("testConvertListToString_Success")
    public void testConvertListToString_Success() throws JsonProcessingException {
        List<String> stringList = Arrays.asList("item1", "item2", "item3");
        when(objectMapper.writeValueAsString(stringList)).thenReturn("['item1', 'item2', 'item3']");

        String result = jobCardService.convertListToString(stringList);

        assertEquals("[\"item1\",\"item2\",\"item3\"]", result);
    }

//    @Test
//    @DisplayName("testConvertListToString_Exception")
//    public void testConvertListToString_Exception() throws JsonProcessingException {
//        List<String> stringList = Arrays.asList("[\"item1");
//
//        Mockito.doThrow(JsonProcessingException.class).when(objectMapper).writeValueAsString(any());
//
//        assertThrows(RuntimeException.class, () -> jobCardService.convertListToString(stringList));
//    }

    @Test
    @DisplayName("testConvertStringToList_emptyString_shouldReturnEmptyList")
    void testConvertStringToList_emptyString_shouldReturnEmptyList() {
        String emptyString = "";
        List<String> result = jobCardService.convertStringToList(emptyString);
        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("testConvertStringToList_nullString_shouldReturnEmptyList")
    void testConvertStringToList_nullString_shouldReturnEmptyList() {
        String nullString = null;
        List<String> result = jobCardService.convertStringToList(nullString);
        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("testConvertStringToList_validJsonString_shouldReturnList")
    void testConvertStringToList_validJsonString_shouldReturnList() {
        String jsonString = "[\"item1\", \"item2\", \"item3\"]";

        List<String> result = jobCardService.convertStringToList(jsonString);

        assertFalse(result.isEmpty());
        assertEquals(3, result.size());
        assertEquals("item1", result.get(0));
        assertEquals("item2", result.get(1));
        assertEquals("item3", result.get(2));
    }

    @Test
    void convertStringToList_invalidJsonString_shouldThrowRuntimeException() {
        String invalidJsonString = "invalidJsonString";
        assertThrows(RuntimeException.class, () -> jobCardService.convertStringToList(invalidJsonString));
    }

}




