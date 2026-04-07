/**
 * Global App Constants
 * Centralized configuration for feature flags and environment variables.
 */

// Video Upload Feature Flag
// Default to false if not explicitly set to 'true' in .env
export const IS_VIDEO_ENABLED = import.meta.env.VITE_ENABLE_VIDEO_UPLOAD === 'true';
