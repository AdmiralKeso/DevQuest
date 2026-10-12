import { useState } from 'react'
import { isAutoTracked } from '../sync/detectSteps.js'

// A checklist of steps. With `pageSize`, it shows that many at a time with < > buttons.
export default function StepList({ steps, completed, syncing, onToggle, pageSize, emptyText }) {
  const [page, setPage] = useState(0)
  const pageCount = pageSize ? Math.max(1, Math.ceil(steps.length / pageSize)) : 1
  const current = Math.min(page, pageCount - 1)
  const first = pageSize ? current * pageSize : 0
  const visible = pageSize ? steps.slice(first, first + pageSize) : steps

  if (steps.length === 0) return <p className="placeholder">{emptyText}</p>

  return (
    <>
      <ol className="steps" start={first + 1}>
        {visible.map((step) => {
          const done = completed.includes(step.id)
          const auto = syncing && isAutoTracked(step)
          return (
            <li key={step.id} className={`step ${done ? 'done' : ''} ${auto ? 'auto' : ''}`}>
              <label className="step-title">
                <input
                  type="checkbox"
                  checked={done}
                  disabled={auto}
                  onChange={() => onToggle(step.id)}
                />
                <span>{step.title}</span>
              </label>
              {auto && (
                <span className="step-status">{done ? 'Detected in your files' : 'Not detected yet'}</span>
              )}
            </li>
          )
        })}
      </ol>

      {pageCount > 1 && (
        <nav className="pager" aria-label="Pages">
          <button
            type="button"
            onClick={() => setPage(current - 1)}
            disabled={current === 0}
            aria-label="Previous page"
          >
            &lt;
          </button>
          <span>
            {current + 1} / {pageCount}
          </span>
          <button
            type="button"
            onClick={() => setPage(current + 1)}
            disabled={current === pageCount - 1}
            aria-label="Next page"
          >
            &gt;
          </button>
        </nav>
      )}
    </>
  )
}
