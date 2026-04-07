import { type ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Overlay Backdrop */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-[340px] bg-white rounded-[20px] p-6 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col items-center">
        {title && (
          <h2 className="text-[18px] font-bold text-neutral-900 mb-4 text-center">{title}</h2>
        )}
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
