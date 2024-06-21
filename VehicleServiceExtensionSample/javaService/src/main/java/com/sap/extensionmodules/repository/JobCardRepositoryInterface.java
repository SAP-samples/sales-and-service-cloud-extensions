package com.sap.extensionmodules.repository;

import com.sap.extensionmodules.entity.JobCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobCardRepositoryInterface extends JpaRepository<JobCard, Long>, JpaSpecificationExecutor<JobCard> {
    JobCard findById(String jobCardId);

    JobCard findByCaseId(String caseId);
}


