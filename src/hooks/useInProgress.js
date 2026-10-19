import { useCallback, useState } from 'react'
import { OBJECTIVES } from '../data/objectives.js'
import { useCompletedProjects } from './useCompletedProjects.js'
import { isProjectCompleted, useAllProgress } from './useProgress.js'

// Projects started by linking a repository are kept in the browser only (not in the database),
// key `devquest.inProgress`: [project ids], most recently linked first.
const STORAGE_KEY = 'devquest.inProgress'

function readIds() {
  try {
    const ids = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(ids) ? ids.filter((id) => typeof id === 'string') : []
  } catch {
    return []
  }
}

// Whether a project is on the In progress list right now: linked before and not completed (`completedIds`: its done steps).
export function isInProgress(project, completedIds) {
  const steps = project.steps ?? []
  const completed = steps.length > 0 && steps.every((s) => completedIds.includes(s.id))
  return !completed && readIds().includes(project.id)
}

// Saves that a project was linked (`linked` true), or removes it on unlink.
export function saveProjectLink(projectId, linked) {
  const ids = readIds().filter((id) => id !== projectId)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(linked ? [projectId, ...ids] : ids))
  } catch {
    // Storage can be unavailable (private mode, quota); the project just won't show under In progress.
  }
}

// Projects in progress: started by linking a repository and not completed yet (all steps done, or saved
// as finished in the database), most recently linked first.
// Returns [projects, quit]: `quit(projectId)` takes a project off In progress and resets it (its ticked steps
// are cleared, so its project page starts from 0% again).
export function useInProgress() {
  const [saved, updateCompleted] = useAllProgress()
  const finishedIds = useCompletedProjects()
  const [ids, setIds] = useState(readIds)

  const quit = useCallback(
    (projectId) => {
      saveProjectLink(projectId, false)
      updateCompleted(projectId, () => [])
      setIds((current) => current.filter((id) => id !== projectId))
    },
    [updateCompleted],
  )

  const projects = ids
    .map((id) => OBJECTIVES.find((o) => o.id === id))
    .filter((project) => project && !finishedIds.includes(project.id) && !isProjectCompleted(project, saved))
  return [projects, quit]
}
