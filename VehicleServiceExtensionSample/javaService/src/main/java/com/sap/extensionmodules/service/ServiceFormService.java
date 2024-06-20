package com.sap.extensionmodules.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sap.cnsmodules.model.CasePatchUpdateRequest;
import com.sap.cnsmodules.model.CaseReadResponse;
import com.sap.cnsmodules.model.RegisteredProductfile;
import com.sap.cnsmodules.model.RegisteredProductqueryresponseValueInner;
import com.sap.extensionmodules.Utils.ServiceFormSpecification;
import com.sap.extensionmodules.Utils.StatusUtil;
import com.sap.extensionmodules.Utils.UpdateChecker;
import com.sap.extensionmodules.commons.Constants;
import com.sap.extensionmodules.commons.SFStatus;
import com.sap.extensionmodules.dtos.AdminData;
import com.sap.extensionmodules.dtos.InspectionItemDto;
import com.sap.extensionmodules.dtos.RegisteredProduct;
import com.sap.extensionmodules.dtos.ServiceFormDto;
import com.sap.extensionmodules.dtos.ServicesDto;
import com.sap.extensionmodules.dtos.query.QueryDTOHelper;
import com.sap.extensionmodules.dtos.query.QueryRequestDTO;
import com.sap.extensionmodules.exception.CustomNotFoundException;
import com.sap.extensionmodules.security.RequestContextProvider;
import com.sap.extensionmodules.mappers.VehicleServiceMapper;
import com.sap.extensionmodules.entity.ServiceForm;
import com.sap.extensionmodules.repository.ServiceFormRepository;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.lang.Error;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static com.sap.extensionmodules.commons.Constants.ExtensionFields.*;
import static com.sap.extensionmodules.commons.Constants.Messages.*;


@Service
public class ServiceFormService {

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private ServiceFormRepository serviceFormRepository;

    @Autowired
    private VehicleServiceMapper mapper;

    @Autowired
    private CaseService caseService;

    @Autowired
    private RegisteredProductsService registeredProductsService;

    @Autowired
    private InspectionItemService inspectionItemService;

    @Autowired
    private ServicesService servicesService;

    @Autowired
    RequestContextProvider requestContextProvider;

    @Autowired
    QueryDTOHelper queryDTOHelper;

    @Transactional(rollbackFor = Exception.class)
    public ServiceFormDto create(ServiceFormDto createServiceFormDto) throws Exception {
        CasePatchUpdateRequest casePatchUpdateRequest = new CasePatchUpdateRequest();
        UUID sCaseId = createServiceFormDto.getCaseId();
        CaseReadResponse caseReadResponse = caseService.getCaseById(sCaseId);
        if(caseReadResponse.getValue().getStatus().equals(Constants.CaseStatus.COMPLETED)) {
            throw new CustomNotFoundException(HttpStatus.INTERNAL_SERVER_ERROR.value(), CASE_COMPLETED);
        }
        ServiceFormDto serviceFormDto = getServiceFormInfo(createServiceFormDto, caseReadResponse, sCaseId);
        OffsetDateTime offsetDateTime = OffsetDateTime.parse(caseReadResponse.getValue().getAdminData().getUpdatedOn());
        Date date = Calendar.getInstance().getTime();
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS000000");
        String strDate = dateFormat.format(date);

        AdminData adminData = new AdminData(
                strDate,strDate,requestContextProvider.getRequestContext().getUserId(),requestContextProvider.getRequestContext().getUserId());
        serviceFormDto.setAdminData(adminData);

        ServiceForm entity = serviceFormRepository.create(mapper.ServiceFormDtoToServiceForm(serviceFormDto));
        ServiceFormDto dto = mapper.ServiceFormToDto(entity);
        String statusDescription = StatusUtil.getDescription(serviceFormDto.getStatus(), requestContextProvider.getRequestContext().getLanguage());
        dto.setStatusDescription(statusDescription);
        entityManager.flush();
        mapper.CaseResponseValueToCasePatchUpdate(caseReadResponse.getValue(), casePatchUpdateRequest);
        HashMap<String, String> map = new HashMap<>();
        map.put(SERVICE_FORM_ID, Integer.toString(entity.getDisplayId()));
        casePatchUpdateRequest.setExtensions(map);
        caseService.updateCase(offsetDateTime, serviceFormDto.getCaseId(), casePatchUpdateRequest);

        return dto;
    }

