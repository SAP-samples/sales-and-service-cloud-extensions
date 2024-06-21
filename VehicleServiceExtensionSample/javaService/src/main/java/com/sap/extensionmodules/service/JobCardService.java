package com.sap.extensionmodules.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.sap.cnsmodules.model.CasePatchResponse;
import com.sap.cnsmodules.model.CasePatchUpdateRequest;
import com.sap.cnsmodules.model.CaseReadResponse;
import com.sap.extensionmodules.Utils.*;
import com.sap.extensionmodules.commons.Constants;
import com.sap.extensionmodules.commons.Constants.Messages;
import com.sap.extensionmodules.commons.Constants.CaseStatus;
import com.sap.extensionmodules.commons.Constants.EntityName;
import com.sap.extensionmodules.commons.Constants.CaseType;
import com.sap.extensionmodules.commons.JCStatus;
import com.sap.extensionmodules.commons.SFStatus;
import com.sap.extensionmodules.commons.ServiceStatus;
import com.sap.extensionmodules.dtos.*;
import com.sap.extensionmodules.dtos.query.QueryDTOHelper;
import com.sap.extensionmodules.dtos.query.QueryFilterOptions;
import com.sap.extensionmodules.dtos.query.QueryRequestDTO;
import com.sap.extensionmodules.exception.CustomException;
import com.sap.extensionmodules.exception.CustomNotFoundException;
import com.sap.extensionmodules.exception.CustomValidationException;
import com.sap.extensionmodules.exception.ErrorResponse;
import com.sap.extensionmodules.repository.ServiceFormRepository;
import com.sap.extensionmodules.security.RequestContextProvider;
import com.sap.extensionmodules.mappers.VehicleServiceMapper;
import com.sap.extensionmodules.entity.JobCard;
import com.sap.extensionmodules.entity.JobCardServices;
import com.sap.extensionmodules.repository.JobCardRepository;
import com.sap.extensionmodules.repository.JobCardServicesRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.regex.Pattern;

import static com.sap.extensionmodules.commons.Constants.ExtensionFields.JOBCARD_ID;
import static com.sap.extensionmodules.commons.Constants.Messages.CASE_COMPLETED;

@Service
public class JobCardService {
    @Autowired
    private EntityManager entityManager;
    @Autowired
    JobCardRepository jobCardRepository;
    @Autowired
    JobCardServicesRepository jobCardServicesRepository;
    @Autowired
    ServiceFormService serviceFormService;
    @Autowired
    CaseService caseService;
    @Autowired
    CustomerService customerService;
    @Autowired
    VehicleServiceMapper mapper;
    @Autowired
    QueryDTOHelper queryDTOHelper;
    @Autowired
    RequestContextProvider requestContextProvider;
    @Autowired
    ServiceFormRepository serviceFormRepository;
    @Autowired
    EmployeesService employeesService;

    private Gson gson = new Gson();

    public List<JobCardDto> findAll(Optional<String> filter, Optional<String> search, Optional<Integer> top, Optional<Integer> skip) {
        Specification<JobCard> spec = null;
        boolean getCustomerDetails = false;
        List<JobCardDto> dtos = new ArrayList<>();
        if(search.isPresent()) {
            spec = JobCardSearchSpecification.hasStatusLike(search.get())
                    .or(JobCardSearchSpecification.hasModelLike(search.get())
                            .or(JobCardSearchSpecification.hasVehicleNumberLike(search.get())
                                    .or(JobCardSearchSpecification.hasDisplayIdLike(search.get()))));
        }
        else if(filter.isPresent()) {
            QueryRequestDTO queryRequestDTO = queryDTOHelper.buildRequestDTO(filter);
            if (queryRequestDTO.getFilterOptions() != null) {
                for(QueryFilterOptions option: queryRequestDTO.getFilterOptions()) {
                    if(spec == null) {
                        spec = new JobCardSpecification(option);
                    }
                    else {
                        Specification<JobCard> predicate = new JobCardSpecification(option);
                        spec = spec.and(predicate);
                    }
                }

            }
        }
        Pageable page = getPageSize(top, skip);

        List<JobCard> entity = jobCardRepository.findAllBy(spec, page);

        for (JobCard jobCard : entity) {
            dtos.add(enhanceDto(jobCard, getCustomerDetails));
        }
        return dtos;
    }

