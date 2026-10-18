import { Link } from 'react-router'
import LanguageSelect from './LanguageSelect.jsx'
import logo from '../assets/images/logo/logodevquest.png'

// Header on every page: logo, title and tagline on the left, nav on the right.
// On the main menu the title is the page's h1; on other pages the logo and title link back to the menu
// (those pages have their own h1).
export default function SiteHeader({ home = false }) {
  const brand = (
    <>
      <img src={logo} alt="" className="menu-logo" />
      <div className="menu-brand-text">
        {home ? <h1 className="menu-title">DevQuest</h1> : <p className="menu-title">DevQuest</p>}
        <p className="menu-tagline">Pick a quest. Build a real website. Level up your skills.</p>
      </div>
    </>
  )

  return (
    <header className={home ? 'menu-header' : 'menu-header site-header'}>
      {home ? (
        <div className="menu-brand">{brand}</div>
      ) : (
        <Link to="/" className="menu-brand">
          {brand}
        </Link>
      )}
      <nav className="menu-nav" aria-label="Site">
        <ul>
          <li>
            <Link to="/docs">Docs</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <LanguageSelect />
          </li>
        </ul>
      </nav>
    </header>
  )
}
