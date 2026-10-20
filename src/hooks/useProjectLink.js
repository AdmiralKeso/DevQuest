import { useEffect, useRef, useState } from 'react'
import { readGitHub, resolveGitHubRepo } from '../sync/readGitHub.js'
import { saveProjectLink } from './useInProgress.js'

// Links a project to a public GitHub repository and reads it once when linked, then again only on "Check now".
// GitHub allows 60 requests an hour without a login; unchanged checks don't count, a new commit costs two.
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

  // Read the repository when it is linked and each time "Check now" is pressed; there is no automatic check.
  useEffect(() => {
    if (!owner) return
    const current = { owner, repo: name, branch, path }
    let cancelled = false

    async function scan() {
      try {
        const result = await readGitHub(current, state.current)
        if (!cancelled) {
          setFiles(result)
          setLastScan(new Date())
          setError(null)
        }
      } catch (e) {
        if (!cancelled) setError(e.message)
      }
    }

    scan()
    return () => {
      cancelled = true
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
