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

2. Syncing of files
- Import files into objective (not built yet)
- App tracks progress and objectives
- Tips and tricks
- Progress bar

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
- `/projects/:projectId` project page: steps checklist, tips, progress bar
- anything else shows "Page not found"

Structure
- `src/data/objectives.js`: all content. STACKS and OBJECTIVES (projects with `stack`, steps and tips). Add or change content here, not in components.
- `src/App.jsx`: header, layout (sidebar always visible) and routes
- `src/components/Sidebar.jsx`: tech stack links (no collapse for now)
- `src/components/ProjectList.jsx`: project cards, each a link to its project page
- `src/components/ProjectPage.jsx`: checklist, tips, progress bar, saved progress
- `src/components/StackBadge.jsx`: stack label with a `data-stack` attribute for per-stack styling
- `src/App.css`: layout-only styles

Commit rules.
- Commit per feature, break it down in steps
- Accurate and small commit that only explains a certain feature
- Use add, update, fix, remove
