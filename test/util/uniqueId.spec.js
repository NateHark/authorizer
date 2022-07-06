import uniqueId from '../../src/util/uniqueId';

describe('uniqueId tests', () => {
  test('uniqueId generates valid id', () => {
    expect(uniqueId('cust')).toMatch(/cust_[A-Za-z0-9]+/);
  });

  test('uniqueId generates unique ids', () => {
    const ids = new Map();
    for (let i = 0; i < 100; i += 1) {
      ids.set(uniqueId('cust'), true);
    }
    expect(ids.size).toBe(100);
  });
});
