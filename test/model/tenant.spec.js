import Tenant from '../../src/model/tenant';

describe('tenant tests', () => {
  test('tenant accessors', () => {
    const tenant = new Tenant('cust_12345', 'Foo Industries');
    expect(tenant.tenantId).toBe('cust_12345');
    expect(tenant.name).toBe('Foo Industries');
  });
});