    public ServiceFormDto getServiceFormInfo(ServiceFormDto createServiceFormDto, CaseReadResponse caseReadResponse, UUID sCaseId) throws Exception {
        Integer nMilometer = createServiceFormDto.getMilometer();
        if (nMilometer == 0) {
            nMilometer = (Integer) ((LinkedHashMap<?, ?>) caseReadResponse.getValue().getExtensions()).get(MILOMETER);
        }
        if (nMilometer == 0) {
            throw new Error(NO_MILOMETER_IN_CASE);
        }
        RegisteredProduct registeredProductData = getRegisteredProductData(caseReadResponse);
        List<InspectionItemDto> inspectionItems = inspectionItemService.findAllByQuery();
        List<ServicesDto> suggestedServices = getSuggestedServices(nMilometer);
        return new ServiceFormDto(sCaseId, caseReadResponse.getValue().getDisplayId(), registeredProductData, createServiceFormDto.getCustomerComplaints(), nMilometer, suggestedServices, inspectionItems, createServiceFormDto.getNotes(), SFStatus.Z01.toString());
    }

    public List<ServicesDto> getSuggestedServices(Integer nMilometer) {
        return servicesService.findAll()
                .stream()
                .filter(serviceObj -> nMilometer >= serviceObj.getMinMileage() && nMilometer <= serviceObj.getMaxMileage())
                .map(serviceObj -> new ServicesDto(serviceObj.getId(), serviceObj.getService(), serviceObj.getPrice(), serviceObj.getIsSelected()))
                .collect(Collectors.toList());
    }

    public RegisteredProduct getRegisteredProductData(CaseReadResponse caseReadResponse) {
        String sVehicleNumber = null;
        UUID registeredProductId = caseReadResponse.getValue().getRegisteredProducts().get(0).getId();
        RegisteredProductfile registeredProduct = registeredProductsService.readRegisteredProductById(registeredProductId);
        if(registeredProduct == null) {
            throw new Error(NO_REGISTERED_PRODUCTS_IN_CASE);
        }
        RegisteredProductqueryresponseValueInner registeredProductObject = registeredProduct.getValue();
        String sModel = registeredProductObject.getDescription();
        OffsetDateTime sDateOfPurchase = registeredProductObject.getReferenceDate();
        LinkedHashMap<?, ?> extensionsMap = (LinkedHashMap<?, ?>) registeredProductObject.getCustomField(EXTENSIONS);
        if (extensionsMap != null && extensionsMap.containsKey(VEHICLE_NUMBER)) {
                sVehicleNumber = String.valueOf(extensionsMap.get(VEHICLE_NUMBER));
        }
        return new RegisteredProduct(sVehicleNumber, sDateOfPurchase.toString(), sModel);
    }

    public List<ServiceFormDto> findAll(Optional<String> filter) {
        List<ServiceFormDto> dtoList = new ArrayList<>();
        QueryRequestDTO queryRequestDTO = queryDTOHelper.buildRequestDTO(filter);
        ServiceFormSpecification spec = null;
        if(queryRequestDTO.getFilterOptions() != null) {
            spec = new ServiceFormSpecification(queryRequestDTO.getFilterOptions().get(0));
        }
        List<ServiceForm> entity = serviceFormRepository.findAll(spec);
        for (ServiceForm form : entity) {
            ServiceFormDto dto = mapper.ServiceFormToDto(form);
            dto.setCustomerComplaints(convertStringToList(form.getCustomerComplaints()));
            dto.setNotes(convertStringToList(form.getNotes()));
            dtoList.add(dto);
        }
        return dtoList;
    }

    public ServiceFormDto findById(String id) throws NotFoundException {
        ServiceForm entity = serviceFormRepository.findById(id);
        ServiceFormDto serviceFormDto = mapper.ServiceFormToDto(entity);
        serviceFormDto.setCustomerComplaints(convertStringToList(entity.getCustomerComplaints()));
        serviceFormDto.setNotes(convertStringToList(entity.getNotes()));
        return serviceFormDto;
    }

