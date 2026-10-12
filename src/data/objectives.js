// Tech stacks shown as categories in the sidebar. Each project is built with exactly one stack.
export const STACKS = [
  { id: 'laravel', label: 'Laravel', description: 'PHP framework with routing, Blade templates and Eloquent ORM built in.', docs: 'https://laravel.com/docs' },
  { id: 'django', label: 'Django', description: 'Python framework with an admin panel, ORM and templates out of the box.', docs: 'https://docs.djangoproject.com' },
  { id: 'node', label: 'Node', description: 'JavaScript on the server, usually with Express for routing.', docs: 'https://nodejs.org/en/learn' },
  { id: 'react', label: 'React', description: 'Component-based UI library for building interactive front ends.', docs: 'https://react.dev/learn' },
]

// The same goal (title) can have one card per stack, each with steps specific to that stack.
export const OBJECTIVES = [
  // Portfolio
  {
    id: 'portfolio-react',
    title: 'Build a portfolio',
    description: 'A single-page portfolio built from React components.',
    stack: 'react',
    steps: [
      { id: 'setup', title: 'Create a React app with Vite', tip: 'Run npm create vite@latest and pick the React template.' },
      { id: 'hero', title: 'Build a Hero component with your name and role', tip: 'Keep it to one sentence. Visitors decide in seconds whether to keep reading.' },
      { id: 'projects', title: 'Render at least 3 projects from an array', tip: 'Keep projects in a data file and map over them into a ProjectCard component.' },
      { id: 'about', title: 'Add an About component', tip: 'Mention what you want to work on next, not just what you have done.' },
      { id: 'contact', title: 'Add contact details', tip: 'A mailto: link is a perfectly good first version.' },
      { id: 'responsive', title: 'Make the layout work on mobile', tip: 'Test at 375px wide. Grids that become a single column usually just work.' },
      { id: 'routing', title: 'Give each project its own page with React Router', tip: 'Use a route like /projects/:id and look the project up by its id.' },
      { id: 'dark-mode', title: 'Add a dark mode toggle', tip: 'Keep the theme in state and save it to localStorage so it survives a refresh.' },
      { id: 'deploy', title: 'Deploy it to a custom domain', tip: 'Netlify, Vercel and GitHub Pages can all host a Vite build for free.' },
    ],
  },
  {
    id: 'portfolio-node',
    title: 'Build a portfolio',
    description: 'A server-rendered portfolio with Node and Express.',
    stack: 'node',
    steps: [
      { id: 'setup', title: 'Set up an Express server', tip: 'npm init, npm install express, then a server.js that listens on a port.' },
      { id: 'static', title: 'Serve your CSS and images as static files', tip: 'app.use(express.static("public")) serves everything in the public folder.' },
      { id: 'home', title: 'Render a home page with your name and role', tip: 'A template engine like EJS lets you reuse a layout across pages.' },
      { id: 'projects', title: 'List at least 3 projects from a JSON file', tip: 'Read the file once at startup and pass the array to your template.' },
      { id: 'project-pages', title: 'Add a page per project with a route parameter', tip: 'app.get("/projects/:id") and return a 404 when the id does not exist.' },
      { id: 'contact-form', title: 'Handle a contact form POST', tip: 'Use express.urlencoded() to read the form, then redirect to a thank-you page.' },
      { id: 'email', title: 'Email yourself the contact form messages', tip: 'Nodemailer can send through any SMTP provider. Keep credentials in a .env file.' },
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
      { id: 'setup', title: 'Create a Laravel project', tip: 'composer create-project laravel/laravel store, then php artisan serve.' },
      { id: 'model', title: 'Add a Product model, migration and seeder', tip: 'php artisan make:model Product -ms creates all three at once.' },
      { id: 'catalog', title: 'Show products in a Blade view', tip: 'Product::paginate(12) gives you pagination links for free.' },
      { id: 'product-page', title: 'Create a product detail page', tip: 'Route model binding: Route::get("/products/{product}") hands you the model directly.' },
      { id: 'cart', title: 'Store the cart in the session', tip: 'session()->put("cart", $cart) keeps it between requests without a database table.' },
      { id: 'checkout', title: 'Build a checkout form with validation', tip: '$request->validate([...]) redirects back with errors automatically.' },
      { id: 'orders', title: 'Save orders to the database', tip: 'Use an orders table plus an order_items table for the products in each order.' },
      { id: 'payments', title: 'Take payments with Stripe in test mode', tip: 'Laravel Cashier wraps Stripe Checkout so you never handle card details.' },
    ],
  },
  {
    id: 'store-django',
    title: 'Create an online store',
    description: 'Manage products in the Django admin and sell them with a session cart.',
    stack: 'django',
    steps: [
      { id: 'setup', title: 'Start a Django project and a shop app', tip: 'django-admin startproject, then python manage.py startapp shop.' },
      { id: 'model', title: 'Add a Product model and run migrations', tip: 'Use DecimalField for prices, never FloatField.' },
      { id: 'admin', title: 'Register products in the admin', tip: 'admin.site.register(Product) gives you a full product editor for free.' },
      { id: 'catalog', title: 'List products with a ListView', tip: 'Set paginate_by on the view to paginate the list.' },
      { id: 'product-page', title: 'Create a product DetailView', tip: 'Use a slug in the URL for readable links: path("<slug:slug>/", ...).' },
      { id: 'cart', title: 'Store the cart in request.session', tip: 'Set request.session.modified = True after changing a nested dict.' },
      { id: 'checkout', title: 'Build a checkout form with a Django Form', tip: 'form.is_valid() and form.cleaned_data handle validation for you.' },
      { id: 'orders', title: 'Save orders with an Order model', tip: 'Copy the price into the order line so later price changes do not alter old orders.' },
    ],
  },
  {
    id: 'store-node',
    title: 'Create an online store',
    description: 'An Express server with product pages, a cart and Stripe checkout.',
    stack: 'node',
    steps: [
      { id: 'setup', title: 'Set up Express with a template engine', tip: 'EJS is the simplest: app.set("view engine", "ejs").' },
      { id: 'data', title: 'Store products in a database', tip: 'SQLite needs no server; better-sqlite3 is fast and easy to use.' },
      { id: 'catalog', title: 'Render a product list page', tip: 'Query the products in the route handler and pass them to res.render.' },
      { id: 'product-page', title: 'Add a product detail route', tip: 'app.get("/products/:id") and send a 404 page when nothing is found.' },
      { id: 'cart', title: 'Keep a cart with express-session', tip: 'Store only product ids and quantities; look up prices at checkout.' },
      { id: 'checkout', title: 'Validate the checkout form on the server', tip: 'express-validator checks fields and collects error messages.' },
      { id: 'payments', title: 'Create a Stripe Checkout session', tip: 'Calculate the total on the server, never trust prices sent from the browser.' },
    ],
  },
  {
    id: 'store-react',
    title: 'Create an online store',
    description: 'A React front end with a product grid, cart and checkout form.',
    stack: 'react',
    steps: [
      { id: 'setup', title: 'Create a React app with Vite', tip: 'Run npm create vite@latest and pick the React template.' },
      { id: 'catalog', title: 'Render a product grid from an array', tip: 'Keep products in a data file and map them into a ProductCard component.' },
      { id: 'product-page', title: 'Add product pages with React Router', tip: 'Use a route like /products/:id and find the product with useParams.' },
      { id: 'cart', title: 'Add a cart with useState or Context', tip: 'Start with an array of { productId, quantity }; Context avoids passing props down.' },
      { id: 'cart-persist', title: 'Keep the cart after a page refresh', tip: 'Save the cart to localStorage in a useEffect.' },
      { id: 'filters', title: 'Add category filters or search', tip: 'Filter the same product array; never duplicate the data.' },
      { id: 'checkout', title: 'Build a checkout form with validation', tip: 'Validate on blur, not on every keystroke.' },
    ],
  },

  // Landing page
  {
    id: 'landing-react',
    title: 'Launch a landing page',
    description: 'One React page that convinces visitors to take a single action.',
    stack: 'react',
    steps: [
      { id: 'setup', title: 'Create a React app with Vite', tip: 'Run npm create vite@latest and pick the React template.' },
      { id: 'headline', title: 'Write a headline and subheadline', tip: 'Say what it does and who it is for.' },
      { id: 'cta', title: 'Add a call-to-action button', tip: 'Use one primary action. Two competing buttons halve your clicks.' },
      { id: 'features', title: 'List 3 key benefits from an array', tip: 'Describe the benefit to the user, not the feature itself.' },
      { id: 'social-proof', title: 'Add testimonials', tip: 'Real names and photos are far more convincing.' },
      { id: 'signup', title: 'Add an email signup form', tip: 'A controlled input with useState; ask for the email only.' },
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
      { id: 'setup', title: 'Create a Laravel project', tip: 'composer create-project laravel/laravel blog, then php artisan serve.' },
      { id: 'model', title: 'Add a Post model and migration', tip: 'Give posts a unique slug column for readable URLs.' },
      { id: 'post-list', title: 'Show a list of posts', tip: 'Post::latest()->paginate(10) orders by newest first.' },
      { id: 'post-page', title: 'Create a post page by slug', tip: 'Route::get("/posts/{post:slug}") binds the post by its slug.' },
      { id: 'markdown', title: 'Write posts in Markdown', tip: 'Str::markdown($post->body) converts Markdown to HTML, no package needed.' },
      { id: 'admin', title: 'Add login and a form to write posts', tip: 'Laravel Breeze sets up login and registration in one command.' },
      { id: 'tags', title: 'Add tags with a many-to-many relation', tip: 'A post_tag pivot table plus belongsToMany on both models.' },
      { id: 'rss', title: 'Generate an RSS feed', tip: 'Return a Blade view with the XML content type from a /feed route.' },
    ],
  },
  {
    id: 'blog-django',
    title: 'Build a blog',
    description: 'Write posts in the Django admin and publish them with templates.',
    stack: 'django',
    steps: [
      { id: 'setup', title: 'Start a Django project and a blog app', tip: 'django-admin startproject, then python manage.py startapp blog.' },
      { id: 'model', title: 'Add a Post model with a slug', tip: 'prepopulated_fields in the admin fills the slug from the title.' },
      { id: 'admin', title: 'Write posts in the admin', tip: 'Run python manage.py createsuperuser to log in to /admin.' },
      { id: 'post-list', title: 'List posts with a ListView', tip: 'Set ordering = ["-published"] on the model Meta for newest first.' },
      { id: 'post-page', title: 'Create a post DetailView', tip: 'Add get_absolute_url to the model so templates can link to posts.' },
      { id: 'tags', title: 'Add tags', tip: 'django-taggit gives you a TaggableManager field and tag lookups.' },
      { id: 'rss', title: 'Generate an RSS feed', tip: 'django.contrib.syndication builds the feed from a small Feed class.' },
      { id: 'comments', title: 'Add a comment form', tip: 'A ModelForm for a Comment model linked to the post with a ForeignKey.' },
    ],
  },
  {
    id: 'blog-node',
    title: 'Build a blog',
    description: 'Markdown files turned into pages by an Express server.',
    stack: 'node',
    steps: [
      { id: 'setup', title: 'Set up Express with a template engine', tip: 'EJS is the simplest: app.set("view engine", "ejs").' },
      { id: 'posts', title: 'Store posts as Markdown files', tip: 'gray-matter reads the title and date from the front matter at the top of each file.' },
      { id: 'post-list', title: 'Show a list of posts', tip: 'Read the posts folder with fs.readdir and sort by date.' },
      { id: 'post-page', title: 'Render a post page', tip: 'marked converts the Markdown body to HTML.' },
      { id: 'tags', title: 'Add tag pages', tip: 'app.get("/tags/:tag") is just the post list, filtered.' },
      { id: 'rss', title: 'Generate an RSS feed', tip: 'Send an XML string with res.type("application/rss+xml").' },
      { id: 'deploy', title: 'Deploy the server', tip: 'Render and Railway run Node apps; read the port from process.env.PORT.' },
    ],
  },
  {
    id: 'blog-react',
    title: 'Build a blog',
    description: 'A React blog with Markdown posts and client-side routing.',
    stack: 'react',
    steps: [
      { id: 'setup', title: 'Create a React app with Vite', tip: 'Run npm create vite@latest and pick the React template.' },
      { id: 'post-list', title: 'Show a list of posts', tip: 'Show the title, date and a one-line summary.' },
      { id: 'post-page', title: 'Add post pages with React Router', tip: 'Use a route like /posts/:slug and find the post with useParams.' },
      { id: 'markdown', title: 'Write posts in Markdown', tip: 'react-markdown renders Markdown as React elements.' },
      { id: 'tags', title: 'Add tag filtering', tip: 'Keep the selected tag in the URL so filtered views can be shared.' },
      { id: 'comments', title: 'Add comments', tip: 'Giscus uses GitHub Discussions, so there is no backend to run.' },
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
      { id: 'setup', title: 'Create a Laravel project', tip: 'composer create-project laravel/laravel business, then php artisan serve.' },
      { id: 'layout', title: 'Make a Blade layout with navigation', tip: 'Use a layout component and request()->routeIs() to highlight the current page.' },
      { id: 'pages', title: 'Add home, services and contact pages', tip: 'Route::view() is enough for pages without logic.' },
      { id: 'contact-form', title: 'Send the contact form by email', tip: 'Validate the request, then send a Mailable with Mail::to().' },
      { id: 'map', title: 'Embed a map of your location', tip: 'Google Maps and OpenStreetMap both offer embed codes.' },
      { id: 'seo', title: 'Give every page its own title and description', tip: 'Pass them to the layout so each page sets its own.' },
      { id: 'booking', title: 'Add an appointment booking form', tip: 'Store bookings in a table and validate the date is in the future.' },
    ],
  },
  {
    id: 'business-django',
    title: 'Create a business website',
    description: 'Pages from templates, with services you edit in the Django admin.',
    stack: 'django',
    steps: [
      { id: 'setup', title: 'Start a Django project and a pages app', tip: 'django-admin startproject, then python manage.py startapp pages.' },
      { id: 'layout', title: 'Make a base template with navigation', tip: 'Other templates extend base.html and fill in {% block content %}.' },
      { id: 'pages', title: 'Add home, services and contact pages', tip: 'TemplateView.as_view(template_name=...) needs no view code.' },
      { id: 'services', title: 'Manage services in the admin', tip: 'A Service model registered in the admin lets non-developers edit them.' },
      { id: 'contact-form', title: 'Send the contact form by email', tip: 'A Django Form plus send_mail; use the console email backend while developing.' },
      { id: 'map', title: 'Embed a map of your location', tip: 'Google Maps and OpenStreetMap both offer embed codes.' },
      { id: 'seo', title: 'Give every page its own title and description', tip: 'Add {% block title %} to base.html and override it per page.' },
    ],
  },
  {
    id: 'business-react',
    title: 'Create a business website',
    description: 'A multi-page React site with routing and a contact section.',
    stack: 'react',
    steps: [
      { id: 'setup', title: 'Create a React app with Vite', tip: 'Run npm create vite@latest and pick the React template.' },
      { id: 'routing', title: 'Add pages with React Router', tip: 'NavLink adds an active class to the link for the current page.' },
      { id: 'home', title: 'Build a home page', tip: 'Answer "what do you do?" above the fold.' },
      { id: 'services', title: 'List your services from an array', tip: 'Add a short description and, if you can, a starting price.' },
      { id: 'contact', title: 'Add contact info and opening hours', tip: 'Make the phone number a tel: link so it works on mobile.' },
      { id: 'map', title: 'Embed a map of your location', tip: 'Google Maps and OpenStreetMap both offer embed codes.' },
      { id: 'seo', title: 'Give every page its own title', tip: 'React 19 lets you render <title> inside a page component.' },
    ],
  },
]

export function getProjectsForStack(stackId) {
  return stackId === 'all' ? OBJECTIVES : OBJECTIVES.filter((o) => o.stack === stackId)
}
