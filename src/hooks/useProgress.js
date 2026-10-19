import { useCallback, useState } from 'react'

// Progress for every project is kept in the browser only, in localStorage,
// key `devquest.progress`: { [projectId]: [completed step ids] }.
// Finished projects are saved in the database separately (useCompletedProjects).
const STORAGE_KEY = 'devquest.progress'

const asObject = (saved) => (saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {})
export const completedIn = (saved, projectId) => {
  const ids = asObject(saved)[projectId]
  return Array.isArray(ids) ? ids : []
}

// A project is completed when it has steps and every one of them is done.
export function isProjectCompleted(project, saved) {
  const steps = project.steps ?? []
  const done = completedIn(saved, project.id)
  return steps.length > 0 && steps.every((s) => done.includes(s.id))
}

function readLocal() {
  try {
    return asObject(JSON.parse(localStorage.getItem(STORAGE_KEY)))
  } catch {
    return {}
  }
}

function writeLocal(saved) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
  } catch {
    // Storage can be unavailable (private mode, quota); the app still works in memory.
  }
}

// All projects' progress, plus `updateCompleted(projectId, update)` where `update` gets the latest
// completed ids and returns the new ones (or the same array for no change).
export function useAllProgress() {
  const [saved, setSaved] = useState(readLocal)

  const updateCompleted = useCallback((projectId, update) => {
    setSaved((prev) => {
      const current = completedIn(prev, projectId)
      const next = update(current)
      if (next === current) return prev
      const all = { ...prev, [projectId]: next }
      writeLocal(all)
      return all
    })
  }, [])

  return [saved, updateCompleted]
}

// One project's completed step ids and its update function.
export function useProgress(projectId) {
  const [saved, updateAll] = useAllProgress()
  const updateCompleted = useCallback((update) => updateAll(projectId, update), [updateAll, projectId])
  return [completedIn(saved, projectId), updateCompleted]
}
