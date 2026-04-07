import { type Comment as CommentType } from '../api/comment';

export interface ReportType {
  id: number;
  type: 'progress' | 'problem';
  title: string;
  project: string;
  shippingStatus: string;
  progressTags: string[];
  tags: string[];
  images: { url: string; caption?: string }[];
  commentsCount: number;
  participantsCount: number;
  description: string;
  timestamp: string;
  postedBy: string;
  comments: CommentType[];
  // New fields for detail page
  completionDateTime: string;
  status: string;
  trend: string;
  mentions: { name: string; avatarUrl: string }[];
}

export const mockReports: ReportType[] = [
  {
    id: 1,
    type: 'progress',
    title: 'Q3 Progress Report',
    project: 'Silverwood Expansion',
    shippingStatus: 'Shipped in 3 days',
    progressTags: ['Good', 'Better'],
    tags: ['Processor', 'Memory Module', 'Solid State Drive'],
    images: [
      { url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80', caption: 'Delayed component inventory' },
      { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80', caption: 'Site bottleneck area' },
      { url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80', caption: 'Maintenance delay equipment' },
    ],
    commentsCount: 4,
    participantsCount: 3,
    description: 'The foundation for the Silverwood Expansion project has been successfully completed ahead of schedule. Our teams are now transitioning to the steel structure assembly phase, which is expected to take approximately two weeks. Weather conditions have been favorable, allowing for continuous work throughout the day.',
    timestamp: '1 day ago',
    postedBy: 'John Doe',
    completionDateTime: '10/28/2026 03:00 PM',
    status: 'Good',
    trend: 'Better',
    mentions: [
      { name: 'Brynn Elmore', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
      { name: 'Evelyn Hayes', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop' },
      { name: 'Garrett Winters', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' }
    ],
    comments: [
      { id: 1, report: 1, authorName: 'Evelyn Hayes', elapsedTime: '12 min', text: 'Robotic arm #27 is malfunctioning, causing bottlenecks in the assembly line. Restarted the system, but the issue persists. Contacting the robotics specialist for assistance. Updates every 20.', createdOn: '2026-03-31T14:18:23Z', media: [] },
      { id: 2, report: 1, authorName: 'Garrett Winters', elapsedTime: '17 min', text: 'Experiencing issues with the automated welding station on Line 4. Welds are inconsistent, causing delays. Investigating potential calibration drift. Awaiting diagnostics from the maintenance team. Updates in 20.', createdOn: '2026-03-31T14:18:23Z', media: [] },
      { id: 3, report: 1, authorName: 'Amelia Earhart', elapsedTime: '21 min', text: 'Paint booth #3 is experiencing temperature fluctuations, leading to uneven coating. Adjusting the climate control settings. Monitoring closely for improvement. Next update in 20 minutes.', createdOn: '2026-03-31T14:18:23Z', media: [] },
      { id: 4, report: 1, authorName: 'Brynn Elmore', elapsedTime: '28 min', text: 'Conveyor belt system in Sector 7 is showing signs of wear. There are concerns about potential breakdowns. Requesting inspection and preventative maintenance. Updates to follow in 20.', createdOn: '2026-03-31T14:18:23Z', media: [] }
    ]
  },
  {
    id: 2,
    type: 'progress',
    title: 'Andovar Project Update',
    project: 'Silverwood Expansion',
    shippingStatus: 'Shipped in 9 days',
    progressTags: ['Good', 'Better'],
    tags: ['Processor', 'Memory Module', 'Solid State Drive'],
    images: [
      { url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80', caption: 'Delayed component inventory' },
      { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80', caption: 'Site bottleneck area' },
      { url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80', caption: 'Maintenance delay equipment' },
    ],
    commentsCount: 4,
    participantsCount: 3,
    description: 'We have initiated the night shift staging to accelerate the interior framing process. The aerial progress shot shows the overall site organization and the successful arrival of the initial shipment of materials. Safety protocols are being strictly enforced as we increase site activity during evening hours.',
    timestamp: '2 days ago',
    postedBy: 'John Doe',
    completionDateTime: '10/28/2026 03:00 PM',
    status: 'Good',
    trend: 'Better',
    mentions: [
      { name: 'Brynn Elmore', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
      { name: 'Evelyn Hayes', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop' },
      { name: 'Garrett Winters', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' }
    ],
    comments: [
      { id: 1, report: 2, authorName: 'Evelyn Hayes', elapsedTime: '12 min', text: 'Robotic arm #27 is malfunctioning, causing bottlenecks in the assembly line. Restarted the system, but the issue persists. Contacting the robotics specialist for assistance. Updates every 20.', createdOn: '2026-03-31T14:18:23Z', media: [] },
      { id: 2, report: 2, authorName: 'Garrett Winters', elapsedTime: '17 min', text: 'Experiencing issues with the automated welding station on Line 4. Welds are inconsistent, causing delays. Investigating potential calibration drift. Awaiting diagnostics from the maintenance team. Updates in 20.', createdOn: '2026-03-31T14:18:23Z', media: [] },
      { id: 3, report: 2, authorName: 'Amelia Earhart', elapsedTime: '21 min', text: 'Paint booth #3 is experiencing temperature fluctuations, leading to uneven coating. Adjusting the climate control settings. Monitoring closely for improvement. Next update in 20 minutes.', createdOn: '2026-03-31T14:18:23Z', media: [] },
      { id: 4, report: 2, authorName: 'Brynn Elmore', elapsedTime: '28 min', text: 'Conveyor belt system in Sector 7 is showing signs of wear. There are concerns about potential breakdowns. Requesting inspection and preventative maintenance. Updates to follow in 20.', createdOn: '2026-03-31T14:18:23Z', media: [] }
    ]
  },
  {
    id: 3,
    type: 'problem',
    title: 'Escalation Report',
    project: 'Bloomfield Outpost',
    shippingStatus: 'Delayed 5 days',
    progressTags: ['Critical', 'Action Required'],
    tags: ['Processor', 'Memory Module', 'Solid State Drive'],
    images: [
      { url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80', caption: 'Delayed component inventory' },
      { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80', caption: 'Site bottleneck area' },
      { url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80', caption: 'Maintenance delay equipment' },
    ],
    commentsCount: 12,
    participantsCount: 5,
    description: 'On Wednesday, November 15th, at approximately 08:30 hours, a network disruption occurred in the Willow Creek building, affecting wired connections. Initial investigations suggest a problem with the local fiber link. Diagnostics are underway to pinpoint the cause and restore connectivity. Updates will be provided every 20 minutes.',
    timestamp: '12 days ago',
    postedBy: 'Jeremy Clarkson',
    completionDateTime: '10/28/2026 03:00 PM',
    status: 'Good',
    trend: 'Better',
    mentions: [
      { name: 'Brynn Elmore', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
      { name: 'Evelyn Hayes', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop' },
      { name: 'Garrett Winters', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' }
    ],
    comments: [
      { id: 1, report: 3, authorName: 'Garrett Winters', elapsedTime: '17 min', text: 'Experiencing issues with the automated welding station on Line 4. Welds are inconsistent, causing delays. Investigating potential calibration drift. Awaiting diagnostics from the maintenance team. Updates in 20.', createdOn: '2026-03-31T14:18:23Z', media: [] },
      { id: 2, report: 3, authorName: 'Amelia Earhart', elapsedTime: '21 min', text: 'Paint booth #3 is experiencing temperature fluctuations, leading to uneven coating. Adjusting the climate control settings. Monitoring closely for improvement. Next update in 20 minutes.', createdOn: '2026-03-31T14:18:23Z', media: [] },
      { id: 3, report: 3, authorName: 'Evelyn Hayes', elapsedTime: '12 min', text: 'Robotic arm #27 is malfunctioning, causing bottlenecks in the assembly line. Restarted the system, but the issue persists. Contacting the robotics specialist for assistance. Updates every 20.', createdOn: '2026-03-31T14:18:23Z', media: [] },
      { id: 4, report: 3, authorName: 'Brynn Elmore', elapsedTime: '28 min', text: 'Conveyor belt system in Sector 7 is showing signs of wear. There are concerns about potential breakdowns. Requesting inspection and preventative maintenance. Updates to follow in 20.', createdOn: '2026-03-31T14:18:23Z', media: [] },
      { id: 5, report: 3, authorName: 'Evelyn Hayes', elapsedTime: '5 min', text: 'Just confirmed with the team, additional parts are on the way. We should be back at 100% capacity by tomorrow morning.', createdOn: '2026-03-31T14:18:23Z', media: [] }
    ]
  },
];
