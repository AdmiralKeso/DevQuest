import { Link, Route, Routes, useLocation, useParams } from 'react-router'
import AboutPage from './components/AboutPage.jsx'
import AchievementsPage from './components/AchievementsPage.jsx'
import DocsPage from './components/DocsPage.jsx'
import HowToPlay from './components/HowToPlay.jsx'
import JsLinterPage from './components/JsLinterPage.jsx'
import MainMenu from './components/MainMenu.jsx'
import ProfilePage from './components/ProfilePage.jsx'
import ProjectList from './components/ProjectList.jsx'
import ProjectPage from './components/ProjectPage.jsx'
import Sidebar from './components/Sidebar.jsx'
import TermsPage from './components/TermsPage.jsx'
import { OBJECTIVES, STACKS } from './data/objectives.js'
import './App.css'

// Projects page: stack sidebar next to the project cards. Project pages don't show the sidebar.
function ProjectsPage({ stackId }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <ProjectList stackId={stackId} />
    </div>
  )
}

function StackRoute() {
  const { stackId } = useParams()
  return STACKS.some((s) => s.id === stackId) ? <ProjectsPage stackId={stackId} /> : <NotFound />
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
      <Link to="/">Back to the main menu</Link>
    </main>
  )
}

function App() {
  // The main menu is a title screen with its own big title, so the small site header is hidden there.
  const onMainMenu = useLocation().pathname === '/'

  return (
    <>
      {!onMainMenu && (
        <header className="site-header">
          <Link to="/" className="site-title">
            DevQuest
          </Link>
        </header>
      )}
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/how-to-play" element={<HowToPlay />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/stack/:stackId" element={<StackRoute />} />
        <Route path="/projects/:projectId" element={<ProjectRoute />} />
        <Route path="/projects/:projectId/js-linter" element={<JsLinterRoute />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
