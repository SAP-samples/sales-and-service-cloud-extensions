service Sscv2SalesorderService @(path: '/api/sscv2Salesorder') {

  function getSalesOrders(employeeId : String, qStartDate : String, qEndDate : String) returns array of {
    ID : String;
    status : String;
    owner : {
      id : String;
    };
    totalValues : {
      grossAmount : {
        content : Double;
        currencyCode : String;
      };
    };
  };
}
