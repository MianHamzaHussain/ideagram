import { describe, it, expect, vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import LoginPage from '@/pages/LoginPage/LoginPage';
import { renderWithProviders } from '@/test/testUtils';

// Mock mutation since we are testing page structure and basic flow
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useMutation: () => ({
      mutate: vi.fn(),
      isPending: false,
    }),
  };
});

describe('LoginPage', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders login heading and form fields', () => {
    const { getByRole, getByLabelText } = renderWithProviders(<LoginPage />);
    
    expect(getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(getByLabelText(/email address/i, { selector: 'input' })).toBeInTheDocument();
    expect(getByLabelText(/password/i, { selector: 'input' })).toBeInTheDocument();
    expect(getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('contains forgot password link', () => {
    const { getByText } = renderWithProviders(<LoginPage />);
    const link = getByText(/forgot your password\?/i);
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/forgot-password');
  });
});
