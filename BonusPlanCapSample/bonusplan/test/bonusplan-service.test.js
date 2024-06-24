const cds = require('@sap/cds')
const axios = require("axios");

describe('cap/bonusplan - bonusplanService', () => {
    const test = cds.test(__dirname + '/..')
    const { GET, POST } = cds.test()

    afterEach(() => {
        // restore the spy created with spyOn
        jest.restoreAllMocks();
    });

    it('test get BonusPlans for employee view when user not found from cns employee api', async () => {

        const sscv2EmployeeSrv = await cds.connect.to('Sscv2EmployeeService');
        const spySscv2EmployeeSrvGetCurrentEmployee = jest.spyOn(sscv2EmployeeSrv, 'getCurrentEmployee')
        spySscv2EmployeeSrvGetCurrentEmployee.mockImplementation(async (id) => {
            return Promise.reject(new Error('Employee not found.'))
        })

        await expect(GET('/api/my/BonusPlans?$count=true&$select=ID&$expand=bonusPolicy($select=ID,endDate,name,startDate)&$skip=0&$top=30', {
            headers: {
                referer: 'https://localhost/bonusplan/webapp/index.html?empid=11eefd4e-4937-742e-afdb-817c71a8c000',
            }
        })).rejects.toThrow('500 - Employee not found.')
    })

    it('test get BonusPlans for employee view when no bonusplan assigned', async () => {
        const sscv2EmployeeSrv = await cds.connect.to('Sscv2EmployeeService');
        const spySscv2EmployeeSrvGetCurrentEmployee = jest.spyOn(sscv2EmployeeSrv, 'getCurrentEmployee')
        spySscv2EmployeeSrvGetCurrentEmployee.mockImplementation(async (id) => {
            return Promise.resolve({
                ID: '12324xyz',
                employeeId: 'a276bc80-f862-4867-9cd8-261028238f15',
                email: 'test.test.com',
                displayId: 'USERTEST123',
                displayName: 'test user'
            })
        })

        await expect(GET('/api/my/BonusPlans', {
            auth: { username: 'testadmin', password: '123456' },
            headers: {
                referer: 'https://localhost/bonusplan/webapp/index.html?empid=11eefd4e-4937-742e-afdb-817c71a8c000',
            }
        })
        ).rejects.toThrow('400 - No Bonus Plan found.')
    })

    it('test non admin employee unable to see other bonusplan', async () => {
        const sscv2EmployeeSrv = await cds.connect.to('Sscv2EmployeeService');
        const spySscv2EmployeeSrvGetCurrentEmployee = jest.spyOn(sscv2EmployeeSrv, 'getCurrentEmployee')
        spySscv2EmployeeSrvGetCurrentEmployee.mockImplementation(async (id) => {
            return Promise.resolve({
                ID: '12324xyz',
                employeeId: 'a276bc80-f862-4867-9cd8-261028238f15',
                email: 'test.test.com',
                displayId: 'USERTEST123',
                displayName: 'test user'
            })
        })

        await expect(GET('/api/my/BonusPlans', {
            auth: { username: 'alice', password: '' },
            headers: {
                referer: 'https://localhost/bonusplan/webapp/index.html?empid=11ee57a0-63ca-edce-afdb-819d51a8c000',
            }
        })
        ).rejects.toThrow('403 - You are not authorized to view bonus plan of this employee')
    })

    it('test when employee id is missing in the url param', async () => {
        const sscv2EmployeeSrv = await cds.connect.to('Sscv2EmployeeService');
        const spySscv2EmployeeSrvGetCurrentEmployee = jest.spyOn(sscv2EmployeeSrv, 'getCurrentEmployee')
        spySscv2EmployeeSrvGetCurrentEmployee.mockImplementation(async (id) => {
            return Promise.resolve({
                ID: '12324xyz',
                employeeId: 'a276bc80-f862-4867-9cd8-261028238f15',
                email: 'test.test.com',
                displayId: 'USERTEST123',
                displayName: 'test user'
            })
        })

        await expect(GET('/api/my/BonusPlans', {
            auth: { username: 'testadmin', password: '123456' },
            headers: {
                referer: 'https://localhost/bonusplan/webapp/index.html',
            }
        })
        ).rejects.toThrow('400 - Employee ID is required.')
    })

    it('test get BonusPlans for employee when external service gives blank output', async () => {

        const sscv2EmployeeSrv = await cds.connect.to('Sscv2EmployeeService');
        const spy = jest.spyOn(sscv2EmployeeSrv, 'getCurrentEmployee')
        spy.mockImplementation(async () => {
            return Promise.resolve(null)
        })

        await expect(GET('/api/my/BonusPlans', {
            auth: { username: 'testadmin', password: '123456' },
            headers: {
                referer: 'https://localhost/bonusplan/webapp/index.html',
            }
        })
        ).rejects.toThrow('403 - unauthorized')

    })


    it('test get BonusPlans for employee view', async () => {
        const sscv2EmployeeSrv = await cds.connect.to('Sscv2EmployeeService');
        const spySscv2EmployeeSrvGetCurrentEmployee = jest.spyOn(sscv2EmployeeSrv, 'getCurrentEmployee')
        spySscv2EmployeeSrvGetCurrentEmployee.mockImplementation(async () => {
            return Promise.resolve({
                ID: '12324xyz',
                employeeId: '11ee57a0-63ca-edce-afdb-819d51a8c000',
                email: 'xuz@xyz.com',
                displayId: 'xyz',
                displayName: 'xyz'
            })
        })

        const spySelectFrom = jest.spyOn(SELECT.one, 'from')
        spySelectFrom.mockImplementationOnce((entity) => {
            return {
                where: jest.fn().mockResolvedValue({
                    ID: 1234,
                    employeeId: 12345,
                    email: 'xyz@xyz.com',
                    displayName: 'xyz',
                    displayId: 'xyz'
                })
            }
        })

        // test data without filter
        const { data } = await GET('/api/my/BonusPlans', {
            auth: { username: 'testadmin', password: '123456' },
            headers: {
                referer: 'https://localhost/bonusplan/webapp/index.html?empid=11ee57a0-63ca-edce-afdb-819d51a8c000',
            }
        })
        expect(data.value.length).toBeGreaterThanOrEqual(0)

    })

    it('test get BonusPlans for employee view with filter', async () => {
        const sscv2EmployeeSrv = await cds.connect.to('Sscv2EmployeeService');
        const spySscv2EmployeeSrvGetCurrentEmployee = jest.spyOn(sscv2EmployeeSrv, 'getCurrentEmployee')
        spySscv2EmployeeSrvGetCurrentEmployee.mockImplementation(async () => {
            return Promise.resolve({
                ID: '12324xyz',
                employeeId: '11ee57a0-63ca-edce-afdb-819d51a8c000',
                email: 'xuz@xyz.com',
                displayId: 'xyz',
                displayName: 'xyz'
            })
        })

        const spySelectFrom = jest.spyOn(SELECT.one, 'from')
        spySelectFrom.mockImplementationOnce((entity) => {
            return {
                where: jest.fn().mockResolvedValue({
                    ID: 1234,
                    employeeId: 12345,
                    email: 'xyz@xyz.com',
                    displayName: 'xyz',
                    displayId: 'xyz'
                })
            }
        })

        // test data without filter
        const { data } = await GET("/api/my/BonusPlans?$count=true&$select=ID,bonusPolicyDesc,bonusPolicyEndDate,bonusPolicyName,bonusPolicyStartDate&$filter=bonusPolicyName%20eq%20'BonusPolicy2_2023'&$skip=0&$top=30", {
            auth: { username: 'testadmin', password: '123456' },
            headers: {
                referer: 'https://localhost/bonusplan/webapp/index.html?empid=11ee57a0-63ca-edce-afdb-819d51a8c000',
            }
        })
        expect(data.value.length).toBeGreaterThanOrEqual(0)

    })

    it('test get BonusPlans for employee view when showall is true', async () => {
        const sscv2EmployeeSrv = await cds.connect.to('Sscv2EmployeeService');
        const spySscv2EmployeeSrvGetCurrentEmployee = jest.spyOn(sscv2EmployeeSrv, 'getCurrentEmployee')
        spySscv2EmployeeSrvGetCurrentEmployee.mockImplementation(async (id) => {
            return Promise.resolve({
                ID: '12324xyz',
                employeeId: 'a276bc80-f862-4867-9cd8-261028238f15',
                email: 'test.test.com',
                displayId: 'USERTEST123',
                displayName: 'test user'
            })
        })

        // test data without filter
        const { data } = await GET('/api/my/BonusPlans', {
            auth: { username: 'testadmin', password: '123456' },
            headers: {
                referer: "https://localhost/bonusplan/webapp/index.html?showall=true",
            }
        })
        expect(data.value.length).toBeGreaterThanOrEqual(0)

    })

})