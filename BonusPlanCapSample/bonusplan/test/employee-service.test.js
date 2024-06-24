const cds = require('@sap/cds')
const axios = require("axios");

describe('cap/bonusplan - EmployeeService', () => {
	const test = cds.test(__dirname + '/..')
	const { GET, POST, PATCH, axios } = cds.test()

	afterEach(() => {
		// restore the spy created with spyOn
		jest.restoreAllMocks();
	});


	/**
	 * original api call with no user credentials
	 */
	it('test Employees api with No logged in user', async () => {
		await expect(GET('/api/admin/Employees'))
			.rejects.toThrow('401 - Unauthorized')
	})

	/**
	 * original api call with unauthorized user credentials
	 */
	it('test Employees api with unauthorized logged in user', async () => {
		await expect(GET('/api/admin/Employees', { auth: { username: 'alice', password: '' } }))
			.rejects.toThrow('403 - Forbidden')
	})

	/**
	 * working with mock api with success
	 */
	it('Test external user api success', async () => {
		const sscv2EmployeeSrv = await cds.connect.to('Sscv2EmployeeService');
		const spySscv2EmployeeSrvGetEmployees = jest.spyOn(sscv2EmployeeSrv, 'getEmployees')
		spySscv2EmployeeSrvGetEmployees.mockImplementation(async (req) => {
			return Promise.resolve([
				{
					ID: '00000000-0000-0000-0000-000000000000',
					employeeId: 'NA',
					email: 'NA',
					displayName: 'SAP_SYSTEM'
				}
			])
		})

		const { data } = await GET("/api/admin/ExternalEmployees?$select=ID,displayName,email&$count=true&$orderby=ID&$skip=0&$top=31", {
			auth: { username: 'testadmin', password: '123456' },
		})
		expect(data.value.length).toBeGreaterThan(0)
	})

	/**
	 * working with mock api with failed to fetch data
	 */
	it('Test external user api fail - user not found', async () => {
		const sscv2EmployeeSrv = await cds.connect.to('Sscv2EmployeeService');
		const spySscv2EmployeeSrvGetEmployees = jest.spyOn(sscv2EmployeeSrv, 'getEmployees')
		spySscv2EmployeeSrvGetEmployees.mockImplementation(async (req) => {
			return Promise.reject(new Error('Employee not found.'))
		})

		await expect(GET("/api/admin/ExternalEmployees?$select=ID,displayName,email&$count=true&$orderby=ID&$search=%22t%22&$filter=email%20eq%20'test1@test.com'&$skip=0&$top=31", {
			auth: { username: 'testadmin', password: '123456' },
		})).rejects.toThrow('500 - Employee not found.')
	})

	it('Test create bonusplan with mocked user', async () => {
		const sscv2EmployeeSrv = await cds.connect.to('Sscv2EmployeeService');

		const spySscv2EmployeeSrvGetEmpByDispId = jest.spyOn(sscv2EmployeeSrv, 'getEmployeeByDisplayId')
		spySscv2EmployeeSrvGetEmpByDispId.mockImplementation(async (id) => {
			return Promise.resolve({
				ID: '12324xyz',
				employeeId: 'a276bc80-f862-4867-9cd8-261028238f15',
				email: 'test.test.com',
				displayId: 'USERTEST123',
				displayName: 'test user'
			})
		})

		const spySscv2EmployeeSrvGetEmp = jest.spyOn(sscv2EmployeeSrv, 'getEmployee')
		spySscv2EmployeeSrvGetEmp.mockImplementation(async (id) => {
			return Promise.resolve({
				ID: 'a276bc80-f862-4867-9cd8-261028238f15',
				updatedOn: '2022-01-01',
				formattedName: 'test user',
				currentBonusplan1: null
			})
		})

		const spySscv2EmployeeSrvUpdateEmpExt = jest.spyOn(sscv2EmployeeSrv, 'updateEmployeeExtField')
		spySscv2EmployeeSrvUpdateEmpExt.mockImplementation(async (id) => {
			return Promise.resolve({
				ID: 'a276bc80-f862-4867-9cd8-261028238f15'
			})
		})

		// creating a draft version 
		const { data: newDraft } = await POST(`/api/admin/Employees`, {
			employeeId: 'a276bc80-f862-4867-9cd8-261028238f15',
			email: 'test.test.com',
			displayName: 'test user',
			displayId: 'USERTEST123',
			"bonusPlans": [
				{
					ID: '3ce81f37-a8e8-4918-8350-f4a67f363047',
					bonusPolicy: {
						ID: "5b44095a-4303-4980-bf71-730d75b3ec5c"
					},
					employee_ID: '642cbe3c-db1d-48a4-a67d-c8c82e48c7a8'
				}
			]
		}, {
			auth: { username: 'testadmin', password: '123456' }
		})

		// post to convert draft entry to a real entry
		const { data: newBonusPlan } = await POST(`/api/admin/Employees(ID=${newDraft.ID},IsActiveEntity=false)/EmployeeService.draftActivate`
			, {}, {
			auth: { username: 'testadmin', password: '123456' }
		})
		expect(newBonusPlan).toHaveProperty('ID', newDraft.ID);

		/**
		 * Testing negative test cases
		 * trying to insert duplicate bonusplan for same employee
		 */
		const { data: newDraftDuplicate } = await POST(`/api/admin/Employees`, {
			email: 'test.test.com',
			displayName: 'test user',
			displayId: 'USERTEST123',
			"bonusPlans": [
				{
					ID: '3ce81f37-a8e8-4918-8350-f4a67f363048',
					bonusPolicy: {
						ID: "5b44095a-4303-4980-bf71-730d75b3ec5c"
					},
					employee_ID: '642cbe3c-db1d-48a4-a67d-c8c82e48c7a8'
				}
			]
		}, {
			auth: { username: 'testadmin', password: '123456' }
		})

		await expect(POST(`/api/admin/Employees(ID=${newDraftDuplicate.ID},IsActiveEntity=false)/EmployeeService.draftActivate`
			, {}, {
			auth: { username: 'testadmin', password: '123456' }
		})).rejects.toThrow('400 - Bad request. Bonusplan for same employee with same bonus policy already exists.')

	})

	it('Test create bonusplan when some of the user details are blank', async () => {

		const sscv2EmployeeSrv = await cds.connect.to('Sscv2EmployeeService');

		const spyExternalSrvGetEmployeeByDisplayId = jest.spyOn(sscv2EmployeeSrv, 'getEmployeeByDisplayId')
		spyExternalSrvGetEmployeeByDisplayId.mockImplementation(async (id) => {
			return Promise.resolve({
				ID: '9a4f6ddf-d51f-4620-bdc4-8b63acb53903',
				displayId: 'USERTEST123'
			})
		})

		const spyExternalSrvGetEmployee = jest.spyOn(sscv2EmployeeSrv, 'getEmployee')
		spyExternalSrvGetEmployee.mockImplementation(async (id) => {
			return Promise.resolve({
				ID: '9a4f6ddf-d51f-4620-bdc4-8b63acb53903',
				updatedOn: '2024-04-18',
				formattedName: 'test employee'
			})
		})

		const spyExternalSrvUpdateEmployeeExtField = jest.spyOn(sscv2EmployeeSrv, 'updateEmployeeExtField')
		spyExternalSrvUpdateEmployeeExtField.mockImplementation(async (employeeId, bonusplanId, ifMatch) => {
			return Promise.resolve({
				status: 'Success',
				message: 'Updated'
			})
		})


		// creating a draft version 
		const { data: newDraft } = await POST(`/api/admin/Employees`, {
			employeeId: 'e8819fba-02ee-4e90-b984-bbb0dfd834d1',
			email: 'test.test.com',
			displayName: 'test user',
			displayId: 'USERTEST123',
			"bonusPlans": [
				{
					ID: '3ce81f37-a8e8-4918-8350-f4a67f363049',
					bonusPolicy: {
						ID: "5b44095a-4303-4980-bf71-730d75b3ec5e"
					},
					employee_ID: '642cbe3c-db1d-48a4-a67d-c8c82e48c7a8'
				}
			]
		}, {
			auth: { username: 'testadmin', password: '123456' }
		})

		// post to convert draft entry to a real entry
		const { data: newBonusPlan } = await POST(`/api/admin/Employees(ID=${newDraft.ID},IsActiveEntity=false)/EmployeeService.draftActivate`
			, {}, {
			auth: { username: 'testadmin', password: '123456' }
		})
		expect(newBonusPlan).toHaveProperty('ID', newDraft.ID);

	})

	it('Test create bonusplan failure when employee not found while updating ext field', async () => {

		const sscv2EmployeeSrv = await cds.connect.to('Sscv2EmployeeService');

		const spyExternalSrvGetEmployeeByDisplayId = jest.spyOn(sscv2EmployeeSrv, 'getEmployeeByDisplayId')
		spyExternalSrvGetEmployeeByDisplayId.mockImplementation(async (id) => {
			return Promise.resolve({
				ID: '9a4f6ddf-d51f-4620-bdc4-8b63acb53903',
				employeeId: 'a276bc80-f862-4867-9cd8-261028238f17',
				email: 'test.test4.com',
				displayName: 'test user4',
				displayId: 'USERTEST1234'
			})
		})

		const spyExternalSrvGetEmployee = jest.spyOn(sscv2EmployeeSrv, 'getEmployee')
		spyExternalSrvGetEmployee.mockImplementation(async (id) => {
			return Promise.resolve(null)
		})

		const spyExternalSrvUpdateEmployeeExtField = jest.spyOn(sscv2EmployeeSrv, 'updateEmployeeExtField')
		spyExternalSrvUpdateEmployeeExtField.mockImplementation(async (id) => {
			return Promise.resolve({
				status: 'Success',
				message: 'Updated'
			})
		})

		// creating a draft version 
		const { data: newDraft } = await POST(`/api/admin/Employees`, {
			employeeId: 'e8819fba-02ee-4e90-b984-bbb0dfd834d3',
			email: 'test.test4.com',
			displayName: 'test user4',
			displayId: 'USERTEST1234',
			"bonusPlans": [
				{
					ID: '3ce81f37-a8e8-4918-8350-f4a67f363051',
					bonusPolicy: {
						ID: "5b44095a-4303-4980-bf71-730d75b3ec5d"
					},
					employee_ID: '642cbe3c-db1d-48a4-a67d-c8c82e48c7b0'
				}
			]
		}, {
			auth: { username: 'testadmin', password: '123456' }
		})

		// post to convert draft entry to a real entry
		const { data: newBonusPlan } = await POST(`/api/admin/Employees(ID=${newDraft.ID},IsActiveEntity=false)/EmployeeService.draftActivate`
			, {}, {
			auth: { username: 'testadmin', password: '123456' }
		})
		expect(newBonusPlan).toHaveProperty('ID', newDraft.ID);

	}, 120000)


	it('Test create bonusplan with mocked user. failed when external service fails ', async () => {
		const sscv2EmployeeSrv = await cds.connect.to('Sscv2EmployeeService');
		const spy = jest.spyOn(sscv2EmployeeSrv, 'getEmployeeByDisplayId')

		spy.mockImplementation(async (id) => {
			return Promise.resolve(null)
		})

		// creating a draft version 
		const { data: newDraft } = await POST(`/api/admin/Employees`, {
			employeeId: 'e8819fba-02ee-4e90-b984-bbb0dfd834d2',
			email: 'test.test2.com',
			displayName: 'test user2',
			displayId: 'USERTEST2123',
			"bonusPlans": [
				{
					ID: '3ce81f37-a8e8-4918-8350-f4a67f363050',
					bonusPolicy: {
						ID: "5b44095a-4303-4980-bf71-730d75b3ec5c"
					},
					employee_ID: '642cbe3c-db1d-48a4-a67d-c8c82e48c7a9'
				}
			]
		}, {
			auth: { username: 'testadmin', password: '123456' }
		})

		// post to convert draft entry to a real entry
		await expect(POST(`/api/admin/Employees(ID=${newDraft.ID},IsActiveEntity=false)/EmployeeService.draftActivate`
			, {}, {
			auth: { username: 'testadmin', password: '123456' }
		})
		).rejects.toThrow('400 - employee data not found.')

	})

	it('Test calculate bonusplan functionality', async () => {
		const sscv2SalesorderSrv = await cds.connect.to('Sscv2SalesorderService');
		const spySscv2SalesorderSrvGetSalesOrders = jest.spyOn(sscv2SalesorderSrv, 'getSalesOrders')
		spySscv2SalesorderSrvGetSalesOrders.mockImplementation(async (employeed, startOfQuarter, endOfQuarter) => {
			return Promise.resolve([
				{
					ID: '86f1aee8-cc60-44f6-9d02-c77bb0c62b2a',
					status: 'NA',
					owner: {
						id: '11ee57a0-63ca-edce-afdb-819d51a8c000'
					},
					totalValues: {
						grossAmount: {
							content: 5
						}
					}
				}
			])
		})

		// mock all bonusplans 
		const spySelectFrom = jest.spyOn(SELECT, 'from')
		spySelectFrom.mockImplementationOnce((entity) => {
			return {
				where: jest.fn().mockResolvedValue([
					{
						ID: 'bplan123',
						bonusPolicy: {
							ID: 'bpolicy123'
						},
						employee: {
							ID: 'emp123',
							employeeId: '11eeec4b-434d-62ee-afdb-81a46fa8c000'
						}
					}
				])
			}
		})

		// mock bonus rate
		const spySelectOneFrom = jest.spyOn(SELECT.one, 'from')
		spySelectOneFrom.mockImplementationOnce((entity) => {
			return {
				where: jest.fn().mockImplementationOnce((whereObj) => {
					return {
						where: jest.fn().mockResolvedValue({
							ID: 1234,
							ratePercent: 5
						})
					}
				})
			}
		})

		const { data } = await POST(`/api/admin/calculateBonusesAction`
			, {}, {
			auth: { username: 'testadmin', password: '123456' }
		})
		expect(data).toHaveProperty('status', 'Success');

	})

	it('Test calculate bonusplan functionality when no salesorder found', async () => {
		const sscv2SalesorderSrv = await cds.connect.to('Sscv2SalesorderService');
		const spySscv2SalesorderSrvGetSalesOrders = jest.spyOn(sscv2SalesorderSrv, 'getSalesOrders')
		spySscv2SalesorderSrvGetSalesOrders.mockImplementation(async (employeed, startOfQuarter, endOfQuarter) => {
			return Promise.resolve([])
		})

		// mock all bonusplans 
		const spySelectFrom = jest.spyOn(SELECT, 'from')
		spySelectFrom.mockImplementationOnce((entity) => {
			return {
				where: jest.fn().mockResolvedValue([
					{
						ID: 'bplan123',
						bonusPolicy: {
							ID: 'bpolicy123'
						},
						employee: {
							ID: 'emp123',
							employeeId: '11eeec4b-434d-62ee-afdb-81a46fa8c000'
						}
					}
				])
			}
		})

		// mock bonus rate
		const spySelectOneFrom = jest.spyOn(SELECT.one, 'from')
		spySelectOneFrom.mockImplementationOnce((entity) => {
			return {
				where: jest.fn().mockImplementationOnce((whereObj) => {
					return {
						where: jest.fn().mockResolvedValue({
							ID: 1234,
							ratePercent: 5
						})
					}
				})
			}
		})

		const { data } = await POST(`/api/admin/calculateBonusesAction`
			, {}, {
			auth: { username: 'testadmin', password: '123456' }
		})
		expect(data).toHaveProperty('status', 'Success');

	})

	it('Test calculate bonusplan functionality handling exception', async () => {
		const sscv2SalesorderSrv = await cds.connect.to('Sscv2SalesorderService');
		const spySscv2SalesorderSrvGetSalesOrders = jest.spyOn(sscv2SalesorderSrv, 'getSalesOrders')
		spySscv2SalesorderSrvGetSalesOrders.mockImplementation(async (employeed, startOfQuarter, endOfQuarter) => {
			return Promise.resolve([])
		})

		// this will make key as null, hence exception
		const cryptoRandomUUID = jest.spyOn(crypto, 'randomUUID')
		cryptoRandomUUID.mockImplementation(() => {
			return null;
		})

		// mock all bonusplans 
		const spySelectFrom = jest.spyOn(SELECT, 'from')
		spySelectFrom.mockImplementationOnce((entity) => {
			return {
				where: jest.fn().mockResolvedValue([
					{
						ID: 'bplan123',
						bonusPolicy: {
							ID: 'bpolicy123'
						},
						employee: {
							ID: 'emp123',
							employeeId: '11eeec4b-434d-62ee-afdb-81a46fa8c000'
						}
					}
				])
			}
		})

		// mock bonus rate
		const spySelectOneFrom = jest.spyOn(SELECT.one, 'from')
		spySelectOneFrom.mockImplementationOnce((entity) => {
			return {
				where: jest.fn().mockImplementationOnce((whereObj) => {
					return {
						where: jest.fn().mockResolvedValue({
							ID: 1234,
							ratePercent: 5
						})
					}
				})
			}
		})

		const { data } = await POST(`/api/admin/calculateBonusesAction`
			, {}, {
			auth: { username: 'testadmin', password: '123456' }
		})
		expect(data).toHaveProperty('status', 'Success');

	})

	it('Test calculate bonusplan functionality add select testing', async () => {
		const sscv2SalesorderSrv = await cds.connect.to('Sscv2SalesorderService');
		const spySscv2SalesorderSrvGetSalesOrders = jest.spyOn(sscv2SalesorderSrv, 'getSalesOrders')
		spySscv2SalesorderSrvGetSalesOrders.mockImplementation(async (employeed, startOfQuarter, endOfQuarter) => {
			return Promise.resolve([])
		})

		const { data } = await POST(`/api/admin/calculateBonusesAction`
			, {}, {
			auth: { username: 'testadmin', password: '123456' }
		})

		// mock all bonusplans 
		const spySelectFrom = jest.spyOn(SELECT, 'from')
		spySelectFrom.mockImplementationOnce((entity) => {
			return {
				where: jest.fn().mockResolvedValue([
					{
						ID: 'bplan123',
						bonusPolicy: {
							ID: 'bpolicy123'
						},
						employee: {
							ID: 'emp123',
							employeeId: '11eeec4b-434d-62ee-afdb-81a46fa8c000'
						}
					}
				])
			}
		})

		const { data: data2 } = await POST(`/api/admin/calculateBonusesAction`
			, {}, {
			auth: { username: 'testadmin', password: '123456' }
		})
		expect(data2).toHaveProperty('status', 'Success');

	})

})