    public long getCount() {
        return jobCardRepository.getCount();
    }

    public Pageable getPageSize(Optional<Integer> top, Optional<Integer> skip) {

        int pageSize = top.orElse(Constants.DEFAULT_PAGE_SIZE);
        if(pageSize > Constants.MAX_PAGE_SIZE) {
            pageSize = Constants.MAX_PAGE_SIZE;
        }
        int pageNumber = skip.orElse(0)/(pageSize!=0?pageSize:Constants.DEFAULT_PAGE_SIZE);

        return PageRequest.of(pageNumber, pageSize );
    }

    public JobCardDto findOne(String id) {
        JobCard entity = jobCardRepository.findOneBy(id);
        boolean getCustomerDetails = true;
        return enhanceDto(entity, getCustomerDetails);

    }

    public JobCardDto findByCaseId(String id, boolean getCustomerDetails) {
        JobCard entity = jobCardRepository.findOneByCaseId(id);
        return enhanceDto(entity, getCustomerDetails);

    }

    //    list of type servicesSelected
    public List<JobCardServicesDto> findAllJobCardServices(String jobCardId) {
        List<JobCardServicesDto> result = findOne(jobCardId).getServicesSelected();
        return result;
    }

    public JobCardServicesDto findOneJobCardService(String jobCardServiceId) {
        JobCardServices entity = jobCardServicesRepository.findOneBy(jobCardServiceId);
        JobCardServicesDto dto = mapper.JobCardServicesToDto(entity);
        dto.setTechnician(gson.fromJson(entity.getTechnician(), TechnicianDto.class));
        return dto;
    }

