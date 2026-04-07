import { apiClient } from './client';

export interface SimpleUser {
  id: number;
  name: string;
}

export const userApi = {
  fetchSimpleUsers: async (params: { 
    project_id?: string; 
    author_id?: number; 
    keyword?: string 
  }): Promise<SimpleUser[]> => {
    const queryParams = new URLSearchParams();
    if (params.project_id) queryParams.append('project_id', params.project_id);
    if (params.author_id) queryParams.append('author_id', params.author_id.toString());
    if (params.keyword) queryParams.append('keyword', params.keyword);

    return apiClient.get<SimpleUser[]>(`simple-user/list/?${queryParams.toString()}`);
  },
};
