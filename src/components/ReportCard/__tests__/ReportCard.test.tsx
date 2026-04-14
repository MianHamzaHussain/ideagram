import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import ReportCard from '@/components/ReportCard/ReportCard';
import { renderWithProviders } from '@/test/testUtils';

describe('ReportCard', () => {
  const mockProps = {
    id: 1,
    title: 'Project Alpha Report',
    project: 'Development Team',
    shippingStatus: 'Ship: 2026-12-01',
    progressTags: ['On Track'],
    tags: ['Urgent'],
    images: [{ url: 'test.jpg', type: 'image' as const }],
    commentsCount: 3,
    participantsCount: 8,
    description: 'Detailed description of the alpha progress.',
    timestamp: '5m ago',
    postedBy: 'System'
  };

  it('renders title and project information', () => {
    renderWithProviders(<ReportCard {...mockProps} />);
    expect(screen.getByText('Project Alpha Report')).toBeInTheDocument();
    expect(screen.getByText('Development Team')).toBeInTheDocument();
  });

  it('renders status and progress tags', () => {
    renderWithProviders(<ReportCard {...mockProps} />);
    expect(screen.getByText('On Track')).toBeInTheDocument();
    expect(screen.getByText('Ship: 2026-12-01')).toBeInTheDocument();
  });

  it('displays correct badge counts with accessibility labels', () => {
    renderWithProviders(<ReportCard {...mockProps} />);
    
    // Check aria-labels we added in Phase 5
    expect(screen.getByLabelText('3 comments')).toBeInTheDocument();
    expect(screen.getByLabelText('8 participants')).toBeInTheDocument();
  });

  it('contains a link to details', () => {
    renderWithProviders(<ReportCard {...mockProps} />);
    const detailLink = screen.getByRole('link', { name: /view report details/i });
    expect(detailLink).toHaveAttribute('href', '/report/1');
  });

  it('renders the call action button', () => {
    renderWithProviders(<ReportCard {...mockProps} />);
    expect(screen.getByLabelText('Call project leader')).toBeInTheDocument();
  });
});
