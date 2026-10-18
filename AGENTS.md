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
  - Left: stat circles (All objectives progress, Code Comprehension, Semantic HTML, Defensive Programming, Responsive), then the "All objectives" box with the auto-tracked steps: a small header listing the category (skill) names, then every category on one list that scrolls inside the box
  - Right panel: "Link to project" (GitHub URL field and button, plus "Public GitHub repositories only."), then "To do" (steps that can't be tracked, ticked by hand), which takes the rest of the height
- Skills (categories): every step has a `skill` (Code Comprehension, Semantic HTML, Defensive Programming or Responsive; deploy steps have none). Each skill ring shows the % of that skill's steps that are done (tracked and to do), or "-" when the project has no steps for it.
- Rings and "All objectives" are linked: clicking a category name in the header or a skill ring scrolls the list to that category, and the header and ring highlight the category in view (classes `.category-link.active`, `.stat-circle.selected`). Categories with no tracked steps are skipped, and tracked steps without a skill go in "Other".
- The app fills the browser window with no page scroll (`#root` is `100dvh`). Areas that can overflow (project list, All objectives, To do) scroll inside themselves. Below 720px wide the columns stack and the page scrolls normally.
- Only `id`, `title` and `stack` are required; a missing description or steps shows a placeholder. A commented template for new projects is above OBJECTIVES in `objectives.js`.

2. Syncing of files
- Import files into objective: on a project page the user pastes a public GitHub repository URL and clicks "Link to project". Each project remembers its own repository.
- GitHub only, read-only through the GitHub API. No local folders and no folder storage.
- Accepted URLs: `github.com/{owner}/{repo}`, optionally `.git` or `/tree/{branch}/{subfolder}` (default branch if none; branch names with a slash aren't supported)
- App tracks progress and objectives: while linked, the repository is checked every 30 seconds (plus a "Check now" button), and steps are ticked off automatically when their code is found in the latest commit (and unticked if it is removed)
- "Link to project" and "Check now" each have a 5-second cooldown after use (`src/hooks/useCooldown.js`), so repeated clicks can't flood the GitHub API. Clicking Link to project during it sends nothing and shows "Too many requests. Please wait a moment before trying again." Only one link request runs at a time.
- GitHub allows 60 API requests an hour without a login. One check = one request for the latest commit (unchanged answers don't count, via ETag) and, only on a new commit, one request for the file tree. File contents come from raw.githubusercontent.com (no limit) and are cached by blob sha, so only changed files are downloaded.
- Steps with a `check` in `objectives.js` are auto-tracked; steps without one (deploying, Lighthouse, etc.) stay manual checkboxes
- `node_modules`, `vendor`, `.git`, `dist`, `venv` and similar folders are skipped. Private repositories aren't supported (they would need a GitHub token).
- Tips and tricks: removed from the project page for now. Every step still has a `tip` in `objectives.js` for when it comes back.
- Progress bar (now the "All objectives progress" circle)

Developing
- No emotes: no emoji or icon symbols anywhere in the UI or data
- Simple design: the user styles the app themselves. CSS is layout only (no colors, shadows, rounded corners, animations). Keep class names on elements and use modifier classes (.active, .done) for state so they can be styled later.

Tech
- React + Vite (JavaScript, no TypeScript), React Router for pages
- Tailwind CSS v4 via `@tailwindcss/vite` (no config file; customise with `@theme` in `src/index.css`). Style with utility classes in `className`.
- CSS layers, lowest to highest: `base` (`src/index.css`: root layout and plain defaults after Tailwind's reset), `components` (`src/App.css`: layout rules), `utilities` (Tailwind classes). Utility classes always win, so styling never needs `!important`.
- `npm run dev` to develop, `npm run build` outputs to `dist/` (gitignored, don't commit or edit)
- Progress is saved per project in the browser via localStorage, key `devquest.progress`: `{ [projectId]: [completed step ids] }`
- Linked repositories are saved in localStorage, key `devquest.links`: `{ [projectId]: { owner, repo, branch, path } }`

Routes
- `/` all projects
- `/stack/:stackId` projects for one stack
- `/projects/:projectId` project page (see Project page template)
- anything else shows "Page not found"

Structure
- `src/data/objectives.js`: all content. STACKS, SKILLS and OBJECTIVES (projects with `stack`, steps with tips and a `skill`). Add or change content here, not in components.
- `src/App.jsx`: header and routes; `MainPage` puts the sidebar next to the project list
- `src/components/Sidebar.jsx`: tech stack links (no collapse for now)
- `src/components/ProjectList.jsx`: project cards, each a link to its project page
- `src/components/ProjectPage.jsx`: the project page template (sections with placeholders), saved progress; applies repository detection to auto-tracked steps
- `src/components/StatCircle.jsx`: round stat with a value and label; a button when given `onClick` (skill rings)
- `src/components/StepList.jsx`: step checklist (auto-tracked steps can only be ticked by the repository)
- `src/components/ProjectLink.jsx`: "Link to project" box: GitHub URL form, or the linked repository with Check now / Unlink
- `src/hooks/useProjectLink.js`: linked repository per project (saved in localStorage) and the 30-second check
- `src/hooks/useCooldown.js`: short wait after an action before it can run again (used by the Link to project and Check now buttons)
- `src/sync/readGitHub.js`: parses GitHub URLs, checks the repository exists, reads its files through the GitHub API (skipping installed/generated folders, caching unchanged files)
- `src/sync/detectSteps.js`: matches step `check` rules (file path regex + optional content regex) against the files
- `src/components/StackBadge.jsx`: stack label with a `data-stack` attribute for per-stack styling
- `src/App.css`: layout-only styles

Commit rules.
- Commit per feature, break it down in steps
- Accurate and small commit that only explains a certain feature
- Use add, update, fix, remove
- Always ask before commiting or wait when told to.
- Push to main directly
