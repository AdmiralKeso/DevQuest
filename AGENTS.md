Imagine an app where a user chooses what they want to achieve, and the platform helps them build a website that accomplishes that goal.

1. Choose an objective
Users start with a goal instead of a blank canvas.
- Build a portfolio
- Create an online store
- Launch a landing page
- Build a blog
- Create a business website
- Easy, Medium, Hard (removed for now, will be added back later)

Categories (sidebar on the left) are tech stacks:
- Laravel, Django, Node, React
- Each project card belongs to exactly one stack, with steps and tips specific to that stack
- The same goal can have one card per stack with the same title (e.g. "Build a portfolio" has `portfolio-react` and `portfolio-node`)
- Picking a stack shows its projects; "All projects" shows everything
- Clicking a card only routes to the project's own page. Nothing opens or expands on the list itself.
- The sidebar is only on the main page (`/` and `/stack/:stackId`), not on project pages.

Project page template
- Every project fills the same page. Header (back link, title, description, stack badge, docs link), then two columns:
  - Left: stat circles (All objectives progress, Knowledge, Redundant, Complexity), then the "All objectives" box with the auto-tracked steps, 5 per page with < > buttons
  - Right panel: "Link to project" (just the button plus "Files stay in your browser."), then "To do" (steps that can't be tracked, ticked by hand), which takes the rest of the height
- Knowledge, Redundant and Complexity are placeholders ("-") until it's decided what they measure
- The app fills the browser window with no page scroll (`#root` is `100dvh`). Areas that can overflow (project list, All objectives, To do) scroll inside themselves. Below 720px wide the columns stack and the page scrolls normally.
- Only `id`, `title` and `stack` are required; a missing description or steps shows a placeholder. A commented template for new projects is above OBJECTIVES in `objectives.js`.

2. Syncing of files
- Import files into objective: on a project page the user links the folder they code in ("Link folder"). Each project remembers its own folder.
- App tracks progress and objectives: while linked, the folder is rescanned every 2 seconds and steps are ticked off automatically when their code is found (and unticked if it is removed)
- Steps with a `check` in `objectives.js` are auto-tracked; steps without one (deploying, Lighthouse, etc.) stay manual checkboxes
- Uses the browser File System Access API: works in Chrome and Edge only. Other browsers show a note and all steps stay manual.
- Files are only read in the browser, never uploaded. `node_modules`, `vendor`, `.git`, `dist`, `venv` and similar folders are skipped.
- Browsers forget folder permission between visits, so the user may need to click "Reconnect folder"
- Tips and tricks: removed from the project page for now. Every step still has a `tip` in `objectives.js` for when it comes back.
- Progress bar (now the "All objectives progress" circle)

Developing
- No emotes: no emoji or icon symbols anywhere in the UI or data
- Simple design: the user styles the app themselves. CSS is layout only (no colors, shadows, rounded corners, animations). Keep class names on elements and use modifier classes (.active, .done) for state so they can be styled later.

Tech
- React + Vite (JavaScript, no TypeScript), React Router for pages
- `npm run dev` to develop, `npm run build` outputs to `dist/` (gitignored, don't commit or edit)
- Progress is saved per project in the browser via localStorage, key `devquest.progress`: `{ [projectId]: [completed step ids] }`

Routes
- `/` all projects
- `/stack/:stackId` projects for one stack
- `/projects/:projectId` project page (see Project page template)
- anything else shows "Page not found"

Structure
- `src/data/objectives.js`: all content. STACKS and OBJECTIVES (projects with `stack`, steps and tips). Add or change content here, not in components.
- `src/App.jsx`: header and routes; `MainPage` puts the sidebar next to the project list
- `src/components/Sidebar.jsx`: tech stack links (no collapse for now)
- `src/components/ProjectList.jsx`: project cards, each a link to its project page
- `src/components/ProjectPage.jsx`: the project page template (sections with placeholders), saved progress; applies folder detection to auto-tracked steps
- `src/components/StatCircle.jsx`: round stat with a value and label
- `src/components/StepList.jsx`: step checklist, optional paging (< >)
- `src/components/FolderSync.jsx`: "Link to project" box: link / reconnect / unlink folder
- `src/hooks/useLinkedFolder.js`: linked folder state per project and the 2-second rescan
- `src/sync/handleStore.js`: saves folder handles in IndexedDB (they can't go in localStorage)
- `src/sync/readFolder.js`: reads the folder's files, skipping installed/generated folders, caching unchanged files
- `src/sync/detectSteps.js`: matches step `check` rules (file path regex + optional content regex) against the files
- `src/components/StackBadge.jsx`: stack label with a `data-stack` attribute for per-stack styling
- `src/App.css`: layout-only styles

Commit rules.
- Commit per feature, break it down in steps
- Accurate and small commit that only explains a certain feature
- Use add, update, fix, remove
- Always ask before commiting or wait when told to.
