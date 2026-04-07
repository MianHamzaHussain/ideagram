import { ArrowLeft } from 'react-feather';

interface ModalHeaderProps {
  title: string;
  onBack: () => void;
  className?: string;
}

/**
 * Shared Header for Modals and Detail Pages
 * Consistent with SF Pro font and ArrowLeft icon.
 */
const ModalHeader = ({ title, onBack, className = "" }: ModalHeaderProps) => {
  return (
    <header className={`flex flex-col bg-white pb-2 pt-3 px-4 shrink-0 sticky top-0 z-10 border-b border-transparent ${className}`}>
      <div className="flex items-center relative h-8 w-full">
        <button
          onClick={onBack}
          className="absolute left-0 p-1 hover:bg-neutral-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20.25} className="text-neutral-900" />
        </button>
        <h1 className="w-full text-center font-['SF_Pro',sans-serif] font-[590] text-[17px] leading-[22px] tracking-[-0.43px] text-neutral-900 truncate">
          {title}
        </h1>
      </div>
    </header>
  );
};

export default ModalHeader;
