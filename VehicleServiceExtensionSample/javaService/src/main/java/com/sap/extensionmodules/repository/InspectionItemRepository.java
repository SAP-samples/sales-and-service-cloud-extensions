package com.sap.extensionmodules.repository;

import com.sap.extensionmodules.commons.Constants;
import com.sap.extensionmodules.dtos.InspectionItemDto;
import com.sap.extensionmodules.exception.CustomNotFoundException;
import com.sap.extensionmodules.entity.InspectionItem;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

import static com.sap.extensionmodules.commons.Constants.Messages.INSPECTION_ITEM_RESOURCE_NOT_FOUND;

@Repository
public class InspectionItemRepository {

    @Autowired
    private InspectionItemRepositoryInterface serviceRepo;

    public InspectionItem create(InspectionItem entity) {
        try {
            return serviceRepo.save(entity);
        } catch (DataIntegrityViolationException e) {
            throw new CustomNotFoundException(HttpStatus.INTERNAL_SERVER_ERROR.value(), Constants.Messages.UNIQUE_KEY_CONSTRAINT_FAILED);
        } catch (DataAccessException e) {
            throw new CustomNotFoundException(HttpStatus.INTERNAL_SERVER_ERROR.value(), Constants.Messages.DB_ERROR);
        }
    }

    public List<InspectionItem> findAll() {
        try {
            List<InspectionItem> entities = new ArrayList<>();
            serviceRepo.findAll().forEach(entities::add);
            return entities;
        } catch (DataAccessException e) {
            throw new CustomNotFoundException(HttpStatus.INTERNAL_SERVER_ERROR.value(), Constants.Messages.DB_ERROR);
        }
    }
    public List<InspectionItemDto> findAllByQuery() {
        try {
            List<InspectionItemDto> dtos = new ArrayList<>();

            for( String[] obj : serviceRepo.findAllByQuery()) {
                InspectionItemDto dto = InspectionItemDto.builder()
                        .id(obj[0])
                        .description(obj[1])
                        .isSelected(Boolean.parseBoolean(obj[2])).build();
                dtos.add(dto);
            }
            return dtos;
        } catch (DataAccessException e) {
            throw new CustomNotFoundException(HttpStatus.INTERNAL_SERVER_ERROR.value(), Constants.Messages.DB_ERROR);
        }
    }

    public InspectionItem findById(String id) throws NotFoundException {
        try {
            InspectionItem entity = serviceRepo.findById(id);
            if (entity == null) {
                throw new NotFoundException(INSPECTION_ITEM_RESOURCE_NOT_FOUND);
            }
            return entity;
        } catch (DataAccessException e) {
            throw new CustomNotFoundException(HttpStatus.INTERNAL_SERVER_ERROR.value(), Constants.Messages.DB_ERROR);
        }

    }

    public InspectionItem update(InspectionItem entity) throws NotFoundException {
        try {
            return serviceRepo.save(entity);
        } catch (DataAccessException e) {
            throw new CustomNotFoundException(HttpStatus.INTERNAL_SERVER_ERROR.value(), Constants.Messages.DB_ERROR);
        }
    }

    public void delete(InspectionItem entity) {
        try {
            serviceRepo.delete(entity);
        } catch (DataAccessException e) {
            throw new CustomNotFoundException(HttpStatus.INTERNAL_SERVER_ERROR.value(), Constants.Messages.DB_ERROR);
        }
    }

}
