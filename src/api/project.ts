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

export interface ProjectListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Project[];
}

export const projectApi = {
  list: async (page = 1, pageSize = 50): Promise<ProjectListResponse> => {
    return apiClient.get<ProjectListResponse>(`project/?page=${page}&page_size=${pageSize}`);
  },
};
