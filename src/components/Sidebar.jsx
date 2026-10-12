import { NavLink } from 'react-router'
import { STACKS, getProjectsForStack } from '../data/objectives.js'

const CATEGORIES = [{ id: 'all', label: 'All projects', to: '/' }, ...STACKS.map((s) => ({ ...s, to: `/stack/${s.id}` }))]

// NavLink adds the `active` class to the link for the current page.
export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-heading">Tech stack</h2>
      <nav>
        <ul className="category-list">
          {CATEGORIES.map((c) => (
            <li key={c.id}>
              <NavLink to={c.to} end className="category">
                <span className="category-label">{c.label}</span>
                <span className="category-count">{getProjectsForStack(c.id).length}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
