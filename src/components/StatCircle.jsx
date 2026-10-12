// A round stat on the project page: a big value with a label under it.
export default function StatCircle({ label, value, detail, className = '' }) {
  return (
    <div className={`stat-circle ${className}`}>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
      {detail && <span className="stat-detail">{detail}</span>}
    </div>
  )
}
