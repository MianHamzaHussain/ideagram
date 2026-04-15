import { create } from 'zustand';

export interface FilterState {
  reportType: 'progress' | 'trouble';
  keyword: string;
  tagIds: number[];
  tagsMap: Record<number, number[]>;
  projectId: number | undefined;
  
  // Actions
  setReportType: (type: 'progress' | 'trouble') => void;
  setKeyword: (keyword: string) => void;
  setFilters: (filters: { tagIds: number[]; tagsMap: Record<number, number[]> }) => void;
  setProjectId: (projectId: number | undefined) => void;
  reset: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  reportType: 'progress',
  keyword: '',
  tagIds: [],
  tagsMap: {},
  projectId: undefined,

  setReportType: (reportType) => set({ reportType }),
  
  setKeyword: (keyword) => set({ keyword }),

  setFilters: ({ tagIds, tagsMap }) => set({ tagIds, tagsMap }),

  setProjectId: (projectId) => set({ projectId }),

  reset: () => set({
    reportType: 'progress',
    keyword: '',
    tagIds: [],
    tagsMap: {},
    projectId: undefined,
  }),
}));
