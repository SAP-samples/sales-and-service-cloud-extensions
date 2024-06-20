package com.sap.extensionmodules.repository;

import com.sap.extensionmodules.Utils.EmployeeSpecification;
import com.sap.extensionmodules.commons.Constants;
import com.sap.extensionmodules.entity.Employee;
import com.sap.extensionmodules.exception.CustomNotFoundException;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

import static com.sap.extensionmodules.commons.Constants.Messages.EMPLOYEE_RESOURCE_NOT_FOUND;

@Repository
public class EmployeesRepository {
    @Autowired
    private EmployeeRepositoryInterface employeeRepo;

    public Employee create(Employee entity) {
        try {
            return employeeRepo.save(entity);
        } catch (DataIntegrityViolationException e) {
            throw new CustomNotFoundException(HttpStatus.INTERNAL_SERVER_ERROR.value(), Constants.Messages.UNIQUE_KEY_CONSTRAINT_FAILED);
        } catch (DataAccessException e) {
            throw new CustomNotFoundException(HttpStatus.INTERNAL_SERVER_ERROR.value(), Constants.Messages.DB_ERROR);
        }
    }

    public List<Employee> findAll(EmployeeSpecification spec) {
        try {
            return new ArrayList<>(employeeRepo.findAll(spec));
        } catch (DataAccessException e) {
            throw new CustomNotFoundException(HttpStatus.INTERNAL_SERVER_ERROR.value(), Constants.Messages.DB_ERROR);
        }
    }

    public Employee findById(String id) throws NotFoundException {
        try {
            Employee entity = employeeRepo.findById(id);
            if (entity == null) {
                throw new NotFoundException(EMPLOYEE_RESOURCE_NOT_FOUND);
            }
            return entity;
        } catch (DataAccessException e) {
            throw new CustomNotFoundException(HttpStatus.INTERNAL_SERVER_ERROR.value(), Constants.Messages.DB_ERROR);
        }
    }

    public Employee update(Employee entity) {
        try {
            return employeeRepo.save(entity);
        } catch (DataAccessException e) {
            throw new CustomNotFoundException(HttpStatus.INTERNAL_SERVER_ERROR.value(), Constants.Messages.DB_ERROR);
        }
    }

    public void delete(Employee entity) throws NotFoundException {
        try {
            employeeRepo.delete(entity);
        } catch (DataAccessException e) {
            throw new CustomNotFoundException(HttpStatus.INTERNAL_SERVER_ERROR.value(), Constants.Messages.DB_ERROR);
        }
    }
}
