package com.sap.extensionmodules.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sap.cnsmodules.model.*;
import com.sap.extensionmodules.Utils.ServiceFormSpecification;
import com.sap.extensionmodules.commons.Constants;
import com.sap.extensionmodules.dtos.*;
import com.sap.extensionmodules.dtos.query.QueryDTOHelper;
import com.sap.extensionmodules.dtos.query.QueryFilterOptions;
import com.sap.extensionmodules.dtos.query.QueryRequestDTO;
import com.sap.extensionmodules.entity.InspectionItem;
import com.sap.extensionmodules.entity.Services;
import com.sap.extensionmodules.exception.CustomNotFoundException;
import com.sap.extensionmodules.mappers.VehicleServiceMapper;
import com.sap.extensionmodules.repository.ServiceFormRepository;
import com.sap.extensionmodules.entity.ServiceForm;
import com.sap.extensionmodules.security.RequestContext;
import com.sap.extensionmodules.security.RequestContextProvider;
import javassist.NotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import javax.persistence.EntityManager;

import static com.sap.extensionmodules.commons.Constants.ExtensionFields.VEHICLE_NUMBER;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import java.lang.Error;
import java.rmi.ServerException;
import java.time.OffsetDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class ServiceFormServiceTest {
    @Mock
    private EntityManager entityManager;

    @Mock
    private CaseService caseService;

    @Mock
    RegisteredProductsService registeredProductsService;

    @Mock
    RequestContextProvider requestContextProvider;

    @Mock
    RegisteredProductqueryresponseValueInner registeredProductObject;

    @Mock
    private VehicleServiceMapper mapper;

    @Mock
    ServicesService servicesService;

    @Mock
    InspectionItemService inspectionItemService;

    @Mock
    private QueryDTOHelper queryDTOHelper;

    @Mock
    Constants.ExtensionFields extFields;

    @Mock
    Constants.CaseStatus caseStatus;

    @Mock
    private ServiceFormRepository serviceFormRepository;

    @Mock
    ObjectMapper objectMapper;

    @InjectMocks
    private ServiceFormService serviceFormService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        Constants.CaseStatus.COMPLETED = "ZC";
        Constants.ExtensionFields.MILOMETER = "milometer_lgfbu3bg";
    }

    @Test
    public void testCreate_SuccessfulCreation() throws Exception {
        CaseReadResponseValue value = createCaseReadResponse(5656);
        value.setStatus("ABC");
        ServiceFormDto createServiceFormDto = createSampleServiceFormDto();
        CaseReadResponse caseReadResponse = spy(new CaseReadResponse().value(value));
        ServiceFormService spy = Mockito.spy(serviceFormService);

        assertNotNull(createServiceFormDto);

        when(caseService.getCaseById(createServiceFormDto.getCaseId())).thenReturn(caseReadResponse);

        RequestContext.RequestContextBuilder authTokenResult = RequestContext.builder().authToken("ABC123");
        RequestContext.RequestContextBuilder destinationResult = authTokenResult.caseStatus(caseStatus)
                .destination(null);
        RequestContext buildResult2 = destinationResult.extensionFields(extFields)
                .language("en")
                .userId("3f32e6e4-8bf2-411e-90a6-87e27f663f4b")
                .userToken("ABC123")
                .build();
        when(requestContextProvider.getRequestContext()).thenReturn(buildResult2);
        doReturn(createServiceFormDto).when(spy).getServiceFormInfo(any(), any(), any());
        when(serviceFormRepository.create(Mockito.any())).thenReturn(createSampleServiceForm());
        when(mapper.ServiceFormToDto(Mockito.any())).thenReturn(createServiceFormDto);
        doNothing().when(entityManager).flush();

        ServiceFormDto result = spy.create(createServiceFormDto);

        assertNotNull(result);

        verify(caseService).getCaseById(createServiceFormDto.getCaseId());
        verify(mapper).CaseResponseValueToCasePatchUpdate(eq(caseReadResponse.getValue()), any(CasePatchUpdateRequest.class));
        verify(caseService).updateCase(any(OffsetDateTime.class), eq(createServiceFormDto.getCaseId()), any(CasePatchUpdateRequest.class));
    }

    @Test
    public void testCreate_ThrowsNotFoundExceptionWhenCaseCompleted() throws Exception {
        CaseReadResponseValue value = createCaseReadResponse(5655);
        ServiceFormDto createServiceFormDto = createSampleServiceFormDto();
        CaseReadResponse completedCaseReadResponse = spy(new CaseReadResponse().value(value));
        ServiceFormService spy = Mockito.spy(serviceFormService);

        assertNotNull(createServiceFormDto);

        when(caseService.getCaseById(createServiceFormDto.getCaseId())).thenReturn(completedCaseReadResponse);

        assertThrows(CustomNotFoundException.class,
                () -> spy.create(createServiceFormDto),
                "Expected a CustomNotFoundException to be thrown with the message 'CASE_COMPLETED'"
        );

    }

    @Test
    public void testGetServiceFormInfo() throws Exception {
        CaseReadResponseValue value = createCaseReadResponse(5656);
        CaseReadResponse caseReadResponse = new CaseReadResponse().value(value);
        ServiceFormDto createServiceFormDto = createSampleServiceFormDto();
        ServiceFormService spy = Mockito.spy(serviceFormService);

        doReturn(createRegisteredProduct()).when(spy).getRegisteredProductData(any());
        doReturn(createInspectionItemsList()).when(inspectionItemService).findAll();
        doReturn(createServicesList()).when(spy).getSuggestedServices(any());

        ServiceFormDto result = spy.getServiceFormInfo(createServiceFormDto, caseReadResponse, UUID.randomUUID());

        assertNotNull(result);
    }

    @Test
    public void testGetServiceFormInfo_NoMilometerInDto() throws Exception {
        CaseReadResponseValue value = createCaseReadResponse(5656);
        CaseReadResponse caseReadResponse = new CaseReadResponse().value(value);
        ServiceFormDto createServiceFormDto = createSampleServiceFormDto();
        createServiceFormDto.setMilometer(0);
        ServiceFormService spy = Mockito.spy(serviceFormService);

        doReturn(createRegisteredProduct()).when(spy).getRegisteredProductData(any());
        doReturn(createInspectionItemsList()).when(inspectionItemService).findAll();
        doReturn(createServicesList()).when(spy).getSuggestedServices(any());

        ServiceFormDto result = spy.getServiceFormInfo(createServiceFormDto, caseReadResponse, UUID.randomUUID());

        assertNotNull(result);
    }

    @Test
    public void testGetServiceFormInfo_WithMilometerInExtensions() {
        CaseReadResponseValue value = createCaseReadResponse(0);
        CaseReadResponse caseReadResponse = new CaseReadResponse().value(value);
        ServiceFormDto createServiceFormDto = createSampleServiceFormDto();
        createServiceFormDto.setMilometer(0);
        ServiceFormService spy = Mockito.spy(serviceFormService);

        assertThrows(Error.class,
                () -> spy.getServiceFormInfo(createServiceFormDto, caseReadResponse, UUID.randomUUID()),
                "Expected an Error to be thrown with the message 'NO_MILOMETER_IN_CASE'"
        );

    }

    @Test
    public void testGetSuggestedServices() {
        List<ServicesDto> result = serviceFormService.getSuggestedServices(10000);
        assertNotNull(result);
    }

    @Test
    public void testGetRegisteredProductData() throws ServerException {
        CaseReadResponseValue value = createCaseReadResponse(5656);
        CaseReadResponse caseReadResponse = new CaseReadResponse().value(value);

        OffsetDateTime date = OffsetDateTime.parse("2023-08-24T08:08:26.679Z");

        RegisteredProductfile registeredProductsFile = new RegisteredProductfile();
        registeredProductsFile.setValue(registeredProductObject);

        when(registeredProductsService.readRegisteredProductById(any())).thenReturn(registeredProductsFile);

        when(registeredProductObject.getDescription()).thenReturn("Tata Neon");
        when(registeredProductObject.getReferenceDate()).thenReturn(date);

        LinkedHashMap<String, Object> extensionsMap = new LinkedHashMap<>();
        extensionsMap.put(VEHICLE_NUMBER, "someValue");

        when(registeredProductObject.getCustomField(any())).thenReturn(extensionsMap);

        RegisteredProduct result = serviceFormService.getRegisteredProductData(caseReadResponse);

        assertNotNull(result);
    }

    @Test
    public void testGetRegisteredProductDataWithNullRegisteredProduct() throws ServerException {
        CaseReadResponseValue value = createCaseReadResponse(5656);
        CaseReadResponse caseReadResponse = new CaseReadResponse().value(value);

        UUID registeredProductId = caseReadResponse.getValue().getRegisteredProducts().get(0).getId();
        when(registeredProductsService.readRegisteredProductById(registeredProductId)).thenReturn(null);

        assertThrows(Error.class,
                () -> serviceFormService.getRegisteredProductData(caseReadResponse),
                "Expected an Error to be thrown with the message 'NO_REGISTERED_PRODUCTS_IN_CASE'"
        );
    }

    @Test
    public void testFindAll_WithFilter() {
        ServiceForm entity = createSampleServiceForm();
        QueryFilterOptions filterOptions = new QueryFilterOptions(
                "caseId", QueryFilterOptions.QueryFilterOperator.EQ, "52bae7b3-8c35-11ee-b2e1-fff1214a8fa0", false, null, false);
        List<QueryFilterOptions> filterList = Arrays.asList(filterOptions);
        QueryRequestDTO queryRequestDTO = QueryRequestDTO.builder()
                .filterOptions(filterList)
                .build();

        when(queryDTOHelper.buildRequestDTO(Optional.of("someFilter"))).thenReturn(queryRequestDTO);

        entity.setCustomerComplaints("[\"C1\"]");
        entity.setNotes("[\"N1\"]");

        List<ServiceForm> entityList = List.of(entity);
        when(serviceFormRepository.findAll(any(ServiceFormSpecification.class))).thenReturn(entityList);

        ServiceFormDto dto = createSampleServiceFormDto();
        when(mapper.ServiceFormToDto(any())).thenReturn(dto);

        List<ServiceFormDto> result = serviceFormService.findAll(Optional.of("someFilter"));

        assertEquals(1, result.size());
        assertEquals(dto, result.get(0));

        verify(queryDTOHelper).buildRequestDTO(Optional.of("someFilter"));
        verify(serviceFormRepository).findAll(any(ServiceFormSpecification.class));
        verify(mapper).ServiceFormToDto(any());
    }

    @Test
    public void testFindAll_WithoutFilter() {
        QueryRequestDTO queryRequestDTO = QueryRequestDTO.builder().build();
        when(queryDTOHelper.buildRequestDTO(Optional.empty())).thenReturn(queryRequestDTO);

        ServiceForm entity = createSampleServiceForm();
        entity.setCustomerComplaints("[\"C1\"]");
        entity.setNotes("[\"N1\"]");
        List<ServiceForm> entityList = Collections.singletonList(entity);
        when(serviceFormRepository.findAll(null)).thenReturn(entityList);

        ServiceFormDto dto = createSampleServiceFormDto();
        when(mapper.ServiceFormToDto(entity)).thenReturn(dto);

        List<ServiceFormDto> result = serviceFormService.findAll(Optional.empty());

        assertEquals(1, result.size());
        assertEquals(dto, result.get(0));

        verify(queryDTOHelper).buildRequestDTO(Optional.empty());
        verify(serviceFormRepository).findAll(null);
        verify(mapper).ServiceFormToDto(entity);
    }

    @Test
    public void testFindById_Success() throws NotFoundException {
        String serviceFormId = "exampleId";
        ServiceForm mockEntity = createSampleServiceForm();
        ServiceFormDto mockDto = createSampleServiceFormDto();

        mockEntity.setCustomerComplaints("[\"C1\"]");
        mockEntity.setNotes("[\"N1\"]");

        when(serviceFormRepository.findById(anyString())).thenReturn(mockEntity);
        when(mapper.ServiceFormToDto(any())).thenReturn(mockDto);

        ServiceFormDto result = serviceFormService.findById(serviceFormId);

        assertNotNull(result);
        assertEquals(mockDto, result);

        verify(serviceFormRepository).findById(serviceFormId);

        verify(mapper).ServiceFormToDto(mockEntity);
    }

    @Test
    public void testUpdate_SuccessfulUpdate() throws NotFoundException {
        String id = "existing-id";
        String ifMatch = "some-tag";
        ServiceFormDto existingServiceForm = createSampleServiceFormDto();
        ServiceFormDto updateServiceFormDto = createSampleServiceFormDto();
        updateServiceFormDto.setStatus("NEW_STATUS");

        ServiceForm entity = createSampleServiceForm();
        entity.setCustomerComplaints("[\"C1\"]");
        entity.setNotes("[\"N1\"]");

        when(mapper.ServiceFormToDto(serviceFormRepository.findById(id))).thenReturn(existingServiceForm);
        RequestContext.RequestContextBuilder authTokenResult = RequestContext.builder().authToken("ABC123");
        RequestContext.RequestContextBuilder destinationResult = authTokenResult.caseStatus(caseStatus)
                .destination(null);
        RequestContext buildResult2 = destinationResult.extensionFields(extFields)
                .language("en")
                .userId("3f32e6e4-8bf2-411e-90a6-87e27f663f4b")
                .userToken("ABC123")
                .build();
        when(requestContextProvider.getRequestContext()).thenReturn(buildResult2);
        when(inspectionItemService.findById(any())).thenReturn(createInspectionItemsDtoList().get(0));
        when(servicesService.findById(any())).thenReturn(createServicesDtos().get(0));
        when(serviceFormRepository.update(any())).thenReturn(entity);
        when(mapper.ServiceFormToDto(any())).thenReturn(createSampleServiceFormDto());

        ServiceFormDto result = serviceFormService.update(id, updateServiceFormDto, ifMatch);

        assertNotNull(result);
        assertEquals("NEW_STATUS", result.getStatus());
    }

    @Test
    public void testUpdate_NotFoundException() throws NotFoundException {
        String id = "non-existent-id";
        String ifMatch = "some-tag";
        ServiceFormDto updateServiceFormDto = createSampleServiceFormDto();

        when(serviceFormRepository.findById(id)).thenReturn(null);

        assertThrows(NotFoundException.class, () -> serviceFormService.update(id, updateServiceFormDto, ifMatch));
    }

    @Test
    public void testFetchServicesAndInspectionItems() throws NotFoundException {
        AdminData adminData = AdminData.builder()
                .createdOn("2024-01-09 10:45:27.445000000")
                .updatedOn("2024-01-10 04:05:10.101000000")
                .createdBy("b4042340-3a8b-42b3-b983-5db33caa331b")
                .updatedBy("b4042340-3a8b-42b3-b983-5db33caa331b")
                .build();
        List<InspectionItemDto> inspectionItemDtos = List.of(
                new InspectionItemDto(
                        "3f32e6e4-8bf2-411e-90a6-87e27f663f4b",
                        "Check for body damage, dents, or scratches",
                        false,
                        adminData
                ));
        List<ServicesDto> servicesDtos = List.of(
                new ServicesDto(
                        "5e99c0f1-8720-44a2-82fd-7b983fb134fc",
                        "Change Filter",
                        "499",
                        2000,
                        4000,
                        true,
                        adminData
                ));
        ServiceFormDto updateServiceFormDto = createSampleServiceFormDto();
        updateServiceFormDto.setInspectionItems(inspectionItemDtos);
        updateServiceFormDto.setServicesProposed(servicesDtos);

        ServicesDto existingService = createServicesDtos().get(0);
        InspectionItemDto existingInspectionItem = createInspectionItemsDtoList().get(0);

        when(servicesService.findById(existingService.getId())).thenReturn(existingService);
        when(inspectionItemService.findById(existingInspectionItem.getId())).thenReturn(existingInspectionItem);

        ServiceFormDto result = serviceFormService.fetchServicesAndInspectionItems(updateServiceFormDto);

        assertNotNull(result);
        assertEquals(existingService.getService(), result.getServicesProposed().get(0).getService());
        assertEquals(existingInspectionItem.getDescription(), result.getInspectionItems().get(0).getDescription());

        verify(servicesService).findById(existingService.getId());
        verify(inspectionItemService).findById(existingInspectionItem.getId());
    }

    @Test
    public void testFetchServicesAndInspectionItems_ServiceNotFound() throws NotFoundException {
        ServiceFormDto updateServiceFormDto = createSampleServiceFormDto();
        updateServiceFormDto.setServicesProposed(List.of(new ServicesDto("non-existing-id", null, null, 0, 0, false, null)));

        when(servicesService.findById("non-existing-id")).thenReturn(null);

        assertThrows(NotFoundException.class, () -> serviceFormService.fetchServicesAndInspectionItems(updateServiceFormDto));

        verify(servicesService).findById("non-existing-id");
        verifyNoInteractions(inspectionItemService);
    }

    @Test
    public void testFetchServicesAndInspectionItems_InspectionItemNotFound() throws NotFoundException {
        AdminData adminData = AdminData.builder()
                .createdOn("2024-01-09 10:45:27.445000000")
                .updatedOn("2024-01-10 04:05:10.101000000")
                .createdBy("b4042340-3a8b-42b3-b983-5db33caa331b")
                .updatedBy("b4042340-3a8b-42b3-b983-5db33caa331b")
                .build();
        List<ServicesDto> servicesDtos = List.of(
                new ServicesDto(
                        "5e99c0f1-8720-44a2-82fd-7b983fb134fc",
                        "Change Filter",
                        "499",
                        2000,
                        4000,
                        true,
                        adminData
                ));
        ServiceFormDto updateServiceFormDto = createSampleServiceFormDto();
        updateServiceFormDto.setServicesProposed(servicesDtos);

        ServicesDto existingService = createServicesDtos().get(0);
        when(servicesService.findById(existingService.getId())).thenReturn(existingService);
        updateServiceFormDto.setInspectionItems(List.of(new InspectionItemDto("non-existing-id", null, false, null)));

        when(inspectionItemService.findById("non-existing-id")).thenReturn(null);

        assertThrows(NotFoundException.class, () -> serviceFormService.fetchServicesAndInspectionItems(updateServiceFormDto));
    }

    @Test
    public void testDelete_ExistingServiceForm_DeletedSuccessfully() throws Exception {
        String serviceFormId = "f393b77d-cdcb-42d8-9e31-4fb26b7d0c87";
        ServiceForm serviceForm = createSampleServiceForm();

        serviceForm.setCustomerComplaints("[\"C1\"]");
        serviceForm.setNotes("[\"N1\"]");

        ServiceFormDto serviceFormDto = createSampleServiceFormDto();

        when(serviceFormRepository.findById(any())).thenReturn(serviceForm);
        when(mapper.ServiceFormToDto(serviceForm)).thenReturn(serviceFormDto);

        ServiceFormDto result = serviceFormService.delete(serviceFormId);

        assertNotNull(result);

        verify(serviceFormRepository).findById(serviceFormId);
        verify(serviceFormRepository).delete(serviceForm);
        verify(mapper).ServiceFormToDto(serviceForm);
    }

    @Test
    void convertStringToList_emptyString_shouldReturnEmptyList() {
        String emptyString = "";

        List<String> result = serviceFormService.convertStringToList(emptyString);

        assertTrue(result.isEmpty());
    }

    @Test
    void convertStringToList_nullString_shouldReturnEmptyList() {
        String nullString = null;

        List<String> result = serviceFormService.convertStringToList(nullString);

        assertTrue(result.isEmpty());
    }

    @Test
    void convertStringToList_validJsonString_shouldReturnList() {
        String jsonString = "[\"item1\", \"item2\", \"item3\"]";

        List<String> result = serviceFormService.convertStringToList(jsonString);

        assertFalse(result.isEmpty());
        assertEquals(3, result.size());
        assertEquals("item1", result.get(0));
        assertEquals("item2", result.get(1));
        assertEquals("item3", result.get(2));
    }

    @Test
    void convertStringToList_invalidJsonString_shouldThrowRuntimeException() {
        String invalidJsonString = "invalidJsonString";

        assertThrows(RuntimeException.class, () -> serviceFormService.convertStringToList(invalidJsonString));
    }

    private ServiceFormDto createSampleServiceFormDto() {
        return ServiceFormDto.builder()
                .id("f393b77d-cdcb-42d8-9e31-4fb26b7d0c87")
                .displayId(19)
                .caseId(UUID.fromString("b867087f-f3ba-11ed-95b1-4f6d461bbdcd"))
                .caseDisplayId("3251")
                .registeredProduct(createRegisteredProduct())
                .customerComplaints(Collections.singletonList("Loose Clutch"))
                .milometer(3457)
                .servicesProposed(createServicesDtos())
                .inspectionItems(createInspectionItemsDtoList())
                .notes(Collections.singletonList("Brake Shoe Change"))
                .status("Z01")
                .statusDescription("Booked")
                .adminData(createAdminData())
                .build();
    }

    private ServiceForm createSampleServiceForm() {
        return ServiceForm.builder()
                .id("f393b77d-cdcb-42d8-9e31-4fb26b7d0c87")
                .displayId(19)
                .caseId("b867087f-f3ba-11ed-95b1-4f6d461bbdcd")
                .caseDisplayId("3251")
                .registeredProduct(createRegisteredProduct())
                .customerComplaints("Loose Clutch")
                .milometer(3457)
                .servicesProposed(createServicesDtos())
                .inspectionItems(createInspectionItemsDtoList())
                .notes("Brake Shoe Change")
                .status("Z01")
                .createdOn("2024-01-10 04:05:10.101000000")
                .updatedOn("2024-01-10 04:05:10.101000000")
                .createdBy("b4042340-3a8b-42b3-b983-5db33caa331b")
                .updatedBy("b4042340-3a8b-42b3-b983-5db33caa331b")
                .build();
    }

    private RegisteredProduct createRegisteredProduct() {
        return RegisteredProduct.builder()
                .vehicleNumber("KA12345L")
                .dateOfPurchase("2023-06-28T00:00:00Z")
                .model("TATA Neon")
                .build();
    }

    private static List<ServicesDto> createServicesDtos() {
        List<ServicesDto> servicesProposed = new ArrayList<>();
        ServicesDto service1 = new ServicesDto();
        service1.setId("5e99c0f1-8720-44a2-82fd-7b983fb134fc");
        service1.setService("Change Filter");
        service1.setPrice("499");
        service1.setMinMileage(2000);
        service1.setMaxMileage(4000);
        service1.setIsSelected(true);
        ServicesDto service2 = new ServicesDto();
        service2.setId("ee34812a-345b-4e3f-87d1-dc98f80cef6c");
        service2.setService("Change Oil");
        service2.setPrice("2499");
        service2.setMinMileage(1000);
        service2.setMaxMileage(5000);
        service1.setIsSelected(true);
        servicesProposed.add(service1);
        servicesProposed.add(service2);
        return servicesProposed;
    }

    private static List<Services> createServicesList() {
        List<Services> servicesProposed = new ArrayList<>();
        Services service1 = new Services();
        service1.setId("5e99c0f1-8720-44a2-82fd-7b983fb134fc");
        service1.setService("Change Filter");
        service1.setPrice("499");
        service1.setMinMileage(2000);
        service1.setMaxMileage(4000);
        service1.setIsSelected(true);

        Services service2 = new Services();
        service2.setId("ee34812a-345b-4e3f-87d1-dc98f80cef6c");
        service2.setService("Change Oil");
        service2.setPrice("2499");
        service2.setMinMileage(1000);
        service2.setMaxMileage(5000);
        service2.setIsSelected(true);

        servicesProposed.add(service1);
        servicesProposed.add(service2);

        return servicesProposed;
    }

    private static List<InspectionItemDto> createInspectionItemsDtoList() {
        AdminData adminData = AdminData.builder()
                .createdOn("2024-01-09 10:45:27.445000000")
                .updatedOn("2024-01-10 04:05:10.101000000")
                .createdBy("b4042340-3a8b-42b3-b983-5db33caa331b")
                .updatedBy("b4042340-3a8b-42b3-b983-5db33caa331b")
                .build();
        return List.of(
                new InspectionItemDto(
                        "3f32e6e4-8bf2-411e-90a6-87e27f663f4b",
                        "Check for body damage, dents, or scratches",
                        false,
                        adminData
                ),
                new InspectionItemDto(
                        "11f83129-c5af-4dff-82ef-e372f29b8f01",
                        "Inspect lights (headlights, taillights, brake lights, turn signals).",
                        false,
                        adminData
                ),
                new InspectionItemDto(
                        "ff53693c-71d2-493a-80c8-d58433bc8b52",
                        "Inspect the engine for oil leaks.",
                        false,
                        adminData
                ),
                new InspectionItemDto(
                        "129daa0c-fadc-4714-bddc-9a1eb9b3f480",
                        "Verify the condition of the serpentine belt.",
                        false,
                        adminData
                ),
                new InspectionItemDto(
                        "ff304083-b125-4cb4-b024-235322010614",
                        "Check transmission fluid level and condition.",
                        false,
                        adminData
                ),
                new InspectionItemDto(
                        "ea8dc1e7-1359-4973-9035-3a18035b1e41",
                        "Verify the condition of the brake pads and brake fluid.",
                        false,
                        adminData
                )
        );
    }

    private static List<InspectionItem> createInspectionItemsList() {
        return List.of(
                new InspectionItem(
                        "3f32e6e4-8bf2-411e-90a6-87e27f663f4b",
                        "Check for body damage, dents, or scratches",
                        false,
                        "2024-01-09 10:45:27.445000000",
                        "2024-01-10 04:05:10.101000000",
                        "b4042340-3a8b-42b3-b983-5db33caa331b",
                        "b4042340-3a8b-42b3-b983-5db33caa331b"
                ),
                new InspectionItem(
                        "11f83129-c5af-4dff-82ef-e372f29b8f01",
                        "Inspect lights (headlights, taillights, brake lights, turn signals).",
                        false,
                        "2024-01-09 10:45:27.445000000",
                        "2024-01-10 04:05:10.101000000",
                        "b4042340-3a8b-42b3-b983-5db33caa331b",
                        "b4042340-3a8b-42b3-b983-5db33caa331b"
                ),
                new InspectionItem(
                        "ff53693c-71d2-493a-80c8-d58433bc8b52",
                        "Inspect the engine for oil leaks.",
                        false,
                        "2024-01-09 10:45:27.445000000",
                        "2024-01-10 04:05:10.101000000",
                        "b4042340-3a8b-42b3-b983-5db33caa331b",
                        "b4042340-3a8b-42b3-b983-5db33caa331b"
                ),
                new InspectionItem(
                        "129daa0c-fadc-4714-bddc-9a1eb9b3f480",
                        "Verify the condition of the serpentine belt.",
                        false,
                        "2024-01-09 10:45:27.445000000",
                        "2024-01-10 04:05:10.101000000",
                        "b4042340-3a8b-42b3-b983-5db33caa331b",
                        "b4042340-3a8b-42b3-b983-5db33caa331b"
                ),
                new InspectionItem(
                        "ff304083-b125-4cb4-b024-235322010614",
                        "Check transmission fluid level and condition.",
                        false,
                        "2024-01-09 10:45:27.445000000",
                        "2024-01-10 04:05:10.101000000",
                        "b4042340-3a8b-42b3-b983-5db33caa331b",
                        "b4042340-3a8b-42b3-b983-5db33caa331b"
                ),
                new InspectionItem(
                        "ea8dc1e7-1359-4973-9035-3a18035b1e41",
                        "Verify the condition of the brake pads and brake fluid.",
                        false,
                        "2024-01-09 10:45:27.445000000",
                        "2024-01-10 04:05:10.101000000",
                        "b4042340-3a8b-42b3-b983-5db33caa331b",
                        "b4042340-3a8b-42b3-b983-5db33caa331b"
                )
        );
    }

    private AdminData createAdminData() {
        return AdminData.builder()
                .createdOn("2023-08-24 14:03:11.289000000")
                .updatedOn("2023-08-24 14:03:29.296000000")
                .createdBy("b4042340-3a8b-42b3-b983-5db33caa331b")
                .updatedBy("b4042340-3a8b-42b3-b983-5db33caa331b")
                .build();
    }

    private CaseReadResponseValue createCaseReadResponse(Integer nMilometer) {
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
        extensions.put("jobcardid_lgfbv7xg", 43);
        extensions.put("milometer_lgfbu3bg", nMilometer);
        caseReadResponseValue.setExtensions(extensions);
        caseReadResponseValue.setProcessor(createIndividualCustomer());
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
        caseReadResponseValue.setAdminData(adminData());
        return caseReadResponseValue;
    }

    private CaseQueryResponseValueInnerIndividualCustomer createIndividualCustomer() {
        CaseQueryResponseValueInnerIndividualCustomer individualCustomer = new CaseQueryResponseValueInnerIndividualCustomer();
        individualCustomer.setName("John Doe");
        individualCustomer.setId(UUID.fromString("11eccc06-510b-a8ee-afdb-81c341010a00"));
        return individualCustomer;
    }

    private CaseReadResponseValueAdminData adminData() {
        CaseReadResponseValueAdminData adminData = new CaseReadResponseValueAdminData();
        adminData.setCreatedBy(UUID.fromString("9808336e-cc65-11ec-980b-7f14df82f69b"));
        adminData.setCreatedOn("2023-08-23T06:17:33.793Z");
        adminData.setCreatedByName("Abhimanyu Service Engineer");
        adminData.updatedBy(UUID.fromString("00000000-0000-0000-0000-000000000000"));
        adminData.setUpdatedByName("SAP_SYSTEM01");
        adminData.setUpdatedOn("2023-08-24T08:08:26.679Z");
        return adminData;
    }
}
