import { useField } from 'formik';
import { useState } from 'react';
import { Eye, EyeOff } from 'react-feather';

interface TextFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  multiline?: boolean;
  height?: string;
  [x: string]: any;
}

const TextField = ({ label, type = 'text', multiline = false, height, ...props }: TextFieldProps) => {
  const [field, meta] = useField(props);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const baseClasses = `
    w-full px-4 py-3 
    bg-white border border-[#D5D5D5] rounded-xl 
    font-['Inter',sans-serif] text-[15px] text-neutral-900 
    placeholder:text-neutral-400
    focus:border-brand-blue outline-none transition-all
    ${meta.touched && meta.error ? 'border-brand-red focus:border-brand-red ring-brand-red/10' : ''}
  `;

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label 
          htmlFor={props.id || props.name} 
          className="font-['Inter',sans-serif] font-bold text-[16px] text-neutral-900 px-1"
        >
          {label}
        </label>
      )}
      <div className="relative w-full">
        {multiline ? (
          <textarea
            {...field}
            {...props}
            style={{ height: height || '120px' }}
            className={`${baseClasses} resize-none`}
          />
        ) : (
          <input
            {...field}
            {...props}
            type={inputType}
            className={`${baseClasses} h-12 pr-10`}
          />
        )}
        
        {isPassword && !multiline && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {meta.touched && meta.error ? (
        <div className="text-brand-red text-[12px] font-normal font-inter px-1">
          {meta.error}
        </div>
      ) : null}
    </div>
  );
};

export default TextField;
