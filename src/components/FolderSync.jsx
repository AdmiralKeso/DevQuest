// Shows the project's linked folder and lets the user link, reconnect or unlink it.
export default function FolderSync({ folder, autoCount }) {
  const { status, folderName, files, lastScan, error, link, reconnect, unlink } = folder

  if (status === 'loading') return null

  return (
    <section className={`folder-sync ${status}`}>
      <h2>Project folder</h2>

      {status === 'unsupported' && (
        <p>Folder syncing needs Chrome or Edge. You can still tick steps off by hand.</p>
      )}

      {status === 'none' && (
        <>
          <p>
            Link the folder you are building this project in. DevQuest checks your files every few
            seconds and ticks off {autoCount} of the steps automatically. Files are read in your
            browser and never uploaded.
          </p>
          <button type="button" onClick={link}>
            Link folder
          </button>
        </>
      )}

      {status === 'needs-permission' && (
        <>
          <p>DevQuest needs permission to read "{folderName}" again.</p>
          <div className="folder-actions">
            <button type="button" onClick={reconnect}>
              Reconnect folder
            </button>
            <button type="button" onClick={unlink}>
              Unlink
            </button>
          </div>
        </>
      )}

      {status === 'linked' && (
        <>
          <p>
            Linked to <strong>{folderName}</strong>
            {lastScan && files && (
              <span className="last-scan">
                {' '}
                · {files.length} files · last checked {lastScan.toLocaleTimeString()}
              </span>
            )}
          </p>
          <div className="folder-actions">
            <button type="button" onClick={link}>
              Change folder
            </button>
            <button type="button" onClick={unlink}>
              Unlink
            </button>
          </div>
        </>
      )}

      {error && <p className="folder-error">{error}</p>}
    </section>
  )
}
