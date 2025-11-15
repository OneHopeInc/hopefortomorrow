# Hope for Tomorrow

A modern web application built with Cloudflare Workers featuring dynamic navigation and client-side routing.

## Features

- **Dynamic Navigation**: Responsive navigation bar that adapts to different pages
- **Client-Side Routing**: Single Page Application (SPA) with smooth page transitions
- **Modern UI**: Beautiful, responsive design with gradient backgrounds and hover effects
- **Multiple Pages**: Home, Resources, and Lessons pages with distinct content
- **Mobile Responsive**: Optimized for all device sizes

## Project Structure

```
hopefortomorrow/
├── public/
│   ├── index.html          # Main HTML file
│   ├── css/
│   │   └── styles.css      # All styles
│   └── js/
│       └── router.js       # Client-side router
├── src/
│   └── index.ts           # Cloudflare Worker
├── wrangler.jsonc         # Cloudflare configuration
└── package.json           # Dependencies
```

## Pages

### Home Page (`/`)
- Welcome message and hero section
- Quick access buttons to Resources and Lessons
- Clean, engaging design

### Resources Page (`/resources`)
- Grid layout of resource cards
- Categories: Mental Health Support, Community Programs, Educational Materials, Crisis Support
- Each card has a "Learn More" button

### Lessons Page (`/lessons`)
- Grid layout of lesson cards
- Categories: Coping Strategies, Building Resilience, Mindfulness Practice, Communication Skills
- Each card has a "Start Lesson" button

## Navigation System

The app uses a custom client-side router that:

1. **Handles URL Changes**: Updates the browser URL without page reloads
2. **Manages Active States**: Highlights the current page in the navigation
3. **Supports Browser Navigation**: Works with back/forward buttons
4. **Smooth Transitions**: Shows/hides content smoothly

## Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open http://localhost:8787

### Deployment
Deploy to Cloudflare Workers:
```bash
npm run deploy
```

## Adding New Pages

To add a new page:

1. **Add the route** in `public/js/router.js`:
   ```javascript
   this.routes = {
       '/': 'home',
       '/resources': 'resources',
       '/lessons': 'lessons',
       '/new-page': 'new-page'  // Add this line
   };
   ```

2. **Add the navigation link** in `public/index.html`:
   ```html
   <li><a href="/new-page" class="nav-link" data-page="new-page">New Page</a></li>
   ```

3. **Create the page content** in `public/index.html`:
   ```html
   <div id="new-page" class="page">
       <h1 class="page-title">New Page</h1>
       <!-- Your content here -->
   </div>
   ```

## Customization

### Styling
- All styles are in `public/css/styles.css`
- Uses CSS Grid and Flexbox for layouts
- Gradient backgrounds and hover effects
- Mobile-first responsive design

### Content
- Update the HTML content in `public/index.html`
- Add new cards to the grid layouts
- Modify the hero section text

### API Endpoints
- API routes are handled in `src/index.ts`
- Add new endpoints under `/api/` path
- Example: `/api/message`, `/api/random`

## Browser Support

- Modern browsers with ES6+ support
- CSS Grid and Flexbox support required
- Progressive enhancement for older browsers

## Performance

- Lightweight vanilla JavaScript router
- No external dependencies
- Optimized CSS with minimal reflows
- Fast loading with Cloudflare's global CDN 