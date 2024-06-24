using { managed, sap } from '@sap/cds/common';
namespace sap.capire.bonusplan; 

entity ExternalEmployees {
    key ID: UUID;
    employeeId: UUID;
    email: String;
    displayName: String;
    displayId: String; // this is polulated from Employee external API (CNS)
}

entity Employees : managed {
    key ID: UUID;
    employeeId: UUID;
    email: String;
    displayName: String;
    displayId: String; // this is polulated from Employee external API (CNS)
    bonusPlans: Composition of many BonusPlans on bonusPlans.employee = $self;
}

entity BonusPlans : managed {
    key ID: UUID;
    @mandatory bonusPolicy: Association to BonusPolicies;
    @mandatory employee: Association to Employees;
    bonusDetails: Composition of many CalculatedBonus on bonusDetails.bonusPlan = $self;
}

entity CalculatedBonus : managed {
    key ID: UUID;
    bonusPlan: Association to BonusPlans;
    bonusRate: Association to BonusRates;
    bonusAmount: Integer;
}

entity BonusPolicies : managed {
    key ID: UUID;
    startDate: Date;
    endDate: Date;
    name: String;
    description: localized String;
    bonusRates: Composition of many BonusRates on bonusRates.bonusPolicy = $self;
    bonusPlan: Association to BonusPlans on bonusPlan.bonusPolicy = $self;
}

entity BonusRates : managed { 
    key ID: UUID;
    bonusPolicy: Association to BonusPolicies;
    name: String; // Name of quarter. Can also include start date and end date for defining quarter if required.
    ratePercent: Integer;
    bonusDetail: Association to CalculatedBonus on bonusDetail.bonusRate = $self;
}
