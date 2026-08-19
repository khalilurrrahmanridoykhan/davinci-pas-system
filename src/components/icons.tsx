import type { SVGProps } from 'react'

const base: SVGProps<SVGSVGElement> = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

// A hexagonal seal with a checkmark -- "authorization granted," the app's
// own subject matter, rather than a generic abstract mark.
export function BrandMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M16 2 28 9v14l-12 7-12-7V9z"
        fill="var(--accent-glow)"
        stroke="var(--accent)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M11 16.5l3.4 3.4L21.5 12.5" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconPatient(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.2-4 4-6 7.5-6s6.3 2 7.5 6" />
    </svg>
  )
}

export function IconProvider(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <circle cx="12" cy="10" r="2.2" />
      <path d="M8 17c0.7-2 2-3 4-3s3.3 1 4 3" />
    </svg>
  )
}

export function IconPackage(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3 20 7.5v9L12 21 4 16.5v-9z" />
      <path d="M4 7.5 12 12l8-4.5" />
      <path d="M12 12v9" />
    </svg>
  )
}

export function IconClipboard(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 011-1h4a1 1 0 011 1v1" />
      <path d="M8.5 12.5l2.2 2.2L15.5 10" />
    </svg>
  )
}

export function IconFlag(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M6 21V4" />
      <path d="M6 4c1.6-1.2 3.4-1.2 5 0s3.4 1.2 5 0v9c-1.6 1.2-3.4 1.2-5 0s-3.4-1.2-5 0" />
    </svg>
  )
}

export function IconCheckCircle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.3 12.3l2.5 2.5 5-5.2" />
    </svg>
  )
}

export function IconXCircle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5l5 5m0-5l-5 5" />
    </svg>
  )
}

export function IconClockPending(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  )
}

export function IconAlertTriangle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4 21.5 20h-19z" />
      <path d="M12 10.5v3.5" />
      <path d="M12 17h.01" />
    </svg>
  )
}
