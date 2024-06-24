using BonusplanService as service from '../../srv/bonusplan-service';

annotate service.BonusPlans with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'ID',
            Value : ID,
            ![@HTML5.CssDefaults] : {
                $Type : 'HTML5.CssDefaultsType',
                width : 'auto',
            },
            ![@UI.Hidden],
        },
        {
            $Type : 'UI.DataField',
            Label : 'Policy Name',
            Value : bonusPolicyName,
            ![@HTML5.CssDefaults] : {
                $Type : 'HTML5.CssDefaultsType',
                width : 'auto',
            },
        },
        {
            $Type : 'UI.DataField',
            Label : 'Start Date',
            Value : bonusPolicyStartDate,
            ![@HTML5.CssDefaults] : {
                $Type : 'HTML5.CssDefaultsType',
                width : 'auto',
            },
        },
        {
            $Type : 'UI.DataField',
            Label : 'End Date',
            Value : bonusPolicyEndDate,
            ![@HTML5.CssDefaults] : {
                $Type : 'HTML5.CssDefaultsType',
                width : 'auto',
            },
        },
        {
            $Type : 'UI.DataField',
            Label : 'Policy Description',
            Value : bonusPolicyDesc,
            ![@HTML5.CssDefaults] : {
                $Type : 'HTML5.CssDefaultsType',
                width : 'auto',
            },
        },
        {
            $Type : 'UI.DataField',
            Label : 'Bonus Policy ID',
            Value : bonusPolicy_ID,
            ![@HTML5.CssDefaults] : {
                $Type : 'HTML5.CssDefaultsType',
                width : 'auto',
            },
            ![@UI.Hidden],
        },
        {
            $Type : 'UI.DataField',
            Label : 'Employee Id',
            Value : employee_ID,
            ![@HTML5.CssDefaults] : {
                $Type : 'HTML5.CssDefaultsType',
                width : 'auto',
            },
            ![@UI.Hidden],
        }
    ]
);

annotate service.BonusPlans with @(
    UI.HeaderInfo : {
        TypeName : '{i18n>Bonus Plan}',
        TypeNamePlural : '{i18n>Bonus Plans}',
        Title : {
            $Type : 'UI.DataField',
            Value : bonusPolicy.name,
            Label: 'Bonus Plan ID'
        }
    },
    UI.HeaderFacets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID: 'Policy_Name',
            Target : '@UI.FieldGroup#Policy',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID: 'Policy_Date',
            Target : '@UI.FieldGroup#Date',
        }
    ],
    UI.FieldGroup #Policy : {
        Data : [
            {
                $Type : 'UI.DataField',
                Value : bonusPolicy.name,
                Label : 'Policy Name',
            },
            {
                $Type : 'UI.DataField',
                Value : bonusPolicy.description,
                Label : 'Policy Description',
            }
        ]
    },
    UI.FieldGroup #Date : {
        Data : [
            {
                $Type : 'UI.DataField',
                Value : bonusPolicy.startDate,
                Label : 'Start Date',
            },
            {
                $Type : 'UI.DataField',
                Value : bonusPolicy.endDate,
                Label : 'End Date',
            }
        ]
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            // Label : 'Bonus Detail',
            Target : 'bonusDetails/@UI.LineItem#BonusDetail',
        },
    ]
);

annotate service.CalculatedBonus with @(
    UI.HeaderInfo : {
        TypeName : '{i18n>Bonus Detail}',
        TypeNamePlural : '{i18n>Bonus Details}',
    },
    UI.LineItem #BonusDetail: [
        {
            $Type : 'UI.DataField',
            Value : ID,
            Label : 'Bonus Detail ID',
            ![@HTML5.CssDefaults] : {
                width : 'auto'
            },
            ![@UI.Hidden],
        },
        {
            $Type : 'UI.DataField',
            Value : bonusRateName,
            Label : 'Quarter',
            ![@HTML5.CssDefaults] : {
                width : 'auto'
            }
        },
        {
            $Type : 'UI.DataField',
            Value : bonusRateRatePercent,
            Label : 'Rate Percentage',
            ![@HTML5.CssDefaults] : {
                width : 'auto'
            }
        },
        {
            $Type : 'UI.DataField',
            Value : bonusAmount,
            Label : 'Bonus Amount',
            ![@HTML5.CssDefaults] : {
                width : 'auto'
            }
        }
    ]
) ;
