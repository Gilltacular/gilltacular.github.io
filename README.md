# Gilltacular Portfolio & Blog

A personal portfolio website and blog built with vanilla JavaScript, HTML, and CSS — no frameworks, no build tools, no bloat.

> "Building intelligent systems where software meets hardware and human behavior"

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [File Structure](#file-structure)
- [Design System](#design-system)
- [Development Workflow](#development-workflow)
- [Features](#features)
- [Known Limitations](#known-limitations)
- [Roadmap](#roadmap)
- [Tech Stack](#tech-stack)
- [License](#license)

---

## Architecture Overview

This project follows a **separation of concerns** pattern with clear boundaries between structure (HTML), presentation (CSS), and behavior (JavaScript). All code is organized by namespace to prevent global scope pollution and enable future extensibility.

### Core Principles

1. **Separation of Concerns** — HTML, CSS, and JavaScript live in dedicated files. No inline styles or scripts except for critical above-the-fold optimizations (future enhancement).

2. **Namespace Pattern** — JavaScript functionality is encapsulated within `window` namespaces (`BlogList`, `PortfolioNav`). This prevents naming collisions and makes the codebase maintainable as it grows.

3. **Design Tokens** — All colors, fonts, and spacing values are defined once in `global.css` as CSS custom properties. This enables consistent theming across the site and simplifies future design changes.

4. **Accessibility-First** — Semantic HTML5 structure, ARIA attributes for interactive elements, and keyboard navigation support.

---

## File Structure

    gilltacular.github.io/
    ├── index.html                    # Portfolio landing page
    ├── blog/
    │   ├── index.html                # Blog listing page (pagination)
    │   ├── article.html              # Article template
    │   ├── css/
    │   │   └── article.css           # Article typography styles
    │   ├── js/
    │   │   ├── utils.js              # Helper functions
    │   │   ├── article.js            # Article renderer
    │   │   └── index.js              # Blog listing renderer (BlogList namespace)
    │   └── data/
    │       └── posts.json            # Blog post metadata
    ├── assets/
    │   ├── css/
    │   │   ├── global.css            # Site-wide styles and design tokens
    │   │   └── portfolio.css         # Portfolio-specific component styles
    │   ├── js/
    │   │   └── portfolio.js          # Portfolio interactivity (PortfolioNav namespace)
    │   ├── hero-backgrounds/
    │   │   ├── hero-bg-desktop.webp  # Desktop hero background
    │   │   ├── hero-bg-tablet.webp   # Tablet hero background
    │   │   └── hero-bg-mobile_portrait.webp  # Mobile portrait hero background
    │   └── src/
    │       └── reference.jpg         # Source image for hero background generation
    ├── scripts/
    │   └── hero-bg-generator.py      # Python script for hero background generation
    └── data/
        └── posts.json                # Blog post metadata

---

## Design System

### Color Palette

| Token | Hex | Use Case |
|-------|-----|----------|
| `--color-black` | #040303 | Page background, footer |
| `--color-dark-brown` | #1a1411 | Card backgrounds |
| `--color-medium-brown` | #2d2218 | Secondary backgrounds |
| `--color-bronze` | #4a3f35 | Borders, dividers |
| `--color-copper` | #b88657 | Primary accents, links, hover states |
| `--color-amber` | #8f6b45 | Warning/status badges, secondary accents |
| `--color-cream` | #d9cdc4 | Headings, primary text |
| `--color-smoke` | #9a8b7a | Body text, secondary text |
| `--color-candlelight` | #e8ddd0 | Reserved for future use |

### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Headings | Playfair Display | Variable (responsive) | Bold (700) |
| Body | Libre Baskerville | 1rem | Regular (400) |

### Spacing Scale (8px Baseline)

| Token | Value |
|-------|-------|
| `--space-xs` | 0.5rem (4px) |
| `--space-sm` | 1rem (8px) |
| `--space-md` | 1.5rem (12px) |
| `--space-lg` | 2rem (16px) |
| `--space-xl` | 3rem (24px) |
| `--space-xxl` | 4rem (32px) |

---

## Development Workflow

### Branch Strategy

- `main` — Production-ready code. Deployed to GitHub Pages at https://Gilltacular.github.io
- `feature/*` — Feature branches. Created from `main`, merged via Pull Request
- `bugfix/*` — Hotfix branches. Created from `main`, merged via Pull Request

### Commit Conventions

All commits follow conventional commit format:

    <type>(<scope>): <subject>

    <body>

    Refs: #<issue-number>

| Type | Purpose |
|------|---------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `refactor` | Code restructuring |
| `chore` | Maintenance tasks |

Examples:

    feat(blog-listing): Implement pagination with BlogList namespace
    fix(hero-nav): Resolve hamburger menu toggle bug
    docs(readme): Add architecture overview section

### Issue Tracking

Issues are tracked on GitHub with templates for bugs, features, and documentation. Each issue includes:

- Clear description
- Acceptance criteria (checklist format)
- Technical notes (implementation considerations)
- References to related issues/PRs

---

## Features

### Portfolio Landing Page

| Feature | Implementation |
|---------|----------------|
| Responsive navigation | Fixed top bar with hamburger menu (mobile), nav links (desktop) |
| Hero section | Full viewport height with WebP background, progressive fade-in |
| About section | Multi-paragraph bio, skills tags grid |
| Projects section | 3-column grid of project cards with WIP status badges, hover states |
| Contact section | Email, GitHub, LinkedIn buttons |
| Footer | Copyright, social icons |

### Blog Listing Page

| Feature | Implementation |
|---------|----------------|
| Async data fetching | Fetch from posts.json via BlogList namespace |
| 12 posts per page | Pagination controls (prev/next, page numbers) |
| URL-based page state | Page number in query string (?page=N) |
| Article cards | Title, date, reading time, excerpt |
| Link to article | Slug-based routing to article.html?slug={post-slug} |

### Interactive Enhancements

| Feature | Implementation |
|---------|----------------|
| Smooth scroll | CSS scroll-behavior: smooth on html element |
| Active section highlighting | IntersectionObserver updates nav link state based on viewport position |
| Mobile menu slide-in | CSS transitions (opacity, transform) on .active class |
| Button hover effects | transform: translateY(-2px) + brightness filter |
| Hero background fade-in | JavaScript preloads WebP, adds .loaded class when ready |

---

## Known Limitations

| Issue | Impact | Resolution Status |
|-------|--------|-------------------|
| Hero background unrefined | Current WebP output from Python script needs refinement | Script refinement planned (non-blocking) |
| No CI/CD pipeline | Manual deployment to GitHub Pages | Planned for Phase 4 (Issue #22) |
| Mobile hamburger menu | Functional but lacks animated hamburger-to-X transformation | Future enhancement |
| No dark/light mode toggle | Currently dark theme only | Future enhancement |
| Blog thumbnail generation | Articles lack featured images | Planned for Phase 4 (Issue #20) |

---

## Roadmap

### Phase 4: Quality & Deployment

| Issue | Scope | Priority |
|-------|-------|----------|
| #17 | Accessibility audit (WCAG 2.1 AA) | High |
| #18 | SEO meta tags, Open Graph, sitemap.xml | High |
| #19 | Performance optimization (Lighthouse score) | Medium |
| #20 | Blog thumbnail generation pipeline | Medium |
| #21 | Comprehensive README (this document) | Medium |
| #22 | CI/CD pipeline (GitHub Actions) | Low |

### Future Enhancements

| Feature | Status |
|---------|--------|
| Dark/light mode toggle | Backlog |
| Blog comment system | Backlog |
| Newsletter subscription | Backlog |
| RSS feed for blog | Backlog |
| Dynamic project card generation from GitHub API | Backlog |

---

## Tech Stack

| Category | Technology | Why |
|----------|-----------|-----|
| Frontend | HTML5, CSS3, Vanilla JavaScript | No framework overhead, full control |
| Hosting | GitHub Pages | Free, integrated with repo workflow |
| Design | CSS Custom Properties, Flexbox, Grid | Modern CSS without preprocessing |
| JavaScript Patterns | Namespace Pattern, IntersectionObserver | Encapsulation, performant viewport tracking |
| Image Formats | WebP | Progressive loading, smaller file size |
| Version Control | Git, GitHub | Industry-standard workflow |

---

## License

MIT License — See LICENSE file for details.

---

*Built as a capstone project by Jon Gill — BS Computer Science*
*Transitioning to industrial automation and robotics engineering*
