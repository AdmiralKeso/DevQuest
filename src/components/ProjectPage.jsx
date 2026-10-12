import { useCallback, useEffect } from 'react'
import { Link } from 'react-router'
import { STACKS } from '../data/objectives.js'
import { useLinkedFolder } from '../hooks/useLinkedFolder.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { detectSteps, isAutoTracked } from '../sync/detectSteps.js'
import FolderSync from './FolderSync.jsx'
import ProgressBar from './ProgressBar.jsx'
import StackBadge from './StackBadge.jsx'

// Progress for every project is kept in one object: { [projectId]: [completed step ids] }
const asObject = (saved) => (saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {})
const completedIn = (saved, projectId) => {
  const ids = asObject(saved)[projectId]
  return Array.isArray(ids) ? ids : []
}

function useProgress(projectId) {
  const [saved, setSaved] = useLocalStorage('devquest.progress', {})
  // `update` gets the latest completed ids and returns the new ones (or the same array for no change).
  const updateCompleted = useCallback(
    (update) =>
      setSaved((prev) => {
        const current = completedIn(prev, projectId)
        const next = update(current)
        return next === current ? prev : { ...asObject(prev), [projectId]: next }
      }),
    [setSaved, projectId],
  )
  return [completedIn(saved, projectId), updateCompleted]
}

const sameIds = (a, b) => a.length === b.length && a.every((id) => b.includes(id))

export default function ProjectPage({ project }) {
  const stack = STACKS.find((s) => s.id === project.stack)
  const [completed, updateCompleted] = useProgress(project.id)
  const folder = useLinkedFolder(project.id)
  const steps = project.steps ?? []
  const syncing = folder.status === 'linked' && folder.files !== null
  const doneCount = steps.filter((s) => completed.includes(s.id)).length
  const autoCount = steps.filter(isAutoTracked).length

  // While a folder is linked, auto-tracked steps follow the files; manual steps are left alone.
  // The result is saved, so progress still shows after the folder is unlinked.
  useEffect(() => {
    if (!syncing) return
    const projectSteps = project.steps ?? []
    const detected = detectSteps(projectSteps, folder.files)
    const autoIds = projectSteps.filter(isAutoTracked).map((s) => s.id)
    updateCompleted((current) => {
      const next = [...current.filter((id) => !autoIds.includes(id)), ...detected]
      return sameIds(next, current) ? current : next
    })
  }, [syncing, folder.files, project, updateCompleted])

  function toggleStep(stepId) {
    updateCompleted((current) =>
      current.includes(stepId) ? current.filter((id) => id !== stepId) : [...current, stepId],
    )
  }

  // Project page template: every project fills the same sections, with placeholders for missing details.
  return (
    <main className="project-page">
      <header className="page-header">
        <Link to={`/stack/${stack.id}`} className="back-link">
          ← {stack.label} projects
        </Link>
        <h1>{project.title}</h1>
        <p className="project-meta">
          <StackBadge stackId={stack.id} />
          <a href={stack.docs} target="_blank" rel="noreferrer">
            {stack.label} docs ↗
          </a>
        </p>
      </header>

      <section className="project-overview">
        <h2>About this project</h2>
        <p>{project.description || 'No description yet.'}</p>
        <p>
          Built with <strong>{stack.label}</strong>: {stack.description}
        </p>
        <p>
          {steps.length} steps, {autoCount} tracked automatically when you link a folder.
        </p>
      </section>

      <section className="project-progress">
        <h2>Progress</h2>
        <ProgressBar done={doneCount} total={steps.length} />
        {steps.length > 0 && doneCount === steps.length && (
          <p className="complete">Project complete!</p>
        )}
      </section>

      <FolderSync folder={folder} autoCount={autoCount} />

      <section className="project-steps">
        <h2>Steps</h2>
        {steps.length === 0 && <p className="placeholder">No steps added yet.</p>}
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
                    disabled={auto}
                    onChange={() => toggleStep(step.id)}
                  />
                  <span>{step.title}</span>
                </label>
                {auto && (
                  <p className="step-status">{done ? 'Detected in your files' : 'Not detected yet'}</p>
                )}
                {syncing && !isAutoTracked(step) && (
                  <p className="step-status">Tick this one off yourself</p>
                )}
                {step.tip && <p className="tip">{step.tip}</p>}
              </li>
            )
          })}
        </ol>
      </section>
    </main>
  )
}
