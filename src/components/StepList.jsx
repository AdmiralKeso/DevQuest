import { isAutoTracked } from '../sync/detectSteps.js'
import CodeText from './CodeText.jsx'

// A checklist of steps. Auto-tracked steps can only be ticked by the linked repository.
export default function StepList({ steps, completed, syncing, onToggle, emptyText }) {
  if (steps.length === 0) return <p className="placeholder">{emptyText}</p>

  return (
    <ol className="steps">
      {steps.map((step) => {
        const done = completed.includes(step.id)
        const auto = syncing && isAutoTracked(step)
        return (
          <li key={step.id} className={`step ${done ? 'done' : ''} ${auto ? 'auto' : ''}`}>
            <label className="step-title">
              <input
                type="checkbox"
                checked={done}
                disabled={isAutoTracked(step)}
                onChange={() => onToggle(step.id)}
              />
              <span>
                <CodeText text={step.title} />
              </span>
            </label>
            {auto && (
              <span className="step-status">{done}</span>
            )}
          </li>
        )
      })}
    </ol>
  )
}
