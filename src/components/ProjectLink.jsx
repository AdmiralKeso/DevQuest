import { useState } from 'react'

// "Link to project" box: link a public GitHub repository, or show the linked one with Check now / Unlink.
export default function ProjectLink({ project }) {
  const { repo, files, lastScan, error, link, unlink, checkNow } = project
  const [url, setUrl] = useState('')
  const [linking, setLinking] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setLinking(true)
    if (await link(url)) setUrl('')
    setLinking(false)
  }

  // While linking, the box's contents are hidden (keeping its size) and one spinner fills the whole box.
  const hiddenWhileLinking = linking ? 'invisible' : ''

  return (
    <section
      className={`project-link relative ${repo ? 'linked' : 'none'} ${linking ? 'linking' : ''}`}
      aria-busy={linking}
    >
      {!repo && (
        <>
          <form className={`github-form ${hiddenWhileLinking}`} onSubmit={submit}>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/user/repo"
              aria-label="GitHub repository URL"
              required
            />
            <button type="submit" disabled={linking}>
              Link to project
            </button>
          </form>
          <p className={`link-note ${hiddenWhileLinking}`}>Public GitHub repositories only.</p>
        </>
      )}

      {linking && (
        <div className="absolute inset-0 flex items-center justify-center p-2">
          <span
            className="loading-spinner aspect-square h-1/2 animate-spin rounded-full border-4 border-current border-t-transparent"
            role="status"
            aria-label="Linking"
          />
        </div>
      )}

      {repo && (
        <>
          <p>
            Linked to{' '}
            <a
              href={`https://github.com/${repo.owner}/${repo.repo}/tree/${repo.branch}${repo.path ? `/${repo.path}` : ''}`}
              target="_blank"
              rel="noreferrer"
            >
              {repo.owner}/{repo.repo}
              {repo.path && `/${repo.path}`}
            </a>{' '}
            ({repo.branch})
            {lastScan && files && (
              <span className="last-scan"> · checked {lastScan.toLocaleTimeString()}</span>
            )}
          </p>
          <div className="link-actions">
            <button type="button" onClick={checkNow}>
              Check now
            </button>
            <button type="button" onClick={unlink}>
              Unlink
            </button>
          </div>
        </>
      )}

      {error && <p className={`link-error ${hiddenWhileLinking}`}>{error}</p>}
    </section>
  )
}
