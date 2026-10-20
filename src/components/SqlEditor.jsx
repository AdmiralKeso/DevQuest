// The SQL text box under the rings, for projects checked from SQL instead of GitHub (`editor: 'sql'`).
// Under it: how many statements were read, per type, so you can see what the objectives are checked against.
export default function SqlEditor({ value, onChange, statements }) {
  const counts = {}
  for (const s of statements) counts[s.type] = (counts[s.type] ?? 0) + 1

  return (
    <section className="sql-editor">
      <h2>Your SQL</h2>
      <p className="section-note">
        Write your queries here, each ending with a semicolon. The objectives are ticked off as you type.
      </p>
      <textarea
        className="sql-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Your SQL"
        placeholder="CREATE TABLE authors (...);"
        spellCheck={false}
        rows={12}
      />
      <p className="sql-summary">
        {statements.length === 0
          ? 'No statements yet.'
          : `${statements.length} ${statements.length === 1 ? 'statement' : 'statements'} read: `}
        {Object.entries(counts).map(([type, count]) => (
          <span key={type} className="sql-count" data-type={type}>
            {type.toUpperCase()} {count}
          </span>
        ))}
      </p>
    </section>
  )
}
