import { Link, Route, Routes, useParams } from 'react-router'
import JsLinterPage from './components/JsLinterPage.jsx'
import ProjectList from './components/ProjectList.jsx'
import ProjectPage from './components/ProjectPage.jsx'
import Sidebar from './components/Sidebar.jsx'
import { OBJECTIVES, STACKS } from './data/objectives.js'
import './App.css'

// Main page: stack sidebar next to the project cards. Project pages don't show the sidebar.
function MainPage({ stackId }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <ProjectList stackId={stackId} />
    </div>
  )
}

function StackRoute() {
  const { stackId } = useParams()
  return STACKS.some((s) => s.id === stackId) ? <MainPage stackId={stackId} /> : <NotFound />
}

function ProjectRoute() {
  const { projectId } = useParams()
  const project = OBJECTIVES.find((o) => o.id === projectId)
  // `key` resets the page when navigating straight from one project to another.
  return project ? <ProjectPage key={project.id} project={project} /> : <NotFound />
}

function JsLinterRoute() {
  const { projectId } = useParams()
  const project = OBJECTIVES.find((o) => o.id === projectId)
  return project ? <JsLinterPage project={project} /> : <NotFound />
}

function NotFound() {
  return (
    <main className="not-found">
      <h1>Page not found</h1>
      <Link to="/">Back to all projects</Link>
    </main>
  )
}

function App() {
  return (
    <>
      <header className="site-header">
        <Link to="/" className="site-title">
          DevQuest
        </Link>
      </header>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/stack/:stackId" element={<StackRoute />} />
        <Route path="/projects/:projectId" element={<ProjectRoute />} />
        <Route path="/projects/:projectId/js-linter" element={<JsLinterRoute />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
