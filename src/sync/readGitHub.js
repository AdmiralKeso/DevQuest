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

// Errors with a message meant for the user. Anything else is replaced by a generic message before it reaches the UI.
class GitHubError extends Error {}

// Every error is logged once, with what was being done and the original error, then shown to the user as a short message.
function logError(context, error) {
  console.error(`[DevQuest] ${context}:`, error)
}

function toUserError(error) {
  return error instanceof GitHubError
    ? error
    : new GitHubError('GitHub sent an unexpected response. Try again later.', { cause: error })
}

// Unauthenticated requests are limited to 60 per hour per network, so errors explain that clearly.
async function api(url, options) {
  let res
  try {
    res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' }, ...options })
  } catch (error) {
    throw new GitHubError("Couldn't reach GitHub. Check your internet connection.", { cause: error })
  }
  if (res.ok) {
    try {
      return await res.json()
    } catch (error) {
      throw new GitHubError('GitHub sent an unexpected response. Try again later.', { cause: error })
    }
  }
  const cause = new Error(`${res.status} ${res.statusText} for ${url}`)
  if ((res.status === 403 || res.status === 429) && res.headers.get('x-ratelimit-remaining') === '0') {
    const reset = new Date(Number(res.headers.get('x-ratelimit-reset')) * 1000)
    throw new GitHubError(`GitHub's hourly limit is reached. Checking resumes at ${reset.toLocaleTimeString()}.`, { cause })
  }
  if (res.status === 404) {
    throw new GitHubError('Repository not found. Only public repositories can be linked.', { cause })
  }
  throw new GitHubError(`GitHub returned an error (${res.status}).`, { cause })
}

// Checks the repository exists and fills in the default branch. The result is what gets saved per project.
export async function resolveGitHubRepo(url) {
  try {
    const parsed = parseGitHubUrl(url)
    if (!parsed) throw new GitHubError('Enter a GitHub repository URL, like https://github.com/user/repo')
    const info = await api(`${API}/repos/${parsed.owner}/${parsed.repo}`)
    return {
      owner: info.owner.login,
      repo: info.name,
      branch: parsed.branch ?? info.default_branch,
      path: parsed.path,
    }
  } catch (error) {
    logError(`Couldn't link "${url}"`, error)
    throw toUserError(error)
  }
}

// A file that can't be downloaded is logged and treated as unread, so one bad file doesn't stop the whole check.
async function fetchRaw(repo, commitSha, path) {
  const url = `${RAW}/${repo.owner}/${repo.repo}/${commitSha}/${path.split('/').map(encodeURIComponent).join('/')}`
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`)
    return await res.text()
  } catch (error) {
    logError(`Couldn't download ${path}`, error)
    return null
  }
}

async function inBatches(items, size, fn) {
  for (let i = 0; i < items.length; i += size) await Promise.all(items.slice(i, i + size).map(fn))
}

// Returns [{ path, text }] for every file, with `text` null for files that aren't read. `state` is kept between scans:
// when the latest commit hasn't changed it returns the previous files without downloading anything,
// and file contents are cached by blob sha so only changed files are downloaded again.
export async function readGitHub(repo, state) {
  try {
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
  } catch (error) {
    logError(`Couldn't read ${repo.owner}/${repo.repo} (${repo.branch})`, error)
    throw toUserError(error)
  }
}
