// Tech stacks shown as categories in the sidebar. Each project is built with exactly one stack.
export const STACKS = [
  { id: 'laravel', label: 'Laravel', description: 'PHP framework with routing, Blade templates and Eloquent ORM built in.', docs: 'https://laravel.com/docs' },
  { id: 'django', label: 'Django', description: 'Python framework with an admin panel, ORM and templates out of the box.', docs: 'https://docs.djangoproject.com' },
  { id: 'node', label: 'Node', description: 'JavaScript on the server, usually with Express for routing.', docs: 'https://nodejs.org/en/learn' },
  { id: 'react', label: 'React', description: 'Component-based UI library for building interactive front ends.', docs: 'https://react.dev/learn' },
]

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

// The same goal (title) can have one card per stack, each with steps specific to that stack.
export const OBJECTIVES = [
  // Portfolio
  {
    id: 'portfolio-react',
    title: 'Build a portfolio',
    description: 'A single-page portfolio built from React components.',
    stack: 'react',
    steps: [
      { id: 'setup', title: 'Create a React app with Vite', tip: 'Run npm create vite@latest and pick the React template.', check: REACT_SETUP },
      { id: 'hero', title: 'Build a Hero component with your name and role', tip: 'Keep it to one sentence. Visitors decide in seconds whether to keep reading.', check: component('Hero') },
      { id: 'projects', title: 'Render at least 3 projects from an array', tip: 'Keep projects in a data file and map over them into a ProjectCard component.', check: component('ProjectCard') },
      { id: 'about', title: 'Add an About component', tip: 'Mention what you want to work on next, not just what you have done.', check: component('About') },
      { id: 'contact', title: 'Add contact details', tip: 'A mailto: link is a perfectly good first version.', check: code(`${JSX}|html`, /mailto:/) },
      { id: 'responsive', title: 'Make the layout work on mobile', tip: 'Test at 375px wide. Grids that become a single column usually just work.', check: code('css|scss', /@media/) },
      { id: 'routing', title: 'Give each project its own page with React Router', tip: 'Use a route like /projects/:id and look the project up by its id.', check: ROUTE_PARAM },
      { id: 'dark-mode', title: 'Add a dark mode toggle', tip: 'Keep the theme in state and save it to localStorage so it survives a refresh.', check: code(JSX, /localStorage[\s\S]{0,300}(theme|dark)|(theme|dark)[\s\S]{0,300}localStorage/i) },
      { id: 'deploy', title: 'Deploy it to a custom domain', tip: 'Netlify, Vercel and GitHub Pages can all host a Vite build for free.' },
    ],
  },
  {
    id: 'portfolio-node',
    title: 'Build a portfolio',
    description: 'A server-rendered portfolio with Node and Express.',
    stack: 'node',
    steps: [
      { id: 'setup', title: 'Set up an Express server', tip: 'npm init, npm install express, then a server.js that listens on a port.', check: [pkg('express'), code(JS, /\.listen\(/)] },
      { id: 'static', title: 'Serve your CSS and images as static files', tip: 'app.use(express.static("public")) serves everything in the public folder.', check: code(JS, /express\.static\(/) },
      { id: 'home', title: 'Render a home page with your name and role', tip: 'A template engine like EJS lets you reuse a layout across pages.', check: [pkg('ejs'), code(JS, /res\.render\(/)] },
      { id: 'projects', title: 'List at least 3 projects from a JSON file', tip: 'Read the file once at startup and pass the array to your template.', check: named('projects\\.json') },
      { id: 'project-pages', title: 'Add a page per project with a route parameter', tip: 'app.get("/projects/:id") and return a 404 when the id does not exist.', check: code(JS, /\.get\(\s*["'`][^"'`]*\/:\w+/) },
      { id: 'contact-form', title: 'Handle a contact form POST', tip: 'Use express.urlencoded() to read the form, then redirect to a thank-you page.', check: [code(JS, /express\.urlencoded\(/), code(JS, /\.post\(/)] },
      { id: 'email', title: 'Email yourself the contact form messages', tip: 'Nodemailer can send through any SMTP provider. Keep credentials in a .env file.', check: pkg('nodemailer') },
      { id: 'deploy', title: 'Deploy the server', tip: 'Render and Railway run Node apps; read the port from process.env.PORT.' },
    ],
  },

  // Online store
  {
    id: 'store-laravel',
    title: 'Create an online store',
    description: 'Products in a database, a session cart and checkout with Laravel.',
    stack: 'laravel',
    steps: [
      { id: 'setup', title: 'Create a Laravel project', tip: 'composer create-project laravel/laravel store, then php artisan serve.', check: LARAVEL_SETUP },
      { id: 'model', title: 'Add a Product model, migration and seeder', tip: 'php artisan make:model Product -ms creates all three at once.', check: [named('app/Models/Product\\.php'), migration('products'), named('ProductSeeder\\.php')] },
      { id: 'catalog', title: 'Show products in a Blade view', tip: 'Product::paginate(12) gives you pagination links for free.', check: code(BLADE, /@foreach\s*\(\s*\$products/) },
      { id: 'product-page', title: 'Create a product detail page', tip: 'Route model binding: Route::get("/products/{product}") hands you the model directly.', check: file(/(^|\/)routes\/web\.php$/, /\{product\}/) },
      { id: 'cart', title: 'Store the cart in the session', tip: 'session()->put("cart", $cart) keeps it between requests without a database table.', check: code('php', /session[\s\S]{0,40}['"]cart['"]/) },
      { id: 'checkout', title: 'Build a checkout form with validation', tip: '$request->validate([...]) redirects back with errors automatically.', check: code('php', /->validate\(/) },
      { id: 'orders', title: 'Save orders to the database', tip: 'Use an orders table plus an order_items table for the products in each order.', check: migration('orders') },
      { id: 'payments', title: 'Take payments with Stripe in test mode', tip: 'Laravel Cashier wraps Stripe Checkout so you never handle card details.', check: composer('laravel/cashier') },
    ],
  },
  {
    id: 'store-django',
    title: 'Create an online store',
    description: 'Manage products in the Django admin and sell them with a session cart.',
    stack: 'django',
    steps: [
      { id: 'setup', title: 'Start a Django project and a shop app', tip: 'django-admin startproject, then python manage.py startapp shop.', check: djangoSetup('shop') },
      { id: 'model', title: 'Add a Product model and run migrations', tip: 'Use DecimalField for prices, never FloatField.', check: [code('py', /class\s+Product\s*\(/), file(/migrations\/0001_initial\.py$/)] },
      { id: 'admin', title: 'Register products in the admin', tip: 'admin.site.register(Product) gives you a full product editor for free.', check: file(/admin\.py$/, /register\(\s*Product/) },
      { id: 'catalog', title: 'List products with a ListView', tip: 'Set paginate_by on the view to paginate the list.', check: code('py', /ListView/) },
      { id: 'product-page', title: 'Create a product DetailView', tip: 'Use a slug in the URL for readable links: path("<slug:slug>/", ...).', check: code('py', /DetailView/) },
      { id: 'cart', title: 'Store the cart in request.session', tip: 'Set request.session.modified = True after changing a nested dict.', check: code('py', /session[\s\S]{0,20}['"]cart['"]/) },
      { id: 'checkout', title: 'Build a checkout form with a Django Form', tip: 'form.is_valid() and form.cleaned_data handle validation for you.', check: file(/forms\.py$/, /forms\.(Model)?Form/) },
      { id: 'orders', title: 'Save orders with an Order model', tip: 'Copy the price into the order line so later price changes do not alter old orders.', check: code('py', /class\s+Order\s*\(/) },
    ],
  },
  {
    id: 'store-node',
    title: 'Create an online store',
    description: 'An Express server with product pages, a cart and Stripe checkout.',
    stack: 'node',
    steps: [
      { id: 'setup', title: 'Set up Express with a template engine', tip: 'EJS is the simplest: app.set("view engine", "ejs").', check: [pkg('express'), code(JS, /set\(\s*["']view engine/)] },
      { id: 'data', title: 'Store products in a database', tip: 'SQLite needs no server; better-sqlite3 is fast and easy to use.', check: pkg('(better-sqlite3|sqlite3|mongoose|pg|mysql2)') },
      { id: 'catalog', title: 'Render a product list page', tip: 'Query the products in the route handler and pass them to res.render.', check: code(JS, /res\.render\(\s*["'`][^"'`]*products/) },
      { id: 'product-page', title: 'Add a product detail route', tip: 'app.get("/products/:id") and send a 404 page when nothing is found.', check: code(JS, /\.get\(\s*["'`][^"'`]*products\/:\w+/) },
      { id: 'cart', title: 'Keep a cart with express-session', tip: 'Store only product ids and quantities; look up prices at checkout.', check: pkg('express-session') },
      { id: 'checkout', title: 'Validate the checkout form on the server', tip: 'express-validator checks fields and collects error messages.', check: pkg('express-validator') },
      { id: 'payments', title: 'Create a Stripe Checkout session', tip: 'Calculate the total on the server, never trust prices sent from the browser.', check: [pkg('stripe'), code(JS, /checkout\.sessions\.create\(/)] },
    ],
  },
  {
    id: 'store-react',
    title: 'Create an online store',
    description: 'A React front end with a product grid, cart and checkout form.',
    stack: 'react',
    steps: [
      { id: 'setup', title: 'Create a React app with Vite', tip: 'Run npm create vite@latest and pick the React template.', check: REACT_SETUP },
      { id: 'catalog', title: 'Render a product grid from an array', tip: 'Keep products in a data file and map them into a ProductCard component.', check: component('ProductCard') },
      { id: 'product-page', title: 'Add product pages with React Router', tip: 'Use a route like /products/:id and find the product with useParams.', check: ROUTE_PARAM },
      { id: 'cart', title: 'Add a cart with useState or Context', tip: 'Start with an array of { productId, quantity }; Context avoids passing props down.', check: file(/(^|\/)Cart\w*\.(jsx|tsx|js)$/) },
      { id: 'cart-persist', title: 'Keep the cart after a page refresh', tip: 'Save the cart to localStorage in a useEffect.', check: code(JSX, /localStorage[\s\S]{0,200}cart|cart[\s\S]{0,200}localStorage/i) },
      { id: 'filters', title: 'Add category filters or search', tip: 'Filter the same product array; never duplicate the data.', check: code(JSX, /(category|search)[\s\S]{0,200}\.filter\(|\.filter\([\s\S]{0,200}(category|search)/i) },
      { id: 'checkout', title: 'Build a checkout form with validation', tip: 'Validate on blur, not on every keystroke.', check: component('Checkout') },
    ],
  },

  // Landing page
  {
    id: 'landing-react',
    title: 'Launch a landing page',
    description: 'One React page that convinces visitors to take a single action.',
    stack: 'react',
    steps: [
      { id: 'setup', title: 'Create a React app with Vite', tip: 'Run npm create vite@latest and pick the React template.', check: REACT_SETUP },
      { id: 'headline', title: 'Write a headline and subheadline', tip: 'Say what it does and who it is for.', check: code('jsx|tsx', /<h1/) },
      { id: 'cta', title: 'Add a call-to-action button', tip: 'Use one primary action. Two competing buttons halve your clicks.' },
      { id: 'features', title: 'List 3 key benefits from an array', tip: 'Describe the benefit to the user, not the feature itself.', check: code(JSX, /(features|benefits)\.map\(/i) },
      { id: 'social-proof', title: 'Add testimonials', tip: 'Real names and photos are far more convincing.', check: file(/(^|\/)Testimonials?\.(jsx|tsx)$/) },
      { id: 'signup', title: 'Add an email signup form', tip: 'A controlled input with useState; ask for the email only.', check: code('jsx|tsx', /type=["']email["']/) },
      { id: 'performance', title: 'Score 90+ on Lighthouse performance', tip: 'Compress images and lazy-load anything below the fold.' },
    ],
  },

  // Blog
  {
    id: 'blog-laravel',
    title: 'Build a blog',
    description: 'Posts stored in a database and rendered with Blade.',
    stack: 'laravel',
    steps: [
      { id: 'setup', title: 'Create a Laravel project', tip: 'composer create-project laravel/laravel blog, then php artisan serve.', check: LARAVEL_SETUP },
      { id: 'model', title: 'Add a Post model and migration', tip: 'Give posts a unique slug column for readable URLs.', check: [named('app/Models/Post\\.php'), migration('posts')] },
      { id: 'post-list', title: 'Show a list of posts', tip: 'Post::latest()->paginate(10) orders by newest first.', check: code(BLADE, /@foreach\s*\(\s*\$posts/) },
      { id: 'post-page', title: 'Create a post page by slug', tip: 'Route::get("/posts/{post:slug}") binds the post by its slug.', check: file(/(^|\/)routes\/web\.php$/, /\{post(:slug)?\}/) },
      { id: 'markdown', title: 'Write posts in Markdown', tip: 'Str::markdown($post->body) converts Markdown to HTML, no package needed.', check: code('php', /Str::markdown\(|->markdown\(/) },
      { id: 'admin', title: 'Add login and a form to write posts', tip: 'Laravel Breeze sets up login and registration in one command.', check: composer('laravel/breeze') },
      { id: 'tags', title: 'Add tags with a many-to-many relation', tip: 'A post_tag pivot table plus belongsToMany on both models.', check: code('php', /belongsToMany\(\s*Tag::class/) },
      { id: 'rss', title: 'Generate an RSS feed', tip: 'Return a Blade view with the XML content type from a /feed route.', check: file(/(^|\/)routes\/web\.php$/, /['"]\/?feed['"]/) },
    ],
  },
  {
    id: 'blog-django',
    title: 'Build a blog',
    description: 'Write posts in the Django admin and publish them with templates.',
    stack: 'django',
    steps: [
      { id: 'setup', title: 'Start a Django project and a blog app', tip: 'django-admin startproject, then python manage.py startapp blog.', check: djangoSetup('blog') },
      { id: 'model', title: 'Add a Post model with a slug', tip: 'prepopulated_fields in the admin fills the slug from the title.', check: code('py', /class\s+Post\s*\([\s\S]*SlugField/) },
      { id: 'admin', title: 'Write posts in the admin', tip: 'Run python manage.py createsuperuser to log in to /admin.', check: file(/admin\.py$/, /register\(\s*Post/) },
      { id: 'post-list', title: 'List posts with a ListView', tip: 'Set ordering = ["-published"] on the model Meta for newest first.', check: code('py', /ListView/) },
      { id: 'post-page', title: 'Create a post DetailView', tip: 'Add get_absolute_url to the model so templates can link to posts.', check: code('py', /DetailView/) },
      { id: 'tags', title: 'Add tags', tip: 'django-taggit gives you a TaggableManager field and tag lookups.', check: code('py', /TaggableManager/) },
      { id: 'rss', title: 'Generate an RSS feed', tip: 'django.contrib.syndication builds the feed from a small Feed class.', check: code('py', /django\.contrib\.syndication/) },
      { id: 'comments', title: 'Add a comment form', tip: 'A ModelForm for a Comment model linked to the post with a ForeignKey.', check: code('py', /class\s+Comment\s*\(/) },
    ],
  },
  {
    id: 'blog-node',
    title: 'Build a blog',
    description: 'Markdown files turned into pages by an Express server.',
    stack: 'node',
    steps: [
      { id: 'setup', title: 'Set up Express with a template engine', tip: 'EJS is the simplest: app.set("view engine", "ejs").', check: [pkg('express'), code(JS, /set\(\s*["']view engine/)] },
      { id: 'posts', title: 'Store posts as Markdown files', tip: 'gray-matter reads the title and date from the front matter at the top of each file.', check: [pkg('gray-matter'), file(/(^|\/)posts\/[^/]+\.md$/)] },
      { id: 'post-list', title: 'Show a list of posts', tip: 'Read the posts folder with fs.readdir and sort by date.', check: code(JS, /readdir/) },
      { id: 'post-page', title: 'Render a post page', tip: 'marked converts the Markdown body to HTML.', check: pkg('marked') },
      { id: 'tags', title: 'Add tag pages', tip: 'app.get("/tags/:tag") is just the post list, filtered.', check: code(JS, /\.get\(\s*["'`][^"'`]*tags\/:\w+/) },
      { id: 'rss', title: 'Generate an RSS feed', tip: 'Send an XML string with res.type("application/rss+xml").', check: code(JS, /application\/rss\+xml/) },
      { id: 'deploy', title: 'Deploy the server', tip: 'Render and Railway run Node apps; read the port from process.env.PORT.' },
    ],
  },
  {
    id: 'blog-react',
    title: 'Build a blog',
    description: 'A React blog with Markdown posts and client-side routing.',
    stack: 'react',
    steps: [
      { id: 'setup', title: 'Create a React app with Vite', tip: 'Run npm create vite@latest and pick the React template.', check: REACT_SETUP },
      { id: 'post-list', title: 'Show a list of posts', tip: 'Show the title, date and a one-line summary.', check: file(/(^|\/)(PostList|Posts)\.(jsx|tsx)$/) },
      { id: 'post-page', title: 'Add post pages with React Router', tip: 'Use a route like /posts/:slug and find the post with useParams.', check: ROUTE_PARAM },
      { id: 'markdown', title: 'Write posts in Markdown', tip: 'react-markdown renders Markdown as React elements.', check: pkg('react-markdown') },
      { id: 'tags', title: 'Add tag filtering', tip: 'Keep the selected tag in the URL so filtered views can be shared.', check: code(JSX, /useSearchParams/) },
      { id: 'comments', title: 'Add comments', tip: 'Giscus uses GitHub Discussions, so there is no backend to run.', check: code(`${JSX}|json`, /giscus/i) },
      { id: 'deploy', title: 'Deploy it', tip: 'Netlify, Vercel and GitHub Pages can all host a Vite build for free.' },
    ],
  },

  // Business website
  {
    id: 'business-laravel',
    title: 'Create a business website',
    description: 'A multi-page site with a contact form and bookings in Laravel.',
    stack: 'laravel',
    steps: [
      { id: 'setup', title: 'Create a Laravel project', tip: 'composer create-project laravel/laravel business, then php artisan serve.', check: LARAVEL_SETUP },
      { id: 'layout', title: 'Make a Blade layout with navigation', tip: 'Use a layout component and request()->routeIs() to highlight the current page.', check: file(/resources\/views\/(layouts|components)\/.*\.blade\.php$/, /<nav/) },
      { id: 'pages', title: 'Add home, services and contact pages', tip: 'Route::view() is enough for pages without logic.', check: [named('services\\.blade\\.php'), named('contact\\.blade\\.php')] },
      { id: 'contact-form', title: 'Send the contact form by email', tip: 'Validate the request, then send a Mailable with Mail::to().', check: file(/(^|\/)app\/Mail\/\w+\.php$/) },
      { id: 'map', title: 'Embed a map of your location', tip: 'Google Maps and OpenStreetMap both offer embed codes.', check: MAP_EMBED },
      { id: 'seo', title: 'Give every page its own title and description', tip: 'Pass them to the layout so each page sets its own.', check: code(BLADE, /<meta\s+name=["']description/) },
      { id: 'booking', title: 'Add an appointment booking form', tip: 'Store bookings in a table and validate the date is in the future.', check: migration('(bookings|appointments)') },
    ],
  },
  {
    id: 'business-django',
    title: 'Create a business website',
    description: 'Pages from templates, with services you edit in the Django admin.',
    stack: 'django',
    steps: [
      { id: 'setup', title: 'Start a Django project and a pages app', tip: 'django-admin startproject, then python manage.py startapp pages.', check: djangoSetup('pages') },
      { id: 'layout', title: 'Make a base template with navigation', tip: 'Other templates extend base.html and fill in {% block content %}.', check: file(/(^|\/)base\.html$/, /<nav/) },
      { id: 'pages', title: 'Add home, services and contact pages', tip: 'TemplateView.as_view(template_name=...) needs no view code.', check: code('py', /TemplateView/) },
      { id: 'services', title: 'Manage services in the admin', tip: 'A Service model registered in the admin lets non-developers edit them.', check: [code('py', /class\s+Service\s*\(/), file(/admin\.py$/, /register\(\s*Service/)] },
      { id: 'contact-form', title: 'Send the contact form by email', tip: 'A Django Form plus send_mail; use the console email backend while developing.', check: code('py', /send_mail\(/) },
      { id: 'map', title: 'Embed a map of your location', tip: 'Google Maps and OpenStreetMap both offer embed codes.', check: MAP_EMBED },
      { id: 'seo', title: 'Give every page its own title and description', tip: 'Add {% block title %} to base.html and override it per page.', check: code('html', /\{%\s*block\s+title/) },
    ],
  },
  {
    id: 'business-react',
    title: 'Create a business website',
    description: 'A multi-page React site with routing and a contact section.',
    stack: 'react',
    steps: [
      { id: 'setup', title: 'Create a React app with Vite', tip: 'Run npm create vite@latest and pick the React template.', check: REACT_SETUP },
      { id: 'routing', title: 'Add pages with React Router', tip: 'NavLink adds an active class to the link for the current page.', check: [pkg('react-router(-dom)?'), code(JSX, /<NavLink/)] },
      { id: 'home', title: 'Build a home page', tip: 'Answer "what do you do?" above the fold.', check: component('Home') },
      { id: 'services', title: 'List your services from an array', tip: 'Add a short description and, if you can, a starting price.', check: component('Services') },
      { id: 'contact', title: 'Add contact info and opening hours', tip: 'Make the phone number a tel: link so it works on mobile.', check: code(JSX, /tel:/) },
      { id: 'map', title: 'Embed a map of your location', tip: 'Google Maps and OpenStreetMap both offer embed codes.', check: MAP_EMBED },
      { id: 'seo', title: 'Give every page its own title', tip: 'React 19 lets you render <title> inside a page component.', check: code('jsx|tsx', /<title>/) },
    ],
  },
]

export function getProjectsForStack(stackId) {
  return stackId === 'all' ? OBJECTIVES : OBJECTIVES.filter((o) => o.stack === stackId)
}
