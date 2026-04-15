import type { Report, ReportTag, ReportMedia } from '@/api';

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
  comments: never[]; // Comments are fetched separately via useComments hook
}

/**
 * Splits the raw `explanation` field into title + description.
 * Backend stores: "Title\n\nDescription body..."
 */
export const parseExplanation = (explanation: string) => {
  const parts = explanation.split('\n');
  const title = parts[0] || 'Untitled Report';
  const description = parts.slice(1).join('\n').trim() || 'No description provided.';
  return { title, description };
};

/**
 * Categorizes report tags by their tagType.
 */
export const categorizeReportTags = (tags: ReportTag[]) => {
  const statusTag = tags.find(t => t.tagType === 2)?.name;
  const trendTag = tags.find(t => t.tagType === 3)?.name;
  const generalTags = tags.filter(t => t.tagType !== 2 && t.tagType !== 3);
  const progressTags = tags.filter(t => t.tagType === 2 || t.tagType === 3).map(t => t.name);
  return { statusTag, trendTag, generalTags, progressTags };
};

/**
 * Maps report media to a simplified format.
 */
export const mapReportMedia = (media: ReportMedia[]) => {
  return media.map(m => ({
    url: m.mediaType === 'image' ? m.image : m.videoUrl,
    caption: m.caption,
    type: m.mediaType,
  }));
};

/**
 * Maps a report object to the props needed for ReportCard components.
 */
export const mapReportToCardProps = (report: Report): ReportCardProps => {
  const { title, description } = parseExplanation(report.explanation);
  const { generalTags, progressTags } = categorizeReportTags(report.tags);
  const images = mapReportMedia(report.media);

  return {
    id: report.id,
    title,
    description,
    project: report.projectName || 'General Project',
    shippingStatus: report.projectShipDate ? `Ship: ${report.projectShipDate}` : 'In Progress',
    progressTags,
    tags: generalTags.map(t => t.name),
    images,
    commentsCount: report.commentCount || 0,
    participantsCount: report.viewerCount || 0,
    timestamp: report.elapsedTime,
    postedBy: report.authorName,
    comments: [],
  };
};

