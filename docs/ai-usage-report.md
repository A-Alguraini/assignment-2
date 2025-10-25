

# AI Usage Report

## Tools Used
- ChatGPT: brainstorming UI flows, drafting code scaffolds (tabs, reveal, form validation), and documentation outlines.
- VS Code IntelliSense: in-editor completions and quick fixes.

## Representative Prompts
1. “Build a projects page in vanilla JS with a template, search, sort by date/title, tag chips, and accordion details.”
2. “Show loading, empty, and error states for fetch with a Retry button; announce status with aria-live.”
3. “Add a dark/light theme toggle persisted in localStorage; include subtle reveal animations.”

## Raw Outputs (Short Excerpts)
- IntersectionObserver reveal snippet.
- `fetch` with retry button pattern.
- Minimal form validation logic (name/email/message).

## Your Edits & Rationale
- **Accessibility**: confirmed `role="status"` + `aria-live="polite"` for announcements; kept strong focus styles and keyboard-friendly chip toggles.
- **Performance**: added CSS preload, `loading="lazy"`, explicit image dimensions to reduce CLS.
- **UX Polish**: simplified toasts, tuned error/empty copy, balanced animation duration.
- **Data Model**: projects extended with `image`/`imageAlt` fields.

## Challenges
- Handling network errors while keeping the UI responsive.
- Combining query + tag chips + sort without jank.
- Preventing layout shift with different thumbnail sizes.

## Learning Outcomes
- Managing small app state in vanilla JS (query, sort, tags, theme).
- Using IntersectionObserver for performant reveals.
- Applying ARIA live regions for accessible feedback.

## Innovation
- JSON-driven gallery with optional thumbnails.
- Unified toast/status pattern for Projects and Contact.
