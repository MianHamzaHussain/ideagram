import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import Button from '@/components/Button/Button';
import { renderWithProviders } from '@/test/testUtils';

describe('Button', () => {
  it('renders children correctly', () => {
    renderWithProviders(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    renderWithProviders(<Button onClick={handleClick}>Click Me</Button>);
    
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when the disabled prop is true', () => {
    const handleClick = vi.fn();
    renderWithProviders(<Button onClick={handleClick} disabled>Disabled</Button>);
    
    const button = screen.getByText('Disabled').closest('button');
    expect(button).toBeDisabled();
    
    fireEvent.click(screen.getByText('Disabled'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders loading state and prevents clicks', () => {
    const handleClick = vi.fn();
    renderWithProviders(<Button onClick={handleClick} isLoading>Action</Button>);
    
    // Indicator (Spinner) should be visible
    expect(screen.getByRole('button')).toHaveClass('cursor-not-allowed');
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies correct variant classes', () => {
    renderWithProviders(<Button variant="primary">Primary Label</Button>);
    expect(screen.getByText('Primary Label').closest('button')).toHaveClass('bg-brand-blue');

    renderWithProviders(<Button variant="brand-outline">Outline Label</Button>);
    expect(screen.getByText('Outline Label').closest('button')).toHaveClass('border-border-brand');
  });
});
