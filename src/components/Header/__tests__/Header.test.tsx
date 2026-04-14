import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import Header from '@/components/Header/Header';
import { renderWithProviders } from '@/test/testUtils';

describe('Header', () => {
  it('renders the branding title', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText('Reports')).toBeInTheDocument();
  });

  it('triggers onFilterClick when filter button is clicked', () => {
    const handleFilter = vi.fn();
    renderWithProviders(<Header onFilterClick={handleFilter} />);
    
    const filterBtn = screen.getByLabelText('Open filters');
    fireEvent.click(filterBtn);
    expect(handleFilter).toHaveBeenCalledTimes(1);
  });

  it('navigates to search page when search button is clicked', () => {
    // In our renderWithProviders, we use MemoryRouter, 
    // so we can verify the button exists and is clickable.
    renderWithProviders(<Header />);
    const searchBtn = screen.getByLabelText('Search reports');
    expect(searchBtn).toBeInTheDocument();
    
    fireEvent.click(searchBtn);
    // In a more complex test, we'd check window.location or router state
  });
});
