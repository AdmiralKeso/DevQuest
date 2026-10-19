import { Link } from 'react-router'

// Js Linter page for a project, opened from the Static Analysis box. Says "Coming soon" for now; the linter will be added here later.
export default function JsLinterPage({ project }) {
  return (
    <main className="js-linter-page">
      <header className="page-header">
        <Link to={`/projects/${project.id}`} className="back-link">
          ← {project.title}
        </Link>
        <h1>Js Linter</h1>
      </header>
      <p className="coming-soon">Coming soon</p>
    </main>
  )
}
