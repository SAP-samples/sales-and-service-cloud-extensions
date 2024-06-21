package com.sap.extensionmodules.Utils;

import com.sap.extensionmodules.dtos.query.QueryFilterOptions;
import com.sap.extensionmodules.dtos.query.SearchCriteria;
import com.sap.extensionmodules.entity.JobCard;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

public class JobCardSearchSpecification{
    public static Specification<JobCard> hasDisplayIdLike(String search) {
        return (root, query, criteriaBuilder) ->
                //criteriaBuilder.equal(root.<String>get("displayId"), "%" + search + "%");
        criteriaBuilder.equal(criteriaBuilder.function("STR", String.class, root.get("displayId")),  search );

    }

    public static Specification<JobCard> hasVehicleNumberLike(String search) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.<String>get("vehicleNumber"), "%" + search + "%");
    }
    public static Specification<JobCard> hasModelLike(String search) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.<String>get("model"), "%" + search + "%");
    }
    public static Specification<JobCard> hasStatusLike(String search) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.<String>get("status"), "%" + search + "%");
    }
}
