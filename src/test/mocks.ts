import type { Report, ReportTag, ReportMedia } from '@/api';

export const mockTag: ReportTag = {
  id: 1,
  name: 'High Priority',
  translatedName: 'Prioridad Alta',
  tagType: 1,
  tagTypeName: 'Priority'
};

export const mockReport: Report = {
  id: 1,
  projectName: 'Ideamakr Pro',
  projectShipDate: '2026-05-20',
  projectLeaderName: 'Standard Leader',
  explanation: 'Test Title\nTest Description section.',
  elapsedTime: '2 hours ago',
  authorName: 'Test User',
  commentCount: 5,
  viewerCount: 12,
  draft: false,
  reportType: 1,
  tags: [
    mockTag,
    { id: 2, name: 'In Progress', translatedName: 'En Progreso', tagType: 2, tagTypeName: 'Status' }
  ],
  media: [
    {
      id: 101,
      report: 1,
      mediaType: 'image',
      image: 'https://example.com/img.jpg',
      caption: 'Main View',
      videoUrl: '',
      videoStatus: 'completed',
      thumbnail: 'https://example.com/thumb.jpg'
    } as ReportMedia
  ]
};
