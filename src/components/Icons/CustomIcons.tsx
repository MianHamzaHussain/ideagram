

interface IconProps {
  size?: number | string;
  color?: string;
  className?: string;
}

/**
 * Custom Chat Icon
 * Matches the stylized teardrop speech bubble design provided by the user.
 */
export const CustomChatIcon = ({
  size = 24,
  color = 'currentColor',
  className = ''
}: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Balanced path for a stylized teardrop bubble (Tail on bottom-right) */}
      <path d="M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 13.4876 20.6397 14.8913 20 16.12L21 21L16.12 20C14.8913 20.6397 13.4876 21 12 21Z" />
    </svg>
  );
};