    @Transactional(rollbackFor = Exception.class)
    public JobCardServicesDto updateJobCardService(String jobCardId,
                                                   String jobCardServiceId,
                                                   JobCardServicesUpdateDto jobCardServicesUpdateDto,
                                                   String ifMatch) throws Exception {

        JobCardServices entity = jobCardServicesRepository.findOneBy(jobCardServiceId);
        JobCardServicesDto result = mapper.JobCardServicesToDto(entity);
        if(jobCardServicesUpdateDto.getTechnician()!=null) {
            List<EmployeeDto> employee = employeesService.findAll(Optional.of("btpUserId eq "+jobCardServicesUpdateDto.getTechnician().getBtpUserId()));
            if(employee.size()>0) {
                result.setTechnician(new TechnicianDto(employee.get(0).getBtpUserId(),employee.get(0).getName()));
            }
            else {
                throw new RuntimeException(Messages.INVALID_EMPLOYEE);
            }
        } else {
            result.setTechnician(gson.fromJson(entity.getTechnician(), TechnicianDto.class));
        }

        checkAuthorization(jobCardServicesUpdateDto, result);

        Date date = Calendar.getInstance().getTime();
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
        String strDate = dateFormat.format(date);

        String userId = requestContextProvider.getRequestContext().getUserId();
        JobCardDto jobCardDto = findOne(jobCardId);
        List<JobCardServicesDto> jobCardServices = jobCardDto.getServicesSelected();


        UpdateChecker.isUpdateOnLatestData(ifMatch, result.getAdminData().getUpdatedOn());

        mapper.updateJobCardServicesDto(jobCardServicesUpdateDto, result);
        result.setAdminData(new AdminData(result.getAdminData().getCreatedOn(),
                strDate,
                result.getAdminData().getCreatedBy(),
                userId));

        String caseId = jobCardDto.getCaseId();
        CasePatchUpdateRequest caseUpdateData = new CasePatchUpdateRequest();
        CaseReadResponse caseReadResponse = caseService.getCaseById(UUID.fromString(caseId));
        mapper.CaseResponseValueToCasePatchUpdate(caseReadResponse.getValue(), caseUpdateData);

        boolean jobCardCompleted = false;
        boolean jobCardStarted = false;

        if (jobCardServicesUpdateDto.getStatus() != null) {
            //updatedStatus = In Progress (Z22) or Completed (Z23)
            if (jobCardServicesUpdateDto.getStatus().equals(ServiceStatus.Z22.toString()) || jobCardServicesUpdateDto.getStatus().equals(ServiceStatus.Z23.toString())) {
                if (jobCardServicesUpdateDto.getStatus().equals(ServiceStatus.Z22.toString()) && result.getStartTime() == null) {
                    result.setStartTime(strDate);
                } else if (jobCardServicesUpdateDto.getStatus().equals(ServiceStatus.Z23.toString()) && result.getEndTime() == null) {
                    result.setEndTime(strDate);
                }

                int numberOfJobCardService = jobCardServices.size();
                List<JobCardServicesDto> list = new ArrayList<>();
                for (JobCardServicesDto jobCardService : jobCardServices) {
                    if (jobCardService.getStatus().equals(ServiceStatus.Z23.toString())) {
                        list.add(jobCardService);
                    }
                }
                int numberOfCompletedServices = list.size();

                List<JobCardServicesDto> list1 = new ArrayList<>();
                for (JobCardServicesDto t : jobCardServices) {
                    if (t.getStatus().equals(ServiceStatus.Z22.toString())) {
                        list1.add(t);
                    }
                }
                int numberOfServicesInProgress = list1.size();
        /* If the first service is started, update case status to "Service In Process". If the last service is completed,
        update case status to "Service Completed",update job card status to "Completed"
        */
                if (jobCardServicesUpdateDto.getStatus().equals(ServiceStatus.Z22.toString()) && numberOfServicesInProgress == 0) {
                    caseUpdateData.setStatus(CaseStatus.SERVICE_IN_PROCESS);
                    jobCardStarted = true;
                } else if (jobCardServicesUpdateDto.getStatus().equals(ServiceStatus.Z23.toString()) && numberOfCompletedServices + 1 == numberOfJobCardService) {
                    caseUpdateData.setStatus(CaseStatus.SERVICE_COMPLETED);
                    jobCardCompleted = true;
                }
            }
        }

        mapper.updateJobCardServices(result, entity);
        entity.setTechnician(gson.toJson(result.getTechnician()));
        jobCardServicesRepository.update(entity);
        entityManager.flush();
        //update the corresponding jobCard
        if (jobCardStarted) {
            JobCardDto newJobCardDto = findOne(jobCardId);
            newJobCardDto.setStatus(JCStatus.Z12.toString());
            newJobCardDto.getAdminData().setUpdatedBy(userId);
            newJobCardDto.getAdminData().setUpdatedOn(strDate);
            updateJobCard(newJobCardDto);

        } else if (jobCardCompleted) {
            JobCardDto newJobCardDto = findOne(jobCardId);
            newJobCardDto.setStatus(JCStatus.Z13.toString());
            newJobCardDto.getAdminData().setUpdatedBy(userId);
            newJobCardDto.getAdminData().setUpdatedOn(strDate);
            updateJobCard(newJobCardDto);
        }

        OffsetDateTime offsetDateTime = OffsetDateTime.parse(caseReadResponse.getValue().getAdminData().getUpdatedOn());
        CasePatchResponse response = caseService.updateCase(offsetDateTime, UUID.fromString(caseId), caseUpdateData);
        return result;
    }

