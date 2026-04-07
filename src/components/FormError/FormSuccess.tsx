import { CheckCircle } from 'react-feather';

interface FormSuccessProps {
  message?: string;
  className?: string;
}

const FormSuccess = ({ message, className = '' }: FormSuccessProps) => {
  if (!message) return null;

  return (
    <div className={`flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-[8px] animate-fade-in ${className}`}>
      <CheckCircle size={18} className="text-green-600 shrink-0" />
      <span className="text-green-600 text-[14px] font-medium leading-[1.4]">
        {message}
      </span>
    </div>
  );
};

export default FormSuccess;
