export default function LogoMark({ size = 38 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="logo-gradient" x1="6" y1="6" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2563eb" />
          <stop offset="1" stopColor="#047857" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="#fff" />
      <g fill="none" stroke="url(#logo-gradient)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12.5C17.4 10.6 13.6 9.9 9 10.5v17c4.6-.6 8.4.1 11 2 2.6-1.9 6.4-2.6 11-2v-17c-4.6-.6-8.4.1-11 2Z" />
        <path d="M20 12.5v17" />
      </g>
    </svg>
  );
}
