using { sap.capire.bonusplan as admin } from '../db/schema';

service EmployeeService @(path:'/api/admin') { 
  @(requires: 'ReadWriteBPlan')
  @odata.draft.enabled
  entity Employees as projection on admin.Employees actions {
    action calcSelectedAction();
  };
  entity BonusPlans as projection on admin.BonusPlans;
  entity CalculatedBonus as projection on admin.CalculatedBonus;

  @(requires: 'ReadWriteBPlan')
  @odata.draft.enabled
  entity BonusPolicies as projection on admin.BonusPolicies;
  entity BonusRates as projection on admin.BonusRates;

  entity ExternalEmployees as projection on admin.ExternalEmployees;

  action calculateBonusesAction (  ) returns { 
    status: String;
    message: String;
  };
}
