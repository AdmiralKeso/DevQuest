// "Link to project" box: links the project to a folder, or shows the linked folder with change/unlink.
export default function FolderSync({ folder }) {
  const { status, folderName, files, lastScan, error, link, reconnect, unlink } = folder

  return (
    <section className={`folder-sync ${status}`}>
      {status === 'loading' && <p>Checking for a linked folder…</p>}

      {status === 'unsupported' && <p>Linking a folder needs Chrome or Edge.</p>}

      {status === 'none' && (
        <button type="button" onClick={link}>
          Link to project
        </button>
      )}

      {status === 'needs-permission' && (
        <div className="folder-actions">
          <button type="button" onClick={reconnect}>
            Reconnect "{folderName}"
          </button>
          <button type="button" onClick={unlink}>
            Unlink
          </button>
        </div>
      )}

      {status === 'linked' && (
        <>
          <p>
            Linked to <strong>{folderName}</strong>
            {lastScan && files && (
              <span className="last-scan"> · checked {lastScan.toLocaleTimeString()}</span>
            )}
          </p>
          <div className="folder-actions">
            <button type="button" onClick={link}>
              Change
            </button>
            <button type="button" onClick={unlink}>
              Unlink
            </button>
          </div>
        </>
      )}

      {status !== 'unsupported' && <p className="folder-note">Files stay in your browser.</p>}
      {error && <p className="folder-error">{error}</p>}
    </section>
  )
}
