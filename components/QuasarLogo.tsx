import * as React from 'react'

interface QuasarLogoProps {
  size?: number
  className?: string
}

export function QuasarLogo({ size = 64, className = '' }: QuasarLogoProps) {
  const stroke = 'url(#q-gradient)'
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      className={className}
      aria-label="Trivector Quasar Logo"
    >
      <defs>
        <radialGradient id="q-glow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#06b6d4" stopOpacity="0.35" />
          <stop offset="70%" stopColor="#8b5cf6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ec4899" stopOpacity="0.15" />
        </radialGradient>
        <linearGradient id="q-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>

      {/* cosmic glow */}
      <circle cx="100" cy="100" r="90" fill="url(#q-glow)" opacity="0.35" />

      {/* event horizon */}
      <circle cx="100" cy="100" r="26" fill="#020202" stroke={stroke} strokeWidth="2" />

      {/* accretion ring */}
      <circle cx="100" cy="100" r="54" fill="none" stroke={stroke} strokeOpacity="0.8" strokeWidth="12" />

      {/* jets */}
      <path d="M100 8 L100 68" stroke={stroke} strokeWidth="6" strokeLinecap="round" />
      <path d="M100 132 L100 192" stroke={stroke} strokeWidth="6" strokeLinecap="round" />

      {/* wabi-sabi offset ring */}
      <ellipse cx="100" cy="100" rx="78" ry="52" transform="rotate(18 100 100)" stroke={stroke} strokeWidth="1.5" opacity="0.65" />
    </svg>
  )
}
