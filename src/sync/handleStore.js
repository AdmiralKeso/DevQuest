// Linked folders are saved per project. Folder handles can't go in localStorage, but IndexedDB stores them directly.
const DB_NAME = 'devquest'
const STORE = 'folders'

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => request.result.createObjectStore(STORE)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function run(mode, action) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode)
    const request = action(tx.objectStore(STORE))
    tx.oncomplete = () => {
      db.close()
      resolve(request.result)
    }
    tx.onerror = () => {
      db.close()
      reject(tx.error)
    }
  })
}

export const loadHandle = (projectId) => run('readonly', (store) => store.get(projectId))
export const saveHandle = (projectId, handle) => run('readwrite', (store) => store.put(handle, projectId))
export const removeHandle = (projectId) => run('readwrite', (store) => store.delete(projectId))
