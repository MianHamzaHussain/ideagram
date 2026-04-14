import { motion } from 'framer-motion';
import { ArrowLeft, X } from 'react-feather';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  showBack?: boolean;
  backIcon?: 'arrow' | 'close';
  sticky?: boolean;
  className?: string;
  variant?: 'default' | 'creation' | 'modal';
  isPWA?: boolean;
  centered?: boolean;
  showBorder?: boolean;
  showHandle?: boolean;
  leftElement?: React.ReactNode;
}

/**
 * Universal Header for all pages and modals.
 * Supports PWA safe areas, centered/left-aligned layouts, and multiple variants.
 */
const PageHeader = ({
  title,
  onBack,
  rightElement,
  showBack = true,
  backIcon = 'arrow',
  sticky = true,
  className = "",
  variant = 'default',
  isPWA = true,
  centered = true,
  showBorder,
  showHandle = false,
  leftElement,
}: PageHeaderProps) => {
  const navigate = useNavigate();

  const isCreation = variant === 'creation';
  const shouldShowBorder = showBorder !== undefined ? showBorder : !isCreation;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className={`
      flex flex-col bg-white shrink-0 z-[100] w-full
      ${sticky ? 'sticky top-0' : ''}
      ${isPWA && !showHandle ? 'pt-[env(safe-area-inset-top,0px)]' : ''}
      ${showHandle ? 'rounded-t-[32px]' : ''}
      ${shouldShowBorder ? 'border-b border-neutral-100' : ''}
      ${className}
    `}>
      {showHandle && (
        <motion.button 
          whileTap={{ opacity: 0.6 }}
          type="button"
          onClick={handleBack}
          className="flex justify-center items-start w-full h-[24px] pt-[12px] shrink-0 transition-opacity focus:outline-none"
          aria-label="Close modal"
        >
          <div
            className="w-[36px] h-[5px] rounded-[100px] bg-[#CCCCCC]"
            style={{ mixBlendMode: 'plus-darker' as React.CSSProperties['mixBlendMode'] }}
          />
        </motion.button>
      )}

      <div className={`flex items-center relative h-[60px] px-4 w-full ${centered ? 'justify-between' : 'justify-start gap-3'}`}>
        {leftElement ? (
          <div className="z-10">{leftElement}</div>
        ) : showBack ? (
          <motion.button
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            type="button"
            onClick={handleBack}
            className="p-2 -ml-2 text-neutral-900 z-10 focus:outline-none"
          >
            {backIcon === 'arrow' ? (
              <ArrowLeft size={24} strokeWidth={2.5} />
            ) : (
              <X size={24} strokeWidth={2.5} />
            )}
          </motion.button>
        ) : null}

        {centered ? (
          <h1 className={`
            absolute left-1/2 -translate-x-1/2 w-full text-center truncate px-16 pointer-events-none
            ${isCreation
              ? "font-inter font-bold text-[18px] text-[#000000]"
              : "font-sf-pro font-[590] text-[17px] tracking-[-0.43px] text-neutral-900"
            }
          `}>
            {title}
          </h1>
        ) : (
          <h1 className={`
            truncate font-inter font-bold text-[18px] text-neutral-900
          `}>
            {title}
          </h1>
        )}

        <div className={`flex items-center gap-2 min-w-[24px] z-20 ${!centered ? 'flex-1' : ''}`}>
          {rightElement}
          {(!rightElement && centered && showBack) && <div className="w-6" />}
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
