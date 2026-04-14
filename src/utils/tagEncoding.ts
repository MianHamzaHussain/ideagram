import type { Tag } from '../api/tag';

/**
 * Encodes a flat list of tags into the backend-required Base64 JSON map format.
 * Format: { "tagTypeId": [tagId1, tagId2] } -> JSON -> Base64
 */
export const encodeTags = (selectedTags: Tag[]) => {
  if (!selectedTags.length) return undefined;

  const groups: Record<number, number[]> = {};
  
  selectedTags.forEach((tag) => {
    if (!groups[tag.tagType]) {
      groups[tag.tagType] = [];
    }
    groups[tag.tagType].push(tag.id);
  });

  try {
    const jsonString = JSON.stringify(groups);
    // Use the mobile-prescribed encoding trick for UTF-8 compatibility
    return btoa(unescape(encodeURIComponent(jsonString)));
  } catch (error) {
    console.error('Failed to encode tags:', error);
    return undefined;
  }
};

/**
 * Decodes the tag group map (optional, for debugging or complex states)
 */
export const decodeTags = (encoded: string) => {
  try {
    const jsonString = decodeURIComponent(escape(atob(encoded)));
    return JSON.parse(jsonString) as Record<number, number[]>;
  } catch (error) {
    console.error('Failed to decode tags:', error);
    return {};
  }
};
