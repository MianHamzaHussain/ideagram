import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import ImageCarousel from '@/components/ImageCarousel/ImageCarousel';
import { renderWithProviders } from '@/test/testUtils';

describe('ImageCarousel', () => {
  const mockImages = [
    { url: 'img1.jpg', caption: 'Caption 1', type: 'image' as const },
    { url: 'vid1.mp4', caption: 'Video 1', type: 'video' as const },
  ];

  it('renders all images and videos with correct accessibility attributes', () => {
    renderWithProviders(<ImageCarousel images={mockImages} />);
    
    // Check main gallery container
    expect(screen.getByRole('region', { name: /media gallery/i })).toBeInTheDocument();
    
    // Check individual slides
    expect(screen.getByRole('group', { name: /slide 1 of 2/i })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /slide 2 of 2/i })).toBeInTheDocument();
  });

  it('renders image elements correctly', () => {
    renderWithProviders(<ImageCarousel images={mockImages} />);
    const img = screen.getByAltText('Caption 1');
    expect(img).toBeInTheDocument();
    expect(img.tagName).toBe('IMG');
  });

  it('renders video elements correctly', () => {
    renderWithProviders(<ImageCarousel images={mockImages} />);
    // Since video has aria-label="Video 1" or fallback
    expect(screen.getByLabelText('Video 1')).toBeInTheDocument();
  });

  it('displays captions for each slide', () => {
    renderWithProviders(<ImageCarousel images={mockImages} />);
    expect(screen.getByText('Caption 1')).toBeInTheDocument();
    expect(screen.getByText('Video 1')).toBeInTheDocument();
  });
});
