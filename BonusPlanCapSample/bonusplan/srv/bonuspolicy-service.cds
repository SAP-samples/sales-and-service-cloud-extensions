using { sap.capire.bonusplan as dbschema } from '../db/schema';

service BonuspolicyService @(path:'/api/superadmin') { 

  @(requires: 'ReadWriteBPlan')
  @odata.draft.enabled
  entity BonusPolicies as projection on dbschema.BonusPolicies;
  entity BonusRates as projection on dbschema.BonusRates;

}