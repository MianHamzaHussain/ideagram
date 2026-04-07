import { AlertCircle } from 'react-feather';

interface FormErrorProps {
  message?: string;
  className?: string;
}

const FormError = ({ message, className = '' }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div className={`flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-[8px] animate-fade-in ${className}`}>
      <AlertCircle size={18} className="text-red-500 shrink-0" />
      <span className="text-red-500 text-[14px] font-medium leading-[1.4]">
        {message}
      </span>
    </div>
  );
};

export default FormError;
