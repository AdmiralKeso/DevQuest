import { useState } from 'react'
import certificateDesign from '../../../pdfmaker/pdf.png'
import {
  PAGE_HEIGHT,
  PAGE_WIDTH,
  createProgressPdf,
  downloadPdf,
  layoutCertificate,
} from '../../../pdfmaker/pdfMaker.js'
import { DIFFICULTIES, STACKS } from '../../data/objectives.js'
import { useFinishedProjects } from '../../hooks/useCompletedProjects.js'
import InfoPage from '../InfoPage.jsx'

// At most this many projects can be on the certificate
const MAX_PROJECTS = 5

// Certificate builder (/profile/certificate, from Profile): your name and up to 5 of your finished projects
// (a dropdown per place) on the left, a preview of the certificate on the right. The preview is pdf.png with the
// texts placed exactly where the PDF puts them (layoutCertificate), so it updates instantly and never scrolls;
// Download PDF makes the real PDF. "Total projects completed" counts every finished project, not only the chosen ones.
export default function CertificatePage() {
  const finished = useFinishedProjects()
  const [name, setName] = useState('')
  // One project id per dropdown ('' = none), in the order they're listed on the certificate
  const [slots, setSlots] = useState(() => Array(MAX_PROJECTS).fill(''))
  const [makingPdf, setMakingPdf] = useState(false)
  const [error, setError] = useState(null)

  // The chosen projects in the order of the dropdowns, as the PDF maker wants them
  const chosen = slots
    .map((id) => finished.find(({ project }) => project.id === id))
    .filter(Boolean)
    .map(({ project, completedAt }) => ({
      title: project.title,
      stack: STACKS.find((s) => s.id === project.stack)?.label,
      difficulty: DIFFICULTIES.find((d) => d.id === project.difficulty)?.label,
      completedAt,
    }))
  const options = { name, total: finished.length }
  // Up to 5 projects always fit on one page
  const [texts] = layoutCertificate(chosen, options)

  function chooseProject(slot, projectId) {
    setSlots((current) => current.map((id, i) => (i === slot ? projectId : id)))
  }

  async function downloadCertificate() {
    setError(null)
    setMakingPdf(true)
    try {
      downloadPdf(await createProgressPdf(chosen, { ...options, background: await loadDesign() }))
    } catch (e) {
      setError(`The PDF couldn't be made: ${e.message}`)
    } finally {
      setMakingPdf(false)
    }
  }

  return (
    <InfoPage title="Certificate builder" className="certificate-page" backTo="/profile" backLabel="Profile">
      <div className="certificate-layout">
        <form className="certificate-form" onSubmit={(e) => e.preventDefault()}>
          <label className="certificate-name">
            Your name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              autoComplete="name"
            />
          </label>

          <fieldset className="certificate-projects">
            <legend>
              Projects on the certificate ({chosen.length} of {MAX_PROJECTS})
            </legend>
            {finished.length === 0 && <p className="empty">Finish a project to add it to your certificate.</p>}
            {/* A dropdown per place on the certificate; a project chosen in another dropdown isn't offered again */}
            {slots.map((selectedId, slot) => (
              <label key={slot} className={`certificate-project ${selectedId ? 'chosen' : ''}`}>
                Project {slot + 1}
                <select
                  value={selectedId}
                  onChange={(e) => chooseProject(slot, e.target.value)}
                  disabled={finished.length === 0}
                >
                  <option value="">None</option>
                  {finished
                    .filter(({ project }) => project.id === selectedId || !slots.includes(project.id))
                    .map(({ project }) => (
                      <option key={project.id} value={project.id}>
                        {project.title}
                      </option>
                    ))}
                </select>
              </label>
            ))}
          </fieldset>

          <p className="certificate-total">Total projects completed: {finished.length}</p>

          <button type="button" className="download-pdf" disabled={makingPdf} onClick={downloadCertificate}>
            {makingPdf ? 'Making PDF...' : 'Download PDF'}
          </button>
          {error && <p className="pdf-error">{error}</p>}
        </form>

        <CertificatePreview texts={texts} />
      </div>
    </InfoPage>
  )
}

// The certificate as the PDF will look: the design, with each text at its place. Positions and sizes are in PDF
// points, turned into percentages of the page (and font sizes into cqi, % of the preview's width), so it scales.
function CertificatePreview({ texts }) {
  return (
    <section className="certificate-preview" aria-label="Certificate preview">
      <img src={certificateDesign} alt="" className="certificate-design" />
      {texts.map((placed, i) => (
        <span
          key={i}
          className={`certificate-text ${placed.bold ? 'bold' : ''}`}
          style={{
            left: `${(placed.x / PAGE_WIDTH) * 100}%`,
            bottom: `${(placed.y / PAGE_HEIGHT) * 100}%`,
            fontSize: `${(placed.size / PAGE_WIDTH) * 100}cqi`,
          }}
        >
          {placed.text}
        </span>
      ))}
    </section>
  )
}

// The certificate design (pdfmaker/pdf.png, served by Vite) as bytes
async function loadDesign() {
  let res
  try {
    res = await fetch(certificateDesign)
  } catch {
    throw new Error('Server error: the certificate design could not be loaded')
  }
  if (res.status === 404) throw new Error('File not found: the certificate design (pdfmaker/pdf.png)')
  if (!res.ok) throw new Error(`Server error: the certificate design answered ${res.status}`)
  return new Uint8Array(await res.arrayBuffer())
}
