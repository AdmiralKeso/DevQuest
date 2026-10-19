import { useEffect, useId, useRef, useState } from 'react'

// Ring in the style of src/assets/images/attachments/ProgressCircle .svg: a dark grey track and a cyan arc
// (rounded ends, soft inner glow) that starts at the top and runs clockwise. It fills the box it is placed in;
// `className` can position it (e.g. `absolute inset-0` behind text).
// `percent` (0-100) sets how much is filled; it fills up from 0 when it appears and moves smoothly whenever it
// changes (no animation with reduced motion). With `percent` null only the track is drawn.
// All of its styling lives here (SVG attributes and Tailwind classes), not in App.css.
// Same proportions as the design: the ring is about a tenth of the circle's width thick.
const RADIUS = 44.5
const STROKE = 10.4
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const TRACK_COLOR = '#2E2F2E'
const ARC_COLOR = '#00C0E8'
// When the page opens, the ring waits until the page's slide-in is mostly done, then fills up.
const FILL_DELAY_MS = 400

export default function ProgressRing({ percent = null, className = '' }) {
  const id = useId()
  // Starts empty and fills to `percent` after FILL_DELAY_MS; later changes move straight to the new value.
  const [shown, setShown] = useState(0)
  const appeared = useRef(false)
  useEffect(() => {
    const delay = appeared.current ? 0 : FILL_DELAY_MS
    const timer = setTimeout(() => {
      appeared.current = true
      setShown(percent ?? 0)
    }, delay)
    return () => clearTimeout(timer)
  }, [percent])

  const filled = Math.min(100, Math.max(0, shown))

  return (
    <svg className={`progress-ring size-full ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        {/* Soft white inner glow along the arc, like the Figma design's inner shadow */}
        <filter id={`${id}-glow`} x="-10%" y="-10%" width="120%" height="120%">
          <feOffset in="SourceAlpha" dx="0.6" dy="0.6" />
          <feGaussianBlur stdDeviation="1.2" result="shadow" />
          <feComposite in="SourceAlpha" in2="shadow" operator="out" result="inner" />
          <feFlood floodColor="#fff" floodOpacity="0.35" />
          <feComposite in2="inner" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="glow" />
          </feMerge>
        </filter>
      </defs>
      <circle
        className="progress-ring-track"
        cx="50"
        cy="50"
        r={RADIUS}
        fill="none"
        stroke={TRACK_COLOR}
        strokeWidth={STROKE}
      />
      {/* Always drawn (so it can animate from empty); hidden while empty, where the round ends would leave a dot */}
      {percent !== null && (
        <circle
          className={`progress-ring-arc motion-safe:transition-[stroke-dashoffset] motion-safe:duration-1000 motion-safe:ease-out ${filled > 0 ? '' : 'invisible'}`}
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          strokeLinecap="round"
          stroke={ARC_COLOR}
          filter={`url(#${id}-glow)`}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - filled / 100)}
          transform="rotate(-90 50 50)"
        />
      )}
    </svg>
  )
}
