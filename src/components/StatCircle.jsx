// A round stat on the project page: the title, with the value (e.g. a percentage) under it.
// With `onClick` it's a button (e.g. a skill ring that scrolls to its category in "All objectives").
export default function StatCircle({ label, value, className = '', onClick, selected = false }) {
  const content = (
    <>
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
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
