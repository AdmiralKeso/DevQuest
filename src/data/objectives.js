// Groups shown in the sidebar above their stacks. Every stack belongs to one or more groups (`groups` on the stack,
// e.g. Python is both functional and object-oriented). Groups are headings only, not pages.
export const GROUPS = [
  { id: 'functional', label: 'Functional programming', description: 'Projects built from functions without a framework: JavaScript and Python.' },
  { id: 'oop', label: 'Object-oriented programming', description: 'Projects built from classes and objects without a framework: Java, C++, Python and JavaScript.' },
  { id: 'ux', label: 'UX', description: 'Projects about design and user experience: layout, accessibility and usability, in HTML, CSS and JavaScript.' },
  { id: 'frameworks', label: 'Frameworks', description: 'Projects built with a framework: Laravel, Django and Node.' },
  { id: 'libraries', label: 'Libraries', description: 'Projects built with a library: React.' },
  { id: 'server', label: 'Server programming', description: 'Projects that run on the server and store data: Node, Java, Python and SQL.' },
]

// Tech stacks shown as categories in the sidebar. Each project is built with exactly one stack.
// `groups` are GROUPS ids.
// `requirements` are what you need installed or set up before starting any project in that stack.
// `docLinks` are the documentation shown in the Docs section of every project in that stack.
// `gettingStarted` is how to set up a new project in that stack, shown as "How to start" on every project page.
const doc = (label, url) => ({ label, url })
export const STACKS = [
  {
    id: 'laravel', label: 'Laravel', groups: ['frameworks'], description: 'PHP framework with routing, Blade templates and Eloquent ORM built in.', docs: 'https://laravel.com/docs',
    requirements: ['PHP 8.2 or newer', 'Composer', 'Basic PHP'],
    gettingStarted: ['Create the project: composer create-project laravel/laravel my-project', 'Go into the folder and start it: php artisan serve', 'Open http://localhost:8000 and add your first route in routes/web.php'],
    docLinks: [doc('Laravel', 'https://laravel.com/docs'), doc('Blade', 'https://laravel.com/docs/blade'), doc('Eloquent', 'https://laravel.com/docs/eloquent')],
  },
  {
    id: 'django', label: 'Django', groups: ['frameworks'], description: 'Python framework with an admin panel, ORM and templates out of the box.', docs: 'https://docs.djangoproject.com',
    requirements: ['Python 3.10 or newer', 'pip', 'Basic Python'],
    gettingStarted: ['Create and activate a virtual environment: python -m venv venv', 'Install Django: pip install django', 'Create the project: django-admin startproject mysite, then python manage.py runserver', 'Add an app for your pages: python manage.py startapp pages'],
    docLinks: [doc('Django', 'https://docs.djangoproject.com/en/stable/'), doc('Django tutorial', 'https://docs.djangoproject.com/en/stable/intro/tutorial01/'), doc('Django forms', 'https://docs.djangoproject.com/en/stable/topics/forms/')],
  },
  {
    id: 'node', label: 'Node', groups: ['server', 'frameworks'], description: 'JavaScript on the server, usually with Express for routing.', docs: 'https://nodejs.org/en/learn',
    requirements: ['Node.js 20 or newer', 'npm', 'Basic JavaScript'],
    gettingStarted: ['Create a folder and run npm init -y', 'Install Express: npm install express', 'Write a small server in index.js and start it with node index.js'],
    docLinks: [doc('Node.js', 'https://nodejs.org/en/learn'), doc('Express', 'https://expressjs.com/en/guide/routing.html'), doc('EJS', 'https://github.com/mde/ejs')],
  },
  {
    id: 'react', label: 'React', groups: ['libraries'], description: 'Component-based UI library for building interactive front ends.', docs: 'https://react.dev/learn',
    requirements: ['Node.js 20 or newer', 'npm', 'Basic JavaScript'],
    gettingStarted: ['Create the project: Run `npm create vite@latest my-react-app`, choose react then javascript and eslint', 'Go into the folder and install: `cd my-react-app` then `npm install`', 'Start the development server with Node: `npm run dev`, then open http://localhost:5173 in your browser', 'Edit src/App.jsx; the page updates by itself when you save'],
    docLinks: [doc('React', 'https://react.dev/learn'), doc('Vite', 'https://vite.dev/guide/'), doc('React Router', 'https://reactrouter.com/home')],
  },
  {
    id: 'html', label: 'HTML', groups: ['ux'], description: 'The structure and content of every web page, written by hand.', docs: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
    requirements: ['A code editor', 'A web browser'],
    gettingStarted: ['Create a folder with an index.html file', 'Add the basic structure: doctype, html, head with a title, and body', 'Open the file in your browser and refresh after each change'],
    docLinks: [doc('HTML', 'https://developer.mozilla.org/en-US/docs/Web/HTML'), doc('HTML elements', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element'), doc('HTML forms', 'https://developer.mozilla.org/en-US/docs/Learn/Forms')],
  },
  {
    id: 'javascript', label: 'JavaScript', groups: ['functional', 'oop', 'ux'], description: 'The language of the browser, without a framework: the DOM, events and fetch.', docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    requirements: ['A code editor', 'A web browser', 'Basic HTML'],
    gettingStarted: ['Create index.html and a script.js file next to it', 'Load the script at the end of the body with a script tag: src="script.js"', 'Open the page and use the browser console (F12) to test your code'],
    docLinks: [doc('JavaScript', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide'), doc('DOM', 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model'), doc('Fetch API', 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API')],
  },
  {
    id: 'css', label: 'CSS', groups: ['ux'], description: 'Layout and styling of web pages: flexbox, grid and media queries.', docs: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
    requirements: ['A code editor', 'A web browser', 'Basic HTML'],
    gettingStarted: ['Create index.html and a styles.css file next to it', 'Link the stylesheet in the head with a link tag: rel="stylesheet" href="styles.css"', 'Start with the layout (flexbox or grid), then add colours and fonts'],
    docLinks: [doc('CSS', 'https://developer.mozilla.org/en-US/docs/Web/CSS'), doc('Flexbox', 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox'), doc('Grid', 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Grids')],
  },
  {
    id: 'java', label: 'Java', groups: ['oop', 'server'], description: 'Typed, object-oriented language that runs on the JVM, also used for web servers.', docs: 'https://dev.java/learn/',
    requirements: ['JDK 21 or newer', 'Basic Java'],
    gettingStarted: ['Install a JDK and check it with java -version', 'Create Main.java with a public static void main method', 'Run it with java Main.java, or create a Maven or Gradle project for bigger work'],
    docLinks: [doc('Java', 'https://dev.java/learn/'), doc('Java API', 'https://docs.oracle.com/en/java/javase/21/docs/api/'), doc('HttpServer', 'https://docs.oracle.com/en/java/javase/21/docs/api/jdk.httpserver/com/sun/net/httpserver/HttpServer.html')],
  },
  {
    id: 'cpp', label: 'C++', groups: ['oop'], description: 'Fast, compiled language with manual control over memory.', docs: 'https://en.cppreference.com',
    requirements: ['A C++ compiler (g++, clang or MSVC)', 'CMake', 'Basic C++'],
    gettingStarted: ['Install a compiler and check it with g++ --version', 'Create main.cpp with an int main() function', 'Compile and run: g++ main.cpp -o main, then ./main (use CMake once you have several files)'],
    docLinks: [doc('cppreference', 'https://en.cppreference.com'), doc('Learn C++', 'https://www.learncpp.com'), doc('CMake', 'https://cmake.org/cmake/help/latest/guide/tutorial/index.html')],
  },
  {
    id: 'python', label: 'Python', groups: ['functional', 'oop', 'server'], description: 'Readable language with a big standard library, without a web framework.', docs: 'https://docs.python.org/3/',
    requirements: ['Python 3.10 or newer', 'pip', 'Basic Python'],
    gettingStarted: ['Create and activate a virtual environment: python -m venv venv', 'Create main.py and run it with python main.py', 'Install packages with pip and save them in requirements.txt'],
    docLinks: [doc('Python', 'https://docs.python.org/3/tutorial/'), doc('Standard library', 'https://docs.python.org/3/library/'), doc('http.server', 'https://docs.python.org/3/library/http.server.html')],
  },
  {
    id: 'sql', label: 'SQL', groups: ['server'], description: 'Storing and querying data in a database: tables, joins and migrations.', docs: 'https://www.sqlite.org/docs.html',
    requirements: ['SQLite, MySQL or PostgreSQL', 'Basic SQL'],
    gettingStarted: ['Install SQLite (or MySQL or PostgreSQL) and open a database: sqlite3 my.db', 'Create your first table with CREATE TABLE, then add rows with INSERT', 'Query them with SELECT, and keep your statements in a .sql file in the repository'],
    docLinks: [doc('SQLite', 'https://www.sqlite.org/lang.html'), doc('PostgreSQL', 'https://www.postgresql.org/docs/current/tutorial.html'), doc('MySQL', 'https://dev.mysql.com/doc/refman/8.4/en/tutorial.html')],
  },
]

// Last steps of "How to start" on every project page, after the stack's own `gettingStarted`.
export const COMMON_GETTING_STARTED = [
  'Create a public repository on GitHub and push your project to it',
  'Paste the repository URL in "Link to project" on this page; steps tick off as you push code',
]

// Needed for every project: progress is tracked by linking a public GitHub repository.
export const COMMON_REQUIREMENTS = ['Git', 'A public GitHub repository']

// Shown in the Docs section of every project, before the stack's and the project's own docs.
export const COMMON_DOC_LINKS = [doc('MDN Web Docs', 'https://developer.mozilla.org/en-US/docs/Web')]

// "Getting started" on the Docs page (main menu): what every quest needs before the stack-specific docs.
export const GETTING_STARTED_DOC_LINKS = [
  doc('Git', 'https://git-scm.com/doc'),
  doc('Creating a GitHub repository', 'https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository'),
  ...COMMON_DOC_LINKS,
]

// Step checks: when a folder is linked, a step with a `check` is ticked off automatically once the
// files match (see src/sync/detectSteps.js). A check is one rule or a list of rules that must all match.
// Steps without a check (deploying, writing content) are ticked off by hand.
const file = (path, content) => ({ file: path, content })
const named = (name) => file(new RegExp(`(^|/)${name}$`))
const code = (ext, content) => file(new RegExp(`\\.(${ext})$`), content)
const pkg = (name) => file(/(^|\/)package\.json$/, new RegExp(`"${name}"`))
const composer = (name) => file(/(^|\/)composer\.json$/, new RegExp(`"${name}"`))
const component = (name, content) => file(new RegExp(`(^|/)${name}\\.(jsx|tsx)$`), content)

const JS = 'js|mjs|cjs|ts'
const JSX = 'jsx|tsx|js'
const REACT_SETUP = [pkg('react'), pkg('vite')]
const ROUTE_PARAM = [pkg('react-router(-dom)?'), code(JSX, /<Route[^>]*path=["'][^"']*:\w+/)]
const LARAVEL_SETUP = [named('artisan'), composer('laravel/framework')]
const BLADE = 'blade\\.php'
const migration = (table) => file(new RegExp(`database/migrations/.*create_${table}_table\\.php$`))
const djangoSetup = (app) => [named('manage\\.py'), file(new RegExp(`(^|/)${app}/apps\\.py$`))]
const MAP_EMBED = code(`${BLADE}|html|jsx|tsx`, /<iframe[^>]*(google\.com\/maps|openstreetmap)/)
const indexHtml = (content) => file(/(^|\/)index\.html$/, content)
// An HTML tag with all the given attributes in any order, e.g. tag('input', 'type=["\']tel["\']', 'pattern=')
const tag = (name, ...attrs) => new RegExp(`<${name}\\b${attrs.map((a) => `(?=[^>]*\\s${a})`).join('')}[^>]*>`, 'i')
// Matches when no file matches the rule, e.g. no HTML file with an onclick attribute
const absent = (rule) => ({ ...rule, absent: true })

// Difficulty shown on the project cards. A project's `difficulty` is one of these ids.
export const DIFFICULTIES = [
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
]

// Skills: each step trains one. They're the rings on the project page and the categories of the "All objectives" list.
const COMPREHENSION = 'comprehension'
const SEMANTIC_HTML = 'semantic-html'
const DEFENSIVE = 'defensive'
const RESPONSIVE = 'responsive'
export const SKILLS = [
  { id: COMPREHENSION, label: 'Code Comprehension' },
  { id: SEMANTIC_HTML, label: 'Semantic HTML' },
  { id: DEFENSIVE, label: 'Defensive Programming' },
  { id: RESPONSIVE, label: 'Responsive' },
]

export const OBJECTIVES = [
  // Fetch a pokemon from an API
  {
    id: 'pokemon-javascript',
    title: 'Fetch a Pokémon from an API',
    description: 'A search page that requests a Pokémon from PokéAPI with fetch and shows it, errors included.',
    stack: 'javascript',
    difficulty: 'medium',
    tags: ['API', 'JSON'],
    tools: [doc('PokéAPI', 'https://pokeapi.co/api/v2/')],
    docLinks: [
      doc('PokéAPI', 'https://pokeapi.co/docs/v2'),
      doc('async function', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function'),
      doc('try...catch', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch'),
      doc('Response.ok', 'https://developer.mozilla.org/en-US/docs/Web/API/Response/ok'),
      doc('aria-label', 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label'),
      doc('ESLint', 'https://eslint.org/docs/latest/use/getting-started'),
    ],
    steps: [
      // Files
      { id: 'html', title: 'Create index.html with the page structure', tip: 'Start with the DOCTYPE html line, a title element and a main element for the search and the result.', check: indexHtml(/<!doctype html>/i), skill: SEMANTIC_HTML },
      { id: 'script', title: 'Create script.js and load it from index.html', tip: 'Put a script tag with src="script.js" at the end of the body, just before the closing body tag, so the elements exist before your code runs.', check: [indexHtml(/<script[^>]+src=["'][^"']*\.js["']/i), code(JS)], skill: COMPREHENSION },
      // Unobtrusive JavaScript: no inline event attributes, inline script code or javascript: links in the HTML
      { id: 'unobtrusive', title: 'Keep all JavaScript out of the HTML (unobtrusive JavaScript)', tip: 'No onclick="..." or other on... attributes, no code between script tags and no href="javascript:...". Select the elements in script.js with document.querySelector and attach the events there with addEventListener.', check: [indexHtml(/<script[^>]+src=/i), code(JS, /addEventListener\(/), absent(code('html', /<[^>]+\son[a-z]+\s*=|href\s*=\s*["']\s*javascript:|<script(?![^>]*\bsrc=)[^>]*>\s*\S/i))], skill: COMPREHENSION },
      { id: 'styles', title: 'Create a CSS file and link it from index.html', tip: 'Add a link tag with rel="stylesheet" and href="styles.css" in the head.', check: [indexHtml(/<link[^>]+rel=["']stylesheet["']/i), code('css')], skill: SEMANTIC_HTML },
      // Search
      { id: 'search-form', title: 'Add a search form with a text field and a search button', tip: 'A form element lets the Enter key search too; give the button type="submit".', check: indexHtml(/<form[\s\S]*<input[\s\S]*<button[\s\S]*<\/form>/i), skill: SEMANTIC_HTML },
      { id: 'submit', title: 'Search on submit without reloading the page', tip: 'Listen for the form\'s submit event and call event.preventDefault() first.', check: code(JS, /addEventListener\(\s*["']submit["'][\s\S]*preventDefault\(\)/), skill: COMPREHENSION },
      { id: 'clean-input', title: 'Trim and lowercase the search before using it', tip: 'PokéAPI only knows lowercase names: "Pikachu " has to become "pikachu". Don\'t search when it\'s empty.', check: [code(JS, /\.trim\(\)/), code(JS, /\.toLowerCase\(\)/)], skill: DEFENSIVE },
      // Fetch
      // Only the function is checked (fetch called inside a function), not which URL it requests or what comes back
      { id: 'fetch', title: 'Write a function that requests a Pokémon with fetch', tip: 'The API lives at https://pokeapi.co/api/v2/; one Pokémon is pokemon/ plus its name or number, e.g. https://pokeapi.co/api/v2/pokemon/pikachu.', check: code(JS, /(\bfunction\b[^{]*|=>\s*)\{[\s\S]*?\bfetch\(\s*\S/), skill: COMPREHENSION },
      { id: 'async-await', title: 'Wrap the fetch into an async function and use await to wait for response', tip: 'Mark the function async, then await both fetch() and res.json().', check: [code(JS, /\basync\b/), code(JS, /await\s+fetch\(/), code(JS, /await\s+\w+\.json\(\)/)], skill: COMPREHENSION },
      { id: 'show-result', title: 'Build the result with createElement: the name in a heading, the image in an img element and the types in a list', tip: 'Make each element with document.createElement: an h2 element with the name (data.name) as textContent, an img element with src data.sprites.front_default and the name as alt, and a ul element with an li element for each type (data.types[].type.name, e.g. with forEach). Add them to the result area with append() or appendChild(), and empty it first with replaceChildren() so an old Pokémon doesn\'t stay. No innerHTML.', check: [code(JS, /sprites/), code(JS, /\btypes\b/), code(JS, /createElement\(\s*["']h[1-6]["']\s*\)/), code(JS, /createElement\(\s*["']img["']\s*\)/), code(JS, /createElement\(\s*["']li["']\s*\)/), code(JS, /\.(append|appendChild|replaceChildren)\(/)], skill: COMPREHENSION },
      // Errors
      { id: 'try-catch', title: 'Wrap the request in try/catch', tip: 'fetch only rejects when the network fails, so catch also needs the error you throw for a bad response.', check: code(JS, /\btry\s*\{[\s\S]*\}\s*catch\s*(\(\s*\w+\s*\))?\s*\{/), skill: DEFENSIVE },
      { id: 'res-ok', title: 'Throw an error when the server answers with an error (!res.ok)', tip: 'A misspelled name returns 404 and a server problem 500; both still resolve, so check res.ok and throw.', check: [code(JS, /!\s*\w+\.ok\b/), code(JS, /throw\s+new\s+Error\(/)], skill: DEFENSIVE },
      { id: 'show-error', title: 'Show the error on the page, not only in the console', tip: 'In catch, write a message like "Pokémon not found" into the result area with textContent.', check: code(JS, /catch\s*(\(\s*\w+\s*\))?\s*\{[\s\S]{0,400}\.textContent\s*=/), skill: DEFENSIVE },
      // Accessibility and mobile
      { id: 'aria-labels', title: 'Give the search field and button aria-labels', tip: 'A screen reader reads aria-label out loud, e.g. aria-label="Pokémon name or number".', check: indexHtml(/<input[^>]+aria-label=["'][^"']+["'][\s\S]*<button[^>]+aria-label=["'][^"']+["']|<button[^>]+aria-label=["'][^"']+["'][\s\S]*<input[^>]+aria-label=["'][^"']+["']/i), skill: SEMANTIC_HTML },
      { id: 'responsive', title: 'Make the page work on a mobile phone', tip: 'Add the viewport meta tag, then a @media query; test at 375px wide in the browser\'s device mode.', check: [indexHtml(/<meta[^>]+name=["']viewport["']/i), code('css', /@media/)], skill: RESPONSIVE },
      // Code quality
      { id: 'lint', title: 'Check for unused variables and functions with ESLint', tip: 'Run npm init @eslint/config@latest, turn on no-unused-vars, then remove whatever it reports.', check: file(/(^|\/)eslint\.config\.(js|mjs|cjs)$/, /no-unused-vars|recommended/), skill: COMPREHENSION },
    ],
  },
  // Timer with React components, state and setInterval
  {
    id: 'timer-react',
    title: 'Build a timer',
    description: 'A stopwatch made of React components that counts up with setInterval and keeps its time in state.',
    stack: 'react',
    difficulty: 'medium',
    tags: ['Components', 'State', 'Props'],
    docLinks: [
      doc('Your first component', 'https://react.dev/learn/your-first-component'),
      doc('Passing props', 'https://react.dev/learn/passing-props-to-a-component'),
      doc('useState', 'https://react.dev/reference/react/useState'),
      doc('useEffect', 'https://react.dev/reference/react/useEffect'),
      doc('setInterval', 'https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval'),
    ],
    // Checks look in the named component files, because Vite's starter App.jsx already uses useState
    steps: [
      // Components
      { id: 'timer-component', title: 'Make a Timer component in Timer.jsx and render it in App', tip: 'Create src/components/Timer.jsx with export default function Timer() { return ... }, then import it in App.jsx and render Timer in the JSX.', check: [component('Timer'), code(JSX, /<Timer\b/)], skill: COMPREHENSION },
      { id: 'display-component', title: 'Show the time in a TimeDisplay component that gets the seconds as a prop', tip: 'Write function TimeDisplay({ seconds }) in TimeDisplay.jsx and render it from Timer with the prop seconds={seconds}. The component only shows the time, it doesn\'t keep it.', check: [component('TimeDisplay', /TimeDisplay\s*(=\s*)?\(\s*(\{[^}]*\}|props)\s*\)/), component('Timer', /<TimeDisplay\s+\w+=\{/)], skill: COMPREHENSION },
      { id: 'controls-component', title: 'Put the Start, Pause and Reset buttons in a Controls component', tip: 'Give Controls the click handlers as props, e.g. Controls with onStart={start}, onPause={pause} and onReset={reset}, and use them on the buttons as onClick={onStart}. The state stays in Timer.', check: [component('Controls', /<button[^>]*onClick=\{/), component('Timer', /<Controls\s[^>]*on\w+=\{/)], skill: COMPREHENSION },
      // State
      { id: 'seconds-state', title: 'Keep the elapsed seconds in state with useState', tip: 'const [seconds, setSeconds] = useState(0) in Timer. Changing state re-renders the component, so the new time shows up by itself.', check: component('Timer', /useState\(\s*0\s*\)/), skill: COMPREHENSION },
      { id: 'running-state', title: 'Keep whether the timer is running in a second state', tip: 'const [isRunning, setIsRunning] = useState(false). Start sets it to true and Pause to false.', check: component('Timer', /useState\(\s*false\s*\)/), skill: COMPREHENSION },
      // Interval
      { id: 'set-interval', title: 'Count up every second with setInterval inside useEffect', tip: 'useEffect(() => { if (!isRunning) return; const id = setInterval(() => ..., 1000); ... }, [isRunning]) starts the interval only while the timer runs.', check: component('Timer', /useEffect\([\s\S]*setInterval\(/), skill: COMPREHENSION },
      { id: 'clear-interval', title: 'Stop the interval in the effect\'s cleanup with clearInterval', tip: 'End the effect with return () => clearInterval(id). Without it every Start adds another interval and the timer speeds up (React\'s StrictMode even runs effects twice in development to show this).', check: component('Timer', /return\s*\(\s*\)\s*=>[\s\S]{0,60}clearInterval\(/), skill: DEFENSIVE },
      { id: 'updater', title: 'Add a second with an updater function', tip: 'setSeconds((s) => s + 1) always uses the latest value. setSeconds(seconds + 1) inside the interval keeps reading the value from when the effect started, so the timer gets stuck at 1.', check: component('Timer', /set\w+\(\s*\(?\s*\w+\s*\)?\s*=>/), skill: DEFENSIVE },
      { id: 'reset', title: 'Make Reset stop the timer and set it back to 0', tip: 'In reset, call setIsRunning(false) and setSeconds(0).', check: [component('Timer', /set\w+\(\s*0\s*\)/), component('Timer', /set\w+\(\s*false\s*\)/)], skill: COMPREHENSION },
      { id: 'disable-buttons', title: 'Disable Start while running and Pause while stopped', tip: 'Pass isRunning to Controls and use disabled={isRunning} on Start and disabled={!isRunning} on Pause, so a double click can\'t start a second interval.', check: component('Controls', /disabled=\{/), skill: DEFENSIVE },
      // Semantic HTML
      { id: 'semantic', title: 'Give the page an h1 element and show the time in a p element', tip: 'Put an h1 element like Timer above it, and in TimeDisplay return the seconds in a p element.', check: [code(JSX, /<h1\b/), component('TimeDisplay', /<p\b/)], skill: SEMANTIC_HTML },
      { id: 'timer-section', title: 'Wrap the timer in a section element with an aria-label', tip: 'A section element with aria-label="Timer" tells a screen reader what the buttons and time belong to.', check: component('Timer', /<section[^>]*aria-label=/), skill: SEMANTIC_HTML },
    ],
  },
  // Contact form in plain HTML
  {
    id: 'contact-form-html',
    title: 'Build a contact form',
    description: 'A plain HTML form with fields for a username, address, phone number and message, and a submit button.',
    stack: 'html',
    difficulty: 'easy',
    tags: ['Forms'],
    docLinks: [
      doc('form', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form'),
      doc('label', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label'),
      doc('input', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input'),
      doc('input type="tel"', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/tel'),
      doc('textarea', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea'),
    ],
    steps: [
      // Page
      { id: 'html', title: 'Create index.html with the page structure', tip: 'Start with the DOCTYPE html line, a title element, an h1 element and a main element that holds the form.', check: [indexHtml(/<!doctype html>/i), indexHtml(/<main\b[\s\S]*<h1\b|<h1\b[\s\S]*<main\b/i)], skill: SEMANTIC_HTML },
      { id: 'styles', title: 'Create a CSS file and link it from index.html', tip: 'Add a link tag with `rel="stylesheet"` and `href="styles.css"` in the head.', check: [indexHtml(/<link[^>]+rel=["']stylesheet["']/i), code('css')], skill: SEMANTIC_HTML },
      // Fields
      { id: 'form', title: 'Add a form element with a submit button', tip: 'Put the fields in a form element and end it with a button element with `type="submit"`. Pressing Enter in a field then sends the form too.', check: indexHtml(/<form\b[\s\S]*<button(?=[^>]*\stype=["']submit["'])[^>]*>[\s\S]*<\/form>/i), skill: SEMANTIC_HTML },
      { id: 'username', title: 'Add a username field', tip: 'An input element with `type="text"` and `name="username"`. The name is what the field is called when the form is sent.', check: indexHtml(tag('input', 'name=["\']username["\']')), skill: COMPREHENSION },
      { id: 'address', title: 'Add an address field', tip: 'An input element with `type="text"` and `name="address"`.', check: indexHtml(tag('input', 'name=["\']address["\']')), skill: COMPREHENSION },
      { id: 'phone', title: 'Add a phone number field with type="tel"', tip: 'An input element with `type="tel"` and `name="phone"`. On a phone this opens the number keyboard.', check: indexHtml(tag('input', 'type=["\']tel["\']', 'name=')), skill: COMPREHENSION },
      { id: 'message', title: 'Add a text box for a message with a textarea', tip: 'A textarea element with `name="message"` and `rows="5"`; unlike an input it can hold several lines.', check: indexHtml(tag('textarea', 'name=')), skill: COMPREHENSION },
      // Accessibility
      { id: 'labels', title: 'Give every field a label element linked with for and id', tip: 'A label element with `for="username"` belongs to the field with `id="username"`: clicking the label focuses the field and a screen reader reads it out.', check: [indexHtml(tag('label', 'for=["\']username["\']')), indexHtml(tag('input', 'id=["\']username["\']')), indexHtml(/(<label\b[^>]*\sfor=[\s\S]*){4}/i)], skill: SEMANTIC_HTML },
      { id: 'fieldset', title: 'Group the fields in a fieldset element with a legend element', tip: 'A fieldset element around the fields with a legend element like Your details tells a screen reader what they belong to.', check: indexHtml(/<fieldset\b[\s\S]*<legend\b[\s\S]*<\/fieldset>/i), skill: SEMANTIC_HTML },
      // Mobile
      { id: 'responsive', title: 'Make the form work on a mobile phone', tip: 'Add the viewport meta tag, make the fields `width: 100%` with a `max-width` on the form, add a @media query, and test at 375px wide in the browser\'s device mode.', check: [indexHtml(/<meta[^>]+name=["']viewport["']/i), code('css', /@media/), code('css', /width:\s*100%/)], skill: RESPONSIVE },
    ],
  },
]

export function getProjectsForStack(stackId) {
  return stackId === 'all' ? OBJECTIVES : OBJECTIVES.filter((o) => o.stack === stackId)
}

export function getStacksForGroup(groupId) {
  return STACKS.filter((s) => s.groups.includes(groupId))
}
