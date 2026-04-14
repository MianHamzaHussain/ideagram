import { useField } from 'formik';
import { useState } from 'react';
import { Eye, EyeOff } from 'react-feather';
import { motion, AnimatePresence } from 'framer-motion';

interface TextFieldProps {
  label: string;
  name: string;
  id?: string;
  type?: string;
  placeholder?: string;
  multiline?: boolean;
  height?: string;
  onFocus?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  [x: string]: unknown;
}

const TextField = ({ label, type = 'text', multiline = false, height, id, onFocus, onBlur, name, ...props }: TextFieldProps) => {
  const [field, meta] = useField({ name, ...props } as any);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const baseClasses = `
    w-full px-4 py-3 
    bg-white border rounded-xl 
    font-['Inter',sans-serif] text-[15px] text-neutral-900 
    placeholder:text-neutral-400
    outline-none transition-all duration-300
    ${meta.touched && meta.error
      ? 'border-brand-red ring-4 ring-brand-red/5'
      : isFocused
        ? 'border-brand-blue ring-4 ring-brand-blue/5'
        : 'border-[#D5D5D5]'
    }
  `;

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label
          htmlFor={id || name}
          className="font-['Inter',sans-serif] font-bold text-[16px] text-neutral-900 px-1"
        >
          {label}
        </label>
      )}
      <motion.div
        animate={{
          scale: isFocused ? 1.01 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative w-full"
      >
        {multiline ? (
          <textarea
            {...field}
            {...props}
            id={id || name}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              field.onBlur(e);
              onBlur?.(e);
            }}
            style={{ height: height || '120px' }}
            className={`${baseClasses} resize-none`}
          />
        ) : (
          <input
            {...field}
            {...props}
            id={id || name}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              field.onBlur(e);
              onBlur?.(e);
            }}
            type={inputType}
            className={`${baseClasses} h-12 pr-10`}
          />
        )}

        {isPassword && !multiline && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </motion.div>
      <AnimatePresence>
        {meta.touched && meta.error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-brand-red text-[12px] font-normal font-inter px-1"
          >
            {meta.error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TextField;
