import { Link, Route, Routes, useLocation, useParams } from 'react-router'
import AboutPage from './components/pages/AboutPage.jsx'
import DocsPage from './components/pages/DocsPage.jsx'
import HowToPlay from './components/pages/HowToPlay.jsx'
import JsLinterPage from './components/pages/JsLinterPage.jsx'
import MainMenu from './components/pages/MainMenu.jsx'
import ProfilePage from './components/pages/ProfilePage.jsx'
import ProjectList from './components/ProjectList.jsx'
import ProjectPage from './components/pages/ProjectPage.jsx'
import Sidebar from './components/Sidebar.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import { useInProgress } from './hooks/useInProgress.js'
import TermsPage from './components/pages/TermsPage.jsx'
import { OBJECTIVES, STACKS } from './data/objectives.js'
import './App.css'

// Projects page: stack sidebar next to the project cards. Project pages don't show the sidebar.
// `inProgress` (projects linked and not completed) is loaded once here for the sidebar count and the list.
// Shows one stack (`stackId`), In progress, or everything.
function ProjectsPage({ stackId }) {
  const [inProgress, quitProject] = useInProgress()
  return (
    <div className="app-layout">
      <Sidebar inProgressCount={inProgress.length} stackId={stackId} />
      <ProjectList stackId={stackId} inProgress={inProgress} onQuit={quitProject} />
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
      {!onMainMenu && <SiteHeader />}
      <div className={onMainMenu ? 'page-content home' : 'page-content'}>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/how-to-play" element={<HowToPlay />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/in-progress" element={<ProjectsPage stackId="in-progress" />} />
          <Route path="/stack/:stackId" element={<StackRoute />} />
          <Route path="/projects/:projectId" element={<ProjectRoute />} />
          <Route path="/projects/:projectId/js-linter" element={<JsLinterRoute />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  )
}

export default App
