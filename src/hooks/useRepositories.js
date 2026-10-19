import { useCallback, useEffect, useState } from 'react'

// Repositories the user has linked before, saved in the database through the local API (server/index.js).
// Returns [repositories, addRepository, removeRepository]; without the API the list is just empty.
export function useRepositories() {
  const [repositories, setRepositories] = useState([])

  useEffect(() => {
    let cancelled = false
    fetch('/api/repositories')
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((rows) => {
        if (!cancelled && Array.isArray(rows)) setRepositories(rows)
      })
      .catch(() => {
        // API not running; nothing to pick from.
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Saves a linked repository and moves it to the top of the list.
  const addRepository = useCallback(async (url, repo) => {
    try {
      const res = await fetch('/api/repositories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, owner: repo.owner, repo: repo.repo, branch: repo.branch, path: repo.path ?? '' }),
      })
      if (!res.ok) return
      const saved = await res.json()
      setRepositories((list) => [saved, ...list.filter((r) => r.id !== saved.id)])
    } catch {
      // API not running; the repository is linked but not saved to the list.
    }
  }, [])

  // Removes a saved repository from the list.
  const removeRepository = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/repositories/${id}`, { method: 'DELETE' })
      if (res.ok) setRepositories((list) => list.filter((r) => r.id !== id))
    } catch {
      // API not running; the list stays as it is.
    }
  }, [])

  return [repositories, addRepository, removeRepository]
}
