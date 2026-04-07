interface DetailItemProps {
  label: string;
  value: string;
  className?: string;
}

/**
 * Standard Detail Item Row
 * Bold 16px Label, Regular 14px Value.
 */
const DetailItem = ({ label, value, className = "" }: DetailItemProps) => {
  return (
    <div className={`w-full h-[59px] py-[8px] px-4 flex flex-col gap-[4px] ${className}`}>
      <label className="font-inter font-bold text-[16px] leading-[120%] text-neutral-900 leading-trim-none">
        {label}
      </label>
      <p className="font-inter font-normal text-[14px] leading-[140%] text-neutral-900 m-0 leading-trim-none">
        {value}
      </p>
    </div>
  );
};

export default DetailItem;
