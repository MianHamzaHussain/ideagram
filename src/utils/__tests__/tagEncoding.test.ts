import { describe, it, expect } from 'vitest';
import { encodeTags, decodeTags } from '@/utils/tagEncoding';
import type { Tag } from '@/api/tag';

describe('tagEncoding', () => {
  const createMockTag = (id: number, name: string, tagType: number): Tag => ({
    id,
    name,
    tagType,
    tagTypeName: `Type ${tagType}`,
    spanishName: name,
    translatedName: name,
    reportType: 1,
    colorName: 'blue',
    colorHex: '#0000FF',
    isActive: true,
    createdOn: new Date().toISOString(),
    hasInput: false
  });

  const mockTags: Tag[] = [
    createMockTag(10, 'Tag A', 1),
    createMockTag(20, 'Tag B', 1),
    createMockTag(30, 'Tag C', 2),
  ];

  it('correctly encodes a list of tags into a grouping map', () => {
    const encoded = encodeTags(mockTags);
    expect(encoded).toBeDefined();

    // Decoding it back to verify the structure
    const decoded = decodeTags(encoded!);
    expect(decoded[1]).toEqual([10, 20]);
    expect(decoded[2]).toEqual([30]);
  });

  it('returns undefined for empty tag list', () => {
    expect(encodeTags([])).toBeUndefined();
  });

  it('handles special characters in tags via UTF-8 safety trick', () => {
    const specialTagsList: Tag[] = [
      createMockTag(1, 'Café', 1)
    ];
    const encoded = encodeTags(specialTagsList);
    const decoded = decodeTags(encoded!);
    expect(decoded[1]).toEqual([1]);
  });

  it('returns empty object when decoding invalid strings', () => {
    expect(decodeTags('invalid-base64')).toEqual({});
    // @ts-expect-error - testing invalid input (null)
    expect(decodeTags(null)).toEqual({});
  });
});
