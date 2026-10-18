// Tech stacks shown as categories in the sidebar. Each project is built with exactly one stack.
// `requirements` are what you need installed or set up before starting any project in that stack.
// `docLinks` are the documentation shown in the Docs section of every project in that stack.
const doc = (label, url) => ({ label, url })
export const STACKS = [
  {
    id: 'laravel', label: 'Laravel', description: 'PHP framework with routing, Blade templates and Eloquent ORM built in.', docs: 'https://laravel.com/docs',
    requirements: ['PHP 8.2 or newer', 'Composer', 'Basic PHP'],
    docLinks: [doc('Laravel', 'https://laravel.com/docs'), doc('Blade', 'https://laravel.com/docs/blade'), doc('Eloquent', 'https://laravel.com/docs/eloquent')],
  },
  {
    id: 'django', label: 'Django', description: 'Python framework with an admin panel, ORM and templates out of the box.', docs: 'https://docs.djangoproject.com',
    requirements: ['Python 3.10 or newer', 'pip', 'Basic Python'],
    docLinks: [doc('Django', 'https://docs.djangoproject.com/en/stable/'), doc('Django tutorial', 'https://docs.djangoproject.com/en/stable/intro/tutorial01/'), doc('Django forms', 'https://docs.djangoproject.com/en/stable/topics/forms/')],
  },
  {
    id: 'node', label: 'Node', description: 'JavaScript on the server, usually with Express for routing.', docs: 'https://nodejs.org/en/learn',
    requirements: ['Node.js 20 or newer', 'npm', 'Basic JavaScript'],
    docLinks: [doc('Node.js', 'https://nodejs.org/en/learn'), doc('Express', 'https://expressjs.com/en/guide/routing.html'), doc('EJS', 'https://github.com/mde/ejs')],
  },
  {
    id: 'react', label: 'React', description: 'Component-based UI library for building interactive front ends.', docs: 'https://react.dev/learn',
    requirements: ['Node.js 20 or newer', 'npm', 'Basic JavaScript'],
    docLinks: [doc('React', 'https://react.dev/learn'), doc('Vite', 'https://vite.dev/guide/'), doc('React Router', 'https://reactrouter.com/home')],
  },
]

// Needed for every project: progress is tracked by linking a public GitHub repository.
export const COMMON_REQUIREMENTS = ['Git', 'A public GitHub repository']

// Shown in the Docs section of every project, before the stack's and the project's own docs.
export const COMMON_DOC_LINKS = [doc('MDN Web Docs', 'https://developer.mozilla.org/en-US/docs/Web')]

// Step checks: when a folder is linked, a step with a `check` is ticked off automatically once the
// files match (see src/sync/detectSteps.js). A check is one rule or a list of rules that must all match.
// Steps without a check (deploying, writing content) are ticked off by hand.
const file = (path, content) => ({ file: path, content })
const named = (name) => file(new RegExp(`(^|/)${name}$`))
const code = (ext, content) => file(new RegExp(`\\.(${ext})$`), content)
const pkg = (name) => file(/(^|\/)package\.json$/, new RegExp(`"${name}"`))
const composer = (name) => file(/(^|\/)composer\.json$/, new RegExp(`"${name}"`))
const component = (name) => file(new RegExp(`(^|/)${name}\\.(jsx|tsx)$`))

