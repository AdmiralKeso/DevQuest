import { useEffect, useRef, useState } from 'react'
import { readGitHub, resolveGitHubRepo } from '../sync/readGitHub.js'
import { useLocalStorage } from './useLocalStorage.js'

// GitHub allows 60 requests an hour without a login; unchanged checks don't count, a new commit costs two.
const SCAN_INTERVAL_MS = 30000

// Links are kept in one object: { [projectId]: { owner, repo, branch, path } }
const isRepo = (value) =>
  value && typeof value === 'object' && typeof value.owner === 'string' && typeof value.repo === 'string'

// Links a project to a public GitHub repository and rereads it every 30 seconds.
export function useProjectLink(projectId) {
  const [saved, setSaved] = useLocalStorage('devquest.links', {})
  const repo = isRepo(saved?.[projectId]) ? saved[projectId] : null
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
    setSaved((prev) => {
      const links = { ...(prev && typeof prev === 'object' ? prev : {}) }
      if (nextRepo) links[projectId] = nextRepo
      else delete links[projectId]
      return links
    })
  }

  // Returns true when linked, so the form can keep the URL if it failed.
  // Only one link request runs at a time; extra calls while it's running are ignored.
  async function link(url) {
    if (linking.current) return false
    linking.current = true
    try {
      save(await resolveGitHubRepo(url))
      return true
    } catch (e) {
      setError(e.message)
      return false
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
