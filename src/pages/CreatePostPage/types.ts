import type { MediaItem } from './CreatePostPage';

export interface CreatePostFormValues {
  reportType: number;
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
