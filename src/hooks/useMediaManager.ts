import { useCallback } from 'react';
import { IS_VIDEO_ENABLED } from '@/utils';
import { useModalStore } from '@/store';

export interface ManagedMedia {
  id: string;
  dataUrl: string;
  type: 'image' | 'video';
  caption: string;
  file?: File;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

/**
 * Custom hook to manage media selection and capturing across the app.
 * Provides a unified way to handle gallery selection and camera capture.
 */
export const useMediaManager = (onAddMedia?: (media: ManagedMedia) => void) => {
  const { openCamera, closeCamera } = useModalStore();

  const handleCapture = useCallback((fileData: { type: 'image' | 'video'; dataUrl: string; file?: File }) => {
    const newItem: ManagedMedia = {
      id: generateId(),
      dataUrl: fileData.dataUrl,
      type: fileData.type,
      caption: '',
      file: fileData.file,
    };
    if (onAddMedia) {
      onAddMedia(newItem);
    }
    closeCamera();
    return newItem;
  }, [onAddMedia, closeCamera]);

  const processFiles = useCallback(async (files: FileList): Promise<ManagedMedia[]> => {
    const newItems: ManagedMedia[] = [];
    const readPromises = Array.from(files).map((file) => {
      const isVideo = file.type.startsWith('video');

      // Skip video files if disabled
      if (isVideo && !IS_VIDEO_ENABLED) return Promise.resolve();

      return new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const item: ManagedMedia = {
            id: generateId(),
            dataUrl: reader.result as string,
            type: isVideo ? 'video' : 'image',
            caption: '',
            file: file, // Keep the original File
          };
          newItems.push(item);
          if (onAddMedia) onAddMedia(item);
          resolve();
        };
        reader.readAsDataURL(file);
      });
    });

    await Promise.all(readPromises);
    return newItems;
  }, [onAddMedia]);


  return {
    openCamera,
    handleCapture,
    processFiles,
  };
};
