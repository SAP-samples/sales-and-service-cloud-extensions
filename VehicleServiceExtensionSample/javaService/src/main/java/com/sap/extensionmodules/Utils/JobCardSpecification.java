package com.sap.extensionmodules.Utils;

import com.sap.extensionmodules.dtos.query.QueryFilterOptions;
import com.sap.extensionmodules.entity.JobCard;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

@AllArgsConstructor
public class JobCardSpecification implements Specification<JobCard> {
    private QueryFilterOptions criteria;

    @Override
    public Predicate toPredicate
            (Root<JobCard> root, CriteriaQuery<?> query, CriteriaBuilder builder) {

        Object value = dataFromString(criteria);

        if (criteria.getOperator().getValue() == QueryFilterOptions.QueryFilterOperator.EQ.getValue()) {
            return builder.equal(
                    root.<String> get(criteria.getSelectAttributeName()), value);
        }
        else if (criteria.getOperator().getValue() == QueryFilterOptions.QueryFilterOperator.NE.getValue()) {
            return builder.notEqual(
                    root.<String> get(criteria.getSelectAttributeName()), value);
        }
        else if (criteria.getOperator().getValue() == QueryFilterOptions.QueryFilterOperator.GT.getValue()) {
            return builder.greaterThan(
                    root.get(criteria.getSelectAttributeName()), criteria.getSelectValue());
        }
        else if (criteria.getOperator().getValue() == QueryFilterOptions.QueryFilterOperator.GE.getValue()) {
            return builder.greaterThanOrEqualTo(
                    root.get(criteria.getSelectAttributeName()), criteria.getSelectValue());
        }
        else if (criteria.getOperator().getValue() == QueryFilterOptions.QueryFilterOperator.LT.getValue()) {
            return builder.lessThan(
                    root.get(criteria.getSelectAttributeName()), criteria.getSelectValue());
        }
        else if (criteria.getOperator().getValue() == QueryFilterOptions.QueryFilterOperator.LE.getValue()) {
            return builder.lessThanOrEqualTo(
                    root.get(criteria.getSelectAttributeName()), criteria.getSelectValue());
        }
        else if (criteria.getOperator().getValue() == QueryFilterOptions.QueryFilterOperator.CT.getValue()) {
            if(criteria.getSelectAttributeName().equals("displayId"))
                return builder.like(builder.function("STR", String.class, root.get(criteria.getSelectAttributeName())), "%" + value + "%");

            return builder.like(root.get(criteria.getSelectAttributeName()), "%" + criteria.getSelectValue() + "%");
        }

        return null;
    }

    public Object dataFromString(QueryFilterOptions criteria){
        switch (criteria.getSelectAttributeName()) {
            case "servicesProposed.isSelected":
                return Boolean.parseBoolean(criteria.getSelectValue());
            //case "displayId":
            case "milometer":
                return Integer.parseInt(criteria.getSelectValue());
            default:
                return criteria.getSelectValue();
        }
    }
}