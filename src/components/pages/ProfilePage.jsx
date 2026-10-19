import { Link } from 'react-router'
import { OBJECTIVES } from '../../data/objectives.js'
import { useCompletedProjects } from '../../hooks/useCompletedProjects.js'
import { isProjectCompleted, useAllProgress } from '../../hooks/useProgress.js'
import InfoPage from '../InfoPage.jsx'
import ProjectCard from '../ProjectCard.jsx'

// Profile page from the main menu: the projects the user has completed. Those saved as finished in the database
// come first (in the order they were finished), then any finished in localStorage that the database missed.
export default function ProfilePage() {
  const [saved] = useAllProgress()
  const savedIds = useCompletedProjects()
  const localIds = OBJECTIVES.filter((project) => isProjectCompleted(project, saved)).map((project) => project.id)
  const completed = [...new Set([...savedIds, ...localIds])]
    .map((id) => OBJECTIVES.find((o) => o.id === id))
    .filter(Boolean)

  return (
    <InfoPage title="Profile" className="profile-page">
      <section className="completed-projects">
        <h2>Completed projects</h2>
        {completed.length === 0 ? (
          <p className="empty">
            No completed projects yet. <Link to="/projects">Start a quest</Link>
          </p>
        ) : (
          <div className="project-grid">
            {completed.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </InfoPage>
  )
}
