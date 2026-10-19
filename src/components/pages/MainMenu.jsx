import { Link } from 'react-router'
import { OBJECTIVES } from '../../data/objectives.js'
import { useLocalStorage } from '../../hooks/useLocalStorage.js'
import SiteHeader from '../SiteHeader.jsx'

// Worked out once when the app loads, for the footer.
const YEAR = new Date().getFullYear()

// Main menu at "/": a board of tiles that fit together in three columns of different widths.
// Each column splits at different heights, so tiles are uneven but leave no gaps.
// Continue goes back to the last opened project (or to the project list when none has been opened yet).
export default function MainMenu() {
  const [lastProjectId] = useLocalStorage('devquest.lastProject', null)
  const lastProject = OBJECTIVES.find((o) => o.id === lastProjectId)

  return (
    <main className="main-menu">
      <SiteHeader home />

      <nav className="menu-board" aria-label="Main menu">
        <div className="menu-column column-left">
          <Link to={lastProject ? `/projects/${lastProject.id}` : '/projects'} className="menu-tile tile-continue">
          <div className='menu-title-container'>
            <span className="tile-label">
              <i className="fa-solid fa-forward" aria-hidden="true"></i> Continue
            </span>
            <span className="tile-detail">
              {lastProject ? `${lastProject.title}` : 'Start your first quest'}
            </span>
          </div>
          </Link>
          <Link to="/projects" className="menu-tile tile-new-project">
            <div className="menu-title-container">
              <span className="tile-label">
                <i className="fa-solid fa-plus" aria-hidden="true"></i> Start a new project
              </span>
            </div>
          </Link>
        </div>

        <div className="menu-column column-middle">
          <Link to="/about" className="menu-tile tile-about">
            <div className="menu-title-container">
              <span className="tile-label">
                <i className="fa-solid fa-link" aria-hidden="true"></i> Usefull links
              </span>
            </div>
          </Link>
          <Link to="/how-to-play" className="menu-tile tile-how-to-play">
            <span className="tile-label">
              What is <strong className="tile-brand">DevQuest</strong> and how does it work?
            </span>
          </Link>
          {/* Not built yet: greyed out and not a link */}
          <div className="menu-tile tile-achievements disabled" aria-disabled="true">
            <div className="menu-title-container">
              <span className="tile-label">
                <i className="fa-solid fa-trophy" aria-hidden="true"></i> Achievements
              </span>
              <span className="tile-detail">Coming soon</span>
            </div>
          </div>
        </div>

        <div className="menu-column column-right">
          <Link to="/profile" className="menu-tile tile-profile">
            <div className="menu-title-container">
              <span className="tile-label">
                <i className="fa-solid fa-circle-user" aria-hidden="true"></i> Profile
              </span>
            </div>
          </Link>
          <Link to="/docs" className="menu-tile tile-docs">
            <div className="menu-title-container">
              <span className="tile-label">
                <i className="fa-brands fa-readme" aria-hidden="true"></i> Instructions
              </span>
            </div>
          </Link>
        </div>
      </nav>

      <footer className="menu-footer">
        <span>
          © {YEAR} DevQuest ·{' '}
          <Link to="/terms" className="footer-link">
            Terms and conditions
          </Link>
        </span>
        <span>Learn web development one quest at a time</span>
      </footer>
    </main>
  )
}
