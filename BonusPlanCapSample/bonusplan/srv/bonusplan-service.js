const cds = require('@sap/cds')

module.exports = function () {
  this.before('READ', 'BonusPlans', async (req) => {
    const url = new URL(req.headers.referer);
    const employeeId = url.searchParams.get("empid");
    const showAll = url.searchParams.get("showall");
    const sscv2EmployeeSrv = await cds.connect.to('Sscv2EmployeeService');

    const currentEmployee = await sscv2EmployeeSrv.getCurrentEmployee();
    if (currentEmployee) {

      // if role is not admin , and if currentEmployee.employeeId is not param.employeeId , reject the access
      if (!(req.res?.req?.user?.roles?.ReadWriteBPlan) && (currentEmployee.employeeId !== employeeId)) {
        return req.reject(403, "You are not authorized to view bonus plan of this employee");
      }

    } else {
      return req.reject(403, "unauthorized");
    }

    // if param is passed but value is blank, go for below checking 
    if (showAll !== 'true') {
      if (null !== employeeId) {
        const { Employees } = cds.db.entities('sap.capire.bonusplan'); // // variable name should match with entity
        const currentEmployee = await SELECT.one.from(Employees).where({ employeeId });

        if (currentEmployee?.ID) {
          if (req.query.SELECT.where && req.query.SELECT.where.length > 0) {
            req.query.SELECT.where.push("and");
            req.query.SELECT.where.push({ ref: ["employee_ID"] });
            req.query.SELECT.where.push("=");
            req.query.SELECT.where.push({ val: `${currentEmployee.ID}` });
          } else {
            req.query.SELECT.where = [{ ref: ["employee_ID"] }, "=", { val: `${currentEmployee.ID}` }];
          }
        } else {
          return req.reject(400, "No Bonus Plan found.");
        }
      } else {
        return req.reject(400, "Employee ID is required.");
      }
    }
  })
}
