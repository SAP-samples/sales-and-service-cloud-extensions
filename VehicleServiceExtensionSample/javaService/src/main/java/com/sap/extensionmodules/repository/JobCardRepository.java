package com.sap.extensionmodules.repository;

import com.sap.extensionmodules.Utils.JobCardSpecification;
import com.sap.extensionmodules.commons.Constants.Messages;
import com.sap.extensionmodules.exception.CustomNotFoundException;
import com.sap.extensionmodules.entity.JobCard;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class JobCardRepository {
    @Autowired
    private com.sap.extensionmodules.repository.JobCardRepositoryInterface jobCardRepo;

    public List<JobCard> findAllBy(Specification<JobCard> spec, Pageable page) {
        try {
            List<JobCard> entity = jobCardRepo.findAll(spec, page).toList();
            return entity;
        } catch (DataAccessException e) {
            throw new CustomNotFoundException(HttpStatus.INTERNAL_SERVER_ERROR.value(), Messages.DB_ERROR );
        }
    }

    public JobCard findOneBy(String id) {
        try {
            JobCard entity = jobCardRepo.findById(id);
            if (entity == null) {
                throw new CustomNotFoundException(HttpStatus.NOT_FOUND.value(),
                        Messages.JOBCARD_ID_NOT_FOUND);
            }
            return entity;
        } catch (DataAccessException e) {
            throw new CustomNotFoundException(HttpStatus.INTERNAL_SERVER_ERROR.value(), Messages.DB_ERROR );
        }
    }

    public JobCard findOneByCaseId(String id) {
        try {
            JobCard entity = jobCardRepo.findByCaseId(id);
            if (entity == null) {
                throw new CustomNotFoundException(HttpStatus.NOT_FOUND.value(),
                        Messages.JOBCARD_ID_NOT_FOUND);
            }
            return entity;

        } catch (DataAccessException e) {
            throw new CustomNotFoundException(HttpStatus.INTERNAL_SERVER_ERROR.value(), Messages.DB_ERROR);

        }
    }

    public JobCard create(JobCard entity) {
        try {
            entity = jobCardRepo.save(entity);
            return entity;
        } catch (DataIntegrityViolationException e) {
            throw new CustomNotFoundException(HttpStatus.INTERNAL_SERVER_ERROR.value(), Messages.UNIQUE_KEY_CONSTRAINT_FAILED);
        } catch (DataAccessException e) {
            throw new CustomNotFoundException(HttpStatus.INTERNAL_SERVER_ERROR.value(), Messages.DB_ERROR );
        }
    }

//    public JobCard updateJobCardStatus(JobCard entity) {
//        try {
//            return jobCardRepo.save(entity);
//        } catch (DataIntegrityViolationException e) {
//            throw new CustomNotFoundException(HttpStatus.INTERNAL_SERVER_ERROR.value(), Messages.UNIQUE_KEY_CONSTRAINT_FAILED);
//        } catch (DataAccessException e) {
//            throw new CustomNotFoundException(HttpStatus.INTERNAL_SERVER_ERROR.value(), Messages.DB_ERROR);
//        }
//    }

    public void delete(JobCard entity) {
        try {
            if (entity == null) {
                throw new CustomNotFoundException(HttpStatus.NOT_FOUND.value(), Messages.RESOURCE_NOT_FOUND);
            }
            jobCardRepo.delete(entity);
        } catch (DataAccessException e) {
            throw new CustomNotFoundException(HttpStatus.INTERNAL_SERVER_ERROR.value(), Messages.DB_ERROR );
        }
    }
    public long getCount() {
        return jobCardRepo.count();
    }
}
