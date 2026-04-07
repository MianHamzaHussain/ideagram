interface StatusPillProps {
  label: string;
  className?: string;
}

const StatusPill = ({ label, className = "" }: StatusPillProps) => {
  return (
    <span
      className={`inline-flex items-center justify-center h-[24px] px-3 py-1 bg-tag-bg-progress text-text-accent-orange label-xs font-bold rounded-full capitalize tracking-wider ${className}`}
    >
      {label}
    </span>
  );
};

export default StatusPill;
