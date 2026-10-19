import { Link } from 'react-router'
import { DIFFICULTIES } from '../data/objectives.js'
import StackBadge from './StackBadge.jsx'

// Project card (difficulty tab, title, description, stack badge) that links to its project page.
export default function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project.id}`} className="project-card">
      {project.difficulty && (
        <span className="difficulty-badge" data-difficulty={project.difficulty}>
          {DIFFICULTIES.find((d) => d.id === project.difficulty).label}
        </span>
      )}
      <h2>{project.title}</h2>
      <p>{project.description}</p>
      <StackBadge stackId={project.stack} />
    </Link>
  )
}