    public ServiceFormDto update(String id, ServiceFormDto updateServiceFormDto, String ifMatch) throws NotFoundException {
        ServiceFormDto existingServiceForm = mapper.ServiceFormToDto(serviceFormRepository.findById(id));

        if (existingServiceForm == null) {
            throw new NotFoundException(SERVICE_FORM_RESOURCE_NOT_FOUND);
        } else {
            UpdateChecker.isUpdateOnLatestData(ifMatch, existingServiceForm.getAdminData().getUpdatedOn());
            existingServiceForm.setCustomerComplaints(updateServiceFormDto.getCustomerComplaints());
            existingServiceForm.setNotes(updateServiceFormDto.getNotes());

            ServiceFormDto updatedServiceFormDto = fetchServicesAndInspectionItems(updateServiceFormDto);
            if(updatedServiceFormDto.getServicesProposed() !=null){
                existingServiceForm.setServicesProposed(updatedServiceFormDto.getServicesProposed());
            }
            if(updatedServiceFormDto.getInspectionItems() !=null){
                existingServiceForm.setInspectionItems(updatedServiceFormDto.getInspectionItems());
            }

            return updateServiceFormAndConvertToDto(existingServiceForm,updateServiceFormDto);
        }
    }

    public ServiceFormDto fetchServicesAndInspectionItems(ServiceFormDto updateServiceFormDto) throws NotFoundException {
        if (updateServiceFormDto.getServicesProposed() != null) {
            for (ServicesDto sp : updateServiceFormDto.getServicesProposed()) {
                ServicesDto oService = servicesService.findById(sp.getId());
                if (oService == null) {
                    throw new NotFoundException(SERVICE_RESOURCE_NOT_FOUND);
                } else {
                    sp.setService(oService.getService());
                    sp.setPrice(oService.getPrice());
                }
            }
        }

        if (updateServiceFormDto.getInspectionItems() != null) {
            for (InspectionItemDto it : updateServiceFormDto.getInspectionItems()) {
                InspectionItemDto oInspectionItem = inspectionItemService.findById(it.getId());
                if (oInspectionItem == null) {
                    throw new NotFoundException(INSPECTION_ITEM_RESOURCE_NOT_FOUND);
                } else {
                    it.setDescription(oInspectionItem.getDescription());
                }
            }
        }

        return updateServiceFormDto;
    }

    public ServiceFormDto updateServiceFormAndConvertToDto(ServiceFormDto existingServiceForm, ServiceFormDto updateServiceFormDto) {
        ServiceForm serviceForm = new ServiceForm();
        Date date = Calendar.getInstance().getTime();
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS000000");
        String strDate = dateFormat.format(date);

        AdminData adminData = new AdminData(
                existingServiceForm.getAdminData().getCreatedOn(), strDate,
                existingServiceForm.getAdminData().getCreatedBy(),
                requestContextProvider.getRequestContext().getUserId());

        existingServiceForm.setAdminData(adminData);
        if(updateServiceFormDto.getStatus()!=null) {
            existingServiceForm.setStatus(updateServiceFormDto.getStatus());
        }

        mapper.updateServiceForm(existingServiceForm, serviceForm);
        serviceForm.setCustomerComplaints(convertListToString(existingServiceForm.getCustomerComplaints()));
        serviceForm.setNotes(convertListToString(existingServiceForm.getNotes()));

        ServiceForm entity = serviceFormRepository.update(serviceForm);
        ServiceFormDto dto = mapper.ServiceFormToDto(entity);
        dto.setCustomerComplaints(convertStringToList(entity.getCustomerComplaints()));
        dto.setNotes(convertStringToList(entity.getNotes()));

        return dto;
    }


    public ServiceFormDto delete(String id) throws NotFoundException {
        ServiceForm entity = serviceFormRepository.findById(id);
        ServiceFormDto serviceFormDto = mapper.ServiceFormToDto(entity);
        serviceFormDto.setCustomerComplaints(convertStringToList(entity.getCustomerComplaints()));
        serviceFormDto.setNotes(convertStringToList(entity.getNotes()));
        serviceFormRepository.delete(entity);
        return serviceFormDto;
    }

    public List<String> convertStringToList(String stringEntity) {
        if (stringEntity == null || stringEntity.isEmpty()) {
            return new ArrayList<>();
        }
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(stringEntity, new TypeReference<>() {
            });
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    public String convertListToString(List<String> stringList) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(stringList);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

}
