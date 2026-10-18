import { Link } from 'react-router'

// Shared layout for the pages opened from the main menu (How to play, Docs, About):
// a back link to the menu, the title, and content that scrolls inside the page.
export default function InfoPage({ title, className = '', children }) {
  return (
    <main className={`info-page ${className}`}>
      <header className="page-header">
        <Link to="/" className="back-link">
          ← Main menu
        </Link>
        <h1>{title}</h1>
      </header>
      <div className="info-content">{children}</div>
    </main>
  )
}
