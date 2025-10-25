TECHNICAL DOCUMENTATION

Architecture
- HTML: Single index.html with three sections (About, Projects, Contact). Projects render from a <template id="projectItemTemplate">.
- CSS: css/styles.css defines design tokens (colors), layout (grid/cards), focus styles, chips, accordion, toast, and reveal transitions.
- JavaScript: js/script.js manages state, data fetch/Retry, rendering, animations, toasts, and contact-form validation.

State
const state = {
  projects: [],
  filtered: [],
  tags: new Set(),
  activeTags: new Set(),
  sort: 'title',   // 'title' | 'date'
  query: ''
};

Rendering & Interaction
1) Init: set year, apply theme, set greeting, init tabs, reveal observer, and form handler.
2) Data: loadProjects() fetches assets/projects.json. On error, shows message + Retry and can use a minimal fallback list.
3) Filters: buildTags() collects unique tags; applyFilters() combines query + active tag chips + sort.
4) Cards: renderProjects() clones the template per item, fills title/date/summary/details, renders tags, and wires the accordion. If image exists, it shows .thumb with loading="lazy" and imageAlt.

Accessibility
- Landmarks: header / nav / main / footer.
- Status areas use role="status" with aria-live="polite".
- Visible focus rings; chips and accordion buttons are keyboard-operable.
- All images include descriptive alt; thumbnails use imageAlt from JSON.

Error, Loading, and Empty States
- Loading: “Loading projects…” while fetching.
- Error: network failure message with a Retry button.
- Empty: “No projects found.” when filters match nothing.
- All status messages are announced via aria-live.

Animations
- On-scroll reveal uses IntersectionObserver with threshold: 0.12. When an element becomes visible, .visible is added and the observer unobserves it to avoid jank.

Performance
- CSS preload to improve first paint:
  <link rel="preload" href="css/styles.css" as="style">
  <link rel="stylesheet" href="css/styles.css">
- Thumbnails have explicit width/height and loading="lazy" to reduce CLS.
- Minimal JS/CSS; no third-party libraries.

Compatibility
Chrome (Desktop): OK — Baseline dev browser
Edge (Desktop):   OK
Firefox (Desktop): OK
iOS Safari:       OK — Tap targets >= 44px
Android Chrome:   OK — Lazy images work as expected

Data Format (assets/projects.json)
{
  "projects": [
    {
      "title": "K Park Parking App",
      "date": "2025-10-10",
      "summary": "Branding and UI concept for a campus parking app.",
      "details": "Designed logo treatment and explored flows for finding available parking.",
      "tags": ["ui", "branding", "campus"],
      "image": "assets/images/kpark.jpg",
      "imageAlt": "K Park app logo"
    },
    {
      "title": "Class Vacancy Schedule",
      "date": "2025-10-12",
      "summary": "Editable weekly schedule for open class slots.",
      "details": "Printable table and a clean HTML/CSS version for sharing.",
      "tags": ["planning", "html", "table"],
      "image": "assets/images/classVacancySchedule.png",
      "imageAlt": "Class vacancy schedule table"
    },
    {
      "title": "Personal Portfolio",
      "date": "2025-10-15",
      "summary": "Single-page portfolio with greeting, theme toggle, and contact form.",
      "details": "Reveal animations, search/sort/tag filters, and validated form.",
      "tags": ["web", "portfolio", "javascript"],
      "image": "assets/images/gradpic2022.jpg",
      "imageAlt": "Author portrait"
    }
  ]
}

Future Work
- Persist filters in the URL for shareable views.
- Pagination (“Load more”).
- Real email delivery using Formspree / EmailJS / a serverless endpoint.
