import { useState } from 'react'
import { NavLink } from 'react-router'
import { GROUPS, OBJECTIVES, getProjectsForStack, getStacksForGroup } from '../data/objectives.js'

function CategoryLink({ to, label, count }) {
  return (
    <NavLink to={to} end className="category">
      <span className="category-label">{label}</span>
      <span className="category-count">{count}</span>
    </NavLink>
  )
}

// All projects and In progress are plain links. Each group (Functional, Object-oriented, UX, Frameworks, Server) is a dropdown:
// the heading's button opens or closes its stack links. Groups start closed, except the ones holding the open stack.
// A stack in more than one group (e.g. Python, JavaScript, Node) is listed under each.
// NavLink adds the `active` class to the link for the current page; open groups get `open`.
export default function Sidebar({ inProgressCount = 0, stackId }) {
  const [openGroups, setOpenGroups] = useState(() =>
    GROUPS.filter((g) => getStacksForGroup(g.id).some((s) => s.id === stackId)).map((g) => g.id),
  )

  function toggle(groupId) {
    setOpenGroups((ids) => (ids.includes(groupId) ? ids.filter((id) => id !== groupId) : [...ids, groupId]))
  }

  return (
    <aside className="sidebar">
      <h2 className="sidebar-heading">Tech stack</h2>
      <nav>
        <ul className="category-list">
          <li>
            <CategoryLink to="/projects" label="All projects" count={OBJECTIVES.length} />
          </li>
          <li>
            <CategoryLink to="/projects/in-progress" label="In progress" count={inProgressCount} />
          </li>
          {GROUPS.map((g) => {
            const stacks = getStacksForGroup(g.id)
            const open = openGroups.includes(g.id)
            const listId = `stacks-${g.id}`
            return (
              <li key={g.id} className={`category-group ${open ? 'open' : ''}`} data-group={g.id}>
                <h3 className="category-group-heading">
                  <button
                    type="button"
                    className="category-group-toggle"
                    aria-expanded={open}
                    aria-controls={listId}
                    onClick={() => toggle(g.id)}
                  >
                    {g.label}
                  </button>
                </h3>
                {open && (
                  <ul id={listId} className="category-list stack-list">
                    {stacks.map((s) => (
                      <li key={s.id}>
                        <CategoryLink to={`/stack/${s.id}`} label={s.label} count={getProjectsForStack(s.id).length} />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
