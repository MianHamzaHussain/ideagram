import { type ReactNode } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  fullHeight?: boolean;
}

const BottomSheet = ({ isOpen, onClose, children, fullHeight = false }: BottomSheetProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex flex-col justify-end items-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/40 animate-in fade-in duration-300 pointer-events-auto" 
        onClick={onClose}
      />
      
      {/* Sheet Content */}
      <div className={`
        relative w-full max-w-[600px] bg-white rounded-t-[32px] overflow-hidden 
        animate-in slide-in-from-bottom duration-300 flex flex-col transition-all
        ${fullHeight ? 'h-full' : 'max-h-[90%]'}
      `}>
        {children}
      </div>
    </div>
  );
};

export default BottomSheet;
