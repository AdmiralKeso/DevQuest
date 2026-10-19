import { Link } from 'react-router'
import { DIFFICULTIES } from '../data/objectives.js'
import StackBadge from './StackBadge.jsx'
import StatCircle from './StatCircle.jsx'

// Project card (difficulty tab, title, description, stack badge) that links to its project page.
// With `percent` (In progress) it also shows the project's overall progress ring (the project page's StatCircle).
export default function ProjectCard({ project, percent = null }) {
  return (
    <Link to={`/projects/${project.id}`} className="project-card">
      {project.difficulty && (
        <span className="difficulty-badge" data-difficulty={project.difficulty}>
          {DIFFICULTIES.find((d) => d.id === project.difficulty).label}
        </span>
      )}
      {percent !== null ? (
        <span className="project-card-heading">
          <h2>{project.title}</h2>
          <StatCircle className="project-card-progress" value={`${percent}%`} percent={percent} />
        </span>
      ) : (
        <h2>{project.title}</h2>
      )}
      <p>{project.description}</p>
      <StackBadge stackId={project.stack} />
    </Link>
  )
}
