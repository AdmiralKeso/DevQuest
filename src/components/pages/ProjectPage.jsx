import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import { COMMON_DOC_LINKS, COMMON_GETTING_STARTED, COMMON_REQUIREMENTS, SKILLS, STACKS } from '../../data/objectives.js'
import { isInProgress, saveProjectLink } from '../../hooks/useInProgress.js'
import { useProjectLink } from '../../hooks/useProjectLink.js'
import { useLocalStorage } from '../../hooks/useLocalStorage.js'
import { useProgress } from '../../hooks/useProgress.js'
import { saveCompletedProject } from '../../hooks/useCompletedProjects.js'
import { useSqlCode } from '../../hooks/useSqlCode.js'
import { detectSteps, isAutoTracked } from '../../sync/detectSteps.js'
import { detectSqlSteps, readSql } from '../../sync/readSql.js'
import CodeText from '../CodeText.jsx'
import ProjectLink from '../ProjectLink.jsx'
import ProjectTags from '../ProjectTags.jsx'
import SqlEditor from '../SqlEditor.jsx'
import StackBadge from '../StackBadge.jsx'
import StatCircle from '../StatCircle.jsx'
import StepList from '../StepList.jsx'
import StructureTree from '../StructureTree.jsx'

const sameIds = (a, b) => a.length === b.length && a.every((id) => b.includes(id))

