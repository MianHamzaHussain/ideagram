import { apiClient } from './client';

export interface CommentMedia {
  id: number;
  mediaType: 'image' | 'video' | string; // Keep string for fallback resilience
  image?: string;
  videoUrl?: string;
  videoStatus?: string;
  thumbnail: string;
}

export interface Comment {
  id: number;
  report: number;
  text: string;
  authorName: string;
  elapsedTime: string;
  createdOn: string;
  media: CommentMedia[];
}

export const commentApi = {
  list: async (params: { 
    report: number; 
    page_size: number; 
    before_id?: number; 
    pag_type?: string;
  }): Promise<Comment[]> => {
    const queryParams = new URLSearchParams({
      report: params.report.toString(),
      page_size: params.page_size.toString(),
    });

    if (params.before_id) {
      queryParams.append('before_id', params.before_id.toString());
    }

    if (params.pag_type) {
      queryParams.append('pag_type', params.pag_type);
    }

    return apiClient.get<Comment[]>(`comment/?${queryParams.toString()}`);
  },
  create: async (data: { report: number; text: string }): Promise<Comment> => {
    return apiClient.post<Comment>('comment/', data);
  },
  update: async (id: number, data: { report: number; text: string }): Promise<Comment> => {
    return apiClient.patch<Comment>(`comment/${id}/`, data);
  },
  delete: async (id: number): Promise<void> => {
    return apiClient.delete(`comment/${id}/`);
  },
  publish: async (id: number): Promise<void> => {
    return apiClient.put(`publish/comment/${id}/`, {});
  },
};
