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
- The sidebar is only on the projects page (`/projects` and `/stack/:stackId`), not on project pages.

Main menu
- `/` is a board of white tiles with a 2px black border on a white background with `src/assets/images/attachments/attachment1.png` (a sand wave) pinned to the top-right corner (cover; on phones scaled to the width) and `attachment2.png` (developer illustration) in the bottom-left corner, one `--menu-gap` in from the edges, up to 36% of the width / 520px (55% on phones); both sit behind the tiles; filling the window, from the user's sketch: three columns of different widths whose tiles split at different heights, so they are uneven but fit together.
- One gap (`--menu-gap`) between all tiles and above/below the board; the left and right edges use the universal `--side-margin`. This page has real colours by request; other pages stay layout-only.
- Tiles: left Continue (big) + New Project; middle What is DevQuest (About) + How to play + Achievements; right Profile + Docs. On phones they stack in one column. Image tiles (Continue, New Project, Useful links, Achievements, Profile, Instructions) have a light orange arrow along the bottom with the label, half the tile's width from the left and pointing right; on hover and keyboard focus it slides across to the right edge and fades to orange. When the page loads the top tile of each column slides down from above and the others slide up from below, column by column (both off with reduced motion).
- Continue opens the last opened project, or the project list ("Start your first quest") when none has been opened yet.
- Header above the tiles (same gap above and below): the logo (`src/assets/images/logo/logodevquest.png`) on the left, then the "DevQuest" title with the tagline "Pick a quest. Build a real website. Level up your skills." under it, both on one left edge; a nav justified to the right (Log in, Sign up, Docs, About, then a language dropdown; nav links have no underline, only Sign up has a border), lined up with the right edge of the tiles and kept on the right when it wraps on phones. The small site header used on other pages is hidden here.
- Footer under the tiles (same gap above and below): "© <year> DevQuest · Terms and conditions" (link to /terms) and "Learn web development one quest at a time".

