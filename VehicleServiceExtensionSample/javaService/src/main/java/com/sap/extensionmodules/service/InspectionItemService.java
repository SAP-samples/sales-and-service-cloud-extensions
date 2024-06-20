package com.sap.extensionmodules.service;

import com.sap.extensionmodules.Utils.UpdateChecker;
import com.sap.extensionmodules.dtos.AdminData;
import com.sap.extensionmodules.dtos.InspectionItemDto;
import com.sap.extensionmodules.security.RequestContextProvider;
import com.sap.extensionmodules.mappers.VehicleServiceMapper;
import com.sap.extensionmodules.entity.InspectionItem;
import com.sap.extensionmodules.repository.InspectionItemRepository;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import static com.sap.extensionmodules.commons.Constants.Messages.INSPECTION_ITEM_RESOURCE_NOT_FOUND;

@Service
public class InspectionItemService {
    @Autowired
    InspectionItemRepository inspectionItemRepository;

    @Autowired
    private VehicleServiceMapper mapper;

    @Autowired
    RequestContextProvider requestContextProvider;

    public InspectionItemDto create(InspectionItemDto dto) {
        Date date = Calendar.getInstance().getTime();
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS000000");
        String strDate = dateFormat.format(date);
        AdminData adminData = new AdminData(
                strDate,strDate,requestContextProvider.getRequestContext().getUserId(),requestContextProvider.getRequestContext().getUserId());
        dto.setAdminData(adminData);
        InspectionItem entity = inspectionItemRepository.create(mapper.inspectionItemDtoToInspectionItem(dto));
        return mapper.InspectionItemToDto(entity);
    }

    public List<InspectionItemDto> findAll() {
        List<InspectionItem> entities = inspectionItemRepository.findAll();
        List<InspectionItemDto> ListOfInspectionItemDto = new ArrayList<>();
        for (InspectionItem entity : entities) {
            InspectionItemDto inspectionItemDto = mapper.InspectionItemToDto(entity);
            ListOfInspectionItemDto.add(inspectionItemDto);
        }
        return ListOfInspectionItemDto;
    }
    public List<InspectionItemDto> findAllByQuery() {
        List<InspectionItemDto> dtos = inspectionItemRepository.findAllByQuery();
        return dtos;
    }

    public InspectionItemDto findById(String id) throws NotFoundException {
        InspectionItem entity = inspectionItemRepository.findById(id);
        return mapper.InspectionItemToDto(entity);
    }

    public InspectionItemDto update(String id, InspectionItemDto dto, String ifMatch) throws NotFoundException {
        InspectionItem inspectionItem = new InspectionItem();
        Date date = Calendar.getInstance().getTime();
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS000000");
        String strDate = dateFormat.format(date);
        InspectionItemDto existingInspectionItem = mapper.InspectionItemToDto(inspectionItemRepository.findById(id));

        if (existingInspectionItem == null) {
            throw new NotFoundException(INSPECTION_ITEM_RESOURCE_NOT_FOUND);
        } else {
            UpdateChecker.isUpdateOnLatestData(ifMatch, existingInspectionItem.getAdminData().getUpdatedOn());
            AdminData adminData = new AdminData(
                    existingInspectionItem.getAdminData().getCreatedOn(), strDate,
                    existingInspectionItem.getAdminData().getCreatedBy(),
                    requestContextProvider.getRequestContext().getUserId());
            dto.setAdminData(adminData);

            mapper.updateInspectionItem(dto, inspectionItem);
            InspectionItem entity = inspectionItemRepository.update(inspectionItem);
            return mapper.InspectionItemToDto(entity);
        }
    }

    public InspectionItemDto delete(String id) throws NotFoundException {
        InspectionItem entity = inspectionItemRepository.findById(id);
        if (entity == null) {
            throw new NotFoundException(INSPECTION_ITEM_RESOURCE_NOT_FOUND);
        }
        InspectionItemDto inspectionItemDto = mapper.InspectionItemToDto(entity);
        inspectionItemRepository.delete(entity);
        return inspectionItemDto;
    }
}
