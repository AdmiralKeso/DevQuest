import { useRef, useState } from 'react'
import { useCooldown } from '../hooks/useCooldown.js'
import { useRepositories } from '../hooks/useRepositories.js'

// Every click on "Link to project" or "Check now" calls the GitHub API (60 requests an hour without a login),
// so each is blocked for a few seconds after use.
const COOLDOWN_MS = 5000

// "Link to project" box: pick a saved repository or paste a public GitHub URL and link it,
// or show the linked one with Check now / Unlink.
// `disabled` (SQL projects, checked from their text box) greys the box out and makes it unusable.
export default function ProjectLink({ project, disabled = false }) {
  const { repo, files, lastScan, error, link, unlink, checkNow } = project
  const [repositories, addRepository, removeRepository] = useRepositories()
  const [url, setUrl] = useState('')
  // "Linked repositories" opens a small popup with the saved repositories, each with an X to remove it.
  const linkedDialog = useRef(null)
  const [linking, setLinking] = useState(false)
  // A ref also blocks clicks that land before React re-renders the button as disabled.
  const busy = useRef(false)
  const linkCooldown = useCooldown(COOLDOWN_MS)
  const checkCooldown = useCooldown(COOLDOWN_MS)
  // Set when "Link to project" is clicked during the cooldown; the message shows until the cooldown ends.
  const [triedTooSoon, setTriedTooSoon] = useState(false)
  const tooManyRequests = triedTooSoon && linkCooldown.active

  async function submit(event) {
    event.preventDefault()
    if (busy.current) return
    if (linkCooldown.active) {
      setTriedTooSoon(true)
      return
    }
    setTriedTooSoon(false)
    busy.current = true
    setLinking(true)
    const linked = await link(url)
    if (linked) {
      addRepository(url.trim(), linked)
      setUrl('')
    }
    setLinking(false)
    linkCooldown.start()
    busy.current = false
  }

  function check() {
    if (checkCooldown.active) return
    checkNow()
    checkCooldown.start()
  }

  // While linking, the box's contents are hidden (keeping its size) and one spinner fills the whole box.
  const hiddenWhileLinking = linking ? 'invisible' : ''

  return (
    <section
      className={`project-link relative ${repo ? 'linked' : 'none'} ${linking ? 'linking' : ''} ${disabled ? 'disabled' : ''}`}
      aria-busy={linking}
      aria-disabled={disabled}
      inert={disabled}
    >
      {disabled && <p className="link-disabled-note">This project is checked from the SQL text box, not from GitHub.</p>}
      {!repo && (
        <>
          {repositories.length > 0 && (
            <label className={`saved-repositories ${hiddenWhileLinking}`}>
              Saved repositories
              <select
                value={repositories.some((r) => r.url === url) ? url : ''}
                onChange={(e) => setUrl(e.target.value)}
              >
                <option value="">Choose a repository</option>
                {repositories.map((r) => (
                  <option key={r.id} value={r.url}>
                    {r.owner}/{r.repo}
                    {r.path && `/${r.path}`} ({r.branch})
                  </option>
                ))}
              </select>
            </label>
          )}
          {/* The popup stays mounted so removing the last repository doesn't close it; the link needs one saved */}
          <div className={`linked-repositories ${hiddenWhileLinking}`}>
            {repositories.length > 0 && (
              <button
                type="button"
                className="linked-repositories-toggle"
                aria-haspopup="dialog"
                onClick={() => linkedDialog.current?.showModal()}
              >
                Linked repositories
              </button>
            )}
            {/* Closes with Close, Escape, or a click outside the box */}
            <dialog
              ref={linkedDialog}
              className="linked-repositories-dialog"
              aria-labelledby="linked-repositories-title"
              onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
            >
              <h2 id="linked-repositories-title">Linked repositories</h2>
              <ul className="linked-repositories-list">
                {repositories.map((r) => {
                  const name = `${r.owner}/${r.repo}${r.path ? `/${r.path}` : ''}`
                  return (
                    <li key={r.id} className="linked-repository">
                      <span>
                        {name} ({r.branch})
                      </span>
                      <button
                        type="button"
                        className="remove-repository"
                        aria-label={`Remove ${name}`}
                        title="Remove"
                        onClick={() => {
                          if (url === r.url) setUrl('')
                          removeRepository(r.id)
                        }}
                      >
                        ×
                      </button>
                    </li>
                  )
                })}
              </ul>
              {repositories.length === 0 && <p className="empty">No saved repositories.</p>}
              <button type="button" className="close-dialog" onClick={() => linkedDialog.current?.close()}>
                Close
              </button>
            </dialog>
          </div>
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
          <p className={`link-note ${tooManyRequests ? 'too-many-requests' : ''} ${hiddenWhileLinking}`}>
            {tooManyRequests
              ? 'Too many requests. Please wait a moment before trying again.'
              : 'Public GitHub repositories only.'}
          </p>
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
            <button type="button" onClick={check} disabled={checkCooldown.active}>
              {checkCooldown.active ? `Check now (${checkCooldown.secondsLeft}s)` : 'Check now'}
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
