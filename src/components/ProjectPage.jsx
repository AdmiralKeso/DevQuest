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
  const syncing = folder.status === 'linked' && folder.files !== null
  const doneCount = project.steps.filter((s) => completed.includes(s.id)).length
  const autoCount = project.steps.filter(isAutoTracked).length

  // While a folder is linked, auto-tracked steps follow the files; manual steps are left alone.
  // The result is saved, so progress still shows after the folder is unlinked.
  useEffect(() => {
    if (!syncing) return
    const detected = detectSteps(project.steps, folder.files)
    const autoIds = project.steps.filter(isAutoTracked).map((s) => s.id)
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

  return (
    <main className="project-page">
      <header className="page-header">
        <Link to={`/stack/${stack.id}`} className="back-link">
          ← {stack.label} projects
        </Link>
        <h1>{project.title}</h1>
        <p>{project.description}</p>
        <p className="project-meta">
          <StackBadge stackId={stack.id} />
          <a href={stack.docs} target="_blank" rel="noreferrer">
            {stack.label} docs ↗
          </a>
        </p>
        <ProgressBar done={doneCount} total={project.steps.length} />
        {doneCount === project.steps.length && <p className="complete">Project complete!</p>}
      </header>

      <FolderSync folder={folder} autoCount={autoCount} />

      <ol className="steps">
        {project.steps.map((step) => {
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
              <p className="tip">{step.tip}</p>
            </li>
          )
        })}
      </ol>
    </main>
  )
}
