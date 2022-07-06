import Authorizer from '../src/authorizer';

describe('Authorizer Tests', () => {
  test('constructor throws exception', () => {
    expect(() => new Authorizer()).toThrow();
  });

  test('createTenant throws exception', () => {
    expect(() => new Authorizer().createTenant('test', 'test')).toThrow();
  });

  test('deleteTenant throws exception', () => {
    expect(() => new Authorizer().deleteTenant('test')).toThrow();
  });

  test('getTenant throws exception', () => {
    expect(() => new Authorizer().getTenant('test')).toThrow();
  });

  test('listTenants throws exception', () => {
    expect(() => new Authorizer().listTenants()).toThrow();
  });
});
