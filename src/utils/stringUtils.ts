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
