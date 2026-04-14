import { motion } from 'framer-motion';
import Modal from './Modal';
import Button from '../Button/Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'default';
  isLoading?: boolean;
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Discard",
  cancelText = "Cancel",
  variant = 'destructive',
  isLoading = false,
}: ConfirmModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col gap-3 w-full">
        <p className="text-neutral-500 text-[16px] text-center mb-10 font-inter">
          {message}
        </p>
        <div className="flex flex-col gap-3 w-full">
          <Button 
            onClick={onClose}
            disabled={isLoading}
            className="w-full h-[54px] bg-brand-blue text-white font-inter font-bold rounded-button text-[18px]"
          >
            {cancelText}
          </Button>
          <motion.button 
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`
              w-full h-[54px] rounded-button font-inter text-[18px] transition-colors flex items-center justify-center gap-2
              ${variant === 'destructive' 
                ? 'bg-overlay-secondary text-brand-red font-medium' 
                : 'bg-overlay-secondary text-neutral-900 font-bold'}
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isLoading && (
              <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isLoading ? 'Deleting...' : confirmText}
          </motion.button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
