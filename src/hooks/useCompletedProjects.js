import { useEffect, useState } from 'react'
import { OBJECTIVES } from '../data/objectives.js'
import { isProjectCompleted, useAllProgress } from './useProgress.js'

// Saves in the database (through the local API, server/index.js) that a project was finished.
// Saving the same project again does nothing, so it keeps the first completed date.
export function saveCompletedProject(projectId) {
  fetch(`/api/completed-projects/${encodeURIComponent(projectId)}`, { method: 'POST' }).catch(() => {
    // API not running; the project isn't saved as finished in the database this time.
  })
}

// The finished projects saved in the database with their dates, [{ projectId, completedAt }], first finished first.
// Without the API the list is empty.
export function useCompletedProjectRows() {
  const [rows, setRows] = useState([])

  useEffect(() => {
    let cancelled = false
    fetch('/api/completed-projects')
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setRows(data)
      })
      .catch(() => {
        // API not running; nothing to show.
      })
    return () => {
      cancelled = true
    }
  }, [])

  return rows
}

// Ids of the finished projects saved in the database, first finished first.
export function useCompletedProjects() {
  return useCompletedProjectRows().map((row) => row.projectId)
}

// Every finished project as [{ project, completedAt }]: those saved in the database first (in the order they were
// finished, with their date), then any finished in localStorage that the database missed (no date).
export function useFinishedProjects() {
  const [saved] = useAllProgress()
  const rows = useCompletedProjectRows()
  const localIds = OBJECTIVES.filter((project) => isProjectCompleted(project, saved)).map((project) => project.id)
  return [...new Set([...rows.map((row) => row.projectId), ...localIds])]
    .map((id) => ({
      project: OBJECTIVES.find((o) => o.id === id),
      completedAt: rows.find((row) => row.projectId === id)?.completedAt,
    }))
    .filter((finished) => finished.project)
}
