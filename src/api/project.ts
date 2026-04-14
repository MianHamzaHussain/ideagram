import { apiClient } from './client';

export interface Project {
  id: number;
  name: string;
  leader?: number;
  leaderName?: string;
  architect?: number;
  architectName?: string;
  customerName?: string;
  poNumber?: string;
  csmNumber?: string;
  machineNumber?: string;
  machineName?: string;
  shipDate: string;
  status?: string;
  createdOn: string;
  modifiedOn: string;
}

export type InfiniteProjectResponse = Project[];

export interface ProjectListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Project[];
}

export const projectApi = {
  list: async (params: {
    pag_type: string;
    before_id?: number;
    page_size?: number;
    keyword?: string;
  }): Promise<InfiniteProjectResponse> => {
    const queryParams = new URLSearchParams({
      pag_type: params.pag_type,
    });

    if (params.before_id) {
      queryParams.append('before_id', params.before_id.toString());
    }

    if (params.page_size) {
      queryParams.append('page_size', params.page_size.toString());
    }

    if (params.keyword) {
      queryParams.append('keyword', params.keyword);
      queryParams.append('search_type', 'mobile');
    }

    return apiClient.get<InfiniteProjectResponse>(`project/?${queryParams.toString()}`);
  },
};


