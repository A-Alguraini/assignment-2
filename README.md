ASSIGNMENT 2 – INTERACTIVE PORTFOLIO (README)

Live Demo: https://a-alguraini.github.io/assignment-2/
Repository: https://github.com/A-Alguraini/assignment-2

Overview
A single‑page, fully static portfolio (HTML, CSS, vanilla JS) with three sections—About, Projects, and Contact. It supports a persistent light/dark theme, a time‑based greeting, a JSON‑driven projects gallery (search, sort, tag chips, per‑card details, and thumbnails), and a validated contact form. The UI implements Loading, Empty, and Error + Retry states for data fetching and uses accessible status messages.

Run Locally
• Open index.html directly in your browser, or
• VS Code → Live Server (recommended to avoid caching of JSON).

Project Structure
index.html
css/
  styles.css
js/
  script.js
assets/
  images/
    gradpic2022.jpg
    kpark.jpg
    classVacancySchedule.png
  projects.json
docs/
  ai-usage-report.md
  technical-documentation.md
technical-documentation.txt
.gitignore

Features (mapped to requirements)
• Dynamic Content:
  – Tabbed navigation (About/Projects/Contact) with smooth transitions.
  – Time‑based greeting and a theme toggle (persisted via localStorage).
  – Projects list with live search, Title/Date sort, tag chips, and per‑card accordion details.
• Data Handling:
  – Fetches projects from assets/projects.json.
  – Loading, Empty, and Error + Retry states are presented in the status region.
  – Theme (and optionally display name) persisted in localStorage.
• Animations & Transitions:
  – On‑scroll reveal using IntersectionObserver.
  – Subtle hover/focus transitions for interactive elements.
• Error Handling & Feedback:
  – Contact form does client‑side validation.
  – Inline field errors and success/failure toasts.
  – All important status messages are announced via aria‑live for assistive tech.
• Images:
  – Profile photo on the About panel.
  – Per‑project thumbnails driven by JSON (image + imageAlt).

How to Customize
• Profile image: replace assets/images/gradpic2022.jpg and make sure the About <img> points to it.
• Projects: edit assets/projects.json. Each project supports:
  title, date (YYYY‑MM‑DD), summary, details, tags [array], image, imageAlt.
• Place all images under assets/images/.

Accessibility
• Semantic landmarks: header, nav, main, footer.
• Keyboard‑operable controls with visible focus outlines.
• role="status" aria‑live="polite" on status regions (Projects + Contact) so screen readers announce updates.
• Descriptive alt text for all images; thumbnails use imageAlt from JSON.

Performance
• Preload CSS to improve first paint:
  <link rel="preload" href="css/styles.css" as="style">
  <link rel="stylesheet" href="css/styles.css">
• Thumbnails have explicit width/height and loading="lazy" to reduce layout shift (CLS) and bandwidth.
• Minimal JS/CSS with no external libraries.

Compatibility
Tested manually on: Chrome, Edge, Firefox (desktop), iOS Safari, Android Chrome.

Deployment (GitHub Pages)
1) Repo → Settings → Pages.
2) Source: Deploy from a branch; Branch: main; Folder: / (root); Save.
3) Your site URL: https://a-alguraini.github.io/assignment-2/
4) Add the URL to the “Live Demo” line above.

AI Summary
High‑level use of ChatGPT/IntelliSense for brainstorming structure, reveal animation snippet, fetch/Retry pattern, and documentation outlines. Final code adjusted for accessibility (aria‑live), performance (CSS preload, lazy images, fixed sizes), and UX (clear toasts/messages). Full details: docs/ai-usage-report.md.

License
MIT (or your preferred license).
