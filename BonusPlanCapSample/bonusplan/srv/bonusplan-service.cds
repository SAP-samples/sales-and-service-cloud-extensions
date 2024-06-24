using { sap.capire.bonusplan as my } from '../db/schema';

service BonusplanService @(path:'/api/my') { 

  @readonly entity BonusPlans as SELECT FROM my.BonusPlans {
    ID,
    bonusPolicy,
    bonusPolicy.name as bonusPolicyName,
    bonusPolicy.description as bonusPolicyDesc,
    bonusPolicy.startDate as bonusPolicyStartDate,
    bonusPolicy.endDate as bonusPolicyEndDate,
    employee,
    bonusDetails
  };
  @readonly entity BonusPolicies as projection on my.BonusPolicies excluding { createdAt, createdBy, modifiedAt, modifiedBy };
  @readonly entity CalculatedBonus as SELECT FROM my.CalculatedBonus {
    ID,
    bonusAmount,
    bonusPlan,
    bonusRate,
    bonusRate.name as bonusRateName,
    bonusRate.ratePercent as bonusRateRatePercent,
  };
  @readonly entity BonusRates as projection on my.BonusRates excluding { createdAt, createdBy, modifiedAt, modifiedBy };
}
