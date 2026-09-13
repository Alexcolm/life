interface LogoProps {
  size?: number
  className?: string
}

/** Marca propia: cuadrado redondeado con degradé de marca + una "L" geométrica. */
export function Logo({ size = 32, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="LIFE"
    >
      <defs>
        <linearGradient id="life-logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5eb1ff" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#life-logo-grad)" />
      <path
        d="M11 8.5v11.4h9.2"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="21.2" cy="8.6" r="1.9" fill="white" />
    </svg>
  )
}
