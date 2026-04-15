/**
 * Generates up to 2 uppercase initials from a name string.
 * @param name The full name to extract initials from.
 * @returns A string containing the initials (e.g., "John Doe" -> "JD").
 */
export const getInitials = (name?: string): string => {
  if (!name) return '?';
  
  return name
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Formats a date string as a human-readable relative time (e.g., "5m ago", "2h ago").
 */
export const formatRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

