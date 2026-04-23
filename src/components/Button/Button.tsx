import { motion, type HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'navy' | 'brand-outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'xl' | 'full';
  isLoading?: boolean;
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = 'xl',
  isLoading = false,
  className = '',
  ...props
}: ButtonProps) => {
  const sizeStyles = {
    sm: 'px-4 py-2 h-[36px] text-sm',
    md: 'px-6 py-[14px] h-[48px] text-base',
    lg: 'px-8 py-4 h-[56px] text-lg',
  };

  const baseStyles = `w-full cursor-pointer transition-colors duration-200 ripple flex items-center justify-center gap-2 font-inter font-bold select-none focus:outline-none 
    ${sizeStyles[size]}
    ${rounded === 'full' ? 'rounded-button' : 'rounded-xl'}`;

  const variantStyles = {
    primary: 'bg-brand-blue text-white hover:bg-primary-400 border-none',
    secondary: 'bg-neutral-50 text-neutral-900 hover:bg-neutral-100 border-none',
    outline: 'border border-primary-300 text-primary-300 hover:bg-primary-50',
    navy: 'bg-[#004777] text-white hover:bg-[#00365a] border-none',
    'brand-outline': 'border border-border-brand text-border-brand bg-transparent hover:bg-primary-50 shadow-sm',
    destructive: 'bg-destructive text-white hover:opacity-90 border-none',
  };

  const disabledStyles = 'opacity-50 grayscale cursor-not-allowed transform-none';

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${props.disabled || isLoading ? disabledStyles : ''} ${className}`;

  return (
    <motion.button
      whileTap={props.disabled || isLoading ? {} : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={combinedClassName}
      disabled={props.disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </div>
      ) : children}
    </motion.button>
  );
};

export default Button;
