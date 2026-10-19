Imagine an app where a user chooses what they want to achieve, and the platform helps them build a website that accomplishes that goal.

1. Choose an objective
Users start with a goal instead of a blank canvas.
- Build a portfolio
- Create an online store
- Launch a landing page
- Build a blog
- Create a business website
- Easy, Medium, Hard: each project has an optional `difficulty` (`DIFFICULTIES` in `objectives.js`), shown as a bold tab sitting on top of the card's top-right corner (`.difficulty-badge` with `data-difficulty`)

Categories (sidebar on the left) are tech stacks:
- Laravel, Django, Node, React (Frameworks); JavaScript, Python (Functional programming); Java, C++, Python, JavaScript (Object-oriented programming); HTML, CSS, JavaScript (UX); Node, Java, Python, SQL (Server programming)
- Each project card belongs to exactly one stack, with steps and tips specific to that stack
- The same goal can have one card per stack with the same title (e.g. "Build a portfolio" has `portfolio-react` and `portfolio-node`)
- Picking a stack shows its projects; "All projects" shows everything
- Stacks are grouped (`GROUPS` in `objectives.js`, `groups` on each stack, a stack can be in more than one): Frameworks (Laravel, Django, Node, React), Functional programming (JavaScript, Python), Object-oriented programming (Java, C++, Python, JavaScript), UX (HTML, CSS, JavaScript) and Server programming (Node, Java, Python, SQL). Only the Frameworks stacks have projects so far; stacks without projects show an empty message. The sidebar shows All projects and In progress (links), then each group (Functional programming, Object-oriented programming, UX, Frameworks, Server programming last) as a dropdown: an `h3` heading (`.category-group-heading`) with a button (`.category-group-toggle`, `aria-expanded`) that opens or closes its stack links indented under it (`.category-group.open`). Groups start closed, except the ones holding the stack being viewed. All projects and In progress are plain links, not dropdowns
- "In progress" (`/projects/in-progress`) shows the projects that were started by linking a repository (saved in localStorage only, not in the database) and are not completed yet; each card there has a Quit button (`.quit-button`, a single red X with the label "Quit" for screen readers, in the card's bottom-right corner, next to the card's link rather than inside it) that takes the project off In progress while keeping its steps; unlinking also removes a project from it, finishing it (all steps done, or saved as finished in the database) moves it to Profile
- Clicking a card only routes to the project's own page. Nothing opens or expands on the list itself.
- Cards look like the main menu tiles: white with a 2px dark grey border, title, description, and the stack badge (also with a 2px border) at the bottom.
- The sidebar is only on the projects pages (`/projects`, `/projects/in-progress` and `/stack/:stackId`), not on project pages.

