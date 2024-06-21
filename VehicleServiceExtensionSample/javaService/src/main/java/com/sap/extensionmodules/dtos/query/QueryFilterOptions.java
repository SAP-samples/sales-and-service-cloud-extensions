package com.sap.extensionmodules.dtos.query;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.Value;

@Value
@NoArgsConstructor(force = true)
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class QueryFilterOptions {

    private String selectAttributeName;

    private QueryFilterOperator operator;

    private String selectValue;

    private boolean isArray;

    private String arrayName;

    private boolean isLogicalOr;


    public enum QueryFilterOperator {
        LK(0),

        EQ(1),
        NE(2),
        LT(3),
        LE(4),
        GT(5),
        GE(6),
        BT(7),
        EX(8),
        NEX(9),
        IN(10),
        NIN(11),
        CT(12);

        private int value;

        QueryFilterOperator(int value) {
            this.value = value;
        }

        public int getValue() {
            return this.value;
        }
    }

}
