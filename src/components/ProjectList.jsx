import { STACKS, getProjectsForStack } from '../data/objectives.js'
import ProjectCard from './ProjectCard.jsx'

// `stackId` is a stack, 'all', or 'in-progress' (shows `inProgress`: projects linked and not completed).
export default function ProjectList({ stackId = 'all', inProgress = [] }) {
  const stack = STACKS.find((s) => s.id === stackId)
  const showInProgress = stackId === 'in-progress'
  const projects = showInProgress ? inProgress : getProjectsForStack(stackId)

  let title = 'What do you want to build?'
  let description = 'Pick a project, or choose a tech stack on the left to narrow it down.'
  if (stack) {
    title = `Projects with ${stack.label}`
    description = stack.description
  } else if (showInProgress) {
    title = 'Projects in progress'
    description = 'Projects you have started by linking a GitHub repository and not completed yet.'
  }

  return (
    <main className="project-list">
      <header className="page-header">
        <h1>{title}</h1>
        <p>{description}</p>
      </header>

      {showInProgress && projects.length === 0 && (
        <p className="empty">No projects in progress yet. Link a repository on a project page to start one.</p>
      )}
      {stack && projects.length === 0 && <p className="empty">No {stack.label} projects yet. They will be added soon.</p>}

      <section className="project-grid">
        {projects.map((o) => (
          <ProjectCard key={o.id} project={o} />
        ))}
      </section>
    </main>
  )
}