    @Transactional(rollbackFor = Exception.class)
    public JobCardDto createJobCard(String sourceid, String sourceType) throws Exception {
        boolean getCustomerDetails = false;
        List<ErrorResponse.ErrorInfo> details = new ArrayList<>();

        // get the source id and based on source id get service form id
        if (!Objects.equals(sourceType, "service-form"))
            details.add(new ErrorResponse.ErrorInfo(
                    Messages.INVALID_SOURCE_TYPE, "sourceType", sourceType));

        if (!isValidUUID(sourceid))
            details.add(new ErrorResponse.ErrorInfo(
                    Messages.INVALID_SOURCE_ID, "sourceid", sourceid));

        if (!details.isEmpty()) {
            throw new CustomValidationException(HttpStatus.BAD_REQUEST.value(),
                    "Validation errors occurred.", details);
        }

        ServiceFormDto serviceForm = serviceFormService.findById(sourceid);
        String caseId = serviceForm.getCaseId().toString();

        String serviceFormStatus = serviceForm.getStatus();
        if (serviceFormStatus.compareTo(SFStatus.Z02.toString()) != 0) {
            //throw new InternalServer exception if service is not booked
            throw new CustomNotFoundException(HttpStatus.NOT_FOUND.value(), Messages.SERVICE_FORM_NOT_BOOKED);
        }
        Date date = Calendar.getInstance().getTime();
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
        String strDate = dateFormat.format(date);

        List<ServicesDto> servicesProposed = serviceForm.getServicesProposed();
        List<JobCardServicesDto> jobCardServicesList = new ArrayList<>();
        List<ServicesDto> servicesSelected = new ArrayList<>();

        for (ServicesDto servicesDto : servicesProposed) {
            if (servicesDto.getIsSelected()) {
                servicesSelected.add(servicesDto);
            }
        }
        if (servicesSelected.size() == 0) {
            throw new CustomNotFoundException(HttpStatus.NOT_FOUND.value(), Messages.NO_SERVICES_SELECTED);
        }

        for (ServicesDto servicesDto : servicesSelected) {
            JobCardServicesDto jobCardService = new JobCardServicesDto();
            jobCardService.setPrice(servicesDto.getPrice());
            jobCardService.setService(servicesDto.getService());
            jobCardService.setStatus(ServiceStatus.Z21.toString());
            jobCardService.setAdminData(new AdminData(strDate, strDate, "", ""));
            jobCardService.setTechnician(new TechnicianDto());
            jobCardServicesList.add(jobCardService);
        }

        CaseReadResponse caseReadResponse = caseService.getCaseById(UUID.fromString(caseId));
        CaseServiceDto caseServiceDto = caseService.getCaseData(caseReadResponse);
        if (caseReadResponse.getValue().getStatus().equals(CaseStatus.COMPLETED))
            throw new CustomNotFoundException(HttpStatus.INTERNAL_SERVER_ERROR.value(), CASE_COMPLETED);

        CustomerDetails customerDetails = getCustomerDetailsFromCase(caseReadResponse, caseServiceDto);
        String userId = requestContextProvider.getRequestContext().getUserId();

        JobCardDto jobCardDto = new JobCardDto();
        jobCardDto.setCaseId(caseId);
        jobCardDto.setCaseDisplayId(caseServiceDto.getCaseDisplayId());
        jobCardDto.setStatus(JCStatus.Z11.toString());
        jobCardDto.setMilometer(serviceForm.getMilometer());
        jobCardDto.setModel(serviceForm.getRegisteredProduct() != null && serviceForm.getRegisteredProduct().getModel() != null ? serviceForm.getRegisteredProduct().getModel() : "");
        jobCardDto.setVehicleNumber(serviceForm.getRegisteredProduct() != null && serviceForm.getRegisteredProduct().getVehicleNumber() != null ? serviceForm.getRegisteredProduct().getVehicleNumber() : "");
        AdminData adminData = new AdminData();
        adminData.setCreatedBy(userId);
        adminData.setCreatedOn(strDate);
        adminData.setUpdatedOn(strDate);
        jobCardDto.setAdminData(adminData);

        if (caseServiceDto.getEstimatedCompletionDate() != null) {
            jobCardDto.setEstimatedCompletionDate(caseServiceDto.getEstimatedCompletionDate());
        } else {
            jobCardDto.setEstimatedCompletionDate("");
        }

        jobCardDto.setRegisteredProduct(serviceForm.getRegisteredProduct());
        jobCardDto.setCustomerDetails(customerDetails);
        jobCardDto.setServicesSelected(jobCardServicesList);
        if (serviceForm.getCustomerComplaints() != null) {
            jobCardDto.setCustomerComplaints(serviceForm.getCustomerComplaints());
        }

        JobCard entity = new JobCard();
        mapper.updateJobCard(jobCardDto, entity);
        if (jobCardDto.getCustomerComplaints() != null)
            entity.setCustomerComplaints(convertListToString(jobCardDto.getCustomerComplaints()));

        List<JobCardServicesDto> servicesDtos = jobCardDto.getServicesSelected();
        for (JobCardServicesDto serviceDto : servicesDtos) {
            JobCardServices service = mapper.JobCardServicesDtoToJobCardServices(serviceDto);
            service.setTechnician(gson.toJson(serviceDto.getTechnician()));
            entity.addServicesSelected(service);
        }
        entity.addServiceForm(serviceFormRepository.findById(serviceForm.getId()));
        JobCard newEnity = jobCardRepository.create(entity);
        entityManager.flush();
        JobCardDto result = enhanceDto(newEnity, getCustomerDetails);
        StatusUtil.addStatusDescription(result, requestContextProvider.getRequestContext().getLanguage());
        CasePatchUpdateRequest caseUpdateData = new CasePatchUpdateRequest();
        mapper.CaseResponseValueToCasePatchUpdate(caseReadResponse.getValue(), caseUpdateData);
        caseUpdateData.setStatus(CaseStatus.BOOKED);
        HashMap<String, String> map = new HashMap<>();
        map.put(JOBCARD_ID, Integer.toString(result.getDisplayId()));
        caseUpdateData.setExtensions(map);
        OffsetDateTime offsetDateTime = OffsetDateTime.parse(caseReadResponse.getValue().getAdminData().getUpdatedOn());
        CasePatchResponse response = caseService.updateCase(offsetDateTime, UUID.fromString(caseId), caseUpdateData);
        return result;

    }

