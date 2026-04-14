import { apiClient } from './client';

export interface Notification {
  id: number;
  title: string;
  projectName: string;
  report: number;
  comment: number | null;
  daysToStop: number | null;
  content: string;
  thumbnail: string | null;
  createdOn: string;
  viewed: boolean;
}

export interface NotificationListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Notification[];
}

export interface UnviewedCountResponse {
  detail: string;
  count: number;
}

export const notificationApi = {
  list: async (params: { 
    type?: string; 
    before_id?: number; 
    page_size?: number 
  }): Promise<Notification[]> => {
    const queryParams = new URLSearchParams({
      type: params.type || 'mobile',
    });
    
    if (params.before_id) {
      queryParams.append('before_id', params.before_id.toString());
    }
    
    if (params.page_size) {
      queryParams.append('page_size', params.page_size.toString());
    }

    // The live API returns a flat array for 'mobile' type, matching the screenshot.
    return apiClient.get<Notification[]>(`notification/list/?${queryParams.toString()}`);
  },

  getUnviewedCount: async (): Promise<UnviewedCountResponse> => {
    return apiClient.get<UnviewedCountResponse>('count/unviewed/notifications/');
  },

  markAsViewed: async (id: number): Promise<void> => {
    return apiClient.put(`mark/notification/viewed/${id}/`, {});
  }
};
