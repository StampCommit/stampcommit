import { type ReactNode } from "react";

interface IconProps {
  size?: number;
  className?: string;
}

export function BluetoothIcon({ size = 24, className }: IconProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M6.5 6.5l11 11L12 23V1l5.5 5.5-11 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MobileIcon({ size = 24, className }: IconProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <line x1="12" y1="18" x2="12.01" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function CpuIcon({ size = 24, className }: IconProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <line x1="9" y1="1" x2="9" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="15" y1="1" x2="15" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="9" y1="20" x2="9" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="15" y1="20" x2="15" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="20" y1="9" x2="23" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="20" y1="15" x2="23" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="1" y1="9" x2="4" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="1" y1="15" x2="4" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function CloudIcon({ size = 24, className }: IconProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PrinterIcon({ size = 24, className }: IconProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 9V2h12v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="6" y="14" width="12" height="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function RadioIcon({ size = 24, className }: IconProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16.24 7.76a6 6 0 0 1 0 8.49" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7.76 16.24a6 6 0 0 1 0-8.49" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4.93 19.07a10 10 0 0 1 0-14.14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ZapIcon({ size = 24, className }: IconProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SparklesIcon({ size = 24, className }: IconProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Map icon keys to components
const ICON_MAP: Record<string, (props: IconProps) => ReactNode> = {
  bluetooth: BluetoothIcon,
  mobile: MobileIcon,
  cpu: CpuIcon,
  cloud: CloudIcon,
  printer: PrinterIcon,
  radio: RadioIcon,
  zap: ZapIcon,
  sparkles: SparklesIcon,
};

export function Icon({ name, ...props }: IconProps & { name: string }): ReactNode {
  const IconComponent = ICON_MAP[name];
  if (!IconComponent) return null;
  return <IconComponent {...props} />;
}
