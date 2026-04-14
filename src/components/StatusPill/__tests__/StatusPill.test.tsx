import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import StatusPill from '@/components/StatusPill/StatusPill';
import { renderWithProviders } from '@/test/testUtils';

describe('StatusPill', () => {
  it('renders fixed label correctly', () => {
    renderWithProviders(<StatusPill label="In Progress" />);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('applies basic styling classes', () => {
    renderWithProviders(<StatusPill label="Test" />);
    const pill = screen.getByText('Test');
    expect(pill).toHaveClass('rounded-full');
    expect(pill).toHaveClass('capitalize');
  });

  it('accepts custom className props', () => {
    renderWithProviders(<StatusPill label="Test" className="custom-class" />);
    expect(screen.getByText('Test')).toHaveClass('custom-class');
  });
});
