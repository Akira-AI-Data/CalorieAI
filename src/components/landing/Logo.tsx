'use client';

export function Logo({ className = '', size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Camera aperture circle */}
      <circle cx="24" cy="24" r="20" stroke="#22C55E" strokeWidth="2.5" fill="none" />
      <circle cx="24" cy="24" r="14" stroke="#22C55E" strokeWidth="1.5" fill="none" opacity="0.5" />
      {/* Aperture blades */}
      <path d="M24 4 L28 14 L24 10 Z" fill="#22C55E" opacity="0.8" />
      <path d="M41.3 14 L33 20 L35 15 Z" fill="#22C55E" opacity="0.7" />
      <path d="M41.3 34 L33 28 L37 28 Z" fill="#22C55E" opacity="0.6" />
      <path d="M24 44 L20 34 L24 38 Z" fill="#22C55E" opacity="0.8" />
      <path d="M6.7 34 L15 28 L11 32 Z" fill="#22C55E" opacity="0.7" />
      <path d="M6.7 14 L15 20 L11 16 Z" fill="#22C55E" opacity="0.6" />
      {/* Leaf overlay */}
      <path
        d="M24 12 C24 12 32 18 32 26 C32 30 28 34 24 34 C20 34 16 30 16 26 C16 18 24 12 24 12Z"
        fill="#22C55E"
        opacity="0.2"
      />
      <path
        d="M24 16 C24 16 24 30 24 32"
        stroke="#22C55E"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M24 22 C21 20 19 21 18 22"
        stroke="#22C55E"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M24 26 C27 24 29 25 30 26"
        stroke="#22C55E"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
