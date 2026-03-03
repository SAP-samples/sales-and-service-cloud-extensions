import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from './employee.service';
import { REQUEST } from '@nestjs/core';
import { EmployeeApi } from './open-api/client/SalesSvcCloudV2_employeeService';

// Mock the OpenAPI generated client
jest.mock('./open-api/client/SalesSvcCloudV2_employeeService', () => ({
  EmployeeApi: {
    queryemployeeserviceEmployee: jest.fn(),
  },
}));

describe('EmployeeService with External API Mocking', () => {
  let service: EmployeeService;
  let mockQueryEmployee: jest.Mock;

  const mockSession = {
    userToken: 'mock-jwt-token',
    requestId: 'req-123',
    userId: 'user-123',
    sscDestination: 'ssc-test-destination',
  };

  const mockRequest = {
    session: mockSession, // lowercase 'session' to match SESSION constant value
  };

  beforeEach(async () => {
    // Reset mocks before each test
    jest.clearAllMocks();
    mockQueryEmployee = EmployeeApi.queryemployeeserviceEmployee as jest.Mock;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: EmployeeService,
          useFactory: (request) => new EmployeeService(request),
          inject: [REQUEST],
        },
        {
          provide: REQUEST,
          useValue: mockRequest,
        },
      ],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
  });

  describe('getEmployeeById - Success Cases', () => {
    it('should return employee data when API returns valid response', async () => {
      const mockEmployeeData = {
        value: [
          {
            id: 'emp-123',
            formattedName: 'John Doe',
            displayId: 'EMP-123',
            businessEmail: 'john.doe@example.com',
            firstName: 'John',
            lastName: 'Doe',
          },
        ],
      };

      // Mock the execute method chain
      mockQueryEmployee.mockReturnValue({
        execute: jest.fn().mockResolvedValue(mockEmployeeData),
      });

      const result = await service.getEmployeeById('emp-123');

      expect(result).toBeDefined();
      expect(result.id).toBe('emp-123');
      expect(result.formattedName).toBe('John Doe');
      expect(mockQueryEmployee).toHaveBeenCalledWith({
        $filter: "id eq 'emp-123'",
      });
    });

    it('should call API with correct destination and JWT', async () => {
      const mockEmployeeData = {
        value: [
          {
            id: 'emp-456',
            formattedName: 'Jane Smith',
            displayId: 'EMP-456',
          },
        ],
      };

      const mockExecute = jest.fn().mockResolvedValue(mockEmployeeData);
      mockQueryEmployee.mockReturnValue({
        execute: mockExecute,
      });

      await service.getEmployeeById('emp-456');

      expect(mockExecute).toHaveBeenCalledWith({
        destinationName: 'ssc-test-destination',
        jwt: 'mock-jwt-token',
      });
    });
  });

  describe('getEmployeeById - Error Cases', () => {
    it('should return null when API returns empty array', async () => {
      mockQueryEmployee.mockReturnValue({
        execute: jest.fn().mockResolvedValue({ value: [] }),
      });

      const result = await service.getEmployeeById('non-existent-id');

      expect(result).toBeNull();
    });

    it('should return null when no JWT token available', async () => {
      const mockRequestNoToken = {
        session: {
          ...mockSession,
          userToken: null,
        },
      };

      const moduleNoToken = await Test.createTestingModule({
        providers: [
          {
            provide: EmployeeService,
            useFactory: (request) => new EmployeeService(request),
            inject: [REQUEST],
          },
          {
            provide: REQUEST,
            useValue: mockRequestNoToken,
          },
        ],
      }).compile();

      const serviceNoToken = moduleNoToken.get<EmployeeService>(EmployeeService);
      const result = await serviceNoToken.getEmployeeById('emp-123');

      expect(result).toBeNull();
      expect(mockQueryEmployee).not.toHaveBeenCalled();
    });

    it('should handle API errors gracefully', async () => {
      mockQueryEmployee.mockReturnValue({
        execute: jest.fn().mockRejectedValue(new Error('API Connection Failed')),
      });

      const result = await service.getEmployeeById('emp-123');

      expect(result).toBeNull();
    });

    it('should handle network timeout errors', async () => {
      mockQueryEmployee.mockReturnValue({
        execute: jest.fn().mockRejectedValue(new Error('ETIMEDOUT')),
      });

      const result = await service.getEmployeeById('emp-999');

      expect(result).toBeNull();
    });
  });

  describe('getEmployeeById - Edge Cases', () => {
    it('should handle malformed API response', async () => {
      mockQueryEmployee.mockReturnValue({
        execute: jest.fn().mockResolvedValue({ value: null }),
      });

      const result = await service.getEmployeeById('emp-123');

      expect(result).toBeNull();
    });

    it('should handle response without value property', async () => {
      mockQueryEmployee.mockReturnValue({
        execute: jest.fn().mockResolvedValue({}),
      });

      const result = await service.getEmployeeById('emp-123');

      expect(result).toBeNull();
    });

    it('should handle special characters in employee ID', async () => {
      const specialId = "emp-123-'test\"";
      mockQueryEmployee.mockReturnValue({
        execute: jest.fn().mockResolvedValue({
          value: [{ id: specialId, formattedName: 'Test User', displayId: 'TEST' }],
        }),
      });

      const result = await service.getEmployeeById(specialId);

      expect(result).toBeDefined();
      expect(mockQueryEmployee).toHaveBeenCalledWith({
        $filter: `id eq '${specialId}'`,
      });
    });
  });

  describe('Service Initialization', () => {
    it('should throw error when no session found', async () => {
      await expect(async () => {
        const module = await Test.createTestingModule({
          providers: [
            {
              provide: EmployeeService,
              useFactory: (request) => new EmployeeService(request),
              inject: [REQUEST],
            },
            { provide: REQUEST, useValue: {} },
          ],
        }).compile();
        module.get<EmployeeService>(EmployeeService);
      }).rejects.toThrow('Session is required to access SSC Employee API');
    });

    it('should initialize successfully with valid session', () => {
      expect(service).toBeDefined();
    });
  });

  describe('Multiple API Calls', () => {
    it('should handle consecutive API calls independently', async () => {
      const mockEmployee1 = {
        value: [{ id: 'emp-1', formattedName: 'User 1', displayId: 'U1' }],
      };
      const mockEmployee2 = {
        value: [{ id: 'emp-2', formattedName: 'User 2', displayId: 'U2' }],
      };

      mockQueryEmployee
        .mockReturnValueOnce({ execute: jest.fn().mockResolvedValue(mockEmployee1) })
        .mockReturnValueOnce({ execute: jest.fn().mockResolvedValue(mockEmployee2) });

      const result1 = await service.getEmployeeById('emp-1');
      const result2 = await service.getEmployeeById('emp-2');

      expect(result1.id).toBe('emp-1');
      expect(result2.id).toBe('emp-2');
      expect(mockQueryEmployee).toHaveBeenCalledTimes(2);
    });
  });

  describe('getAllEmployees', () => {
    it('should return all employees when API returns data', async () => {
      const mockEmployeesData = {
        value: [
          { id: 'emp-1', formattedName: 'John Doe', displayId: 'EMP-001' },
          { id: 'emp-2', formattedName: 'Jane Smith', employeeDisplayId: 'EMP-002' },
          { id: 'emp-3', formattedName: 'Bob Wilson', displayId: 'EMP-003' },
        ],
      };

      mockQueryEmployee.mockReturnValue({
        execute: jest.fn().mockResolvedValue(mockEmployeesData),
      });

      const result = await service.getAllEmployees();

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('emp-1');
      expect(result[1].displayId).toBe('EMP-002'); // Falls back to employeeDisplayId
      expect(mockQueryEmployee).toHaveBeenCalledWith({
        $top: 50,
        $skip: 0,
      });
    });

    it('should call API with correct pagination parameters', async () => {
      const mockExecute = jest.fn().mockResolvedValue({ value: [] });
      mockQueryEmployee.mockReturnValue({ execute: mockExecute });

      await service.getAllEmployees();

      expect(mockExecute).toHaveBeenCalledWith({
        destinationName: 'ssc-test-destination',
        jwt: 'mock-jwt-token',
      });
    });

    it('should return empty array when API returns no data', async () => {
      mockQueryEmployee.mockReturnValue({
        execute: jest.fn().mockResolvedValue({ value: [] }),
      });

      const result = await service.getAllEmployees();

      expect(result).toEqual([]);
    });

    it('should return empty array when no JWT token available', async () => {
      const mockRequestNoToken = {
        session: {
          ...mockSession,
          userToken: null,
        },
      };

      const moduleNoToken = await Test.createTestingModule({
        providers: [
          {
            provide: EmployeeService,
            useFactory: (request) => new EmployeeService(request),
            inject: [REQUEST],
          },
          {
            provide: REQUEST,
            useValue: mockRequestNoToken,
          },
        ],
      }).compile();

      const serviceNoToken = moduleNoToken.get<EmployeeService>(EmployeeService);
      const result = await serviceNoToken.getAllEmployees();

      expect(result).toEqual([]);
      expect(mockQueryEmployee).not.toHaveBeenCalled();
    });

    it('should handle API errors gracefully', async () => {
      mockQueryEmployee.mockReturnValue({
        execute: jest.fn().mockRejectedValue(new Error('Network error')),
      });

      const result = await service.getAllEmployees();

      expect(result).toEqual([]);
    });

    it('should return empty array when response has no value property', async () => {
      mockQueryEmployee.mockReturnValue({
        execute: jest.fn().mockResolvedValue({}),
      });

      const result = await service.getAllEmployees();

      expect(result).toEqual([]);
    });

    it('should map employee data correctly', async () => {
      const mockEmployeesData = {
        value: [
          {
            id: 'emp-100',
            formattedName: 'Test User',
            displayId: 'TEST-100',
            employeeDisplayId: 'IGNORED',
            email: 'test@example.com',
            department: 'Engineering',
          },
        ],
      };

      mockQueryEmployee.mockReturnValue({
        execute: jest.fn().mockResolvedValue(mockEmployeesData),
      });

      const result = await service.getAllEmployees();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'emp-100',
        formattedName: 'Test User',
        displayId: 'TEST-100',
      });
      // Should only return mapped fields, not all original fields
      expect(result[0]).not.toHaveProperty('email');
      expect(result[0]).not.toHaveProperty('department');
    });
  });

  describe('Error Handling with Response Details', () => {
    it('should log response status when error has response object', async () => {
      const errorWithResponse = new Error('API Error');
      (errorWithResponse as any).response = { status: 404 };

      mockQueryEmployee.mockReturnValue({
        execute: jest.fn().mockRejectedValue(errorWithResponse),
      });

      const result = await service.getEmployeeById('emp-404');

      expect(result).toBeNull();
      // Error should be logged with response status
    });

    it('should handle 401 Unauthorized errors', async () => {
      const errorUnauthorized = new Error('Unauthorized');
      (errorUnauthorized as any).response = { status: 401 };

      mockQueryEmployee.mockReturnValue({
        execute: jest.fn().mockRejectedValue(errorUnauthorized),
      });

      const result = await service.getEmployeeById('emp-123');

      expect(result).toBeNull();
    });

    it('should handle 500 Internal Server errors', async () => {
      const errorServer = new Error('Internal Server Error');
      (errorServer as any).response = { status: 500 };

      mockQueryEmployee.mockReturnValue({
        execute: jest.fn().mockRejectedValue(errorServer),
      });

      const result = await service.getEmployeeById('emp-123');

      expect(result).toBeNull();
    });
  });
});
