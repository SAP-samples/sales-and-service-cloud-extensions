package com.sap.extensionmodules.repository;

import com.sap.extensionmodules.entity.Employee;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;

public interface EmployeeRepositoryInterface extends CrudRepository<Employee, Long> , JpaSpecificationExecutor<Employee> {

    Employee findById(String id);
}
