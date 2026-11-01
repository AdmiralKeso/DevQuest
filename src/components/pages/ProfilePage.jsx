import { Link } from 'react-router'
import { useFinishedProjects } from '../../hooks/useCompletedProjects.js'
import InfoPage from '../InfoPage.jsx'
import ProjectCard from '../ProjectCard.jsx'

// Profile page from the main menu: the projects the user has completed. Those saved as finished in the database
// come first (in the order they were finished), then any finished in localStorage that the database missed.
// "Certificate builder" opens the page that makes a PDF certificate of them.
export default function ProfilePage() {
  const completed = useFinishedProjects().map((finished) => finished.project)

  return (
    <InfoPage title="Profile" className="profile-page">
      <section className="completed-projects">
        <div className="completed-projects-header">
          <h2>Completed projects</h2>
          <Link to="/profile/certificate" className="certificate-builder-link">
            Certificate builder
          </Link>
        </div>
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
