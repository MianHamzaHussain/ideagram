import type { Report } from '../api/report';

export interface ReportCardProps {
  id: number;
  title: string;
  project: string;
  shippingStatus: string;
  progressTags: string[];
  tags: string[];
  images: { url: string; caption?: string; type: 'image' | 'video' }[];
  commentsCount: number;
  participantsCount: number;
  description: string;
  timestamp: string;
  postedBy: string;
  comments: any[]; // API might not have comments yet, keeping it empty for now
}

export const mapReportToCardProps = (report: Report): ReportCardProps => {
  const parts = report.explanation.split('\n');
  const title = parts[0] || 'Untitled Report';
  const description = parts.slice(1).join('\n').trim() || 'No description provided.';

  // Mapping tags: Intelligently categorize by tagType
  const progressTags = report.tags
    .filter(t => t.tagType === 2 || t.tagType === 3)
    .map(t => t.name);
    
  const generalTags = report.tags
    .filter(t => t.tagType !== 2 && t.tagType !== 3)
    .map(t => t.name);

  const images = report.media.map(m => ({
    url: m.mediaType === 'image' ? m.image : m.videoUrl,
    caption: m.caption,
    type: m.mediaType
  }));

  return {
    id: report.id,
    title,
    description,
    project: report.projectName || 'General Project',
    shippingStatus: report.projectShipDate ? `Ship: ${report.projectShipDate}` : 'In Progress',
    progressTags,
    tags: generalTags,
    images: images as any,
    commentsCount: report.commentCount || 0,
    participantsCount: report.viewerCount || 0,
    timestamp: report.elapsedTime,
    postedBy: report.authorName,
    comments: [],
  };
};
