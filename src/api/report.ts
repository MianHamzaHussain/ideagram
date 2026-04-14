import { apiClient } from './client';

export interface ReportMetadata {
  explanation: string;
  reportType: number;
  notifiedUsers: number[];
  project: number;
  reportDate: string; // ISO string
  tags: number[];
  draft: boolean;
  daysToStop?: number;
}

export interface ReportTag {
  id: number;
  name: string;
  translatedName: string;
  tagType: number;
  tagTypeName: string;
}

export interface ReportMedia {
  id: number;
  report: number;
  mediaType: 'image' | 'video';
  caption: string;
  image: string;
  videoUrl: string;
  videoStatus: string;
  thumbnail: string;
}

export interface Report {
  id: number;
  explanation: string;
  reportType: number;
  authorName: string;
  elapsedTime: string;
  tags: ReportTag[];
  media: ReportMedia[];
  draft: boolean;
  commentCount: number;
  viewerCount: number;
  projectName: string;
  projectShipDate: string;
  projectLeaderName: string;
}

export type InfiniteReportResponse = Report[];

export const reportApi = {
  create: async (data: ReportMetadata): Promise<Report> => {
    return apiClient.post<Report>('report/', data);
  },

  uploadMedia: async (reportId: number, mediaItem: {
    file: File;
    caption?: string;
    mediaType: 'image' | 'video'
  }): Promise<void> => {
    const formData = new FormData();

    formData.append('report', reportId.toString());
    formData.append('mediaType', mediaItem.mediaType);
    formData.append('caption', mediaItem.caption || '');

    if (mediaItem.mediaType === 'image') {
      formData.append('image', mediaItem.file);
    } else {
      formData.append('video', mediaItem.file);
    }

    return apiClient.post('media/', formData);
  },

  publish: async (reportId: number): Promise<void> => {
    return apiClient.put(`publish/report/${reportId}/`, {});
  },

  list: async (params: {
    pag_type: string;
    before_id?: number;
    report_type?: 'progress' | 'trouble';
    page_size?: number;
    keyword?: string;
    project_id?: number;
    tags?: Record<number, number[]>; // Map of tagTypeId -> tagIds[]
  }): Promise<InfiniteReportResponse> => {
    const queryParams = new URLSearchParams({
      pag_type: params.pag_type,
    });

    if (params.before_id) {
      queryParams.append('before_id', params.before_id.toString());
    }

    if (params.report_type) {
      queryParams.append('report_type', params.report_type);
    }

    if (params.page_size) {
      queryParams.append('page_size', params.page_size.toString());
    }

    if (params.keyword) {
      queryParams.append('keyword', params.keyword);
      queryParams.append('search_type', 'mobile');
    }

    if (params.project_id) {
      queryParams.append('project_id', params.project_id.toString());
    }

    if (params.tags && Object.keys(params.tags).length > 0) {
      // Advanced Filtering: Base64-encoded JSON map
      const jsonString = JSON.stringify(params.tags);
      const encodedTags = btoa(unescape(encodeURIComponent(jsonString)));
      queryParams.append('tags', encodedTags);
    }

    return apiClient.get<InfiniteReportResponse>(`report/?${queryParams.toString()}`);
  },


  getById: async (id: number): Promise<Report> => {
    return apiClient.get<Report>(`report/${id}/`);
  },

  getNotifiedUsers: async (id: number): Promise<NotifiedUsers> => {
    return apiClient.get<NotifiedUsers>(`report/${id}/notified-users/`);
  },

  markAsViewed: async (id: number): Promise<{ detail: string }> => {
    return apiClient.put(`mark/report/notifications/viewed/${id}/`, {});
  },

  getViewers: async (params: { reportId: number; before_id?: number; page_size?: number; pag_type?: string }): Promise<Viewer[]> => {
    const queryParams = new URLSearchParams({
      report_id: params.reportId.toString(),
    });
    if (params.before_id) queryParams.append('before_id', params.before_id.toString());
    if (params.page_size) queryParams.append('page_size', params.page_size.toString());
    if (params.pag_type) queryParams.append('pag_type', params.pag_type);

    return apiClient.get<Viewer[]>(`report/viewers/list/?${queryParams.toString()}`);
  },

  addViewer: async (reportId: number): Promise<{ detail: string }> => {
    return apiClient.post<{ detail: string }>('add/viewer/report/', { report: reportId });
  },
};

export interface NotifiedUsers {
  id: number;
  notifiedUsers: number[];
  notifiedUsersExtra: {
    id: number;
    name: string;
  }[];
}

export interface Viewer {
  id: number;
  user: number;
  userName: string;
  footprint: string; // ISO String
  elapsedTime: string;
}
