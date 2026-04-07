import { apiClient } from './client';

export interface Tag {
  id: number;
  name: string;
  spanishName: string;
  translatedName: string;
  reportType: number;
  tagType: number;
  tagTypeName: string;
  colorName: string;
  colorHex: string;
  isActive: boolean;
  createdOn: string;
  hasInput: boolean;
}

export interface TagListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Tag[];
  totalPages: number;
  page: number;
}

export const tagApi = {
  list: async (reportType: number, pageSize = 50): Promise<TagListResponse> => {
    // report_type: 1 for Problem, 2 for Progress
    const reportTypeParam = reportType === 1 ? 'problem' : 'progress';
    return apiClient.get<TagListResponse>(
      `tag/?report_type=${reportTypeParam}&page_size=${pageSize}&show_inactive=false&pag_type=standard`
    );
  },
};
