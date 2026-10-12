import { useEffect, useRef, useState } from 'react'
import { loadHandle, removeHandle, saveHandle } from '../sync/handleStore.js'
import { readFolder } from '../sync/readFolder.js'

const SCAN_INTERVAL_MS = 2000
const supported = typeof window !== 'undefined' && 'showDirectoryPicker' in window

// status: 'unsupported' | 'loading' | 'none' | 'needs-permission' | 'linked'
export function useLinkedFolder(projectId) {
  const [handle, setHandle] = useState(null)
  const [status, setStatus] = useState(supported ? 'loading' : 'unsupported')
  const [files, setFiles] = useState(null)
  const [lastScan, setLastScan] = useState(null)
  const [error, setError] = useState(null)
  const cache = useRef(new Map())

  // Restore the folder linked earlier. Browsers forget the permission between visits,
  // so it can need a click on "Reconnect folder" before scanning resumes.
  useEffect(() => {
    if (!supported) return
    let cancelled = false
    loadHandle(projectId)
      .then(async (saved) => {
        if (cancelled) return
        if (!saved) return setStatus('none')
        const permission = await saved.queryPermission({ mode: 'read' })
        if (cancelled) return
        setHandle(saved)
        setStatus(permission === 'granted' ? 'linked' : 'needs-permission')
      })
      .catch(() => !cancelled && setStatus('none'))
    return () => {
      cancelled = true
    }
  }, [projectId])

  // While linked, rescan the folder every couple of seconds (skipped while the tab is hidden).
  useEffect(() => {
    if (status !== 'linked' || !handle) return
    let cancelled = false
    let scanning = false

    async function scan() {
      if (scanning || document.hidden) return
      scanning = true
      try {
        const result = await readFolder(handle, cache.current)
        if (!cancelled) {
          setFiles(result)
          setLastScan(new Date())
          setError(null)
        }
      } catch {
        if (!cancelled) setError(`Can't read "${handle.name}". It may have been moved or deleted.`)
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
  }, [status, handle])

  function reset(nextHandle, nextStatus) {
    cache.current = new Map()
    setHandle(nextHandle)
    setFiles(null)
    setLastScan(null)
    setError(null)
    setStatus(nextStatus)
  }

  async function link() {
    try {
      const picked = await window.showDirectoryPicker({ id: projectId, mode: 'read' })
      await saveHandle(projectId, picked)
      reset(picked, 'linked')
    } catch (e) {
      if (e.name !== 'AbortError') setError("Couldn't link that folder.")
    }
  }

  async function reconnect() {
    const permission = await handle.requestPermission({ mode: 'read' })
    if (permission === 'granted') setStatus('linked')
  }

  async function unlink() {
    await removeHandle(projectId)
    reset(null, 'none')
  }

  return { status, folderName: handle?.name, files, lastScan, error, link, reconnect, unlink }
}
