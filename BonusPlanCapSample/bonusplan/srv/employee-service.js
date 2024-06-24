const cds = require('@sap/cds');
const moment = require('moment'); // require

module.exports = function () {
  this.on('READ', 'ExternalEmployees', async (req) => {
    const sscv2EmployeeSrv = await cds.connect.to('Sscv2EmployeeService');
    let employees;
    employees = await sscv2EmployeeSrv.getEmployees(req);
    return employees;
  });
  this.before('CREATE', 'Employees', async (req) => {
    // required validation for req.data.displayId not needed as handled by CAP

    const { BonusPlans, Employees } = cds.db.entities('sap.capire.bonusplan');
    const displayId = req.data.displayId;
    const bonusPolicy_ID = req.data.bonusPlans[0].bonusPolicy_ID; // variable name should match with DB schema column
    const existingEmployee = await SELECT.one.from(Employees).where({ displayId });
    let existingBonusPlan;
    if (existingEmployee) {
      const employee_ID = existingEmployee.ID; // variable name should match with DB schema column
      existingBonusPlan = await SELECT.one.from(BonusPlans).where({ employee_ID, bonusPolicy_ID });
    }
    if (!existingBonusPlan) {
      const sscv2EmployeeSrv = await cds.connect.to('Sscv2EmployeeService');
      const employee = await sscv2EmployeeSrv.getEmployeeByDisplayId(id = displayId);
      if (employee) {
        req.data.email = employee.email ?? 'NA';
        req.data.displayName = employee.displayName ?? 'NA';
        req.data.employeeId = employee.employeeId ?? 'NA';
        req.data.displayId = employee.displayId;
        return req;
      } else {
        return req.reject(400, "employee data not found.");
      }
    } else {
      return req.reject(400, "Bad request. Bonusplan for same employee with same bonus policy already exists.");
    }

  });

  this.after('CREATE', 'Employees', async (req) => {
    // Update extension field here.
    // employeeID or Bonusplan validation not needed as they are handled in "before handler"
    const sscv2EmployeeSrv = await cds.connect.to('Sscv2EmployeeService');
    const extEmployee = await sscv2EmployeeSrv.getEmployee(id = req.employeeId);
    if (extEmployee && extEmployee.ID && extEmployee.updatedOn) {
      const extEmployeeUpdateMessage = await sscv2EmployeeSrv.updateEmployeeExtField(
        employeeId = extEmployee.ID,
        bonusplanId = req.bonusPlans[req.bonusPlans.length - 1].ID,
        ifMatch = extEmployee.updatedOn
      );
      return extEmployeeUpdateMessage;
    } else {
      return {
        status: 'failure',
        message: "Employee not found."
      }
    }
  });

  /** 
   * action to calculate bonus amount for all the employees
   */
  this.on('calculateBonusesAction', async (req) => {

    // get all rquired dates
    const startOfLastQuarter = moment().date(1).subtract(1, 'quarter').startOf('quarter');
    const endOfLastQuarter = moment().date(1).subtract(1, 'quarter').endOf('quarter');
    const formattedStartOfLastQuarter = startOfLastQuarter.format('YYYY-MM-DD');
    const formattedEndOfLastQuarter = endOfLastQuarter.format('YYYY-MM-DD');
    const quarterNumber = startOfLastQuarter.quarter();
    const formattedStartOfYear = startOfLastQuarter.startOf('year').format('YYYY-MM-DD');
    const yearNumber = startOfLastQuarter.format('YYYY');

    const db = await cds.connect.to('db');
    const { BonusPlans, BonusPolicies, CalculatedBonus, BonusRates } = db.entities('EmployeeService');
    const allBonusPlans = await SELECT.from(BonusPlans, a => {
      a.ID
        , a.bonusPolicy(b => {
          b.ID, b.name, b.startDate
            , b.endDate
        })
        , a.employee(e => { e.ID, e.email, e.displayName, e.employeeId })
    })
      .where('bonusPolicy.startDate =', formattedStartOfYear);

    const sscv2SalesorderSrv = await cds.connect.to('Sscv2SalesorderService');
    allBonusPlans.forEach(async (eachBonusPlan) => {
      try {
        // get bonusRate details for the quarter
        const bonusrateDtl = await SELECT.one.from(BonusRates, br => {
          br.ID, br.bonusPolicy_ID, br.name, br.ratePercent
        })
          .where('bonusPolicy_ID = ', eachBonusPlan.bonusPolicy.ID)
          .where('name = ', 'Q' + quarterNumber + '_' + yearNumber);

        // get sales details for each employee
        const salesorder = await sscv2SalesorderSrv.getSalesOrders(eachBonusPlan.employee.employeeId, formattedStartOfLastQuarter, formattedEndOfLastQuarter);

        // calculate total sales amount and bonus amount using rateParcent
        let totalSalesAmount = 0;
        if (salesorder && 0 < salesorder?.length) {
          salesorder.forEach(eachSalesOrder => {
            totalSalesAmount += eachSalesOrder.totalValues.grossAmount.content;
          });
        }

        const bonusAmount = (totalSalesAmount * bonusrateDtl.ratePercent / 100).toFixed(2);

        // Update bonusAmount in 'CalculatedBonus' table for perticular employee perticular quarter
        const randomUUID = crypto.randomUUID();
        const insertResponse = await INSERT.into(CalculatedBonus).columns(
          'ID', 'bonusPlan_ID', 'bonusRate_ID', 'bonusAmount'
        ).values(
          randomUUID, eachBonusPlan.ID, bonusrateDtl.ID, bonusAmount
        );
      } catch (e) {
        console.error(e)
      }
    });

    return {
      status: "Success",
      message: "Bonusplan calculation for all employees is completed successfully!"
    }
  });

}

