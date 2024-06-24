const cds = require('@sap/cds')
describe('cap/bonusplan - SuperAdminService', () => {

    const test = cds.test(__dirname + '/..')

    it('test BonusPolicies api with No logged in user', async () => {
        await expect(test.get('/api/superadmin/BonusPolicies')).rejects.toThrow('401 - Unauthorized')
    })

    it('test BonusPolicies api with unauthorized logged in user', async () => {
        await expect(test.get('/api/superadmin/BonusPolicies', { auth: { username: 'alice', password: '' } })).rejects.toThrow('403 - Forbidden')
    })

    it('test BonusPolicies api with Authorized user', async () => {
        const { data } = await test.get('/api/superadmin/BonusPolicies', { auth: { username: 'testadmin', password: '123456' } })
        expect(data.value.length).toBeGreaterThanOrEqual(0)
    })

})