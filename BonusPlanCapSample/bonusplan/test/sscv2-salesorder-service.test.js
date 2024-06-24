const cds = require('@sap/cds')
const axios = require("axios");

describe('cap/bonusplan - myservice', () => {
	const test = cds.test(__dirname + '/..')

	afterEach(() => {
		// restore the spy created with spyOn
		jest.restoreAllMocks();
	});


	/**
	 * test case for getSalesOrders for exception handling
	 */
	it('test getSalesOrders for exception handling', async () => {

		const salesOrdersApi = await cds.connect.to("Open.Api.Specification.for.salesQuote.service");
		const spySalesOrdersApi = jest.spyOn(salesOrdersApi, 'send')
		spySalesOrdersApi.mockImplementation(async (method, url) => {
			if (('GET' === method)) {
				return Promise.reject('exception')
			}
		})

		const sscv2SalesorderSrv = await cds.connect.to('Sscv2SalesorderService');
		const param = {
			data: {
				employeeId: 'a276bc80-f862-4867-9cd8-261028238f16',
				qStartDate: '2024-01-01',
				qEndDate: '2024-03-31'
			}
		}

		const responseData = await sscv2SalesorderSrv.getSalesOrders(param)
		expect(responseData).toBeNull()

	})

	/**
	 * test case for getSalesOrders
	 */
	it('test getSalesOrders when some SalesOrders metadata are missing', async () => {

		const salesOrdersApi = await cds.connect.to("Open.Api.Specification.for.salesQuote.service");
		const spySalesOrdersApi = jest.spyOn(salesOrdersApi, 'send')
		spySalesOrdersApi.mockImplementationOnce(async (method, url) => {
			if (('GET' === method)) {
				return Promise.resolve({
					value: [
						{
							id: '86f1aee8-cc60-44f6-9d02-c77bb0c62b2a',
							displayId: '22996',
							draftMode: false,
							documentType: 'ZAK',
							documentTypeDescription: 'ZAK descr ',
							name: 'New Maruti Ciaz order',
							lifeCycleStatus: 'COMPLETED',
							progressStatus: 'WON',
							progressStatusValidSince: '2024-04-15T13:20:19.126Z',
							externalSalesOrderRequestStatus: 'NOT_STARTED',
							creditWorthinessStatus: 'NOT_RELEVANT',
							consistencyStatus: 'CONSISTENT',
							availabilityStatus: 'CONFIRMATION_PENDING',
							documentLanguage: 'en',
							documentLanguageDescription: 'English',
							documentDate: '2024-04-15',
							validityPeriod: { startDate: '2024-04-15', endDate: '2024-04-17' },
							requestedFulfillmentPeriod: {
								startDateTime: '2024-04-15T09:23:03.112Z',
								endDateTime: '2024-04-16T09:23:03.112Z'
							},
							adminData: {
								createdOn: '2024-04-15T09:23:03.758Z',
								createdBy: 'fe358391-eed7-11e9-a252-05c72ee744cd',
								createdByName: 'Dr. user na',
								updatedOn: '2024-04-15T13:20:19.126Z',
								updatedBy: 'fe358391-eed7-11e9-a252-05c72ee744cd',
								updatedByName: 'Dr. user na'
							},
							account: {
								partyId: '11eeec4b-434d-62ee-afdb-81a46fa8c000',
								partyDisplayId: '1109290',
								type: '159',
								addressId: '11eeec4b-434d-ff2e-afdb-81a46fa8c000',
								formattedAddress: [Array],
								formattedPostalAddress: 'East India / 112 Second Street / Bangalore 560048 / IN',
								determinationMethod: '1',
								determinationMethodDescription: 'Provided by an unspecified external source',
								partyName: 'NightRiders'
							},
							owner: {
								partyDisplayId: '8000023277',
								type: '167',
								addressId: '11ee57a0-63cb-62fe-afdb-819d51a8c000',
								determinationMethod: '1',
								determinationMethodDescription: 'Provided by an unspecified external source',
								partyName: 'biswajit maji'
							},
							totalValues: {
								netAmount: {
									content: 30
								},
								taxAmount: {
									content: 10
								}
							},
							relatedObjects: [[Object]],
							pricingProcedureName: 'ZVHP',
							pricingProcedureIsExternal: false,
							priceElements: [[Object]],
							pricingStatus: 'CALCULATED_SUCCESSFULLY',
							configuration: { internalPricing: 'ON' },
							etag: '2024-04-15T13:20:19.126Z'
						}
					]
				})
			}
		})

		const sscv2SalesorderSrv = await cds.connect.to('Sscv2SalesorderService');
		const param = {
			employeeId: '9a4f6ddf-d51f-4620-bdc4-8b63acb53903',
			qStartDate: '2024-01-01',
			qEndDate: '2024-03-31'
		}

		const responseData = await sscv2SalesorderSrv.getSalesOrders(param)
		expect(responseData.length).toBeGreaterThan(0)


		/**
		 * with second mock data
		 */
		spySalesOrdersApi.mockImplementationOnce(async (method, url) => {
			if (('GET' === method)) {
				return Promise.resolve({
					value: [
						{
							id: '86f1aee8-cc60-44f6-9d02-c77bb0c62b2a',
							displayId: '22996',
							draftMode: false,
							documentType: 'ZAK',
							documentTypeDescription: 'ZAK descr ',
							name: 'New Maruti Ciaz order',
							lifeCycleStatus: 'COMPLETED',
							progressStatus: 'WON',
							progressStatusValidSince: '2024-04-15T13:20:19.126Z',
							externalSalesOrderRequestStatus: 'NOT_STARTED',
							creditWorthinessStatus: 'NOT_RELEVANT',
							consistencyStatus: 'CONSISTENT',
							availabilityStatus: 'CONFIRMATION_PENDING',
							documentLanguage: 'en',
							documentLanguageDescription: 'English',
							documentDate: '2024-04-15',
							validityPeriod: { startDate: '2024-04-15', endDate: '2024-04-17' },
							requestedFulfillmentPeriod: {
								startDateTime: '2024-04-15T09:23:03.112Z',
								endDateTime: '2024-04-16T09:23:03.112Z'
							},
							adminData: {
								createdOn: '2024-04-15T09:23:03.758Z',
								createdBy: 'fe358391-eed7-11e9-a252-05c72ee744cd',
								createdByName: 'Dr. user na',
								updatedOn: '2024-04-15T13:20:19.126Z',
								updatedBy: 'fe358391-eed7-11e9-a252-05c72ee744cd',
								updatedByName: 'Dr. user na'
							},
							account: {
								partyId: '11eeec4b-434d-62ee-afdb-81a46fa8c000',
								partyDisplayId: '1109290',
								type: '159',
								addressId: '11eeec4b-434d-ff2e-afdb-81a46fa8c000',
								formattedAddress: [Array],
								formattedPostalAddress: 'East India / 112 Second Street / Bangalore 560048 / IN',
								determinationMethod: '1',
								determinationMethodDescription: 'Provided by an unspecified external source',
								partyName: 'NightRiders'
							},
							totalValues: {
								netAmount: {
									content: 30
								},
								taxAmount: {
									content: 10
								},
								grossAmount: {
									content: 20
								}
							},
							relatedObjects: [[Object]],
							pricingProcedureName: 'ZVHP',
							pricingProcedureIsExternal: false,
							priceElements: [[Object]],
							pricingStatus: 'CALCULATED_SUCCESSFULLY',
							configuration: { internalPricing: 'ON' },
							etag: '2024-04-15T13:20:19.126Z'
						}
					]
				})
			}
		})

		const secondResponseData = await sscv2SalesorderSrv.getSalesOrders(param)
		expect(secondResponseData.length).toEqual(0)

	})

	/**
	 * test case for getSalesOrders when no SalesOrders found
	 */
	it('test getSalesOrders when no SalesOrders found', async () => {
		const salesOrdersApi = await cds.connect.to("Open.Api.Specification.for.salesQuote.service");
		const spySalesOrdersApi = jest.spyOn(salesOrdersApi, 'send')
		spySalesOrdersApi.mockImplementationOnce(async (method, url) => {
			if (('GET' === method)) {
				return Promise.resolve({
					value: []
				})
			}
		})
		const sscv2SalesorderSrv = await cds.connect.to('Sscv2SalesorderService');
		const param = {
			data: {
				employeeId: 'a276bc80-f862-4867-9cd8-261028238f16',
				qStartDate: '2024-01-01',
				qEndDate: '2024-03-31'
			}
		}

		const responseData = await sscv2SalesorderSrv.getSalesOrders(param)
		expect(responseData).toBeNull()
	})

})