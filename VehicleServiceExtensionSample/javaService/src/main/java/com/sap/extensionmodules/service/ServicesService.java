package com.sap.extensionmodules.service;

import com.sap.extensionmodules.Utils.UpdateChecker;
import com.sap.extensionmodules.dtos.AdminData;
import com.sap.extensionmodules.dtos.ServicesDto;
import com.sap.extensionmodules.security.RequestContextProvider;
import com.sap.extensionmodules.mappers.VehicleServiceMapper;
import com.sap.extensionmodules.entity.Services;
import com.sap.extensionmodules.repository.ServicesRepository;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import static com.sap.extensionmodules.commons.Constants.Messages.*;

@Service
public class ServicesService {

    @Autowired
    private ServicesRepository servicesRepository;

    @Autowired
    RequestContextProvider requestContextProvider;

    @Autowired
    private VehicleServiceMapper mapper;

    public ServicesDto create(ServicesDto servicesDto) {
        Date date = Calendar.getInstance().getTime();
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS000000");
        String strDate = dateFormat.format(date);
        AdminData adminData = new AdminData(
                strDate,strDate,requestContextProvider.getRequestContext().getUserId(),requestContextProvider.getRequestContext().getUserId());
        servicesDto.setAdminData(adminData);
        Services entity = servicesRepository.create(mapper.ServicesDtoToServices(servicesDto));
        return mapper.ServicesToDto(entity);
    }

    public List<ServicesDto> findAll() {
        List<Services> entities = servicesRepository.findAll();
        List<ServicesDto> ListOfServicesDto = new ArrayList<>();
        for(Services entity: entities) {
            ServicesDto servicesDto = mapper.ServicesToDto(entity);
            ListOfServicesDto.add(servicesDto);
        }
        return ListOfServicesDto;
    }

    public ServicesDto findById(String id) throws NotFoundException {
        Services entity = servicesRepository.findById(id);
        return mapper.ServicesToDto(entity);
    }

    public ServicesDto update(String id, ServicesDto dto, String ifMatch) throws NotFoundException {
        Services services = new Services();
        Date date = Calendar.getInstance().getTime();
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS000000");
        String strDate = dateFormat.format(date);
        ServicesDto existingService = mapper.ServicesToDto(servicesRepository.findById(id));

        if(existingService == null) {
            throw new NotFoundException(SERVICE_RESOURCE_NOT_FOUND);
        } else {
            UpdateChecker.isUpdateOnLatestData(ifMatch, existingService.getAdminData().getUpdatedOn());
            AdminData adminData = new AdminData(
                    existingService.getAdminData().getCreatedOn(), strDate,
                    existingService.getAdminData().getCreatedBy(),
                    requestContextProvider.getRequestContext().getUserId());
            dto.setAdminData(adminData);

            mapper.updateServices(dto, services);
            Services entity = servicesRepository.update(services);
            return mapper.ServicesToDto(entity);
        }
    }

    public ServicesDto delete(String id) throws NotFoundException {
        Services entity = servicesRepository.findById(id);
        if (entity == null) {
            throw new NotFoundException(SERVICE_RESOURCE_NOT_FOUND);
        }
        ServicesDto servicesDto = mapper.ServicesToDto(entity);
        servicesRepository.delete(entity);
        return servicesDto;
    }
}