const JS = 'js|mjs|cjs|ts'
const JSX = 'jsx|tsx|js'
const REACT_SETUP = [pkg('react'), pkg('vite')]
const ROUTE_PARAM = [pkg('react-router(-dom)?'), code(JSX, /<Route[^>]*path=["'][^"']*:\w+/)]
const LARAVEL_SETUP = [named('artisan'), composer('laravel/framework')]
const BLADE = 'blade\\.php'
const migration = (table) => file(new RegExp(`database/migrations/.*create_${table}_table\\.php$`))
const djangoSetup = (app) => [named('manage\\.py'), file(new RegExp(`(^|/)${app}/apps\\.py$`))]
const MAP_EMBED = code(`${BLADE}|html|jsx|tsx`, /<iframe[^>]*(google\.com\/maps|openstreetmap)/)

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

// The same goal (title) can have one card per stack, each with steps specific to that stack.
// Every project fills the same project page template. Only id, title and stack are required:
//   {
//     id: 'unique-id',              // used in the URL: /projects/unique-id
//     title: 'Build a ...',
//     description: 'One sentence.', // optional, the page shows a placeholder without it
//     stack: 'react',               // one of the STACKS ids
//     requirements: ['...'],        // optional, extra requirements on top of the stack's
//     docLinks: [doc('Label', 'https://...')], // optional, extra docs on top of the stack's
//     steps: [                      // optional, the page shows a placeholder without it
//       { id: 'step-id', title: 'Do this', tip: 'How to do it.', check: file(/regex/), skill: SEMANTIC_HTML },
//     ],
//   },
export const OBJECTIVES = [
  // Portfolio
  {
    id: 'portfolio-react',
    title: 'Build a portfolio',
    description: 'A single-page portfolio built from React components.',
    stack: 'react',
    steps: [
      { id: 'setup', title: 'Create a React app with Vite', tip: 'Run npm create vite@latest and pick the React template.', check: REACT_SETUP, skill: COMPREHENSION },
      { id: 'hero', title: 'Build a Hero component with your name and role', tip: 'Keep it to one sentence. Visitors decide in seconds whether to keep reading.', check: component('Hero'), skill: SEMANTIC_HTML },
      { id: 'projects', title: 'Render at least 3 projects from an array', tip: 'Keep projects in a data file and map over them into a ProjectCard component.', check: component('ProjectCard'), skill: COMPREHENSION },
      { id: 'about', title: 'Add an About component', tip: 'Mention what you want to work on next, not just what you have done.', check: component('About'), skill: SEMANTIC_HTML },
      { id: 'contact', title: 'Add contact details', tip: 'A mailto: link is a perfectly good first version.', check: code(`${JSX}|html`, /mailto:/), skill: SEMANTIC_HTML },
      { id: 'responsive', title: 'Make the layout work on mobile', tip: 'Test at 375px wide. Grids that become a single column usually just work.', check: code('css|scss', /@media/), skill: RESPONSIVE },
      { id: 'routing', title: 'Give each project its own page with React Router', tip: 'Use a route like /projects/:id and look the project up by its id.', check: ROUTE_PARAM, skill: COMPREHENSION },
      { id: 'dark-mode', title: 'Add a dark mode toggle', tip: 'Keep the theme in state and save it to localStorage so it survives a refresh.', check: code(JSX, /localStorage[\s\S]{0,300}(theme|dark)|(theme|dark)[\s\S]{0,300}localStorage/i), skill: COMPREHENSION },
      { id: 'deploy', title: 'Deploy it to a custom domain', tip: 'Netlify, Vercel and GitHub Pages can all host a Vite build for free.' },
    ],
  },
  {
    id: 'portfolio-node',
    title: 'Build a portfolio',
    description: 'A server-rendered portfolio with Node and Express.',
    stack: 'node',
    requirements: ['An email account with SMTP access (for Nodemailer)'],
    docLinks: [doc('Nodemailer', 'https://nodemailer.com/')],
    steps: [
      { id: 'setup', title: 'Set up an Express server', tip: 'npm init, npm install express, then a server.js that listens on a port.', check: [pkg('express'), code(JS, /\.listen\(/)], skill: COMPREHENSION },
      { id: 'static', title: 'Serve your CSS and images as static files', tip: 'app.use(express.static("public")) serves everything in the public folder.', check: code(JS, /express\.static\(/), skill: COMPREHENSION },
      { id: 'home', title: 'Render a home page with your name and role', tip: 'A template engine like EJS lets you reuse a layout across pages.', check: [pkg('ejs'), code(JS, /res\.render\(/)], skill: SEMANTIC_HTML },
      { id: 'projects', title: 'List at least 3 projects from a JSON file', tip: 'Read the file once at startup and pass the array to your template.', check: named('projects\\.json'), skill: COMPREHENSION },
      { id: 'project-pages', title: 'Add a page per project with a route parameter', tip: 'app.get("/projects/:id") and return a 404 when the id does not exist.', check: code(JS, /\.get\(\s*["'`][^"'`]*\/:\w+/), skill: DEFENSIVE },
      { id: 'contact-form', title: 'Handle a contact form POST', tip: 'Use express.urlencoded() to read the form, then redirect to a thank-you page.', check: [code(JS, /express\.urlencoded\(/), code(JS, /\.post\(/)], skill: DEFENSIVE },
      { id: 'email', title: 'Email yourself the contact form messages', tip: 'Nodemailer can send through any SMTP provider. Keep credentials in a .env file.', check: pkg('nodemailer'), skill: COMPREHENSION },
      { id: 'deploy', title: 'Deploy the server', tip: 'Render and Railway run Node apps; read the port from process.env.PORT.' },
    ],
  },

  // Online store
  {
    id: 'store-laravel',
    title: 'Create an online store',
    description: 'Products in a database, a session cart and checkout with Laravel.',
    stack: 'laravel',
    requirements: ['A Stripe account (test mode is free)'],
    docLinks: [doc('Laravel Cashier', 'https://laravel.com/docs/billing')],
    steps: [
      { id: 'setup', title: 'Create a Laravel project', tip: 'composer create-project laravel/laravel store, then php artisan serve.', check: LARAVEL_SETUP, skill: COMPREHENSION },
      { id: 'model', title: 'Add a Product model, migration and seeder', tip: 'php artisan make:model Product -ms creates all three at once.', check: [named('app/Models/Product\\.php'), migration('products'), named('ProductSeeder\\.php')], skill: COMPREHENSION },
      { id: 'catalog', title: 'Show products in a Blade view', tip: 'Product::paginate(12) gives you pagination links for free.', check: code(BLADE, /@foreach\s*\(\s*\$products/), skill: SEMANTIC_HTML },
      { id: 'product-page', title: 'Create a product detail page', tip: 'Route model binding: Route::get("/products/{product}") hands you the model directly.', check: file(/(^|\/)routes\/web\.php$/, /\{product\}/), skill: COMPREHENSION },
      { id: 'cart', title: 'Store the cart in the session', tip: 'session()->put("cart", $cart) keeps it between requests without a database table.', check: code('php', /session[\s\S]{0,40}['"]cart['"]/), skill: COMPREHENSION },
      { id: 'checkout', title: 'Build a checkout form with validation', tip: '$request->validate([...]) redirects back with errors automatically.', check: code('php', /->validate\(/), skill: DEFENSIVE },
      { id: 'orders', title: 'Save orders to the database', tip: 'Use an orders table plus an order_items table for the products in each order.', check: migration('orders'), skill: COMPREHENSION },
      { id: 'payments', title: 'Take payments with Stripe in test mode', tip: 'Laravel Cashier wraps Stripe Checkout so you never handle card details.', check: composer('laravel/cashier'), skill: DEFENSIVE },
    ],
  },
  {
    id: 'store-django',
    title: 'Create an online store',
    description: 'Manage products in the Django admin and sell them with a session cart.',
    stack: 'django',
    steps: [
      { id: 'setup', title: 'Start a Django project and a shop app', tip: 'django-admin startproject, then python manage.py startapp shop.', check: djangoSetup('shop'), skill: COMPREHENSION },
      { id: 'model', title: 'Add a Product model and run migrations', tip: 'Use DecimalField for prices, never FloatField.', check: [code('py', /class\s+Product\s*\(/), file(/migrations\/0001_initial\.py$/)], skill: COMPREHENSION },
      { id: 'admin', title: 'Register products in the admin', tip: 'admin.site.register(Product) gives you a full product editor for free.', check: file(/admin\.py$/, /register\(\s*Product/), skill: COMPREHENSION },
      { id: 'catalog', title: 'List products with a ListView', tip: 'Set paginate_by on the view to paginate the list.', check: code('py', /ListView/), skill: SEMANTIC_HTML },
      { id: 'product-page', title: 'Create a product DetailView', tip: 'Use a slug in the URL for readable links: path("<slug:slug>/", ...).', check: code('py', /DetailView/), skill: COMPREHENSION },
      { id: 'cart', title: 'Store the cart in request.session', tip: 'Set request.session.modified = True after changing a nested dict.', check: code('py', /session[\s\S]{0,20}['"]cart['"]/), skill: COMPREHENSION },
      { id: 'checkout', title: 'Build a checkout form with a Django Form', tip: 'form.is_valid() and form.cleaned_data handle validation for you.', check: file(/forms\.py$/, /forms\.(Model)?Form/), skill: DEFENSIVE },
      { id: 'orders', title: 'Save orders with an Order model', tip: 'Copy the price into the order line so later price changes do not alter old orders.', check: code('py', /class\s+Order\s*\(/), skill: DEFENSIVE },
    ],
  },
  {
    id: 'store-node',
    title: 'Create an online store',
    description: 'An Express server with product pages, a cart and Stripe checkout.',
    stack: 'node',
    requirements: ['A Stripe account (test mode is free)'],
    docLinks: [doc('Stripe Checkout', 'https://docs.stripe.com/payments/checkout'), doc('express-session', 'https://github.com/expressjs/session')],
    steps: [
      { id: 'setup', title: 'Set up Express with a template engine', tip: 'EJS is the simplest: app.set("view engine", "ejs").', check: [pkg('express'), code(JS, /set\(\s*["']view engine/)], skill: COMPREHENSION },
      { id: 'data', title: 'Store products in a database', tip: 'SQLite needs no server; better-sqlite3 is fast and easy to use.', check: pkg('(better-sqlite3|sqlite3|mongoose|pg|mysql2)'), skill: COMPREHENSION },
      { id: 'catalog', title: 'Render a product list page', tip: 'Query the products in the route handler and pass them to res.render.', check: code(JS, /res\.render\(\s*["'`][^"'`]*products/), skill: SEMANTIC_HTML },
      { id: 'product-page', title: 'Add a product detail route', tip: 'app.get("/products/:id") and send a 404 page when nothing is found.', check: code(JS, /\.get\(\s*["'`][^"'`]*products\/:\w+/), skill: DEFENSIVE },
      { id: 'cart', title: 'Keep a cart with express-session', tip: 'Store only product ids and quantities; look up prices at checkout.', check: pkg('express-session'), skill: DEFENSIVE },
      { id: 'checkout', title: 'Validate the checkout form on the server', tip: 'express-validator checks fields and collects error messages.', check: pkg('express-validator'), skill: DEFENSIVE },
      { id: 'payments', title: 'Create a Stripe Checkout session', tip: 'Calculate the total on the server, never trust prices sent from the browser.', check: [pkg('stripe'), code(JS, /checkout\.sessions\.create\(/)], skill: DEFENSIVE },
    ],
  },
  {
    id: 'store-react',
    title: 'Create an online store',
    description: 'A React front end with a product grid, cart and checkout form.',
    stack: 'react',
    steps: [
      { id: 'setup', title: 'Create a React app with Vite', tip: 'Run npm create vite@latest and pick the React template.', check: REACT_SETUP, skill: COMPREHENSION },
      { id: 'catalog', title: 'Render a product grid from an array', tip: 'Keep products in a data file and map them into a ProductCard component.', check: component('ProductCard'), skill: COMPREHENSION },
      { id: 'product-page', title: 'Add product pages with React Router', tip: 'Use a route like /products/:id and find the product with useParams.', check: ROUTE_PARAM, skill: COMPREHENSION },
      { id: 'cart', title: 'Add a cart with useState or Context', tip: 'Start with an array of { productId, quantity }; Context avoids passing props down.', check: file(/(^|\/)Cart\w*\.(jsx|tsx|js)$/), skill: COMPREHENSION },
      { id: 'cart-persist', title: 'Keep the cart after a page refresh', tip: 'Save the cart to localStorage in a useEffect.', check: code(JSX, /localStorage[\s\S]{0,200}cart|cart[\s\S]{0,200}localStorage/i), skill: COMPREHENSION },
      { id: 'filters', title: 'Add category filters or search', tip: 'Filter the same product array; never duplicate the data.', check: code(JSX, /(category|search)[\s\S]{0,200}\.filter\(|\.filter\([\s\S]{0,200}(category|search)/i), skill: COMPREHENSION },
      { id: 'checkout', title: 'Build a checkout form with validation', tip: 'Validate on blur, not on every keystroke.', check: component('Checkout'), skill: DEFENSIVE },
    ],
  },

  // Landing page
  {
    id: 'landing-react',
    title: 'Launch a landing page',
    description: 'One React page that convinces visitors to take a single action.',
    stack: 'react',
    docLinks: [doc('Lighthouse', 'https://developer.chrome.com/docs/lighthouse/overview')],
    steps: [
      { id: 'setup', title: 'Create a React app with Vite', tip: 'Run npm create vite@latest and pick the React template.', check: REACT_SETUP, skill: COMPREHENSION },
      { id: 'headline', title: 'Write a headline and subheadline', tip: 'Say what it does and who it is for.', check: code('jsx|tsx', /<h1/), skill: SEMANTIC_HTML },
      { id: 'cta', title: 'Add a call-to-action button', tip: 'Use one primary action. Two competing buttons halve your clicks.', skill: SEMANTIC_HTML },
      { id: 'features', title: 'List 3 key benefits from an array', tip: 'Describe the benefit to the user, not the feature itself.', check: code(JSX, /(features|benefits)\.map\(/i), skill: SEMANTIC_HTML },
      { id: 'social-proof', title: 'Add testimonials', tip: 'Real names and photos are far more convincing.', check: file(/(^|\/)Testimonials?\.(jsx|tsx)$/), skill: SEMANTIC_HTML },
      { id: 'signup', title: 'Add an email signup form', tip: 'A controlled input with useState; ask for the email only.', check: code('jsx|tsx', /type=["']email["']/), skill: SEMANTIC_HTML },
      { id: 'performance', title: 'Score 90+ on Lighthouse performance', tip: 'Compress images and lazy-load anything below the fold.', skill: RESPONSIVE },
    ],
  },

  // Blog
  {
    id: 'blog-laravel',
    title: 'Build a blog',
    description: 'Posts stored in a database and rendered with Blade.',
    stack: 'laravel',
    docLinks: [doc('Starter kits', 'https://laravel.com/docs/starter-kits')],
    steps: [
      { id: 'setup', title: 'Create a Laravel project', tip: 'composer create-project laravel/laravel blog, then php artisan serve.', check: LARAVEL_SETUP, skill: COMPREHENSION },
      { id: 'model', title: 'Add a Post model and migration', tip: 'Give posts a unique slug column for readable URLs.', check: [named('app/Models/Post\\.php'), migration('posts')], skill: COMPREHENSION },
      { id: 'post-list', title: 'Show a list of posts', tip: 'Post::latest()->paginate(10) orders by newest first.', check: code(BLADE, /@foreach\s*\(\s*\$posts/), skill: SEMANTIC_HTML },
      { id: 'post-page', title: 'Create a post page by slug', tip: 'Route::get("/posts/{post:slug}") binds the post by its slug.', check: file(/(^|\/)routes\/web\.php$/, /\{post(:slug)?\}/), skill: COMPREHENSION },
      { id: 'markdown', title: 'Write posts in Markdown', tip: 'Str::markdown($post->body) converts Markdown to HTML, no package needed.', check: code('php', /Str::markdown\(|->markdown\(/), skill: COMPREHENSION },
      { id: 'admin', title: 'Add login and a form to write posts', tip: 'Laravel Breeze sets up login and registration in one command.', check: composer('laravel/breeze'), skill: DEFENSIVE },
      { id: 'tags', title: 'Add tags with a many-to-many relation', tip: 'A post_tag pivot table plus belongsToMany on both models.', check: code('php', /belongsToMany\(\s*Tag::class/), skill: COMPREHENSION },
      { id: 'rss', title: 'Generate an RSS feed', tip: 'Return a Blade view with the XML content type from a /feed route.', check: file(/(^|\/)routes\/web\.php$/, /['"]\/?feed['"]/), skill: COMPREHENSION },
    ],
  },
  {
    id: 'blog-django',
    title: 'Build a blog',
    description: 'Write posts in the Django admin and publish them with templates.',
    stack: 'django',
    docLinks: [doc('django-taggit', 'https://django-taggit.readthedocs.io/'), doc('Feeds', 'https://docs.djangoproject.com/en/stable/ref/contrib/syndication/')],
    steps: [
      { id: 'setup', title: 'Start a Django project and a blog app', tip: 'django-admin startproject, then python manage.py startapp blog.', check: djangoSetup('blog'), skill: COMPREHENSION },
      { id: 'model', title: 'Add a Post model with a slug', tip: 'prepopulated_fields in the admin fills the slug from the title.', check: code('py', /class\s+Post\s*\([\s\S]*SlugField/), skill: COMPREHENSION },
      { id: 'admin', title: 'Write posts in the admin', tip: 'Run python manage.py createsuperuser to log in to /admin.', check: file(/admin\.py$/, /register\(\s*Post/), skill: COMPREHENSION },
      { id: 'post-list', title: 'List posts with a ListView', tip: 'Set ordering = ["-published"] on the model Meta for newest first.', check: code('py', /ListView/), skill: SEMANTIC_HTML },
      { id: 'post-page', title: 'Create a post DetailView', tip: 'Add get_absolute_url to the model so templates can link to posts.', check: code('py', /DetailView/), skill: COMPREHENSION },
      { id: 'tags', title: 'Add tags', tip: 'django-taggit gives you a TaggableManager field and tag lookups.', check: code('py', /TaggableManager/), skill: COMPREHENSION },
      { id: 'rss', title: 'Generate an RSS feed', tip: 'django.contrib.syndication builds the feed from a small Feed class.', check: code('py', /django\.contrib\.syndication/), skill: COMPREHENSION },
      { id: 'comments', title: 'Add a comment form', tip: 'A ModelForm for a Comment model linked to the post with a ForeignKey.', check: code('py', /class\s+Comment\s*\(/), skill: DEFENSIVE },
    ],
  },
  {
    id: 'blog-node',
    title: 'Build a blog',
    description: 'Markdown files turned into pages by an Express server.',
    stack: 'node',
    docLinks: [doc('marked', 'https://marked.js.org/'), doc('gray-matter', 'https://github.com/jonschlinkert/gray-matter')],
    steps: [
      { id: 'setup', title: 'Set up Express with a template engine', tip: 'EJS is the simplest: app.set("view engine", "ejs").', check: [pkg('express'), code(JS, /set\(\s*["']view engine/)], skill: COMPREHENSION },
      { id: 'posts', title: 'Store posts as Markdown files', tip: 'gray-matter reads the title and date from the front matter at the top of each file.', check: [pkg('gray-matter'), file(/(^|\/)posts\/[^/]+\.md$/)], skill: COMPREHENSION },
      { id: 'post-list', title: 'Show a list of posts', tip: 'Read the posts folder with fs.readdir and sort by date.', check: code(JS, /readdir/), skill: COMPREHENSION },
      { id: 'post-page', title: 'Render a post page', tip: 'marked converts the Markdown body to HTML.', check: pkg('marked'), skill: SEMANTIC_HTML },
      { id: 'tags', title: 'Add tag pages', tip: 'app.get("/tags/:tag") is just the post list, filtered.', check: code(JS, /\.get\(\s*["'`][^"'`]*tags\/:\w+/), skill: COMPREHENSION },
      { id: 'rss', title: 'Generate an RSS feed', tip: 'Send an XML string with res.type("application/rss+xml").', check: code(JS, /application\/rss\+xml/), skill: COMPREHENSION },
      { id: 'deploy', title: 'Deploy the server', tip: 'Render and Railway run Node apps; read the port from process.env.PORT.' },
    ],
  },
  {
    id: 'blog-react',
    title: 'Build a blog',
    description: 'A React blog with Markdown posts and client-side routing.',
    stack: 'react',
    requirements: ['GitHub Discussions turned on for your repository (for Giscus)'],
    docLinks: [doc('react-markdown', 'https://github.com/remarkjs/react-markdown'), doc('Giscus', 'https://giscus.app/')],
    steps: [
      { id: 'setup', title: 'Create a React app with Vite', tip: 'Run npm create vite@latest and pick the React template.', check: REACT_SETUP, skill: COMPREHENSION },
      { id: 'post-list', title: 'Show a list of posts', tip: 'Show the title, date and a one-line summary.', check: file(/(^|\/)(PostList|Posts)\.(jsx|tsx)$/), skill: SEMANTIC_HTML },
      { id: 'post-page', title: 'Add post pages with React Router', tip: 'Use a route like /posts/:slug and find the post with useParams.', check: ROUTE_PARAM, skill: COMPREHENSION },
      { id: 'markdown', title: 'Write posts in Markdown', tip: 'react-markdown renders Markdown as React elements.', check: pkg('react-markdown'), skill: SEMANTIC_HTML },
      { id: 'tags', title: 'Add tag filtering', tip: 'Keep the selected tag in the URL so filtered views can be shared.', check: code(JSX, /useSearchParams/), skill: COMPREHENSION },
      { id: 'comments', title: 'Add comments', tip: 'Giscus uses GitHub Discussions, so there is no backend to run.', check: code(`${JSX}|json`, /giscus/i), skill: COMPREHENSION },
      { id: 'deploy', title: 'Deploy it', tip: 'Netlify, Vercel and GitHub Pages can all host a Vite build for free.' },
    ],
  },

  // Business website
  {
    id: 'business-laravel',
    title: 'Create a business website',
    description: 'A multi-page site with a contact form and bookings in Laravel.',
    stack: 'laravel',
    requirements: ['An email account with SMTP access (for the contact form)'],
    docLinks: [doc('Laravel Mail', 'https://laravel.com/docs/mail')],
    steps: [
      { id: 'setup', title: 'Create a Laravel project', tip: 'composer create-project laravel/laravel business, then php artisan serve.', check: LARAVEL_SETUP, skill: COMPREHENSION },
      { id: 'layout', title: 'Make a Blade layout with navigation', tip: 'Use a layout component and request()->routeIs() to highlight the current page.', check: file(/resources\/views\/(layouts|components)\/.*\.blade\.php$/, /<nav/), skill: SEMANTIC_HTML },
      { id: 'pages', title: 'Add home, services and contact pages', tip: 'Route::view() is enough for pages without logic.', check: [named('services\\.blade\\.php'), named('contact\\.blade\\.php')], skill: SEMANTIC_HTML },
      { id: 'contact-form', title: 'Send the contact form by email', tip: 'Validate the request, then send a Mailable with Mail::to().', check: file(/(^|\/)app\/Mail\/\w+\.php$/), skill: DEFENSIVE },
      { id: 'map', title: 'Embed a map of your location', tip: 'Google Maps and OpenStreetMap both offer embed codes.', check: MAP_EMBED, skill: SEMANTIC_HTML },
      { id: 'seo', title: 'Give every page its own title and description', tip: 'Pass them to the layout so each page sets its own.', check: code(BLADE, /<meta\s+name=["']description/), skill: SEMANTIC_HTML },
      { id: 'booking', title: 'Add an appointment booking form', tip: 'Store bookings in a table and validate the date is in the future.', check: migration('(bookings|appointments)'), skill: DEFENSIVE },
    ],
  },
  {
    id: 'business-django',
    title: 'Create a business website',
    description: 'Pages from templates, with services you edit in the Django admin.',
    stack: 'django',
    docLinks: [doc('Sending email', 'https://docs.djangoproject.com/en/stable/topics/email/')],
    steps: [
      { id: 'setup', title: 'Start a Django project and a pages app', tip: 'django-admin startproject, then python manage.py startapp pages.', check: djangoSetup('pages'), skill: COMPREHENSION },
      { id: 'layout', title: 'Make a base template with navigation', tip: 'Other templates extend base.html and fill in {% block content %}.', check: file(/(^|\/)base\.html$/, /<nav/), skill: SEMANTIC_HTML },
      { id: 'pages', title: 'Add home, services and contact pages', tip: 'TemplateView.as_view(template_name=...) needs no view code.', check: code('py', /TemplateView/), skill: COMPREHENSION },
      { id: 'services', title: 'Manage services in the admin', tip: 'A Service model registered in the admin lets non-developers edit them.', check: [code('py', /class\s+Service\s*\(/), file(/admin\.py$/, /register\(\s*Service/)], skill: COMPREHENSION },
      { id: 'contact-form', title: 'Send the contact form by email', tip: 'A Django Form plus send_mail; use the console email backend while developing.', check: code('py', /send_mail\(/), skill: DEFENSIVE },
      { id: 'map', title: 'Embed a map of your location', tip: 'Google Maps and OpenStreetMap both offer embed codes.', check: MAP_EMBED, skill: SEMANTIC_HTML },
      { id: 'seo', title: 'Give every page its own title and description', tip: 'Add {% block title %} to base.html and override it per page.', check: code('html', /\{%\s*block\s+title/), skill: SEMANTIC_HTML },
    ],
  },
  {
    id: 'business-react',
    title: 'Create a business website',
    description: 'A multi-page React site with routing and a contact section.',
    stack: 'react',
    steps: [
      { id: 'setup', title: 'Create a React app with Vite', tip: 'Run npm create vite@latest and pick the React template.', check: REACT_SETUP, skill: COMPREHENSION },
      { id: 'routing', title: 'Add pages with React Router', tip: 'NavLink adds an active class to the link for the current page.', check: [pkg('react-router(-dom)?'), code(JSX, /<NavLink/)], skill: COMPREHENSION },
      { id: 'home', title: 'Build a home page', tip: 'Answer "what do you do?" above the fold.', check: component('Home'), skill: SEMANTIC_HTML },
      { id: 'services', title: 'List your services from an array', tip: 'Add a short description and, if you can, a starting price.', check: component('Services'), skill: COMPREHENSION },
      { id: 'contact', title: 'Add contact info and opening hours', tip: 'Make the phone number a tel: link so it works on mobile.', check: code(JSX, /tel:/), skill: SEMANTIC_HTML },
      { id: 'map', title: 'Embed a map of your location', tip: 'Google Maps and OpenStreetMap both offer embed codes.', check: MAP_EMBED, skill: SEMANTIC_HTML },
      { id: 'seo', title: 'Give every page its own title', tip: 'React 19 lets you render <title> inside a page component.', check: code('jsx|tsx', /<title>/), skill: SEMANTIC_HTML },
    ],
  },
]

export function getProjectsForStack(stackId) {
  return stackId === 'all' ? OBJECTIVES : OBJECTIVES.filter((o) => o.stack === stackId)
}
