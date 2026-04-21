import { useState, useRef, useEffect } from 'react';
import { X, Edit3, Activity, Square, Circle, Trash2 } from 'react-feather';
import { Button, PageHeader } from '@/components';
import { dataUrlToFile } from '@/utils';
import { useModalStore } from '@/store';

export interface EditableMedia {
  id: string;
  dataUrl: string;
  type: 'image' | 'video';
  caption: string;
  file?: File;
}



interface EditMediaModalProps {
  media: EditableMedia;
  onSave: (updatedMedia: EditableMedia) => void;
  onClose: () => void;
  onDiscard?: (id: string) => void;
}

const EditMediaModal = ({ media, onSave, onClose, onDiscard }: EditMediaModalProps) => {
  const [view, setView] = useState<'draw' | 'caption'>('caption');
  const [caption, setCaption] = useState(media.caption || '');
  const [isDrawingMode] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isModified, setIsModified] = useState(false);
  const [activeTool, setActiveTool] = useState<'free' | 'rect' | 'circle'>('free');
  const [strokeColor, setStrokeColor] = useState('#FFFFFF');
  const [strokeWidth, setStrokeWidth] = useState<'small' | 'medium' | 'large'>('small');

  // We need to keep a reference to the latest canvas state for the preview
  const [previewUrl, setPreviewUrl] = useState(media.dataUrl);
  const [editedFile, setEditedFile] = useState<File | undefined>(media.file);

  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const snapshotRef = useRef<ImageData | null>(null);

  // Check if any changes were made compared to initial state
  const hasChanges = previewUrl !== media.dataUrl || caption !== (media.caption || '');

  useEffect(() => {
    if (media.type === 'image' && view === 'draw') {
      const img = new Image();
      img.onload = () => {
        if (canvasRef.current) {
          canvasRef.current.width = img.width;
          canvasRef.current.height = img.height;
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
          }
        }
      };
      img.src = previewUrl;
    }
  }, [media, view, previewUrl]);

  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingMode) return;
    isDrawing.current = true;
    const pos = getCoordinates(e);
    lastPos.current = pos;
    startPos.current = pos;
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        snapshotRef.current = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
    if (e.pointerId) {
      canvasRef.current?.setPointerCapture(e.pointerId);
    }
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !isDrawingMode || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const currentPos = getCoordinates(e);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = strokeColor;
    const baseWidth = Math.max(8, canvasRef.current.width * 0.008);
    ctx.lineWidth = strokeWidth === 'small' ? baseWidth * 0.5 : strokeWidth === 'large' ? baseWidth * 2 : baseWidth;

    if (activeTool === 'free') {
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(currentPos.x, currentPos.y);
      ctx.stroke();
      lastPos.current = currentPos;
    } else {
      if (snapshotRef.current) {
        ctx.putImageData(snapshotRef.current, 0, 0);
      }
      const width = currentPos.x - startPos.current.x;
      const height = currentPos.y - startPos.current.y;
      ctx.beginPath();
      if (activeTool === 'rect') {
        ctx.rect(startPos.current.x, startPos.current.y, width, height);
      } else if (activeTool === 'circle') {
        const radiusX = Math.abs(width / 2);
        const radiusY = Math.abs(height / 2);
        const centerX = startPos.current.x + width / 2;
        const centerY = startPos.current.y + height / 2;
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
      }
      ctx.stroke();
    }
    setIsModified(true);
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawing.current = false;
    if (e.pointerId && canvasRef.current?.hasPointerCapture(e.pointerId)) {
      canvasRef.current?.releasePointerCapture(e.pointerId);
    }
  };

  const clearDrawing = () => {
    if (!canvasRef.current || media.type !== 'image') return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      ctx.drawImage(img, 0, 0);
      setIsModified(false);
      snapshotRef.current = null;
    };
    img.src = media.dataUrl;
  };

  const handleFinishDrawing = () => {
    if (isModified && canvasRef.current && media.type === 'image') {
      const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.9);
      setPreviewUrl(dataUrl);
      const newFile = dataUrlToFile(dataUrl, `edited_${media.id}.jpg`);
      setEditedFile(newFile);
    }
    setIsModified(false); // Reset modified state after saving to preview
    setView('caption');
  };

  const handleSave = () => {
    onSave({
      ...media,
      caption: caption,
      dataUrl: previewUrl,
      file: editedFile
    });
  };

  const { openConfirm } = useModalStore();

  const handleCloseRequest = () => {
    if (hasChanges) {
      openConfirm({
        title: 'Discard changes?',
        message: 'Are you sure you want to discard your changes? This action cannot be undone.',
        confirmText: 'Discard',
        onConfirm: () => {
          if (onDiscard) onDiscard(media.id);
          onClose();
        },
        variant: 'destructive'
      });
    } else {
      onClose();
    }
  };

  const renderDrawView = () => (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col max-w-[600px] mx-auto overflow-hidden animate-in slide-in-from-right-8 duration-300">
      {/* Custom Minimal Header */}
      <div className="flex items-center px-4 h-[60px] shrink-0 mt-[env(safe-area-inset-top,0px)] z-50">
        <button type="button" onClick={() => setView('caption')} className="p-2 -ml-2 text-white active:opacity-50 transition-opacity focus:outline-none">
          <X size={24} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col relative w-full bg-black">
        <div
          ref={containerRef}
          className="relative flex-1 bg-black overflow-hidden flex items-center justify-center w-full"
        >
          {media.type === 'image' ? (
            <>
              <canvas
                ref={canvasRef}
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerCancel={stopDrawing}
                onPointerOut={stopDrawing}
                style={{ touchAction: 'none' }}
                className="w-full h-full object-contain cursor-crosshair"
              />

              {/* Centered Floating Toolbar */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 w-fit pointer-events-none">
                <div className="flex items-center justify-center gap-1.5 p-1.5 bg-black/40 backdrop-blur-md rounded-full pointer-events-auto border border-white/10 shadow-lg">
                  {/* Shapes */}
                  <button type="button" onClick={() => setActiveTool('free')} className={`w-[32px] h-[32px] rounded-full flex items-center justify-center transition-all ${activeTool === 'free' ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}>
                    <Activity size={18} />
                  </button>
                  <button type="button" onClick={() => setActiveTool('rect')} className={`w-[32px] h-[32px] rounded-full flex items-center justify-center transition-all ${activeTool === 'rect' ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}>
                    <Square size={18} />
                  </button>
                  <button type="button" onClick={() => setActiveTool('circle')} className={`w-[32px] h-[32px] rounded-full flex items-center justify-center transition-all ${activeTool === 'circle' ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}>
                    <Circle size={18} />
                  </button>

                  <div className="w-[1px] h-4 bg-white/20 mx-0.5" />

                  {/* Color */}
                  <div className="relative flex items-center justify-center bg-white/10 rounded-full w-[32px] h-[32px] shrink-0">
                    <div className="w-[18px] h-[18px] rounded-full shrink-0 border border-white/40 pointer-events-none shadow-sm" style={{ backgroundColor: strokeColor }} />
                    <select
                      value={strokeColor}
                      onChange={(e) => setStrokeColor(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    >
                      <option value="#FFFFFF">White</option>
                      <option value="#000000">Black</option>
                      <option value="#FF3B30">Red</option>
                      <option value="#34C759">Green</option>
                      <option value="#007AFF">Blue</option>
                      <option value="#FFCC00">Yellow</option>
                    </select>
                  </div>

                  {/* Size */}
                  <div className="relative flex items-center justify-center bg-white/10 rounded-full w-[32px] h-[32px] shrink-0">
                    <div className="font-inter font-bold text-[13px] text-white pointer-events-none uppercase">
                      {strokeWidth[0]}
                    </div>
                    <select
                      value={strokeWidth}
                      onChange={(e) => setStrokeWidth(e.target.value as 'small' | 'medium' | 'large')}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    >
                      <option value="small">S</option>
                      <option value="medium">M</option>
                      <option value="large">L</option>
                    </select>
                  </div>

                  <div className="w-[1px] h-4 bg-white/20 mx-0.5" />

                  {/* Trash */}
                  <button type="button" onClick={clearDrawing} disabled={!isModified} className="flex items-center justify-center w-[32px] h-[32px] text-white disabled:opacity-40 hover:bg-white/10 rounded-full transition-colors">
                    <Trash2 size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <video
              src={media.dataUrl}
              controls
              autoPlay
              muted
              playsInline
              loop
              preload="auto"
              className="w-full h-full object-contain shadow-2xl"
            />
          )}
        </div>
      </div>

      <footer className="shrink-0 py-4 px-6 bg-black mb-[env(safe-area-inset-bottom,0px)] flex justify-center">
        <Button
          type="button"
          onClick={handleFinishDrawing}
          rounded="full"
          className="w-full !bg-white !text-[#1F2122] font-bold text-[16px] h-[48px] shadow-xl"
        >
          Finish Editing
        </Button>
      </footer>
    </div>
  );

  const renderCaptionView = () => (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col max-w-[600px] mx-auto overflow-hidden animate-in slide-in-from-right-8 duration-300">
      <PageHeader
        title="Edit Media"
        onBack={handleCloseRequest}
        backIcon="arrow"
        variant="creation"
        centered={true}
      />

      <div className="flex-1 px-6 pt-6 overflow-y-auto">
        <div className="flex flex-col gap-2 mb-6">
          <label className="font-inter font-bold text-[16px] text-neutral-900">
            Caption
          </label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Add a required caption"
            className="w-full h-[48px] bg-white border border-[#D5D5D5] rounded-[8px] px-4 font-inter text-[15px] outline-none focus:border-brand-blue"
          />
        </div>

        <div className="relative w-full aspect-square bg-neutral-50 rounded-[16px] overflow-hidden flex items-center justify-center border border-neutral-100">
          {media.type === 'image' ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          ) : (
            <video
              src={media.dataUrl}
              className="w-full h-full object-contain"
              controls
              autoPlay
              muted
              playsInline
              loop
              preload="metadata"
            />
          )}

          {media.type === 'image' && (
            <button
              type="button"
              onClick={() => setView('draw')}
              className="absolute top-4 right-4 w-[40px] h-[40px] bg-black/60 text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            >
              <Edit3 size={20} />
            </button>
          )}
        </div>
      </div>

      <footer className="shrink-0 p-6 bg-white border-t border-neutral-100 mb-[env(safe-area-inset-bottom,0px)]">
        <Button
          type="button"
          onClick={handleSave}
          disabled={!caption.trim()}
          className="w-full h-[54px] font-bold text-[18px]"
          rounded="full"
        >
          Continue
        </Button>
      </footer>
    </div>
  );

  return (
    <>
      {view === 'draw' ? renderDrawView() : renderCaptionView()}
    </>
  );
};

export default EditMediaModal;
