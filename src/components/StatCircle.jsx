import ProgressRing from './ProgressRing.jsx'

// A round stat on the project page: the value (e.g. a percentage) inside a ProgressRing filled to `percent`
// (null for an empty track, e.g. a skill with no steps), with the label (optional) under the ring.
// With `onClick` it's a button (e.g. a skill ring that scrolls to its category in "All objectives").
export default function StatCircle({ label, value, percent = null, className = '', onClick, selected = false }) {
  const content = (
    <>
      <span className="stat-disc">
        <ProgressRing percent={percent} className="absolute inset-0" />
        <span className="stat-value">{value}</span>
      </span>
      {label && <span className="stat-label">{label}</span>}
    </>
  )

  if (!onClick) return <div className={`stat-circle ${className}`}>{content}</div>

  return (
    <button
      type="button"
      className={`stat-circle ${className} ${selected ? 'selected' : ''}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      {content}
    </button>
  )
}
