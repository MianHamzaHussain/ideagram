import { useState, useRef } from 'react';
import { useFormikContext } from 'formik';
import MediaButton from './MediaButton';
import EditMediaModal, { type EditableMedia } from './EditMediaModal';
import { CameraCaptureModal } from '@/components';
import { useMediaManager } from '@/hooks';
import { IS_VIDEO_ENABLED } from '@/utils';
import type { CreatePostFormValues } from '../types';

const StepMediaContent = () => {
  const { values, setFieldValue } = useFormikContext<CreatePostFormValues>();
  const [editingMedia, setEditingMedia] = useState<EditableMedia | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaList: EditableMedia[] = values.media || [];

  const { isCameraOpen, setIsCameraOpen, handleCapture, processFiles } = useMediaManager((item) => {
    // Functional update logic to avoid stale closures
    setFieldValue('media', [...(values.media || []), item]);
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newItems = await processFiles(e.target.files);

    // If only one item was added, open the editor for it automatically
    if (newItems.length === 1) {
      setEditingMedia(newItems[0]);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };


  const labelText = IS_VIDEO_ENABLED ? 'Add Photos or Videos' : 'Add Photos';

  const handleCameraCapture = (fileData: { type: 'image' | 'video'; dataUrl: string; file?: File }) => {
    const newItem = handleCapture(fileData);
    setEditingMedia(newItem);
  };


  const handleSaveEdit = (updatedMedia: EditableMedia) => {
    // Pull the LATEST media list from values at the moment of saving
    const currentMediaList = values.media || [];
    const newMediaList = currentMediaList.map((item) =>
      item.id === updatedMedia.id ? updatedMedia : item
    );
    setFieldValue('media', newMediaList);
    setEditingMedia(null);
  };

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFieldValue('media', mediaList.filter(item => item.id !== id));
  };

  return (
    <>
      <div className="flex flex-col gap-4 px-1 pt-2 pb-8">
        <label className="font-inter font-semibold text-[16px] leading-[24px] text-neutral-900">
          {labelText}
        </label>

        {/* Media Grid */}
        <div className="flex flex-wrap gap-4 w-full">
          <MediaButton
            type="camera"
            onClick={() => setIsCameraOpen(true)}
          />

          <MediaButton
            type="photos"
            onClick={() => fileInputRef.current?.click()}
          />

          <input
            type="file"
            multiple
            accept={IS_VIDEO_ENABLED ? "image/*,video/*" : "image/*"}
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileSelect}
          />

          {/* Uploaded Thumbnails */}
          {mediaList.map((item) => (
            <div
              key={item.id}
              className="relative w-[112px] h-[112px] rounded-[16px] overflow-hidden group cursor-pointer border border-[#D5D5D5]/50 shadow-sm"
              onClick={() => setEditingMedia(item)}
            >
              {item.type === 'image' ? (
                <img src={item.dataUrl} alt="media" className="w-full h-full object-cover" />
              ) : (
                <video
                  src={item.dataUrl}
                  className="w-full h-full object-cover"
                  preload="metadata"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              )}

              <button
                type="button"
                onClick={(e) => handleRemove(item.id, e)}
                className="absolute top-2 right-2 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center opacity-80 hover:opacity-100"
              >
                <span className="text-[12px] font-bold">×</span>
              </button>

              <div className="absolute top-[87px] left-0 w-[112px] h-[25px] bg-black/50 flex items-center gap-[8px] px-[8px] py-[4px] pointer-events-none">
                <span className="text-[#FFFFFF] font-inter font-normal text-[10px] leading-[140%] tracking-[0%] truncate w-full px-1">
                  {item.caption || "Caption required!"}
                </span>
              </div>

            </div>
          ))}
        </div>
      </div>

      {editingMedia && (
        <EditMediaModal
          media={editingMedia}
          onSave={handleSaveEdit}
          onClose={() => setEditingMedia(null)}
        />
      )}

      {isCameraOpen && (
        <CameraCaptureModal
          isOpen={isCameraOpen}
          onClose={() => setIsCameraOpen(false)}
          onCapture={handleCameraCapture}
          allowedModes={IS_VIDEO_ENABLED ? ['photo', 'video'] : ['photo']}
        />
      )}

    </>
  );
};

export default StepMediaContent;
