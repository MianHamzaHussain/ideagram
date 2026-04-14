import { describe, it, expect, beforeEach } from 'vitest';
import { useFilterStore } from '@/store/useFilterStore';

describe('useFilterStore', () => {
  beforeEach(() => {
    useFilterStore.setState({
      reportType: 'progress',
      tagIds: []
    });
  });

  it('correctly updates the report type', () => {
    useFilterStore.getState().setReportType('trouble');
    expect(useFilterStore.getState().reportType).toBe('trouble');
  });

  it('updates tags correctly via setFilters', () => {
    const mockFilters = { tagIds: [10, 20], tagsMap: { 1: [10, 20] } };
    useFilterStore.getState().setFilters(mockFilters);
    
    expect(useFilterStore.getState().tagIds).toEqual([10, 20]);
    expect(useFilterStore.getState().tagsMap[1]).toEqual([10, 20]);
  });

  it('resets filters correctly', () => {
    useFilterStore.getState().setReportType('trouble');
    useFilterStore.getState().setFilters({ tagIds: [5], tagsMap: {} });
    
    useFilterStore.getState().reset();
    
    const state = useFilterStore.getState();
    expect(state.reportType).toBe('progress');
    expect(state.tagIds).toHaveLength(0);
  });
});
