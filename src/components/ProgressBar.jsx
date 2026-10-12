export default function ProgressBar({ done, total }) {
  const percent = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <div className="progress">
      <div className="progress-label">
        <span>
          {done} of {total} steps
        </span>
        <span>{percent}%</span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
