package com.sap.extensionmodules.repository;

import com.sap.extensionmodules.dtos.InspectionItemDto;
import com.sap.extensionmodules.entity.InspectionItem;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InspectionItemRepositoryInterface extends CrudRepository<InspectionItem, Long> {
//    InspectionItem findByDescription(String description);

    InspectionItem findById(String id);

    @Query(value = "SELECT \"id\", \"description\", \"isSelected\" FROM \"inspection_item\"", nativeQuery = true)
    List<String[]> findAllByQuery();
}