Main menu
- Every page has the same background (on `#root` in `src/App.css`, behind everything): white with `src/assets/images/attachments/attachment1.png` (a sand wave) pinned to the top-right corner (cover; on phones scaled to the width). Only the main menu (`#root:has(.page-content.home)`) also has `attachment2.png` (developer illustration) in the bottom-left corner, one `--menu-gap` in from the edges, up to 36% of the width / 520px (55% on phones)
- `/` is a board of white tiles with a 2px dark grey border on that background (both images sit behind the tiles), filling the window, from the user's sketch: three columns of different widths whose tiles split at different heights, so they are uneven but fit together.
- One gap (`--menu-gap`) between all tiles and above/below the board; the left and right edges use `--header-side-margin`, so the board lines up with the header on every page. This page, the project cards, the shared header and the progress rings have real colours by request; other pages stay layout-only.
- Tiles: left Continue (big) + New Project; middle What is DevQuest (About) + How to play + Achievements; right Profile + Docs. On phones they stack in one column. Image tiles (Continue, New Project, Useful links, Achievements, Profile, Instructions) have a light orange arrow along the bottom with a Font Awesome icon (loaded from cdnjs in `index.html`) and the label, half the tile's width from the left and pointing right; on hover and keyboard focus it slides across to the right edge and fades to orange. When the page loads the top tile of each column slides down from above and the others slide up from below, column by column (both off with reduced motion). The other pages come in the same way (`src/App.css`): on the projects page the sidebar, header and project cards (one after another) all slide down, and on a project page the header and both columns (left, then right) slide down; on the other pages (How to play, Docs, About, Achievements, Profile, Terms, Js Linter) the header and then the content slide down; the shared site header stays still.
- Continue opens the last opened project, or the project list ("Start your first quest") when none has been opened yet.
- Header (`src/components/SiteHeader.jsx`, the same on every page and in the same place): the logo (`src/assets/images/logo/logodevquest.png`) on the left, then the "DevQuest" title with the tagline "Pick a quest. Build a real website. Level up your skills." under it, both on one left edge; a nav justified to the right (Docs, About, then a language dropdown; nav links have no underline), kept on the right when it wraps on phones. On the main menu it sits inside the board (the title is the page's h1); on other pages the logo and title link back to the menu.
- Footer under the tiles (same gap above and below): "© <year> DevQuest · Terms and conditions" (link to /terms) and "Learn web development one quest at a time".

Project page template
- Every project fills the same page. Header (back link, title, stack badge, docs link; the description only shows on the main page cards), then two columns:
  - Left: stat circles (progress rings with the percentage inside and the name under them: overall progress titled with the project name, then Code Comprehension, Semantic HTML, Defensive Programming, Responsive), then the "All objectives" box with the auto-tracked steps: a small header listing the category (skill) names, then every category on one list that scrolls inside the box
  - Right panel: "Link to project" (GitHub URL field and button, plus "Public GitHub repositories only."), then a small "Requirements" box (what you need before starting, as one dot-separated line), then "Static Analysis" (just a "Js Linter" button to the project's Js Linter page), which takes the rest of the height and grows to fit its content (no inner scroll)
  - Under both columns: the Docs block, its own block across the full width under All objectives and the right panel, with three parts side by side: "How to start" (the stack's `gettingStarted` then `COMMON_GETTING_STARTED`, numbered), "Tips" (the `tip` of each step not done yet) and "Docs" (documentation links as one dot-separated line)
- Skills (categories): every step has a `skill` (Code Comprehension, Semantic HTML, Defensive Programming or Responsive; deploy steps have none). Each skill ring shows the % of that skill's steps that are done (tracked and to do), or "-" when the project has no steps for it.
- Rings and "All objectives" are linked: clicking a category name in the header or a skill ring scrolls the list to that category, and the header and ring highlight the category in view (classes `.category-link.active`, `.stat-circle.selected`). Categories with no tracked steps are skipped, and tracked steps without a skill go in "Other".
- Universal page structure in `src/index.css`: `.site-header` (margin `--header-side-margin`, header at most `--header-max`, 1000px, wide) and `.page-content` around every page (margin `--side-margin`, content at most `--content-max`, 1600px, wide); `--menu-gap` above the header. Laptops get a small margin (3% of the width, 16-48px); on wider screens the rest becomes margin. On the main menu `.page-content.home` has no margin and the menu fills the window.
- The app fills the browser window with no page scroll (`#root` is `100dvh`). Areas that can overflow (project list, All objectives) scroll inside themselves. On project pages the whole window scrolls instead (`#root:has(.project-page)` drops the `100dvh` height), so the scrollbar covers the whole page and the Docs block under the columns always fits: All objectives and the panel are at least the rest of the window high (never under 600px), and All objectives keeps its inner scroll. Below 720px wide the columns stack and the page scrolls normally.
- Requirements = `COMMON_REQUIREMENTS` (Git, a public GitHub repository) + the stack's `requirements` + the project's optional `requirements` (e.g. a Stripe account for store payments), all in `objectives.js`.
- How to start = the stack's `gettingStarted` (how to set up a project in that stack) + `COMMON_GETTING_STARTED` (push to a public GitHub repository and link it), both in `objectives.js`.
- Docs = `COMMON_DOC_LINKS` (MDN Web Docs) + the stack's `docLinks` + the project's optional `docLinks` (e.g. Stripe Checkout, Giscus), all in `objectives.js`. Links open in a new tab.
- Only `id`, `title` and `stack` are required; missing steps show a placeholder. A commented template for new projects is above OBJECTIVES in `objectives.js`.

2. Syncing of files
- Import files into objective: on a project page the user pastes a public GitHub repository URL, or picks one from "Saved repositories" (every repository linked before, saved in the database, latest first), and clicks "Link to project". The link only lasts while the page is open; the user picks the repository again on each visit (ticked steps stay saved as progress).
- GitHub only, read-only through the GitHub API. No local folders and no folder storage.
- Accepted URLs: `github.com/{owner}/{repo}`, optionally `.git` or `/tree/{branch}/{subfolder}` (default branch if none; branch names with a slash aren't supported)
- App tracks progress and objectives: while linked, the repository is checked every 30 seconds (plus a "Check now" button), and steps are ticked off automatically when their code is found in the latest commit (and unticked if it is removed)
- "Link to project" and "Check now" each have a 5-second cooldown after use (`src/hooks/useCooldown.js`), so repeated clicks can't flood the GitHub API. Clicking Link to project during it sends nothing and shows "Too many requests. Please wait a moment before trying again." Only one link request runs at a time.
- GitHub allows 60 API requests an hour without a login. One check = one request for the latest commit (unchanged answers don't count, via ETag) and, only on a new commit, one request for the file tree. File contents come from raw.githubusercontent.com (no limit) and are cached by blob sha, so only changed files are downloaded.
- Steps with a `check` in `objectives.js` are auto-tracked; steps without one (deploying, Lighthouse, etc.) are not shown on the page right now (the manual list was removed from Static Analysis), but still count toward progress
- `node_modules`, `vendor`, `.git`, `dist`, `venv` and similar folders are skipped. Private repositories aren't supported (they would need a GitHub token).
- Tips: every step has a `tip` in `objectives.js`; the project page shows the tips of the steps not done yet under "Tips" in the Docs block.
- Progress bar (now the "All objectives progress" circle)

Developing
- No emotes: no emoji or icon symbols anywhere in the UI or data if not explicitly told so (the main menu tile icons were asked for).
- Borders: every border uses `--border-color` (`#4a4a4a`, a dark grey softer than black) from `:root` in `src/index.css`.
- Font: PT Serif from Google Fonts (linked in `index.html`), set as `--font-sans` in `@theme` in `src/index.css`.
- Simple design: the user styles the app themselves. CSS is layout only (no colors, shadows, rounded corners), apart from what was asked for (the colours listed above, the shared background and the slide-in animations). Keep class names on elements and use modifier classes (.active, .done) for state so they can be styled later.

Tech
- React + Vite (JavaScript, no TypeScript), React Router for pages
- Tailwind CSS v4 via `@tailwindcss/vite` (no config file; customise with `@theme` in `src/index.css`). Style with utility classes in `className`.
- CSS layers, lowest to highest: `base` (`src/index.css`: root layout and plain defaults after Tailwind's reset), `components` (`src/App.css`: layout rules), `utilities` (Tailwind classes). Utility classes always win, so styling never needs `!important`.
- `npm run dev` starts the app (Vite) and the local API together, `npm run server` the API alone, `npm run build` outputs to `dist/` (gitignored, don't commit or edit)
- Database: SQLite through knex (`knexfile.js`, file `db/devquest.sqlite3`, gitignored; path in `.env` as `DB_FILENAME`, see `.env.example`). Migrations live in `db/migrations`; `npm run migrate` pushes new ones (the API also runs them on start), `npm run migrate:rollback` undoes the last batch, `npm run migrate:make <name>` creates one. Tables: `completed_projects` (finished projects with `completed_at`) and `repositories` (saved repository URLs), one migration each. Migrations only create what is in use; add a new migration for a new table instead of creating tables ahead of time
- Local API (`server/index.js`, Express, port `API_PORT`, default 3001; Vite proxies `/api` to it). No users: it only runs on the local machine. `GET /api/completed-projects` returns the finished projects `[{ projectId, completedAt }]` (first finished first), `POST /api/completed-projects/:projectId` saves one (saving it again keeps the first date), `GET /api/repositories` returns the saved repositories (latest first), `POST /api/repositories` with `{ url, owner, repo, branch, path }` saves one after it was linked (linking it again moves it to the top)
- Steps are saved in the browser only, via localStorage, key `devquest.progress`: `{ [projectId]: [completed step ids] }` (`src/hooks/useProgress.js`). The database only saves finished projects: when every step of a project is done, the project page saves it once in `completed_projects` (`src/hooks/useCompletedProjects.js`); it stays saved even if steps are unticked later
- Projects in progress are saved in localStorage only (not in the database), key `devquest.inProgress`: `[project ids]`, most recently linked first
- The last opened project is saved in localStorage, key `devquest.lastProject`, for "Continue" on the main menu
- The chosen language is saved in localStorage, key `devquest.language` (en, nl, de, fr, es), and set as `<html lang>`. There are no translations yet; all text is English.

Routes
- `/` main menu (tile board, header inside the board): Continue, New Project, What is DevQuest, How to play, Achievements, Profile, Docs
- `/how-to-play`, `/docs`, `/about`, `/achievements`, `/profile` pages from the main menu (Achievements is an empty placeholder for now; Profile shows the completed projects)
- `/terms` terms and conditions, linked from the main menu footer
- `/projects` all projects
- `/projects/in-progress` projects that were linked and are not completed yet
- `/stack/:stackId` projects for one stack
- `/projects/:projectId` project page (see Project page template)
- `/projects/:projectId/js-linter` Js Linter page for that project (empty for now), opened from Static Analysis
- anything else shows "Page not found"

Structure
- `src/data/objectives.js`: all content. GROUPS, STACKS (with groups, requirements and docLinks), COMMON_REQUIREMENTS, COMMON_DOC_LINKS, SKILLS and OBJECTIVES (projects with `stack`, steps with tips and a `skill`). Add or change content here, not in components.
- `src/App.jsx`: site header (inside the board on the main menu), `.page-content` wrapper and routes; `ProjectsPage` puts the sidebar next to the project list
- `src/components/pages/`: one component per page (MainMenu, HowToPlay, DocsPage, AboutPage, AchievementsPage, ProfilePage, TermsPage, ProjectPage, JsLinterPage); shared pieces stay in `src/components/`
- `src/components/SiteHeader.jsx`: the header on every page (logo, title, tagline, nav)
- `src/components/pages/MainMenu.jsx`: the main menu tile board
- `src/components/InfoPage.jsx`: shared layout for How to play, Docs, About, Achievements, Profile and Terms (back link to the menu, title, scrolling content), using the full page width like the projects page
- `src/components/pages/HowToPlay.jsx`, `DocsPage.jsx`, `AboutPage.jsx`, `AchievementsPage.jsx`, `ProfilePage.jsx`: the menu pages (Docs uses `GETTING_STARTED_DOC_LINKS` and each stack's `docLinks`; Profile lists "Completed projects" as project cards: the finished projects from the database (in the order they were finished), plus any finished in localStorage the database missed; Achievements is empty for now)
- `src/components/pages/TermsPage.jsx`: terms and conditions (empty placeholder for now; the terms will be added later)
- `src/components/LanguageSelect.jsx`: language dropdown in the main menu nav (remembers the choice; translations to be added)
- `src/components/Sidebar.jsx`: All projects, In progress, and the groups with their stack links (groups are dropdowns; a stack in more than one group is listed under each)
- `src/components/ProjectList.jsx`: the project list (header and grid of project cards)
- `src/components/ProjectCard.jsx`: one project card (difficulty tab, title, description, stack badge) linking to its project page; used by the project list and Profile
- `src/components/pages/ProjectPage.jsx`: the project page template (sections with placeholders), saved progress; applies repository detection to auto-tracked steps
- `src/components/StatCircle.jsx`: round stat: a white disc with a ProgressRing filled to `percent` and the value inside, the label under the disc; a button when given `onClick` (skill rings)
- `src/components/ProgressRing.jsx`: SVG progress ring in the style of `src/assets/images/attachments/ProgressCircle .svg` (dark grey track `#2E2F2E`, cyan arc `#00C0E8` with rounded ends and a soft inner glow, starting at the top); when the page opens it waits for the slide-in (0.4s), then fills up from 0, and it moves smoothly when the value changes (off with reduced motion); its styling lives in the component (SVG attributes and Tailwind classes), not in App.css; it credits the Figma Community "Progress Circle" design (`DESIGN_SOURCE`, set as `data-design-source` on the SVG)
- `src/components/StepList.jsx`: step checklist (auto-tracked steps can only be ticked by the repository)
- `src/components/ProjectLink.jsx`: "Link to project" box: "Saved repositories" dropdown and GitHub URL form, or the linked repository with Check now / Unlink
- `src/hooks/useProjectLink.js`: linked repository for the open project (not saved; picked again each visit) and the 30-second check
- `src/hooks/useInProgress.js`: projects in progress (linked and not completed) from localStorage, and `saveProjectLink` used by useProjectLink on link and unlink
- `src/hooks/useRepositories.js`: saved repositories from the API, for the "Saved repositories" dropdown
- `src/hooks/useProgress.js`: saved steps in localStorage (`useProgress(projectId)` for one project, `useAllProgress()` for all) and `isProjectCompleted`
- `src/hooks/useCompletedProjects.js`: finished projects in the database (`useCompletedProjects()` to read them, `saveCompletedProject(projectId)` to save one)
- `src/hooks/useCooldown.js`: short wait after an action before it can run again (used by the Link to project and Check now buttons)
- `src/sync/readGitHub.js`: parses GitHub URLs, checks the repository exists, reads its files through the GitHub API (skipping installed/generated folders, caching unchanged files)
- `src/sync/detectSteps.js`: matches step `check` rules (file path regex + optional content regex) against the files
- `src/components/pages/JsLinterPage.jsx`: Js Linter page for a project (empty placeholder; the linter will be added later)
- `src/components/StackBadge.jsx`: stack label with a `data-stack` attribute for per-stack styling
- `src/App.css`: layout styles (plus the colours asked for on the main menu, header and project cards)

Commit rules.
- Commit per feature, break it down in steps
- Accurate and small commit that only explains a certain feature
- Use add, update, fix, remove
- Always ask before commiting or wait when told to.
- Push to main directly
