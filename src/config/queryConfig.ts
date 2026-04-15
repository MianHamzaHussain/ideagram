/** React Query stale time constants (in milliseconds) */
export const STALE_TIME = {
  /** 1 minute — for highly dynamic data like unviewed counts */
  SHORT: 1000 * 60,
  /** 5 minutes — standard default for most data */
  DEFAULT: 1000 * 60 * 5,
  /** 1 hour — for near-static metadata like projects and tags */
  LONG: 1000 * 60 * 60,
} as const;

/** Standard pagination sizes */
export const PAGE_SIZE = {
  FEED: 10,
  COMMENTS: 5,
  VIEWERS: 5,
  PROJECTS: 50,
} as const;

/** Refetch intervals */
export const REFETCH_INTERVAL = {
  NOTIFICATIONS: 1000 * 60 * 2, // 2 minutes
} as const;
