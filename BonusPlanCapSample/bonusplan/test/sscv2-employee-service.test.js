const cds = require('@sap/cds')
const axios = require("axios");

describe('cap/bonusplan - myservice', () => {
	const test = cds.test(__dirname + '/..')

	afterEach(() => {
		// restore the spy created with spyOn
		jest.restoreAllMocks();
	});

	/**
	 * test case for getCurrentEmployee for success
	 */
	it('test getCurrentEmployee for success', async () => {
		const employeesApi = await cds.connect.to("Open.Api.Specification.for.employee.service");
		const spyEmployeesApi = jest.spyOn(employeesApi, 'send')
		spyEmployeesApi.mockImplementation(async (method, url) => {
			if (('GET' === method)) {
				return Promise.resolve({
					value: [{
						id: 'employeexyz',
						employeeDisplayId: 'xyz',
						formattedName: 'xyz',
						workplaceAddress: {
							eMail: 'xyz@xyz.com'
						}
					}]
				})
			}
		})

		const sscv2EmployeeSrv = await cds.connect.to('Sscv2EmployeeService');
		const param = {
			user: {
				id: '9a4f6ddf-d51f-4620-bdc4-8b63acb53903'
			}
		}
		const responseData = await sscv2EmployeeSrv.getCurrentEmployee(param)
		expect(responseData).toHaveProperty('ID')
	})

	/**
	 * test case for getCurrentEmployee returns no data
	 */
	it('test getCurrentEmployee returns no data', async () => {
		const employeesApi = await cds.connect.to("Open.Api.Specification.for.employee.service");
		const spyEmployeesApi = jest.spyOn(employeesApi, 'send')
		spyEmployeesApi.mockImplementation(async (method, url) => {
			if (('GET' === method)) {
				return Promise.resolve({
					value: []
				})
			}
		})

		const sscv2EmployeeSrv = await cds.connect.to('Sscv2EmployeeService');
		const param = {
			user: {
				id: '9a4f6ddf-d51f-4620-bdc4-8b63acb53903'
			}
		}

		await expect(sscv2EmployeeSrv.getCurrentEmployee(param))
			.rejects.toThrow('Employee not found.')
	})

	/**
	 * test case for updateEmployeeExtField for success
	 */
	it('test updateEmployeeExtField for success', async () => {

		const employeesApi = await cds.connect.to("Open.Api.Specification.for.employee.service");
		const spyEmployeesApi = jest.spyOn(employeesApi, 'send')
		spyEmployeesApi.mockImplementation(async ({ method, path }) => {
			if (('PATCH' === method) && ("/employees/a276bc80-f862-4867-9cd8-261028238f16" === path)) {
				return Promise.resolve({
					value: {
						lifeCycleStatus: 'ACTIVE',
						employeeDisplayId: 'I54617',
						isInternalEmployee: true,
						formattedName: 'Tony Mathew',
						givenName: 'Tony',
						familyName: 'Mathew',
						gender: '0',
						adminData: {
							createdOn: '2023-08-22T14:18:27.066Z',
							createdBy: 'fe358391-eed7-11e9-a252-05c72ee744cd',
							createdByName: 'Dr. user na',
							updatedOn: '2024-04-30T08:38:19.649Z',
							updatedBy: 'abf4a353-ea15-11e9-8fa7-f92a516fe752',
							updatedByName: 'MIKE USA'
						},
						id: '11ee40f6-c2d6-4f5e-afdb-815d44a8c000',
						displayId: '8000022974',
						isBusinessPurposeCompleted: false,
						extensions: { CurrentBonusplan1: '80dc974f-2034-49fd-8085-74ca60559746' },
						employeeTypes: [[Object]],
						workplaceAddress: {
							country: 'IN',
							eMail: 'tony.mathew@sap.com',
							isPostOfficeBoxAddress: false,
							formattedPostalAddressDescription: 'IN',
							countryDescription: 'India'
						},
						lifeCycleStatusDescription: 'Active',
						genderDescription: 'Gender not known'
					}
				})
			}
		})

		const sscv2EmployeeSrv = await cds.connect.to('Sscv2EmployeeService');
		const param = {
			employeeId: 'a276bc80-f862-4867-9cd8-261028238f16',
			bonusplanId: '3ce81f37-a8e8-4918-8350-f4a67f363048',
			ifMatch: true
		}

		const employeeExtFieldUpdateMsg = await sscv2EmployeeSrv.updateEmployeeExtField(param);
		expect(employeeExtFieldUpdateMsg).toHaveProperty('value');

	})

	/**
	 * test case for updateEmployeeExtField for negative test case
	 */
	it('test updateEmployeeExtField for negative test case', async () => {
		const employeesApi = await cds.connect.to("Open.Api.Specification.for.employee.service");
		const spyEmployeesApi = jest.spyOn(employeesApi, 'send')
		spyEmployeesApi.mockImplementation(async ({ method, path }) => {

			if (('PATCH' === method) && ("/employees/a276bc80-f862-4867-9cd8-261028238f16" === path)) {
				return Promise.resolve({
					value: {
						lifeCycleStatus: 'ACTIVE',
						employeeDisplayId: 'I54617',
						isInternalEmployee: true,
						formattedName: 'Tony Mathew',
						givenName: 'Tony',
						familyName: 'Mathew',
						gender: '0',
						adminData: {
							createdOn: '2023-08-22T14:18:27.066Z',
							createdBy: 'fe358391-eed7-11e9-a252-05c72ee744cd',
							createdByName: 'Dr. user na',
							updatedOn: '2024-04-30T08:38:19.649Z',
							updatedBy: 'abf4a353-ea15-11e9-8fa7-f92a516fe752',
							updatedByName: 'MIKE USA'
						},
						id: '11ee40f6-c2d6-4f5e-afdb-815d44a8c000',
						displayId: '8000022974',
						isBusinessPurposeCompleted: false,
						extensions: { CurrentBonusplan1: '80dc974f-2034-49fd-8085-74ca60559746' },
						employeeTypes: [[Object]],
						workplaceAddress: {
							country: 'IN',
							eMail: 'tony.mathew@sap.com',
							isPostOfficeBoxAddress: false,
							formattedPostalAddressDescription: 'IN',
							countryDescription: 'India'
						},
						lifeCycleStatusDescription: 'Active',
						genderDescription: 'Gender not known'
					}
				})
			}
		})

		const sscv2EmployeeSrv = await cds.connect.to('Sscv2EmployeeService');
		const param = {
			employeeId: 'a276bc80-f862-4867-9cd8-261028238f16',
			bonusplanId: '3ce81f37-a8e8-4918-8350-f4a67f363048',
			ifMatch: false
		}
		try {
			await sscv2EmployeeSrv.updateEmployeeExtField(param)
		} catch (e) {
			expect(e.message).toEqual('Employee not found.')
		}
	})

	/**
	 * test case for getEmployee
	 */
	it('test getEmployee (by id) when employee not found', async () => {
		const employeesApi = await cds.connect.to("Open.Api.Specification.for.employee.service");
		const spy = jest.spyOn(employeesApi, 'send')

		spy.mockImplementation(async (method, url) => {
			if (('GET' === method)) {
				return Promise.resolve(null)
			}
		})

		const sscv2EmployeeSrv = await cds.connect.to('Sscv2EmployeeService');
		const param = {
			data: {
				id: '9a4f6ddf-d51f-4620-bdc4-8b63acb53903'
			}
		}

		await expect(
			sscv2EmployeeSrv.getEmployee(param)
		).rejects.toThrow('Employee not found.')
	})

	/**
	 * test case for getEmployeeByDisplayId when employee found
	 */
	it('test getEmployeeByDisplayId when employee not found', async () => {
		const employeesApi = await cds.connect.to("Open.Api.Specification.for.employee.service");
		const spy = jest.spyOn(employeesApi, 'send')

		spy.mockImplementation(async (method, url) => {
			if (('GET' === method)) {
				return Promise.resolve({
					value: [{
						id: '1234',
						employeeDisplayId: 'xyz',
						formattedName: 'xyz',
						workplaceAddress: {
							eMail: 'xyz@xyz.com'
						}
					}]
				})
			}
		})

		const sscv2EmployeeSrv = await cds.connect.to('Sscv2EmployeeService');
		const param = {
			data: {
				id: 'USERTEST12345'
			}
		}
		const responseData = await sscv2EmployeeSrv.getEmployeeByDisplayId(param)
		expect(responseData).toHaveProperty('ID')
	})

	/**
	 * test case for getEmployeeByDisplayId when employee not found
	 */
	it('test getEmployeeByDisplayId when employee not found', async () => {
		const employeesApi = await cds.connect.to("Open.Api.Specification.for.employee.service");
		const spy = jest.spyOn(employeesApi, 'send')

		spy.mockImplementation(async (method, url) => {
			if (('GET' === method)) {
				return Promise.resolve({
					value: []
				})
			}
		})

		const sscv2EmployeeSrv = await cds.connect.to('Sscv2EmployeeService');
		const param = {
			data: {
				id: 'USERTEST12345'
			}
		}

		await expect(
			sscv2EmployeeSrv.getEmployeeByDisplayId(param)
		).rejects.toThrow('Employee not found.')
	})

	/**
	 * test case for getEmployee
	 */
	it('test getEmployee when some employee metadata are missing', async () => {
		const employeesApi = await cds.connect.to("Open.Api.Specification.for.employee.service");
		const spyEmployeesApi = jest.spyOn(employeesApi, 'send')
		spyEmployeesApi.mockImplementationOnce(async (method, url) => {
			if (('GET' === method) && ("/employees/9a4f6ddf-d51f-4620-bdc4-8b63acb53903" === url)) {
				return Promise.resolve({
					'@odata.context': '$metadata#Employees(ID,displayName,email)',
					'@odata.count': 2217,
					value: {
						id: '9a4f6ddf-d51f-4620-bdc4-8b63acb53903',
						adminData: {
							updatedOn: '2024-04-18'
						},
						extensions: {
							CurrentBonusplan1: '3ce81f37-a8e8-4918-8350-f4a67f363051'
						}
					}
				})
			}
		})

		const sscv2EmployeeSrv = await cds.connect.to('Sscv2EmployeeService');
		const param = {
			id: '9a4f6ddf-d51f-4620-bdc4-8b63acb53903'
		}

		const responseData = await sscv2EmployeeSrv.getEmployee(param)
		expect(responseData).toHaveProperty('ID')

		// checking when extensions is empty
		spyEmployeesApi.mockImplementationOnce(async (method, url) => {
			if (('GET' === method) && ("/employees/9a4f6ddf-d51f-4620-bdc4-8b63acb53903" === url)) {
				return Promise.resolve({
					'@odata.context': '$metadata#Employees(ID,displayName,email)',
					'@odata.count': 2217,
					value: {
						id: '9a4f6ddf-d51f-4620-bdc4-8b63acb53903',
						adminData: {
							updatedOn: '2024-04-18'
						},
						extensions: {}
					}
				})
			}
		})

		const responseData2 = await sscv2EmployeeSrv.getEmployee(param)
		expect(responseData2).toHaveProperty('ID')
	})

	/**
	 * test case for getEmployees for success
	 */
	it('test getEmployees for success', async () => {
		const employeesApi = await cds.connect.to("Open.Api.Specification.for.employee.service");
		const spyEmployeesApi = jest.spyOn(employeesApi, 'send')
		spyEmployeesApi.mockImplementation(async (method, url) => {
			if (('GET' === method)) {
				return Promise.resolve({
					'@odata.context': '$metadata#ExternalUsers(ID,displayName,email)',
					'@odata.count': 2217,
					value: [
						{
							id: '00000000-0000-0000-0000-000000000000',
							employeeDisplayId: 'xyz',
							workplaceAddress: {
								eMail: 'xyz@xyz.com'
							},
							formattedName: 'xyz'
						}
					]
				})
			}
		})

		const sscv2EmployeeSrv = await cds.connect.to('Sscv2EmployeeService');
		const param = {
			_search: {
				_queryOptions: {
					$skip: 0,
					$top: 10,
					$search: '',
					$filter: ''
				}
			}
		}
		const responseData = await sscv2EmployeeSrv.getEmployees(param)
		expect(responseData).toHaveProperty('$count');
	})

	/**
	 * test case for getEmployees
	 */
	it('test getEmployees when some employee metadata are missing', async () => {
		const employeesApi = await cds.connect.to("Open.Api.Specification.for.employee.service");
		const spyEmployeesApi = jest.spyOn(employeesApi, 'send')
		spyEmployeesApi.mockImplementation(async (method, url) => {
			if (('GET' === method)) {
				return Promise.resolve({
					'@odata.context': '$metadata#ExternalUsers(ID,displayName,email)',
					'@odata.count': 2217,
					value: [
						{
							employeeDisplayId: 'xyz',
							workplaceAddress: {}
						}
					]
				})
			}
		})

		const sscv2EmployeeSrv = await cds.connect.to('Sscv2EmployeeService');
		const param = {
			_search: {
				_queryOptions: {
					$skip: 0,
					$top: 10,
					$search: '',
					$filter: ''
				}
			}
		}
		const responseData = await sscv2EmployeeSrv.getEmployees(param)
		expect(responseData).toHaveProperty('$count');
	})

	/**
	 * test case for getEmployees when no employee found
	 */
	it('test getEmployees when no employee found', async () => {
		const employeesApi = await cds.connect.to("Open.Api.Specification.for.employee.service");
		const spyEmployeesApi = jest.spyOn(employeesApi, 'send')
		spyEmployeesApi.mockImplementation(async (method, url) => {
			if (('GET' === method)) {
				return Promise.resolve({
					'@odata.context': '$metadata#ExternalUsers(ID,displayName,email)',
					'@odata.count': 2217,
					value: []
				})
			}
		})

		const sscv2EmployeeSrv = await cds.connect.to('Sscv2EmployeeService');
		const param = {
			_search: {
				_queryOptions: {
					$skip: 0,
					$top: 10,
					$search: 't',
					$filter: "email%20eq%20'test1@test.com'"
				}
			}
		}

		await expect(
			sscv2EmployeeSrv.getEmployees(param)
		).rejects.toThrow('Employee not found.')
	})

})