import { useCallback, useEffect } from 'react'
import { Link } from 'react-router'
import { STACKS } from '../data/objectives.js'
import { useLinkedFolder } from '../hooks/useLinkedFolder.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { detectSteps, isAutoTracked } from '../sync/detectSteps.js'
import FolderSync from './FolderSync.jsx'
import StackBadge from './StackBadge.jsx'
import StatCircle from './StatCircle.jsx'
import StepList from './StepList.jsx'

const OBJECTIVES_PER_PAGE = 5

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
  const tracked = steps.filter(isAutoTracked)
  const manual = steps.filter((s) => !isAutoTracked(s))
  const syncing = folder.status === 'linked' && folder.files !== null
  const doneCount = steps.filter((s) => completed.includes(s.id)).length
  const percent = steps.length === 0 ? 0 : Math.round((doneCount / steps.length) * 100)

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

  const listProps = { completed, syncing, onToggle: toggleStep }

  // Project page template: every project fills the same sections, with placeholders for missing details.
  return (
    <main className="project-page">
      <header className="page-header">
        <Link to={`/stack/${stack.id}`} className="back-link">
          ← {stack.label} projects
        </Link>
        <h1>{project.title}</h1>
        <p>{project.description || 'No description yet.'}</p>
        <p className="project-meta">
          <StackBadge stackId={stack.id} />
          <a href={stack.docs} target="_blank" rel="noreferrer">
            {stack.label} docs ↗
          </a>
        </p>
      </header>

      <div className="project-layout">
        <div className="project-main">
          <section className="stats">
            <StatCircle
              className="stat-progress"
              label="All objectives progress"
              value={`${percent}%`}
              detail={`${doneCount} of ${steps.length} steps`}
            />
            {/* Placeholders until these stats are defined. */}
            <StatCircle className="stat-knowledge" label="Knowledge" value="-" />
            <StatCircle className="stat-redundant" label="Redundant" value="-" />
            <StatCircle className="stat-complexity" label="Complexity" value="-" />
          </section>
          {steps.length > 0 && doneCount === steps.length && (
            <p className="complete">Project complete!</p>
          )}

          <section className="objectives">
            <h2>All objectives</h2>
            <p className="section-note">Ticked off automatically when you link your project folder.</p>
            <StepList
              {...listProps}
              steps={tracked}
              pageSize={OBJECTIVES_PER_PAGE}
              emptyText="No objectives that can be tracked yet."
            />
          </section>
        </div>

        <aside className="project-panel">
          <FolderSync folder={folder} />

          <section className="todo">
            <h2>To do</h2>
            <p className="section-note">Not detectable from files, tick these off yourself.</p>
            <StepList {...listProps} steps={manual} emptyText="Nothing to tick off by hand." />
          </section>
        </aside>
      </div>
    </main>
  )
}
