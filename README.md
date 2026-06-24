# Aphelion AI

Practical AI solutions for small-to-medium businesses. No hype. No black boxes. Clear ROI from day one.

## Repository Structure

```
/website/          → Main company website (Vite + React SPA, port 3000)
/contact-api/      → Contact form submission API (Express, port 3001)
/demos/            → Demo project overview and references
/templates/        → Reusable integration templates
/docs/             → Deployment guides and documentation
```

## Quick Start

### Website

```bash
cd website
npm install
npm run dev     # → http://localhost:3000
```

### Contact API

```bash
cd contact-api
npm install
node server.cjs  # → http://localhost:3001
```

## Tech Stack

- **Frontend:** React 19, Vite 8, React Router DOM
- **Backend:** Node.js, Express
- **Database:** SQLite via Turso
- **Deployment:** GitHub Pages (via Actions)

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, services overview, stats, CTA |
| `/services` | Services — detailed descriptions with pricing |
| `/demos` | Demo showcase |
| `/demos/chatbot` | Interactive AI chatbot |
| `/demos/document-pipeline` | PDF invoice data extraction |
| `/demos/analytics-dashboard` | AI-powered analytics dashboard |
| `/about` | Company story and values |
| `/contact` | Contact form with database storage |

## Brand

- **Colors:** Deep Navy (#1A2A3A), Warm Amber (#F0A830), Teal (#1B998B), Slate (#4A5A6A)
- **Font:** Inter
- **Tagline:** "Practical AI. Real Results."

---

© 2026 Aphelion AI. All rights reserved.