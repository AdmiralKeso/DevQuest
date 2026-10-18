const API = 'https://api.github.com'
const RAW = 'https://raw.githubusercontent.com'

// Folders that are installed or generated, not written by the user.
const SKIP_DIRS = new Set([
  'node_modules', 'vendor', 'dist', 'build', '.git', '.next',
  'venv', '.venv', 'env', '__pycache__', 'storage', '.idea', '.vscode',
])
// Source files whose contents are read. Names without an extension (e.g. artisan) count too.
const TEXT_FILE = /\.(jsx?|tsx?|mjs|cjs|json|html?|css|scss|md|php|py|ejs|txt|xml|ya?ml|toml)$|^[^.]+$/i
const MAX_FILE_SIZE = 512 * 1024
const MAX_FILES = 5000

const isInSkippedDir = (path) => path.split('/').slice(0, -1).some((dir) => SKIP_DIRS.has(dir))
const shouldReadText = (name, size) => TEXT_FILE.test(name) && size <= MAX_FILE_SIZE

// Accepts github.com/{owner}/{repo}, optionally ending in .git or /tree/{branch}/{subfolder}.
// Branch names that contain a slash aren't supported.
export function parseGitHubUrl(input) {
  const match = input
    .trim()
    .match(/^(?:https?:\/\/)?(?:www\.)?github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:\/tree\/([^/]+)(?:\/(.*?))?)?\/?$/)
  if (!match) return null
  const [, owner, repo, branch = null, path = ''] = match
  return { owner, repo, branch, path }
}

// Unauthenticated requests are limited to 60 per hour per network, so errors explain that clearly.
async function api(url, options) {
  const res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' }, ...options })
  if (res.ok) return res.json()
  if ((res.status === 403 || res.status === 429) && res.headers.get('x-ratelimit-remaining') === '0') {
    const reset = new Date(Number(res.headers.get('x-ratelimit-reset')) * 1000)
    throw new Error(`GitHub's hourly limit is reached. Checking resumes at ${reset.toLocaleTimeString()}.`)
  }
  if (res.status === 404) throw new Error('Repository not found. Only public repositories can be linked.')
  throw new Error(`GitHub returned an error (${res.status}).`)
}

// Checks the repository exists and fills in the default branch. The result is what gets saved per project.
export async function resolveGitHubRepo(url) {
  const parsed = parseGitHubUrl(url)
  if (!parsed) throw new Error('Enter a GitHub repository URL, like https://github.com/user/repo')
  const info = await api(`${API}/repos/${parsed.owner}/${parsed.repo}`)
  return {
    owner: info.owner.login,
    repo: info.name,
    branch: parsed.branch ?? info.default_branch,
    path: parsed.path,
  }
}

async function fetchRaw(repo, commitSha, path) {
  const encoded = path.split('/').map(encodeURIComponent).join('/')
  const res = await fetch(`${RAW}/${repo.owner}/${repo.repo}/${commitSha}/${encoded}`)
  return res.ok ? res.text() : null
}

async function inBatches(items, size, fn) {
  for (let i = 0; i < items.length; i += size) await Promise.all(items.slice(i, i + size).map(fn))
}

// Returns [{ path, text }] for every file, with `text` null for files that aren't read. `state` is kept between scans:
// when the latest commit hasn't changed it returns the previous files without downloading anything,
// and file contents are cached by blob sha so only changed files are downloaded again.
export async function readGitHub(repo, state) {
  const base = `${API}/repos/${repo.owner}/${repo.repo}`
  // 'no-cache' revalidates with an ETag; GitHub doesn't count unchanged (304) answers against the limit.
  const commit = await api(`${base}/commits/${encodeURIComponent(repo.branch)}`, { cache: 'no-cache' })
  if (commit.sha === state.commitSha && state.files) return state.files

  const tree = await api(`${base}/git/trees/${commit.commit.tree.sha}?recursive=1`)
  const prefix = repo.path ? `${repo.path}/` : ''
  const blobs = tree.tree
    .filter((entry) => entry.type === 'blob' && entry.path.startsWith(prefix))
    .map((entry) => ({ ...entry, path: entry.path.slice(prefix.length) }))
    .filter((entry) => !isInSkippedDir(entry.path))
    .slice(0, MAX_FILES)

  const previous = state.texts ?? new Map()
  const texts = new Map()
  await inBatches(blobs, 8, async (blob) => {
    if (!shouldReadText(blob.path.split('/').pop(), blob.size)) return
    const text = previous.has(blob.sha) ? previous.get(blob.sha) : await fetchRaw(repo, commit.sha, prefix + blob.path)
    texts.set(blob.sha, text)
  })

  state.commitSha = commit.sha
  state.texts = texts
  state.files = blobs.map((blob) => ({ path: blob.path, text: texts.get(blob.sha) ?? null }))
  return state.files
}
