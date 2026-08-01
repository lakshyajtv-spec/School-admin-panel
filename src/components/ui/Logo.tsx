export function Logo({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="lg-shield" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#175a99" />
          <stop offset="100%" stopColor="#0c3c66" />
        </linearGradient>
        <linearGradient id="lg-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f3dd97" />
          <stop offset="55%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#f7e8b4" />
        </linearGradient>
      </defs>
      <path
        d="M32 3.5 57 12v22c0 13.6-10.2 23.6-25 27.5C17.2 57.6 7 47.6 7 34V12L32 3.5Z"
        fill="url(#lg-shield)"
        stroke="url(#lg-gold)"
        strokeWidth="2.2"
      />
      <path
        d="M32 17.5 46.5 24 32 30.5 17.5 24 32 17.5Z"
        fill="url(#lg-gold)"
      />
      <path
        d="M22 27.5v8.2c0 3.6 4.5 6.3 10 6.3s10-2.7 10-6.3v-8.2"
        fill="none"
        stroke="url(#lg-gold)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M46.5 24v9"
        stroke="url(#lg-gold)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="46.5" cy="35" r="2.2" fill="url(#lg-gold)" />
      <path
        d="M24 47h16"
        stroke="url(#lg-gold)"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity=".8"
      />
    </svg>
  );
}
