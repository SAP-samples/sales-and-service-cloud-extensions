package com.sap.extensionmodules.mappers;

import com.sap.cnsmodules.model.CasePatchUpdateRequest;
import com.sap.cnsmodules.model.CaseReadResponseValue;
import com.sap.cnsmodules.model.CaseUpdateRequest;
import com.sap.extensionmodules.dtos.*;
import com.sap.extensionmodules.entity.*;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public abstract class VehicleServiceMapper{

    @BeanMapping(nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
    @Mappings({
            @Mapping(source = "createdOn", target = "adminData.createdOn"),
            @Mapping(source = "updatedOn", target = "adminData.updatedOn"),
            @Mapping(source = "createdBy", target = "adminData.createdBy"),
            @Mapping(source = "updatedBy", target = "adminData.updatedBy")
    })
    public abstract InspectionItemDto InspectionItemToDto(InspectionItem inspectionItem);

    @BeanMapping(nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
    @Mappings({
            @Mapping(source = "adminData.createdOn", target = "createdOn"),
            @Mapping(source = "adminData.updatedOn", target = "updatedOn"),
            @Mapping(source = "adminData.createdBy", target = "createdBy"),
            @Mapping(source = "adminData.updatedBy", target = "updatedBy")
    })
    public abstract InspectionItem inspectionItemDtoToInspectionItem(InspectionItemDto inspectionItemDto);

    @BeanMapping(nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
    public abstract List<InspectionItemDto> InspectionItemToDtoList(List<InspectionItem> InspectionItemList);

    @BeanMapping(nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
    @Mappings({
            @Mapping(source = "createdOn", target = "adminData.createdOn"),
            @Mapping(source = "updatedOn", target = "adminData.updatedOn"),
            @Mapping(source = "createdBy", target = "adminData.createdBy"),
            @Mapping(source = "updatedBy", target = "adminData.updatedBy")
    })
    public abstract ServicesDto ServicesToDto(Services services);

    @BeanMapping(nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
    @Mappings({
            @Mapping(source = "adminData.createdOn", target = "createdOn"),
            @Mapping(source = "adminData.updatedOn", target = "updatedOn"),
            @Mapping(source = "adminData.createdBy", target = "createdBy"),
            @Mapping(source = "adminData.updatedBy", target = "updatedBy")
    })
    public abstract Services ServicesDtoToServices(ServicesDto servicesDto);

    @BeanMapping(nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
    public abstract List<ServicesDto> ServicesDtoToDtoList(List<Services> services);

    @BeanMapping(nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
    @Mappings({
            @Mapping(source = "createdOn", target = "adminData.createdOn"),
            @Mapping(source = "updatedOn", target = "adminData.updatedOn"),
            @Mapping(source = "createdBy", target = "adminData.createdBy"),
            @Mapping(source = "updatedBy", target = "adminData.updatedBy")
    })
    public abstract EmployeeDto EmployeeToDto(Employee employee);

    @BeanMapping(nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
    @Mappings({
            @Mapping(source = "adminData.createdOn", target = "createdOn"),
            @Mapping(source = "adminData.updatedOn", target = "updatedOn"),
            @Mapping(source = "adminData.createdBy", target = "createdBy"),
            @Mapping(source = "adminData.updatedBy", target = "updatedBy")
    })
    public abstract Employee EmployeeDtoToServices(EmployeeDto employeeDto);

    @BeanMapping( nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE )
    @Mappings({
            @Mapping(source = "adminData.createdOn", target = "createdOn"),
            @Mapping(source = "adminData.updatedOn", target = "updatedOn"),
            @Mapping(source = "adminData.createdBy", target = "createdBy"),
            @Mapping(source = "adminData.updatedBy", target = "updatedBy")
    })
    public abstract void updateEmployee(EmployeeDto dto, @MappingTarget Employee employee);

    @BeanMapping(nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
    public abstract List<JobCardDto> JobCardToDtoList(List<JobCard> JobCardList);

    @BeanMapping(nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
    @Mappings({
            @Mapping(target = "customerComplaints", ignore = true),
            @Mapping(target = "servicesSelected", ignore = true),
            @Mapping(source = "createdOn", target = "adminData.createdOn"),
            @Mapping(source = "updatedOn", target = "adminData.updatedOn"),
            @Mapping(source = "createdBy", target = "adminData.createdBy"),
            @Mapping(source = "updatedBy", target = "adminData.updatedBy")
    })
    public abstract JobCardDto JobCardToDto(JobCard jobCard);


    @BeanMapping(nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
    @Mappings({
            @Mapping(target = "technician", ignore = true),
            @Mapping(source = "createdOn", target = "adminData.createdOn"),
            @Mapping(source = "updatedOn", target = "adminData.updatedOn"),
            @Mapping(source = "createdBy", target = "adminData.createdBy"),
            @Mapping(source = "updatedBy", target = "adminData.updatedBy")
    })
    public abstract JobCardServicesDto JobCardServicesToDto(JobCardServices jobCardServices);

//    @BeanMapping(nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
//    public abstract JobCardServicesDto UpdateJobCardService(JobCardServicesUpdateDto jobCardServicesUpdateDto, @MappingTarget JobCardServices jobCardServices);

    @BeanMapping( nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE )
    @Mappings({
            @Mapping(source = "adminData.createdOn", target = "createdOn"),
            @Mapping(source = "adminData.updatedOn", target = "updatedOn"),
            @Mapping(source = "adminData.createdBy", target = "createdBy"),
            @Mapping(source = "adminData.updatedBy", target = "updatedBy")
    })
    public abstract void updateInspectionItem(InspectionItemDto dto, @MappingTarget InspectionItem item)  ;

    @BeanMapping( nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE )
    @Mappings({
            @Mapping(source = "adminData.createdOn", target = "createdOn"),
            @Mapping(source = "adminData.updatedOn", target = "updatedOn"),
            @Mapping(source = "adminData.createdBy", target = "createdBy"),
            @Mapping(source = "adminData.updatedBy", target = "updatedBy")
    })
    public abstract void updateServices(ServicesDto dto, @MappingTarget Services services);

    @BeanMapping(nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
    @Mappings({
            @Mapping(target = "customerComplaints", ignore = true),
            @Mapping(target = "notes", ignore = true),
            @Mapping(source = "createdOn", target = "adminData.createdOn"),
            @Mapping(source = "updatedOn", target = "adminData.updatedOn"),
            @Mapping(source = "createdBy", target = "adminData.createdBy"),
            @Mapping(source = "updatedBy", target = "adminData.updatedBy")
    })
    public abstract ServiceFormDto ServiceFormToDto(ServiceForm serviceForm);

    @BeanMapping(nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
    public abstract List<ServiceFormDto> ServiceFormToDtoList(List<ServiceForm> ServiceFormList);

    @BeanMapping(nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
    @Mappings({
            @Mapping(target = "customerComplaints", ignore = true),
            @Mapping(target = "notes", ignore = true),
            @Mapping(source = "adminData.createdOn", target = "createdOn"),
            @Mapping(source = "adminData.updatedOn", target = "updatedOn"),
            @Mapping(source = "adminData.createdBy", target = "createdBy"),
            @Mapping(source = "adminData.updatedBy", target = "updatedBy")
    })
    public abstract ServiceForm ServiceFormDtoToServiceForm(ServiceFormDto dto);

    @BeanMapping( nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE )
    @Mappings({
            @Mapping(target = "customerComplaints", ignore = true),
            @Mapping(target = "notes", ignore = true),
            @Mapping(source = "adminData.createdOn", target = "createdOn"),
            @Mapping(source = "adminData.updatedOn", target = "updatedOn"),
            @Mapping(source = "adminData.createdBy", target = "createdBy"),
            @Mapping(source = "adminData.updatedBy", target = "updatedBy")
    })
    public abstract void updateServiceForm(ServiceFormDto dto, @MappingTarget ServiceForm serviceForm) ;

    @BeanMapping(nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
    @Mappings({
            @Mapping(target = "technician", ignore = true),
            @Mapping(source = "adminData.createdOn", target = "createdOn"),
            @Mapping(source = "adminData.updatedOn", target = "updatedOn"),
            @Mapping(source = "adminData.createdBy", target = "createdBy"),
            @Mapping(source = "adminData.updatedBy", target = "updatedBy")

    })
    public abstract JobCardServices JobCardServicesDtoToJobCardServices(JobCardServicesDto jobCardServicesDto);

    @BeanMapping(nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
    @Mapping(target = "notes", ignore = true)
    public abstract List<JobCardServices> JobCardServicesDtoListToJobCardServicesList(List<JobCardServicesDto> jobCardServicesDtoList);

    @BeanMapping( nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE )
    @Mappings({
            @Mapping(target = "technician", ignore = true),
            @Mapping(source = "adminData.createdOn", target = "createdOn"),
            @Mapping(source = "adminData.updatedOn", target = "updatedOn"),
            @Mapping(source = "adminData.createdBy", target = "createdBy"),
            @Mapping(source = "adminData.updatedBy", target = "updatedBy")

    })
    public abstract void updateJobCardServices(JobCardServicesDto jobCardServicesDto, @MappingTarget JobCardServices jobCardServices);
    @BeanMapping( nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE )
    @Mapping(target = "id", ignore = true)
    public abstract void servicesToJobCardServicesDto(ServicesDto servicesDto, @MappingTarget JobCardServicesDto dto);
    @BeanMapping( nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE )
    @Mappings({
            @Mapping(target = "technician", ignore = true)
    })
    public abstract void updateJobCardServicesDto(JobCardServicesUpdateDto jobCardServicesUpdateDto, @MappingTarget JobCardServicesDto jobCardServicesDto);
//    @BeanMapping( nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE )
//    @Mapping(target = "notes", ignore = true)
//    public abstract void createJobCardServices(JobCardServicesDto jobCardServicesDto, @MappingTarget JobCardServices jobCardServices);

    @BeanMapping( nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE )
    @Mappings({
            @Mapping(target = "servicesSelected", ignore = true),
            @Mapping(target = "displayId", ignore = true),
            @Mapping(target = "customerComplaints", ignore = true),
            @Mapping(source = "adminData.createdOn", target = "createdOn"),
            @Mapping(source = "adminData.updatedOn", target = "updatedOn"),
            @Mapping(source = "adminData.createdBy", target = "createdBy"),
            @Mapping(source = "adminData.updatedBy", target = "updatedBy")

    })
    public abstract void updateJobCard(JobCardDto jobCardDto, @MappingTarget JobCard jobCard);

    @BeanMapping( nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE )
    @Mapping(target = "servicesSelected", ignore = true)
    @Mapping(target = "displayId", ignore = true)
    @Mapping(target = "customerComplaints", ignore = true)
    public abstract void updateJobCardStatus(JobCardDto jobCardDto, @MappingTarget JobCard jobCard);

    @BeanMapping( nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE )
    @Mapping(target = "customFieldNames", ignore = true)
    public abstract void CaseResponseValueToCasePatchUpdate(CaseReadResponseValue responseValue, @MappingTarget CasePatchUpdateRequest casePatchUpdateRequest);

    @BeanMapping( nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE )
    @Mapping(target = "customFieldNames", ignore = true)
    public abstract void CaseResponseValueToCasePutUpdate(CaseReadResponseValue responseValue, @MappingTarget CaseUpdateRequest caseupdateRequest);
}