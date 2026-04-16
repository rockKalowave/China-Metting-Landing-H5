import { describe, expect, it } from 'vitest';
import { API_BASE, getApiUrl } from './api';

describe('api config', () => {
  it('uses relative api base path', () => {
    expect(API_BASE).toBe('/api');
  });

  it('builds api urls from the shared base path', () => {
    expect(getApiUrl('/users')).toBe('/api/users');
    expect(getApiUrl('pay/h5')).toBe('/api/pay/h5');
  });
});
