// Folders that are installed or generated, not written by the user.
const SKIP_DIRS = new Set([
  'node_modules', 'vendor', 'dist', 'build', '.git', '.next',
  'venv', '.venv', 'env', '__pycache__', 'storage', '.idea', '.vscode',
])
// Source files whose contents are read. Names without an extension (e.g. artisan) count too.
const TEXT_FILE = /\.(jsx?|tsx?|mjs|cjs|json|html?|css|scss|md|php|py|ejs|txt|xml|ya?ml|toml)$|^[^.]+$/i
const MAX_FILE_SIZE = 512 * 1024
const MAX_FILES = 5000

// Returns [{ path, text }] for every file, with `text` null for files that aren't read.
// `cache` (path -> { lastModified, size, text }) avoids re-reading files that haven't changed between scans.
export async function readFolder(dirHandle, cache) {
  const files = []
  const seen = new Set()

  async function walk(handle, prefix) {
    for await (const entry of handle.values()) {
      if (files.length >= MAX_FILES) return
      const path = prefix + entry.name
      if (entry.kind === 'directory') {
        if (!SKIP_DIRS.has(entry.name)) await walk(entry, `${path}/`)
        continue
      }

      const file = await entry.getFile()
      let text = null
      if (TEXT_FILE.test(entry.name) && file.size <= MAX_FILE_SIZE) {
        const cached = cache.get(path)
        const unchanged = cached && cached.lastModified === file.lastModified && cached.size === file.size
        text = unchanged ? cached.text : await file.text()
        cache.set(path, { lastModified: file.lastModified, size: file.size, text })
        seen.add(path)
      }
      files.push({ path, text })
    }
  }

  await walk(dirHandle, '')
  for (const path of cache.keys()) if (!seen.has(path)) cache.delete(path)
  return files
}
