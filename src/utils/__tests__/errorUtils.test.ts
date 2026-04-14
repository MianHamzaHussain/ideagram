import { describe, it, expect } from 'vitest';
import { getErrorMessage } from '@/utils/errorUtils';

describe('errorUtils', () => {
  it('returns fallback for null/undefined errors', () => {
    expect(getErrorMessage(null, 'Default')).toBe('Default');
    expect(getErrorMessage(undefined)).toBe('An unexpected error occurred');
  });

  it('extracts "detail" from API responses', () => {
    const error = {
      response: {
        data: { detail: 'Unauthorized access' }
      }
    };
    expect(getErrorMessage(error)).toBe('Unauthorized access');
  });

  it('extracts non-field errors', () => {
    const error = {
      response: {
        data: { nonFieldErrors: ['Invalid credentials'] }
      }
    };
    expect(getErrorMessage(error)).toBe('Invalid credentials');
  });

  it('formats field-specific errors correctly (CamelCase to Title Case)', () => {
    const error = {
      response: {
        data: {
          emailAddress: ['Enter a valid email']
        }
      }
    };
    expect(getErrorMessage(error)).toBe('Email Address: Enter a valid email');
  });

  it('handles network error messages from Axios', () => {
    const error = { message: 'Network Error' };
    expect(getErrorMessage(error)).toBe('Network Error');
  });

  it('ignores "code" and "detail" when searching for field errors', () => {
    const error = {
      response: {
        data: {
          code: 'AUTH_001',
          username: ['This field is required']
        }
      }
    };
    expect(getErrorMessage(error)).toBe('Username: This field is required');
  });
});
