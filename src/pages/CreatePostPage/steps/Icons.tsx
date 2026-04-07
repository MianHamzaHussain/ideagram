/**
 * Exact 80x80 Progress Identity Icon (Green Check)
 */
export const ProgressIcon = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="40" fill="#36B37E" />
    <path 
      d="M25 40L35 50L55 30" 
      stroke="white" 
      strokeWidth="6" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);

/**
 * Exact 80x80 Problem Identity Icon (Orange rounded triangle with exclamation)
 */
export const ProblemIcon = () => (
  <svg width="80" height="106" viewBox="0 0 80 106" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M32.8523 3.51817C35.9189 -1.171 42.7562 -1.171 45.8228 3.51817L78.6946 53.7744C81.9961 58.8219 78.4358 65.5925 72.5093 65.5925H6.16584C0.23933 65.5925 -3.321 58.8219 -0.0195048 53.7744L32.8523 3.51817Z" 
      fill="#FF991F" 
    />
    <rect x="36" y="20" width="8" height="22" rx="4" fill="white" />
    <circle cx="40" cy="52" r="4" fill="white" />
  </svg>
);

// Note: Problem icon height adjusted to align better in a 80x80 square. 
// I'll wrap them in an 80x80 div for consistent clickable area.
