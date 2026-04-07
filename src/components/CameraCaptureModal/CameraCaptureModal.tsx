import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, RefreshCw } from 'react-feather';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (fileData: { type: 'image' | 'video'; dataUrl: string; file?: File }) => void;
  allowedModes?: ('photo' | 'video')[];
}

const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  allowedModes = ['photo', 'video']
}) => {
  const [mode, setMode] = useState<'photo' | 'video'>(allowedModes[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const wantsVideo = allowedModes.includes('video');

  const startCamera = useCallback(async () => {
    stopCamera();
    try {
      const constraints = {
        video: { facingMode },
        audio: wantsVideo
      };
      
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (err) {
        if (constraints.audio) {
          console.warn('Audio permission denied, falling back to video only.', err);
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode }, audio: false });
        } else {
          throw err;
        }
      }

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setHasPermission(false);
    }
  }, [facingMode, wantsVideo, stopCamera]);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setIsRecording(false);
    }
    return () => stopCamera();
  }, [isOpen, startCamera, stopCamera]);

  const toggleFacingMode = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Handle mirroring for user camera so saved photo reflects what they saw
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      // Also provide the blob as a File for better upload performance
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
          onCapture({ type: 'image', dataUrl, file });
        } else {
          onCapture({ type: 'image', dataUrl });
        }
      }, 'image/jpeg', 0.9);
    }
  };

  const handleStartRecording = () => {
    if (!streamRef.current) return;
    chunksRef.current = [];
    
    // Fallback mimeTypes
    const mimeTypes = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'];
    let selectedMimeType = '';
    for (const type of mimeTypes) {
      if (MediaRecorder.isTypeSupported(type)) {
        selectedMimeType = type;
        break;
      }
    }

    const options = selectedMimeType ? { mimeType: selectedMimeType } : undefined;
    
    try {
      mediaRecorderRef.current = new MediaRecorder(streamRef.current, options);
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const fallbackType = MediaRecorder.isTypeSupported('video/mp4') ? 'video/mp4' : 'video/webm';
        const blob = new Blob(chunksRef.current, { type: selectedMimeType || fallbackType });
        
        // Use object URL. Base64 encoding massive Video Blobs can silently crash mobile browsers.
        const videoUrl = URL.createObjectURL(blob);
        const videoFile = new File([blob], `video_${Date.now()}.mp4`, { type: blob.type });
        onCapture({ type: 'video', dataUrl: videoUrl, file: videoFile });
      };
      
      // 200ms slices guarantee iOS explicitly flushes chunks into ondataavailable
      mediaRecorderRef.current.start(200);
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const onActionClick = () => {
    if (mode === 'photo') {
      handleCapturePhoto();
    } else {
      if (isRecording) {
        handleStopRecording();
      } else {
        handleStartRecording();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-black flex flex-col animate-in fade-in duration-300">
      {/* Top Header (40px + Safe Area to prevent notch overlap) */}
      <div className="flex items-center justify-between w-full shrink-0 px-[16px] bg-[#000000] z-20 h-[calc(env(safe-area-inset-top,0px)+40px)] pt-[env(safe-area-inset-top,0px)]">
        <button type="button" onClick={onClose} className="p-1 text-white hover:text-gray-300 transition-colors flex items-center justify-center">
          <X size={24} />
        </button>
        <button type="button" onClick={toggleFacingMode} disabled={isRecording} className="p-1 text-white hover:text-gray-300 transition-colors disabled:opacity-50 flex items-center justify-center">
          <RefreshCw size={24} />
        </button>
      </div>

      {/* Main Video Area (Flexes perfectly between Header and Footer bounds) */}
      <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        {hasPermission === false && (
          <div className="absolute inset-x-8 text-center text-white z-20">
            <p className="font-semibold text-[18px] mb-2">Camera Access Denied</p>
            <p className="text-[14px] text-neutral-400">Please enable camera permissions in your settings.</p>
            <button type="button" onClick={startCamera} className="mt-4 px-6 py-2 bg-white text-black font-bold rounded-full text-[14px]">
              Request Permission
            </button>
          </div>
        )}
        
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover"
          style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
        />
        
        {/* Rec indicator */}
        {isRecording && (
          <div className="absolute top-4 mt-4 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-sm z-20 animate-pulse">
            <div className="w-2.5 h-2.5 bg-brand-red rounded-full" />
            <span className="text-white text-[13px] font-bold tracking-wider">REC</span>
          </div>
        )}

        {/* Action Button */}
        <div className="absolute bottom-6 inset-x-0 flex flex-col items-center justify-end pointer-events-none z-20">
          <button 
            type="button"
            onClick={onActionClick}
            className={`pointer-events-auto relative flex items-center justify-center transition-all duration-300 focus:outline-none w-20 h-20 ${!hasPermission && 'opacity-50 pointer-events-none'}`}
          >
            {/* Outer Ring */}
            <div className={`absolute inset-0 rounded-full border-[4px] border-white transition-all
               ${isRecording ? 'scale-110 opacity-50' : 'scale-100 opacity-100'}
            `} />
            
            {/* Inner Fill */}
            <div className={`bg-[#FF3B30] transition-all duration-300
               ${mode === 'photo' ? 'w-[60px] h-[60px] rounded-full hover:scale-95' : (isRecording ? 'w-[28px] h-[28px] rounded-[6px]' : 'w-[60px] h-[60px] rounded-full hover:scale-95')}
            `} />
          </button>
        </div>
      </div>

      {/* Mode Selector Footer */}
      <div className="bg-[#000000] shrink-0 w-full h-[calc(env(safe-area-inset-bottom,0px)+96px)] pb-[env(safe-area-inset-bottom,0px)] flex items-center justify-center gap-[16px] z-30">
        {allowedModes.length > 1 && !isRecording && (
          <>
            <button 
              type="button"
              className={`min-w-[100px] h-[40px] rounded-full font-['Inter',sans-serif] font-bold text-[16px] leading-[24px] tracking-[0%] text-center flex items-center justify-center transition-colors px-[16px] py-[8px] ${mode === 'photo' ? 'bg-[#FFFFFF] text-[#1F2122]' : 'bg-[#000000] text-[#AAADB1]'}`}
              onClick={() => setMode('photo')}
            >
              Photo
            </button>
            <button 
              type="button"
              className={`min-w-[100px] h-[40px] rounded-full font-['Inter',sans-serif] font-bold text-[16px] leading-[24px] tracking-[0%] text-center flex items-center justify-center transition-colors px-[16px] py-[8px] ${mode === 'video' ? 'bg-[#FFFFFF] text-[#1F2122]' : 'bg-[#000000] text-[#AAADB1]'}`}
              onClick={() => setMode('video')}
            >
              Video
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CameraCaptureModal;