    public void remove(String id) throws Exception {
        JobCard entity = jobCardRepository.findOneBy(id);
        List<JobCardServices> services = entity.getServicesSelected();
        for (int i = services.size() - 1; i >= 0; i--) {
            JobCardServices service = services.get(i);
            entity.removeServicesSelected(service);
        }
        entity.setServiceForm(null);
//        for (JobCardServices service : services) {
//            entity.removeServicesSelected(service);
//        }
        jobCardRepository.delete(entity);
    }

    public JobCardDto updateJobCard(JobCardDto newJobCardDto) {
            JobCard entity = new JobCard();
            mapper.updateJobCard(newJobCardDto, entity);
            if (newJobCardDto.getCustomerComplaints() != null)
                entity.setCustomerComplaints(convertListToString(newJobCardDto.getCustomerComplaints()));
            List<JobCardServicesDto> servicesDtos = newJobCardDto.getServicesSelected();

            for (JobCardServicesDto serviceDto : servicesDtos) {
                JobCardServices service = mapper.JobCardServicesDtoToJobCardServices(serviceDto);
                service.setTechnician(gson.toJson(serviceDto.getTechnician()));
                entity.addServicesSelected(service);
            }

            JobCardDto result = mapper.JobCardToDto(jobCardRepository.create(entity));
            return result;

    }

    private CustomerDetails getCustomerDetailsFromCase(CaseReadResponse caseReadResponse, CaseServiceDto caseServiceDto) {
        JSONObject caseReadResponseValue = new JSONObject(caseReadResponse.getValue());
        CustomerDetails customerDetails = new CustomerDetails();
        customerDetails.setName(caseServiceDto.getCustomerName());

        if (caseServiceDto.getContactNumber() == null) {
            if (caseReadResponseValue.has("individualCustomer"))
                customerDetails = customerService.getIndividualCustomerInfo(caseReadResponse.getValue().getIndividualCustomer().getId());
            else if (caseReadResponseValue.has("account"))
                customerDetails = customerService.getAccountInfo(caseReadResponse.getValue().getAccount().getId());
        } else
            customerDetails.setContactNumber(caseServiceDto.getContactNumber());
        return customerDetails;
    }

