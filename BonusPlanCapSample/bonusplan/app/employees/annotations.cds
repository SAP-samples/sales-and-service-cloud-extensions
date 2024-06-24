using EmployeeService  as service from '../../srv/employee-service';

annotate service.Employees with @odata.draft.enabled;

annotate service.Employees with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : ID,
            Label : 'ID',
            ![@HTML5.CssDefaults] : {
                $Type : 'HTML5.CssDefaultsType',
                width : 'auto',
            },
            ![@UI.Hidden],
        },
        {
            $Type : 'UI.DataField',
            Label : 'Display Name',
            Value : displayName,
            ![@HTML5.CssDefaults] : {
                $Type : 'HTML5.CssDefaultsType',
                width : 'auto',
            }
        },
        {
            $Type : 'UI.DataField',
            Label : 'Email',
            Value : email,
            ![@HTML5.CssDefaults] : {
                $Type : 'HTML5.CssDefaultsType',
                width : 'auto',
            },
        },
        {
            $Type : 'UI.DataFieldForAction',
            Label : 'Calculate Bonus',
            Action : 'service.EntityContainer/calculateBonusesAction'
        }
    ]
);

annotate service.Employees with @(
    UI.HeaderInfo : {
        TypeName : '{i18n>Assigned Employee}',
        TypeNamePlural : '{i18n>Assigned Employees}',
        Title : {
            $Type : 'UI.DataField',
            Value : displayName,
            Label: 'Employee Name'
        }
    },
    UI.FieldGroup #OverviewGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : '{i18n>EmployeeDisplayId}',
                Value : displayId,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>EmployeeName}',
                Value : displayName,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Email}',
                Value : email,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'OverviewFacet',
            Label : '{i18n>Overview}',
            Target : '@UI.FieldGroup#OverviewGroup',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'BonusPlansFacet',
            Label : '{i18n>BonusPlans}',
            Target : 'bonusPlans/@UI.LineItem#BonusPlan',
        }
    ]
);

annotate service.BonusPlans with @(
    UI.LineItem #BonusPlan: [
        {
            $Type : 'UI.DataField',
            Value : ID,
            Label : 'ID',
            ![@HTML5.CssDefaults] : {
                width : 'auto'
            },
            ![@UI.Hidden],
        },
        {
            $Type : 'UI.DataField',
            Value : bonusPolicy.ID,
            Label : 'Policy',
            ![@HTML5.CssDefaults] : {
                width : 'auto'
            },
        },
        {
            $Type : 'UI.DataField',
            Value : bonusPolicy.startDate,
            Label : 'Start Date',
            ![@HTML5.CssDefaults] : {
                width : 'auto'
            }
        },
        {
            $Type : 'UI.DataField',
            Value : bonusPolicy.endDate,
            Label : 'End Date',
            ![@HTML5.CssDefaults] : {
                width : 'auto'
            }
        }
    ]
) ;

annotate service.BonusPlans with @(
    UI.HeaderInfo : {
        TypeName : '{i18n>Bonus Plan}',
        TypeNamePlural : '{i18n>Bonus Plans}',
        Title : {
            $Type : 'UI.DataField',
            Value : bonusPolicy.name,
            Label: 'Policy Name'
        }
    },
    UI.FieldGroup #OverviewGroup : {
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
            },
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
            ID: 'OverviewFacet',
            Label : 'Overview',
            Target : '@UI.FieldGroup#OverviewGroup',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'BonusDetailsFacet',
            Label : '{i18n>BonusDetails1}',
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
            Label : 'ID',
            ![@HTML5.CssDefaults] : {
                width : 'auto'
            },
            ![@UI.Hidden],
        },
        {
            $Type : 'UI.DataField',
            Value : bonusRate.name,
            Label : 'Quarter',
            ![@HTML5.CssDefaults] : {
                width : 'auto'
            }
        },
        {
            $Type : 'UI.DataField',
            Value : bonusRate.ratePercent,
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
annotate service.Employees with {
    displayName @Common.FieldControl : #ReadOnly
};
annotate service.BonusPolicies with {
    ID @(Common.Text : {
            $value : name,
            ![@UI.TextArrangement] : #TextOnly,
        }
)};
annotate service.BonusPolicies with {
    ID @(Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'BonusPolicies',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : ID,
                    ValueListProperty : 'ID',
                    ![@HTML5.CssDefaults] : {
                        width : 'auto'
                    }
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'name',
                    ![@HTML5.CssDefaults] : {
                        width : 'auto'
                    }
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'startDate',
                    ![@HTML5.CssDefaults] : {
                        width : 'auto'
                    }
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'endDate',
                    ![@HTML5.CssDefaults] : {
                        width : 'auto'
                    }
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'description',
                    ![@HTML5.CssDefaults] : {
                        width : 'auto'
                    }
                },
            ],
            Label : 'Policy',
        },
        Common.ValueListWithFixedValues : false
)};
annotate service.BonusPolicies with {
    startDate @Common.FieldControl : #ReadOnly
};
annotate service.BonusPolicies with {
    endDate @Common.FieldControl : #ReadOnly
};
annotate service.BonusPolicies with {
    ID @Common.FieldControl : #Mandatory
};
annotate service.BonusPolicies with {
    name @Common.FieldControl : #ReadOnly
};
annotate service.BonusPolicies with {
    description @Common.FieldControl : #ReadOnly
};
annotate service.CalculatedBonus with {
    ID @Common.FieldControl : #ReadOnly
};
annotate service.BonusRates with {
    name @Common.FieldControl : #ReadOnly
};
annotate service.BonusRates with {
    ratePercent @Common.FieldControl : #ReadOnly
};
annotate service.CalculatedBonus with {
    bonusAmount @Common.FieldControl : #ReadOnly
};
annotate service.Employees with {
    ID @Common.FieldControl : #Mandatory
};
annotate service.Employees with {
    displayId @Common.FieldControl : #Mandatory
};
annotate service.Employees with {
    displayId @(Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'ExternalEmployees',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : displayId,
                    ValueListProperty : 'displayId',
                },
                {
                    $Type : 'Common.ValueListParameterOut',
                    ValueListProperty : 'displayName',
                    LocalDataProperty : displayName,
                    ![@HTML5.CssDefaults] : {
                        width : 'auto'
                    }
                },
                {
                    $Type : 'Common.ValueListParameterOut',
                    ValueListProperty : 'email',
                    LocalDataProperty : email,
                    ![@HTML5.CssDefaults] : {
                        width : 'auto'
                    },
                },
            ],
            Label : 'Display ID',
        },
        Common.ValueListWithFixedValues : false
)};

annotate service.Employees with {
    email @Common.FieldControl : #ReadOnly
};