Project page template
- Every project fills the same page. Header (back link, title, stack badge, docs link; the description only shows on the main page cards), then two columns:
  - Left: stat circles (overall progress titled with the project name, then Code Comprehension, Semantic HTML, Defensive Programming, Responsive), then the "All objectives" box with the auto-tracked steps: a small header listing the category (skill) names, then every category on one list that scrolls inside the box
  - Right panel: "Link to project" (GitHub URL field and button, plus "Public GitHub repositories only."), then a small "Requirements" box (what you need before starting, as one dot-separated line), then a small "Docs" box (documentation links, same style), then "Static Analysis" (just a "Js Linter" button to the project's Js Linter page), which takes the rest of the height
- Skills (categories): every step has a `skill` (Code Comprehension, Semantic HTML, Defensive Programming or Responsive; deploy steps have none). Each skill ring shows the % of that skill's steps that are done (tracked and to do), or "-" when the project has no steps for it.
- Rings and "All objectives" are linked: clicking a category name in the header or a skill ring scrolls the list to that category, and the header and ring highlight the category in view (classes `.category-link.active`, `.stat-circle.selected`). Categories with no tracked steps are skipped, and tracked steps without a skill go in "Other".
- Universal side margin: `--side-margin` in `src/index.css` sets the left and right margin of every page, including the main menu. Laptops get a small margin (3% of the width, 16-48px); on wider screens content stays at most `--content-max` (currently 1000px) wide and the rest becomes margin.
- The app fills the browser window with no page scroll (`#root` is `100dvh`). Areas that can overflow (project list, All objectives, Static Analysis) scroll inside themselves. Below 720px wide the columns stack and the page scrolls normally.
- Requirements = `COMMON_REQUIREMENTS` (Git, a public GitHub repository) + the stack's `requirements` + the project's optional `requirements` (e.g. a Stripe account for store payments), all in `objectives.js`.
- Docs = `COMMON_DOC_LINKS` (MDN Web Docs) + the stack's `docLinks` + the project's optional `docLinks` (e.g. Stripe Checkout, Giscus), all in `objectives.js`. Links open in a new tab.
- Only `id`, `title` and `stack` are required; missing steps show a placeholder. A commented template for new projects is above OBJECTIVES in `objectives.js`.

2. Syncing of files
- Import files into objective: on a project page the user pastes a public GitHub repository URL and clicks "Link to project". Each project remembers its own repository.
- GitHub only, read-only through the GitHub API. No local folders and no folder storage.
- Accepted URLs: `github.com/{owner}/{repo}`, optionally `.git` or `/tree/{branch}/{subfolder}` (default branch if none; branch names with a slash aren't supported)
- App tracks progress and objectives: while linked, the repository is checked every 30 seconds (plus a "Check now" button), and steps are ticked off automatically when their code is found in the latest commit (and unticked if it is removed)
- "Link to project" and "Check now" each have a 5-second cooldown after use (`src/hooks/useCooldown.js`), so repeated clicks can't flood the GitHub API. Clicking Link to project during it sends nothing and shows "Too many requests. Please wait a moment before trying again." Only one link request runs at a time.
- GitHub allows 60 API requests an hour without a login. One check = one request for the latest commit (unchanged answers don't count, via ETag) and, only on a new commit, one request for the file tree. File contents come from raw.githubusercontent.com (no limit) and are cached by blob sha, so only changed files are downloaded.
- Steps with a `check` in `objectives.js` are auto-tracked; steps without one (deploying, Lighthouse, etc.) are not shown on the page right now (the manual list was removed from Static Analysis), but still count toward progress
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
- The last opened project is saved in localStorage, key `devquest.lastProject`, for "Continue" on the main menu
- The chosen language is saved in localStorage, key `devquest.language` (en, nl, de, fr, es), and set as `<html lang>`. There are no translations yet; all text is English.
- Linked repositories are saved in localStorage, key `devquest.links`: `{ [projectId]: { owner, repo, branch, path } }`

Routes
- `/` main menu (tile board, no site header): Continue, New Project, What is DevQuest, How to play, Achievements, Profile, Docs
- `/how-to-play`, `/docs`, `/about`, `/achievements`, `/profile` pages from the main menu (Achievements and Profile are empty placeholders for now)
- `/terms` terms and conditions, linked from the main menu footer
- `/login`, `/signup` from the main menu header nav (empty placeholders; there are no accounts yet)
- `/projects` all projects
- `/stack/:stackId` projects for one stack
- `/projects/:projectId` project page (see Project page template)
- `/projects/:projectId/js-linter` Js Linter page for that project (empty for now), opened from Static Analysis
- anything else shows "Page not found"

Structure
- `src/data/objectives.js`: all content. STACKS (with requirements and docLinks), COMMON_REQUIREMENTS, COMMON_DOC_LINKS, SKILLS and OBJECTIVES (projects with `stack`, steps with tips and a `skill`). Add or change content here, not in components.
- `src/App.jsx`: header (hidden on the main menu) and routes; `ProjectsPage` puts the sidebar next to the project list
- `src/components/MainMenu.jsx`: the main menu tile board
- `src/components/InfoPage.jsx`: shared layout for How to play, Docs and About (back link to the menu, title, scrolling content)
- `src/components/HowToPlay.jsx`, `DocsPage.jsx`, `AboutPage.jsx`, `AchievementsPage.jsx`, `ProfilePage.jsx`: the menu pages (Docs uses `GETTING_STARTED_DOC_LINKS` and each stack's `docLinks`; Achievements and Profile are empty for now)
- `src/components/TermsPage.jsx`: terms and conditions (empty placeholder for now; the terms will be added later)
- `src/components/LoginPage.jsx`, `SignupPage.jsx`: Log in and Sign up pages (empty placeholders until accounts are added)
- `src/components/LanguageSelect.jsx`: language dropdown in the main menu nav (remembers the choice; translations to be added)
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
- `src/components/JsLinterPage.jsx`: Js Linter page for a project (empty placeholder; the linter will be added later)
- `src/components/StackBadge.jsx`: stack label with a `data-stack` attribute for per-stack styling
- `src/App.css`: layout-only styles

Commit rules.
- Commit per feature, break it down in steps
- Accurate and small commit that only explains a certain feature
- Use add, update, fix, remove
- Always ask before commiting or wait when told to.
- Push to main directly
