import { describe, it, expect, vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import HomePage from '@/pages/HomePage/HomePage';
import { renderWithProviders } from '@/test/testUtils';
import { mockReport } from '@/test/mocks';

// Mock the hook that fetches reports
vi.mock('@/hooks', async () => {
  const actual = await vi.importActual('@/hooks');
  return {
    ...actual,
    useInfiniteReports: () => ({
      data: {
        pages: [[mockReport]],
      },
      isLoading: false,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
    }),
    useUnviewedCount: () => ({ data: 0 }),
    useAuth: () => ({ isAuthenticated: true }),
  };
});

describe('HomePage', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the header and report feed', () => {
    const { getByText } = renderWithProviders(<HomePage />);

    // Header title
    expect(getByText('Reports')).toBeInTheDocument();

    // Report Card from mock data
    expect(getByText('Test Title')).toBeInTheDocument();
  });

  it('displays the new post button in the footer', () => {
    const { getByLabelText } = renderWithProviders(<HomePage />);
    const fab = getByLabelText(/new post/i);
    expect(fab).toBeInTheDocument();
    expect(fab.closest('a')).toHaveAttribute('href', '/create-post');
  });
});
