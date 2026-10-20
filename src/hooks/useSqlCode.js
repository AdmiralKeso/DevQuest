import { useEffect, useState } from 'react'

// The SQL written in a project's text box, saved in the browser only, key `devquest.sql`: { [projectId]: sql }.
const STORAGE_KEY = 'devquest.sql'

function readAll() {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return all && typeof all === 'object' ? all : {}
  } catch {
    return {}
  }
}

function writeSql(projectId, sql) {
  const all = readAll()
  if (sql) all[projectId] = sql
  else delete all[projectId]
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch {
    // Storage can be unavailable (private mode, quota); the SQL just isn't kept after a reload.
  }
}

// Empties a project's text box, e.g. when it is quit on In progress.
export function clearSqlCode(projectId) {
  writeSql(projectId, '')
}

// [sql, setSql] for one project's text box.
export function useSqlCode(projectId) {
  const [sql, setSql] = useState(() => readAll()[projectId] ?? '')
  useEffect(() => writeSql(projectId, sql), [projectId, sql])
  return [sql, setSql]
}
