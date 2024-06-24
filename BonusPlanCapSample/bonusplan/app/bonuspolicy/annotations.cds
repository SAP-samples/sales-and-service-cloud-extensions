using BonuspolicyService as service from '../../srv/bonuspolicy-service';
// annotate service.BonusRates with @odata.draft.enabled;

annotate service.BonusPolicies with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'Policy Name',
            Value : name,
            ![@UI.Importance] : #High,
            ![@HTML5.CssDefaults] : {
                $Type : 'HTML5.CssDefaultsType',
                width : 'auto',
            },
        },
        {
            $Type : 'UI.DataField',
            Label : 'Policy Description',
            Value : description,
            ![@HTML5.CssDefaults] : {
                $Type : 'HTML5.CssDefaultsType',
                width : 'auto',
            },
        },
        {
            $Type : 'UI.DataField',
            Label : 'Start Date',
            Value : startDate,
            ![@HTML5.CssDefaults] : {
                $Type : 'HTML5.CssDefaultsType',
                width : 'auto',
            },
        },
        {
            $Type : 'UI.DataField',
            Label : 'End Date',
            Value : endDate,
            ![@HTML5.CssDefaults] : {
                $Type : 'HTML5.CssDefaultsType',
                width : 'auto',
            },
        },
    ]
);
annotate service.BonusPolicies with @(
    UI.FieldGroup #GeneratedGroup1 : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'Policy Name',
                Value : name,
                ![@Common.FieldControl] : #Mandatory,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Policy Description',
                Value : description,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Start Date',
                Value : startDate,
            },
            {
                $Type : 'UI.DataField',
                Label : 'End Date',
                Value : endDate,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup1',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Bonus Rates',
            ID : 'bonusrates',
            Target : 'bonusRates/@UI.LineItem#bonusRateList',
        },
    ]
);

annotate service.BonusRates with @(
    UI.LineItem #bonusRateList : [
        {
            $Type : 'UI.DataField',
            Value : name,
            Label : 'Quarter',
            ![@HTML5.CssDefaults] : {
                $Type : 'HTML5.CssDefaultsType',
                width : 'auto',
            },
        },{
            $Type : 'UI.DataField',
            Value : ratePercent,
            Label : 'Rate Percent',
            ![@HTML5.CssDefaults] : {
                $Type : 'HTML5.CssDefaultsType',
                width : 'auto',
            },
        },]
);

annotate service.BonusRates with @(
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Add Bonus Rates',
            ID : 'AddBonusRates',
            Target : '@UI.FieldGroup#AddBonusRates',
        },
    ],
    UI.FieldGroup #AddBonusRates : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : name,
                Label : 'name',
            },
            {
                $Type : 'UI.DataField',
                Value : ratePercent,
                Label : 'ratePercent',
            },],
    }
);
annotate service.BonusRates with {
    name @Common.FieldControl : #Mandatory;
    ratePercent @Common.FieldControl : #Mandatory
};
annotate service.BonusPolicies with @(
    UI.HeaderInfo : {
        Title : {
            $Type : 'UI.DataField',
            Value : name,
        },
        TypeName : '',
        TypeNamePlural : '',
    }
);
