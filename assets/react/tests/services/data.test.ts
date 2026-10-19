import { describe, expect, test } from '@jest/globals';
import { getRequestHeaders } from '../../services/data';

describe('getRequestHeaders', () => {
  test('get headers without formData', () => {
    const headers = getRequestHeaders();
    expect(headers.get('Content-Type')).toBe('application/json');
  });

  test('get headers with formData', () => {
    const headers = getRequestHeaders(true);
    expect(headers.has('Content-Type')).toBeFalsy();
  });
});
