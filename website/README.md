# Aphelion AI — Company Website & Demo Projects

Corporate website and interactive demo projects for Aphelion AI, a consulting firm that helps businesses adopt practical AI solutions.

## Tech Stack

- **Framework**: React 19 + Vite 8
- **Routing**: React Router DOM
- **Styling**: Pure CSS with custom properties and responsive design
- **Server**: Vite dev server (port 3000)

## Project Structure

```
aphelion-website/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Header.jsx      # Sticky navigation header
│   │   └── Footer.jsx      # Site footer with links
│   ├── pages/
│   │   ├── Home.jsx        # Landing page with hero, services, stats
│   │   ├── Services.jsx    # Detailed service descriptions
│   │   ├── About.jsx       # Company info and values
│   │   ├── Contact.jsx     # Contact form
│   │   ├── Demos.jsx       # Demo project overview
│   │   └── demos/
│   │       ├── ChatbotDemo.jsx           # Interactive AI chatbot
│   │       ├── DocumentPipelineDemo.jsx   # PDF data extraction
│   │       └── AnalyticsDashboardDemo.jsx # AI analytics dashboard
│   ├── App.jsx            # Root component with routes
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Development

```bash
# Install dependencies
npm install

# Start dev server (port 3000)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Pages

| Route | Page | Description |
|---|---|---|
| `/` | Home | Hero, services overview, stats, CTA |
| `/services` | Services | Detailed service descriptions with timelines |
| `/demos` | Demos | Demo project showcase |
| `/demos/chatbot` | Chatbot Demo | Interactive support chatbot |
| `/demos/document-pipeline` | Document Demo | PDF invoice data extraction |
| `/demos/analytics-dashboard` | Analytics Demo | Dashboard with NL querying |
| `/about` | About | Company background and values |
| `/contact` | Contact | Contact form and info |

## Demo Features

### 🤖 Customer Support Chatbot
- Simulated AI responses for common queries (orders, returns, pricing, accounts)
- Optional real OpenAI API integration (toggle and API key field)
- Pre-populated suggested questions
- Production-ready with analytics, escalation, and KB integration

### 📄 Document Processing Pipeline
- 3 sample invoices/contracts to demonstrate extraction
- Animated processing pipeline (OCR → NLP → JSON)
- Structured data output with line-item tables
- One-click JSON copy for testing integrations

### 📊 Analytics Dashboard
- 4 KPI cards with annual metrics
- CSS-based bar chart (revenue vs expenses)
- Product revenue breakdown with progress bars
- **Natural language querying** — ask questions in plain English
- Pre-populated sample questions

## Production Deployment

The server runs on **port 3000**, bound to all interfaces.

```bash
# Start in background
nohup npx vite --host 0.0.0.0 --port 3000 > /tmp/vite-server.log 2>&1 &
```

### Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL (optional for now) |
| `OPENAI_API_KEY` | OpenAI API key for real chatbot demo |

## Contact

**Aphelion AI** — Practical AI solutions with clear ROI.
hello@aphelion-ai.com