    public JobCardValidationResponse findValidationStatusService(String entityName, Map<String, Object> sCompleteAggregateEntity) {

        JobCardValidationError error = new JobCardValidationError();
        List<Map<String, Object>> infoList = new ArrayList<>();
        List<JobCardValidationError> errorList = new ArrayList<>();

        Map<String, Object> query = new HashMap<>();
        query.put("caseId", sCompleteAggregateEntity.get("id"));

        Map<String, Object> caseDetails = new HashMap<>();
        caseDetails.put("caseStatus", sCompleteAggregateEntity.get("status"));
        caseDetails.put("caseType", sCompleteAggregateEntity.get("caseType"));
        try {
            // Check for valid case with entity name, caseId, caseType, and status
            if (EntityName.CASE.replace(".crm.", ".ssc.").equals(entityName) &&
                    query.containsKey("caseId") &&
                    CaseType.VEHICLE_SERVICE_REQUEST.equals(caseDetails.get("caseType")) &&
                    (CaseStatus.COMPLETED.equals(caseDetails.get("caseStatus"))
                            || CaseStatus.CLOSED.equals(caseDetails.get("caseStatus"))
                            || CaseStatus.SERVICE_COMPLETED.equals(caseDetails.get("caseStatus")))) {
                JobCardDto result = findByCaseId(query.get("caseId").toString(), false);
                // Check if job card has any servicesSelected
                if (result.getServicesSelected() == null || result.getServicesSelected().isEmpty()) {
                    error = JobCardUtil.getCustomLogicErrorDetails(
                            (String) query.get("caseId"),
                            Messages.NO_SERVICES_SELECTED
                    );
                    errorList.add(error);
                } else {
                    for (JobCardServicesDto servicesSelected : result.getServicesSelected()) {
                        // Check for servicesSelected complete status
                        if (!ServiceStatus.Z23.toString().equals(servicesSelected.getStatus())) {
                            error = JobCardUtil.getCustomLogicErrorDetails(
                                    (String) query.get("caseId"),
                                    Messages.CASE_STATUS_DISABLED
                            );
                            errorList.add(error);
                            break;
                        }
                    }
                }
            }
        } catch (CustomNotFoundException e) {
            error = JobCardUtil.getCustomLogicErrorDetails(
                    (String) query.get("caseId"),
                    Messages.JOBCARD_NOT_FOUND
            );
            errorList.add(error);
        }
        JobCardValidationResponse responseData = new JobCardValidationResponse(sCompleteAggregateEntity, infoList, errorList);
        return responseData;
    }

    private static boolean isValidUUID(String uuidString) {
        // Regular expression for a UUID
        String uuidRegex = "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$";

        // Check if the provided string matches the UUID format
        return Pattern.matches(uuidRegex, uuidString);
    }

    public JobCardDto enhanceDto(JobCard entity, boolean getCustomerDetails) {
        JobCardDto dto = mapper.JobCardToDto(entity);
        dto.setCustomerComplaints(convertStringToList(entity.getCustomerComplaints()));
        List<JobCardServices> services = entity.getServicesSelected();
        List<JobCardServicesDto> servicesDtos = new ArrayList<>();

        if(services !=null){
            for (JobCardServices jobCardService : services) {
                JobCardServicesDto jobCardServicesDto = mapper.JobCardServicesToDto(jobCardService);
                jobCardServicesDto.setTechnician(gson.fromJson(jobCardService.getTechnician(), TechnicianDto.class));
                servicesDtos.add(jobCardServicesDto);
            }
        }

        dto.setServicesSelected(servicesDtos);
        if (getCustomerDetails) {
            CaseReadResponse caseReadResponse = null;
            try {
                caseReadResponse = caseService.getCaseById(UUID.fromString(dto.getCaseId()));
                CaseServiceDto caseServiceDto = caseService.getCaseData(caseReadResponse);
                CustomerDetails customerDetails = getCustomerDetailsFromCase(caseReadResponse, caseServiceDto);
                dto.setServiceAdvisor(caseReadResponse.getValue().getProcessor().getName());
                dto.setCustomerDetails(customerDetails);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
        return dto;
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
    public void checkAuthorization(JobCardServicesUpdateDto updateDto, JobCardServicesDto dto) {
        // A User who has only `EditTask` scope can update only his own record, and can update only specific fields
        List<String> privileges = requestContextProvider.getRequestContext().getRoles();
        JSONObject json = new JSONObject(updateDto);

        boolean hasOnlyEditTask = privileges.contains(Constants.EditTaskRole) && !privileges.contains(Constants.EditJobCardService);
        List<String> unAuthorizedFields = json.keySet().stream().filter(s->!Arrays.stream(Constants.AUTHORIZED_FIELDS).toList().contains(s)).toList();

        if(hasOnlyEditTask) {
            JSONObject obj = new JSONObject(dto.getTechnician());
            if(!Objects.equals(requestContextProvider.getRequestContext().getUserId(), obj.getString("btpUserId"))){
                throw new CustomException(HttpStatus.FORBIDDEN.value(), Constants.CANNOT_EDIT_OTHER_USER_RECORDS);
            }
            else if(!unAuthorizedFields.isEmpty()) {
                throw new CustomException(HttpStatus.FORBIDDEN.value(), Constants.CANNOT_EDIT_FIELD+unAuthorizedFields);
            }

        }

    }

}

