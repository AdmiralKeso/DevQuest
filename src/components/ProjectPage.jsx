import { Link } from 'react-router'
import { STACKS } from '../data/objectives.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import ProgressBar from './ProgressBar.jsx'
import StackBadge from './StackBadge.jsx'

// Progress for every project is kept in one object: { [projectId]: [completed step ids] }
function useProgress(projectId) {
  const [saved, setSaved] = useLocalStorage('devquest.progress', {})
  const progress = saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {}
  const completed = Array.isArray(progress[projectId]) ? progress[projectId] : []
  const setCompleted = (ids) => setSaved({ ...progress, [projectId]: ids })
  return [completed, setCompleted]
}

export default function ProjectPage({ project }) {
  const stack = STACKS.find((s) => s.id === project.stack)
  const [completed, setCompleted] = useProgress(project.id)
  const doneCount = project.steps.filter((s) => completed.includes(s.id)).length

  function toggleStep(stepId) {
    setCompleted(
      completed.includes(stepId) ? completed.filter((id) => id !== stepId) : [...completed, stepId],
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

      <ol className="steps">
        {project.steps.map((step) => {
          const done = completed.includes(step.id)
          return (
            <li key={step.id} className={`step ${done ? 'done' : ''}`}>
              <label className="step-title">
                <input type="checkbox" checked={done} onChange={() => toggleStep(step.id)} />
                <span>{step.title}</span>
              </label>
              <p className="tip">{step.tip}</p>
            </li>
          )
        })}
      </ol>
    </main>
  )
}