export default function ProjectPage({ project }) {
  const stack = STACKS.find((s) => s.id === project.stack)
  const [completed, updateCompleted] = useProgress(project.id)
  const link = useProjectLink(project.id)
  // SQL projects (`editor: 'sql'`) are written in a text box under the rings and checked from it, not from GitHub
  const sqlProject = project.editor === 'sql'
  const [sql, setSql] = useSqlCode(project.id)
  const statements = useMemo(() => (sqlProject ? readSql(sql) : []), [sqlProject, sql])
  const startedSql = sqlProject && sql.trim() !== ''
  // Back goes to In progress when the project was in progress when the page opened (or was refreshed);
  // linking or unlinking during the visit doesn't change it.
  const [cameFromInProgress] = useState(() => isInProgress(project, completed))

  // Remembered for "Continue" on the main menu.
  const [, setLastProject] = useLocalStorage('devquest.lastProject', null)
  useEffect(() => setLastProject(project.id), [project.id, setLastProject])

  const steps = project.steps ?? []
  // Everything needed before starting: common to all projects, then the stack's, then this project's extras.
  // SQL projects are checked in the browser from their text box, so they need nothing installed: only their own
  // requirements count (none so far), not Git, a GitHub repository or the stack's database.
  const requirements = [
    ...new Set([
      ...(sqlProject ? [] : [...COMMON_REQUIREMENTS, ...(stack.requirements ?? [])]),
      ...(project.requirements ?? []),
    ]),
  ]
  // Tools (apps, APIs) to build it with: the stack's, then this project's.
  const tools = [...(stack.tools ?? []), ...(project.tools ?? [])]
  // Docs in the same order: common, the stack's, then this project's tools.
  const docLinks = [...COMMON_DOC_LINKS, ...(stack.docLinks ?? []), ...(project.docLinks ?? [])]
  // How to start: setting up a project in this stack, then linking it here (or the project's own, e.g. for SQL).
  const gettingStarted = project.gettingStarted ?? [...(stack.gettingStarted ?? []), ...COMMON_GETTING_STARTED]
  const tracked = steps.filter(isAutoTracked)
  const syncing = sqlProject || (link.repo !== null && link.files !== null)
  const doneCount = steps.filter((s) => completed.includes(s.id)).length
  const percent = steps.length === 0 ? 0 : Math.round((doneCount / steps.length) * 100)
  const finished = steps.length > 0 && doneCount === steps.length
  // Tips for the steps that aren't done yet, in step order.
  const tipSteps = steps.filter((s) => s.tip && !completed.includes(s.id))

  // A finished project is saved in the database (steps themselves stay in localStorage).
  useEffect(() => {
    if (finished) saveCompletedProject(project.id)
  }, [finished, project.id])

  // Skill rings: the share of each skill's steps (tracked and to do) that are done.
  const skillStats = SKILLS.map((skill) => {
    const skillSteps = steps.filter((s) => s.skill === skill.id)
    const done = skillSteps.filter((s) => completed.includes(s.id)).length
    return { ...skill, total: skillSteps.length, done }
  })

  // "All objectives" lists every category (skill) in one scrolling list. The category header and the
  // skill rings scroll to a category; the header highlights the one in view. Tracked steps without a skill go in "Other".
  const categories = [
    ...SKILLS.map((skill) => ({ ...skill, steps: tracked.filter((s) => s.skill === skill.id) })),
    { id: 'other', label: 'Other', steps: tracked.filter((s) => !SKILLS.some((skill) => skill.id === s.skill)) },
  ].filter((c) => c.steps.length > 0)
  const listRef = useRef(null)
  const [visibleCategory, setVisibleCategory] = useState(null)
  const activeCategory = visibleCategory ?? categories[0]?.id

  const sectionOf = (categoryId) => listRef.current?.querySelector(`[data-category="${categoryId}"]`)

  // While a click-started scroll is moving, scroll events don't change the highlight, so a category near the
  // bottom (which can't reach the top of the list) stays highlighted instead of jumping to the last one.
  const clickScroll = useRef({ active: false, timer: null })

  function scrollToCategory(categoryId) {
    const list = listRef.current
    const section = sectionOf(categoryId)
    if (!list || !section) return
    clearTimeout(clickScroll.current.timer)
    clickScroll.current = { active: true, timer: setTimeout(() => (clickScroll.current.active = false), 800) }
    list.scrollTo({ top: section.offsetTop, behavior: 'smooth' })
    setVisibleCategory(categoryId)
  }

  // The category in view is the last one whose heading has scrolled to (or past) the top of the list.
  // Section positions are relative to the list (it is position: relative in App.css).
  function updateVisibleCategory() {
    const list = listRef.current
    if (!list || clickScroll.current.active) return
    const top = list.scrollTop + 8
    const atBottom = list.scrollTop + list.clientHeight >= list.scrollHeight - 2
    const current = atBottom
      ? categories.at(-1)
      : categories.findLast((c) => (sectionOf(c.id)?.offsetTop ?? Infinity) <= top)
    setVisibleCategory(current?.id ?? categories[0]?.id ?? null)
  }

  // While a repository is linked (or for SQL, always), auto-tracked steps follow its files or the SQL text box;
  // manual steps are left alone.
  useEffect(() => {
    if (!syncing) return
    const projectSteps = project.steps ?? []
    const detected = sqlProject ? detectSqlSteps(projectSteps, statements) : detectSteps(projectSteps, link.files)
    const autoIds = projectSteps.filter(isAutoTracked).map((s) => s.id)
    updateCompleted((current) => {
      const next = [...current.filter((id) => !autoIds.includes(id)), ...detected]
      return sameIds(next, current) ? current : next
    })
  }, [syncing, sqlProject, statements, link.files, project, updateCompleted])

  // A SQL project is in progress once something is written in its text box (the same list linking adds to).
  useEffect(() => {
    if (startedSql) saveProjectLink(project.id, true)
  }, [startedSql, project.id])

  // Unlinking also unticks the auto-tracked steps, since nothing tracks them anymore.
  function unlink() {
    link.unlink()
    const autoIds = tracked.map((s) => s.id)
    updateCompleted((current) => {
      const next = current.filter((id) => !autoIds.includes(id))
      return next.length === current.length ? current : next
    })
  }

  function toggleStep(stepId) {
    updateCompleted((current) =>
      current.includes(stepId) ? current.filter((id) => id !== stepId) : [...current, stepId],
    )
  }

  const listProps = { completed, syncing, onToggle: toggleStep }

  // All objectives: in the left column under the rings, or on SQL projects (where the text box takes the left
  // column) a row of its own across the full width, between the columns and Docs.
  const objectives = (
    <section className="objectives">
      <h2>All objectives</h2>
      <p className="section-note">
        {sqlProject
          ? 'Ticked off automatically from the SQL in the text box.'
          : 'Ticked off automatically when you link your GitHub repository.'}
      </p>

      {categories.length === 0 && (
        <p className="placeholder">No objectives that can be tracked yet.</p>
      )}

      {categories.length > 0 && (
        <>
          <nav className="category-nav" aria-label="Categories">
            <ul>
              {categories.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className={`category-link ${c.id === activeCategory ? 'active' : ''}`}
                    aria-current={c.id === activeCategory}
                    onClick={() => scrollToCategory(c.id)}
                  >
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Only this list scrolls; the title and category header above stay in place. */}
          <div className="objectives-scroll" ref={listRef} onScroll={updateVisibleCategory}>
            {categories.map((c) => {
              const done = c.steps.filter((s) => completed.includes(s.id)).length
              return (
                <section key={c.id} className={`objective-category category-${c.id}`} data-category={c.id}>
                  <h3 className="category-title">
                    {c.label}
                    <span className="category-progress">
                      {' '}
                      · {done} of {c.steps.length} done
                    </span>
                  </h3>
                  <StepList {...listProps} steps={c.steps} />
                </section>
              )
            })}
          </div>
        </>
      )}
    </section>
  )

  // Project page template: every project fills the same sections, with placeholders for missing details.
  return (
    <main className="project-page">
      <header className="page-header">
        {cameFromInProgress ? (
          <Link to="/projects/in-progress" className="back-link">
            ← Projects in progress
          </Link>
        ) : (
          <Link to={`/stack/${stack.id}`} className="back-link">
            ← {stack.label} projects
          </Link>
        )}
        <div className="project-title">
          <h1>{project.title}</h1>
          <StackBadge stackId={stack.id} />
          <ProjectTags tags={project.tags} />
        </div>
      </header>

      <div className="project-layout">
        <div className="project-main">
          <section className="stats">
            <StatCircle
              className="stat-progress"
              label={project.title}
              value={`${percent}%`}
              percent={percent}
            />
            {skillStats.map((skill) => {
              const hasCategory = categories.some((c) => c.id === skill.id)
              return (
                <StatCircle
                  key={skill.id}
                  className={`stat-${skill.label.toLowerCase().replaceAll(' ', '-')}`}
                  label={skill.label}
                  value={skill.total ? `${Math.round((skill.done / skill.total) * 100)}%` : '-'}
                  percent={skill.total ? Math.round((skill.done / skill.total) * 100) : null}
                  onClick={hasCategory ? () => scrollToCategory(skill.id) : undefined}
                  selected={hasCategory && activeCategory === skill.id}
                />
              )
            })}
          </section>
          {finished && (
            <p className="complete">Project complete!</p>
          )}

          {sqlProject && <SqlEditor value={sql} onChange={setSql} statements={statements} />}

          {!sqlProject && objectives}
        </div>

        <aside className="project-panel">
          <ProjectLink project={{ ...link, unlink }} disabled={sqlProject} />

          {requirements.length > 0 && (
            <section className="requirements">
              <h2>Requirements:</h2>
              <ul className="requirement-list">
                {requirements.map((requirement) => (
                  <li key={requirement}>{requirement}</li>
                ))}
              </ul>
            </section>
          )}

          {project.structure && (
            <section className="structure">
              <h2>Required structure:</h2>
              <StructureTree lines={project.structure} />
            </section>
          )}

          {tools.length > 0 && (
            <section className="tools">
              <h2>Tools:</h2>
              {/* Each tool: its name as a small heading, the URL written out under it */}
              {tools.map((tool) => (
                <div key={tool.url} className="tool">
                  <h3>{tool.label}</h3>
                  <a href={tool.url} target="_blank" rel="noreferrer">
                    {tool.url}
                  </a>
                </div>
              ))}
            </section>
          )}

          <section className="todo static-analysis">
            <h2>Static Analysis</h2>
            <p className="js-linter">
              <Link to={`/projects/${project.id}/js-linter`} className="js-linter-link">
                Js Linter
              </Link>
              <span className="coming-soon">Coming soon</span>
            </p>
          </section>
        </aside>

        {sqlProject && objectives}

        {/* Docs: its own block across the full width, under All objectives and the panel:
            how to start and documentation links side by side, then tips for the steps still to do across the width */}
        <section className="docs">
          <div className="docs-start">
            <h2>How to start</h2>
            <ol className="start-list">
              {gettingStarted.map((item) => (
                <li key={item}>
                  <CodeText text={item} />
                </li>
              ))}
            </ol>
          </div>

          <div className="docs-links">
            <h2>Docs</h2>
            <ul className="doc-list">
              {docLinks.map((docLink) => (
                <li key={docLink.url}>
                  <a href={docLink.url} target="_blank" rel="noreferrer">
                    {docLink.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="docs-tips">
            <h2>Tips</h2>
            {tipSteps.length === 0 ? (
              <p className="placeholder">Every step is done.</p>
            ) : (
              <ul className="tip-list">
                {tipSteps.map((step) => (
                  <li key={step.id}>
                    <span className="tip-step">
                      <CodeText text={step.title} />:
                    </span> <CodeText text={step.tip} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
