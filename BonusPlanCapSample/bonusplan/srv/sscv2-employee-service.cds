service Sscv2EmployeeService @(path: '/api/sscv2Employee') {

  function getCurrentEmployee()                                                                returns {
    ID : String;
    employeeId : String;
    email : String;
    displayName : String;
  };

  function getEmployeeByDisplayId(id : String)                                                 returns {
    ID : String;
    employeeId : String;
    email : String;
    displayName : String;
  };

  function getEmployees(_search : String)                                                      returns array of {
    ID : String;
    employeeId : String;
    email : String;
    displayName : String;
  };

  function getEmployee(id : String)                                                            returns {
    ID : String;
    updatedOn : String;
    formattedName : String;
    currentBonusplan1 : String;
  };

  action   updateEmployeeExtField(employeeId : String, bonusplanId : String, ifMatch : String) returns {
    status : String;
    message : String;
  };

}
