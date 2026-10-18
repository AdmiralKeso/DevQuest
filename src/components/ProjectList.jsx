import { Link } from 'react-router'
import { DIFFICULTIES, STACKS, getProjectsForStack } from '../data/objectives.js'
import StackBadge from './StackBadge.jsx'

export default function ProjectList({ stackId = 'all' }) {
  const stack = STACKS.find((s) => s.id === stackId)
  const projects = getProjectsForStack(stackId)

  return (
    <main className="project-list">
      <header className="page-header">
        <h1>{stack ? `Projects with ${stack.label}` : 'What do you want to build?'}</h1>
        <p>
          {stack
            ? stack.description
            : 'Pick a project, or choose a tech stack on the left to narrow it down.'}
        </p>
      </header>

      <section className="project-grid">
        {projects.map((o) => (
          <Link key={o.id} to={`/projects/${o.id}`} className="project-card">
            {o.difficulty && (
              <span className="difficulty-badge" data-difficulty={o.difficulty}>
                {DIFFICULTIES.find((d) => d.id === o.difficulty).label}
              </span>
            )}
            <h2>{o.title}</h2>
            <p>{o.description}</p>
            <StackBadge stackId={o.stack} />
          </Link>
        ))}
      </section>
    </main>
  )
}
