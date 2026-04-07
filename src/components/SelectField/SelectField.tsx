import { ChevronDown } from 'react-feather';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: string[] | SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

/**
 * A themed dropdown/select field with a custom chevron.
 */
const SelectField = ({ label, value, options, onChange, placeholder = 'Select...', isLoading = false }: SelectFieldProps) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="font-['Inter',sans-serif] font-bold text-[14px] text-neutral-900 px-1">
          {label}
        </label>
      )}
      <div className="relative group">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-full h-12 px-4 
            appearance-none 
            bg-white border border-[#D5D5D5] rounded-xl 
            font-['Inter',sans-serif] text-[15px] text-neutral-900 
            focus:border-brand-blue outline-none transition-all
            cursor-pointer
          "
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => {
            const isObject = typeof option === 'object';
            const label = isObject ? option.label : option;
            const val = isObject ? option.value : option;
            
            return (
              <option key={val} value={val}>
                {label}
              </option>
            );
          })}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 group-focus-within:text-brand-blue transition-colors">
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-neutral-200 border-t-brand-blue rounded-full animate-spin" />
          ) : (
            <ChevronDown size={20} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectField;
