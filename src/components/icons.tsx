type IconProps = { className?: string };

const base = "h-5 w-5";

export function IconDashboard({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}

export function IconLawyer({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.8}>
      <path d="M12 3l3 2-3 2-3-2 3-2z" />
      <path d="M12 7v3" />
      <path d="M5 21c0-3.5 3-5 7-5s7 1.5 7 5" />
      <path d="M5 10l2-3 2 3-2 4-2-4z" />
      <path d="M15 10l2-3 2 3-2 4-2-4z" />
    </svg>
  );
}

export function IconClient({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.9 3.1-6 7-6s7 2.1 7 6" />
    </svg>
  );
}

export function IconMatter({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.8}>
      <path d="M4 4h11l5 5v11a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" />
      <path d="M14 4v5h5" />
      <path d="M7 13h7M7 16h7M7 10h3" />
    </svg>
  );
}

export function IconInCharge({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.8}>
      <path d="M12 2l7 4v6c0 5-3.4 8.4-7 10-3.6-1.6-7-5-7-10V6l7-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function IconTime({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

export function IconDisbursement({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.8}>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 6v-.5A1.5 1.5 0 017.5 4h9A1.5 1.5 0 0118 5.5V6" />
    </svg>
  );
}

export function IconLeave({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M3 9h18M8 2v4M16 2v4" />
      <path d="M8 14l2.5 2.5L16 11" />
    </svg>
  );
}

export function IconInvoice({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.8}>
      <path d="M6 2h9l4 4v16H6z" />
      <path d="M15 2v4h4" />
      <path d="M9 13h6M9 17h6M9 9h2" />
    </svg>
  );
}

export function IconSettings({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.6V21a2 2 0 11-4 0v-.2a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.2a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3H9a1.7 1.7 0 001-1.6V3a2 2 0 114 0v.2a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9V9a1.7 1.7 0 001.6 1H21a2 2 0 110 4h-.2a1.7 1.7 0 00-1.5 1z" />
    </svg>
  );
}

export function IconReport({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.8}>
      <path d="M6 2h9l4 4v16H6z" />
      <path d="M15 2v4h4" />
      <path d="M9 12v5M12 9v8M15 14v3" />
    </svg>
  );
}

export function IconSubadmin({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.8}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5" />
      <path d="M16 4.5c1.7.4 3 2 3 3.9 0 1.9-1.3 3.5-3 3.9" />
      <path d="M21 20c0-2.5-1.6-4-4-4.6" />
    </svg>
  );
}

export function IconChevron({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={2}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function IconLogout({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.8}>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

export function IconPlus({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={2.2}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconLocation({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.8}>
      <path d="M12 21s7-6.5 7-11.5a7 7 0 10-14 0C5 14.5 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

export function IconHoliday({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M3 9h18M8 2v4M16 2v4" />
      <circle cx="12" cy="14" r="2.5" />
    </svg>
  );
}
