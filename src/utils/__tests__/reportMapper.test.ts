import { describe, it, expect } from 'vitest';
import { mapReportToCardProps } from '@/utils/reportMapper';
import { mockReport } from '@/test/mocks';

describe('reportMapper', () => {
  it('correctly maps a full report to card props', () => {
    const props = mapReportToCardProps(mockReport);
    
    expect(props.id).toBe(1);
    expect(props.title).toBe('Test Title');
    expect(props.description).toBe('Test Description section.');
    expect(props.project).toBe('Ideamakr Pro');
    expect(props.shippingStatus).toBe('Ship: 2026-05-20');
  });

  it('handles reports with missing descriptions', () => {
    const simpleReport = { ...mockReport, explanation: 'Just Title' };
    const props = mapReportToCardProps(simpleReport);
    
    expect(props.title).toBe('Just Title');
    expect(props.description).toBe('No description provided.');
  });

  it('categorizes tags correctly', () => {
    const props = mapReportToCardProps(mockReport);
    
    // tagType 2 should go to progressTags
    expect(props.progressTags).toContain('In Progress');
    // tagType 1 should go to general tags
    expect(props.tags).toContain('High Priority');
  });

  it('maps media correctly', () => {
    const props = mapReportToCardProps(mockReport);
    
    expect(props.images[0].url).toBe('https://example.com/img.jpg');
    expect(props.images[0].type).toBe('image');
  });
});
