import { useEffect, useRef, useState } from 'react'
import { readGitHub, resolveGitHubRepo } from '../sync/readGitHub.js'
import { saveProjectLink } from './useInProgress.js'

// GitHub allows 60 requests an hour without a login; unchanged checks don't count, a new commit costs two.
const SCAN_INTERVAL_MS = 30000

// Links a project to a public GitHub repository and rereads it every 30 seconds.
// The link only lasts while the page is open: the user picks a repository again each visit
// (saved repositories are offered by useRepositories). Ticked steps stay saved as progress.
export function useProjectLink(projectId) {
  const [linked, setLinked] = useState({ projectId, repo: null })
  const repo = linked.projectId === projectId ? linked.repo : null
  const [files, setFiles] = useState(null)
  const [lastScan, setLastScan] = useState(null)
  const [error, setError] = useState(null)
  const [scanRequest, setScanRequest] = useState(0)
  const state = useRef({})
  const linking = useRef(false)

  const owner = repo?.owner
  const name = repo?.repo
  const branch = repo?.branch
  const path = repo?.path

  // While linked, reread the repository on an interval (skipped while the tab is hidden). "Check now" restarts it.
  useEffect(() => {
    if (!owner) return
    const current = { owner, repo: name, branch, path }
    let cancelled = false
    let scanning = false

    async function scan() {
      if (scanning || document.hidden) return
      scanning = true
      try {
        const result = await readGitHub(current, state.current)
        if (!cancelled) {
          setFiles(result)
          setLastScan(new Date())
          setError(null)
        }
      } catch (e) {
        if (!cancelled) setError(e.message)
      } finally {
        scanning = false
      }
    }

    scan()
    const timer = setInterval(scan, SCAN_INTERVAL_MS)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [owner, name, branch, path, scanRequest])

  function save(nextRepo) {
    state.current = {}
    setFiles(null)
    setLastScan(null)
    setError(null)
    setLinked({ projectId, repo: nextRepo })
    // Linked projects show under In progress on the projects page.
    saveProjectLink(projectId, nextRepo !== null)
  }

  // Returns the linked repository, or null when it failed (so the form can keep the URL).
  // Only one link request runs at a time; extra calls while it's running are ignored.
  async function link(url) {
    if (linking.current) return null
    linking.current = true
    try {
      const nextRepo = await resolveGitHubRepo(url)
      save(nextRepo)
      return nextRepo
    } catch (e) {
      setError(e.message)
      return null
    } finally {
      linking.current = false
    }
  }

  return {
    repo,
    files,
    lastScan,
    error,
    link,
    unlink: () => save(null),
    checkNow: () => setScanRequest((n) => n + 1),
  }
}
