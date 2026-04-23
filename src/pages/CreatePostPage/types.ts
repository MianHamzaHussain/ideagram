import type { ReportType } from '@/api/report';

export interface MediaItem {
  id: string;
  dataUrl: string;
  type: 'image' | 'video';
  caption: string;
  uploaded?: boolean;
  file?: File;
}

export interface CreatePostFormValues {
  reportType: ReportType | 0;
  draft: boolean;
  daysToStop: number;
  project: string;
  tags: number[];
  title: string;
  description: string;
  date: string;
  time: string;
  media: MediaItem[];
  mentions: number[];
}
