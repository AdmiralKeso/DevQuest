import { useState } from 'react'
import { Link } from 'react-router'
import { createProgressPdf, downloadPdf } from '../../../pdfmaker/pdfMaker.js'
import { DIFFICULTIES, OBJECTIVES, STACKS } from '../../data/objectives.js'
import { useCompletedProjectRows } from '../../hooks/useCompletedProjects.js'
import { isProjectCompleted, useAllProgress } from '../../hooks/useProgress.js'
import InfoPage from '../InfoPage.jsx'
import ProjectCard from '../ProjectCard.jsx'

// Profile page from the main menu: the projects the user has completed. Those saved as finished in the database
// come first (in the order they were finished), then any finished in localStorage that the database missed.
// "Download PDF" saves them as a progress report (pdfmaker/pdfMaker.js).
export default function ProfilePage() {
  const [saved] = useAllProgress()
  const savedRows = useCompletedProjectRows()
  const [pdfError, setPdfError] = useState(null)
  const localIds = OBJECTIVES.filter((project) => isProjectCompleted(project, saved)).map((project) => project.id)
  const completed = [...new Set([...savedRows.map((row) => row.projectId), ...localIds])]
    .map((id) => OBJECTIVES.find((o) => o.id === id))
    .filter(Boolean)

  // The report lists each project with its stack, difficulty and the date it was saved as finished (if it was)
  function downloadReport() {
    setPdfError(null)
    try {
      const projects = completed.map((project) => ({
        title: project.title,
        stack: STACKS.find((s) => s.id === project.stack)?.label,
        difficulty: DIFFICULTIES.find((d) => d.id === project.difficulty)?.label,
        completedAt: savedRows.find((row) => row.projectId === project.id)?.completedAt,
      }))
      downloadPdf(createProgressPdf(projects))
    } catch (e) {
      setPdfError(`The PDF couldn't be made: ${e.message}`)
    }
  }

  return (
    <InfoPage title="Profile" className="profile-page">
      <section className="completed-projects">
        <div className="completed-projects-header">
          <h2>Completed projects</h2>
          {/* Always shown; with nothing finished yet the PDF says "No finished projects yet." */}
          <button type="button" className="download-pdf" onClick={downloadReport}>
            Download PDF
          </button>
        </div>
        {pdfError && <p className="pdf-error">{pdfError}</p>}
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
