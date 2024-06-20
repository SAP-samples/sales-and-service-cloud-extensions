package com.sap.extensionmodules.dtos.query;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

import com.sap.extensionmodules.commons.Constants;
import com.sap.extensionmodules.entity.JobCard;
import com.sap.extensionmodules.exception.InvalidQueryParameterException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import com.sap.extensionmodules.dtos.query.QueryFilterOptions.QueryFilterOperator;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

@Component
@Slf4j
public class QueryDTOHelper {
    @Autowired
    private EntityManager entityManager;

    private String operator;

    public QueryRequestDTO buildRequestDTO(Optional<String> filter) {

        QueryRequestDTO.QueryRequestDTOBuilder requestDTOBuilder = QueryRequestDTO.builder();

        if (filter.isPresent()) {
            requestDTOBuilder.filterOptions(processQuerySelectOptions(filter.get()));
        }

        return requestDTOBuilder.build();
    }

    public List<QueryFilterOptions> processQuerySelectOptions(String selectOptions) {
        List<QueryFilterOptions> processedSelectOptions = new ArrayList<>();
        if(selectOptions.contains(" and "))
            selectOptions = selectOptions.substring(0, selectOptions.lastIndexOf("and"));
        String[] andSelectOptions = selectOptions.split(Constants.AND_DELIMITER);
        for (String andSelectOption : andSelectOptions) {
            if (andSelectOption.contains(Constants.OR_DELIMITER)) {
                String[] orSelectOptions = andSelectOption.split(Constants.OR_DELIMITER);
                for (String orSelectOption : orSelectOptions) {
                    addSelectOptions(processedSelectOptions, orSelectOption, true);
                }
            } else {
                addSelectOptions(processedSelectOptions, andSelectOption, false);
            }
        }
        return processedSelectOptions;
    }

    public static void addSelectOptions(List<QueryFilterOptions> qseList, String selectOption, boolean isLogicalOr) {
        String[] selectFilterList = selectOption.split(Constants.SPACE_DELIMITER);
        QueryFilterOptions.QueryFilterOptionsBuilder selectOptionBuilder =
                QueryFilterOptions.builder()
                        .selectAttributeName(
                                selectFilterList[0]
                                        .replace(Constants.QUOTES_DELIMITER, "")
                                        .replace(Constants.SINGLE_QUOTES_DELIMITER, "")) // remove surrounding quotes
                        .operator(getSelectOperator(selectFilterList[1]))
                        .selectValue(
                                selectFilterList[2]
                                        .replace(Constants.QUOTES_DELIMITER, "")
                                        .replace(Constants.SINGLE_QUOTES_DELIMITER, ""))
                        .isLogicalOr(isLogicalOr);
        qseList.add(selectOptionBuilder.build());
    }

    public static QueryFilterOperator getSelectOperator(String operator) {

        QueryFilterOptions.QueryFilterOperator selectOperator;
        switch (operator.toUpperCase(Locale.ENGLISH)) {
            case ("EQ"):
                selectOperator = QueryFilterOperator.EQ;
                break;
            case ("NE"):
                selectOperator = QueryFilterOperator.NE;
                break;
            case ("LT"):
                selectOperator = QueryFilterOperator.LT;
                break;
            case ("GT"):
                selectOperator = QueryFilterOperator.GT;
                break;
            case ("GE"):
                selectOperator = QueryFilterOperator.GE;
                break;
            case ("LE"):
                selectOperator = QueryFilterOperator.LE;
                break;
            case ("LK"):
                selectOperator = QueryFilterOperator.LK;
                break;
            case ("BT"):
                selectOperator = QueryFilterOperator.BT;
                break;
            case ("CT"):
                selectOperator = QueryFilterOperator.CT;
                break;
            default:
                throw new InvalidQueryParameterException("Invalid filter operator : " + operator);
        }
        return selectOperator;
    }

}

