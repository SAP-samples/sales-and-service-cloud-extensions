using { sap.capire.bonusplan as bonusplan } from '../db/schema';

annotate bonusplan.ExternalEmployees with {
  ID     @title: '{i18n>ID}';
  employeeId  @title: '{i18n>External Employee ID}';
  email @title: '{i18n>Email}';
  displayName  @title: '{i18n>Name}';
  displayId @title: '{i18n>Display ID}';
};

annotate bonusplan.Employees with {
  ID     @title: '{i18n>ID}';
  employeeId  @title: '{i18n>External Employee}';
  email @title: '{i18n>Email}';
  displayName  @title: '{i18n>Name}';
  displayId  @title: '{i18n>Display ID}';
};

annotate bonusplan.BonusPlans with {
  ID     @title: '{i18n>ID}';
};

annotate bonusplan.BonusPolicies with {
  ID    @title: '{i18n>ID}';
  startDate @title: '{i18n>Start Date}';
  endDate   @title: '{i18n>End Date}';
  name  @title: '{i18n>Policy Name}';
  description   @title: '{i18n>Description}';
};

annotate bonusplan.BonusRates with {
  ID    @title: '{i18n>ID}';
  name  @title: '{i18n>Quarter}';
  ratePercent   @title: '{i18n>Percent}';
};

annotate bonusplan.CalculatedBonus with {
  ID    @title: '{i18n>ID}';
  bonusAmount  @title: '{i18n>Calculated Amount}';
};