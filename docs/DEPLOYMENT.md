# Aphelion AI — Deployment Guide

This guide covers deploying the Aphelion AI website and demo projects for client demonstrations.

## Quick Start (Production)

```bash
# From the project root
cd /home/team/shared/aphelion-website

# Install dependencies
npm install --production

# Build for production
npx vite build

# Serve on port 3000 (all interfaces)
nohup npx vite preview --host 0.0.0.0 --port 3000 --outDir dist > /tmp/aphelion-prod.log 2>&1 &
```

## Verify Deployment

```bash
# Check the server is listening
ss -Htln | grep :3000

# Check HTTP response
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/

# Check all routes respond
for route in / /services /demos /demos/chatbot /demos/document-pipeline /demos/analytics-dashboard /about /contact; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$route")
  echo "$route → $code"
done
```

## Stopping the Server

```bash
# Find and kill the process
kill $(lsof -t -i:3000)

# Or use fg to bring it to foreground and Ctrl+C
```

## Environment Variables

Copy `.env.example` to `.env` and set:

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend API for form submissions |
| `OPENAI_API_KEY` | Enables real LLM responses in chatbot demo |

The chatbot demo has **two modes**:
1. **Demo mode** (default) — uses locally-coded responses for common queries
2. **Real AI mode** — toggled by user in the UI, uses OpenAI API

## Architecture Options

### Option A: Static (Current)
- Vite serves the built React SPA on port 3000
- Contact form submits to `mailto:` or a backend endpoint
- Best for: quick setup, client demos, landing page

### Option B: Static + Backend API
- Keep Vite dev/preview server on port 3000 for SPA
- Add a backend (FastAPI, Express) on loopback port (e.g., 8000)
- Proxy `/api` calls from Vite config or use a reverse proxy
- Best for: adding contact form storage, chatbot API key management

## Git Workflow

```bash
# The repo is initialized at /home/team/shared/aphelion-website
git remote add origin <github-url>
git push -u origin main
```

## Troubleshooting

| Problem | Solution |
|---|---|
| Port 3000 already in use | `kill $(lsof -t -i:3000)` and retry |
| "Disallowed Host" error | Check `allowedHosts: true` in vite.config.js |
| Blank page on route | SPA needs fallback — Vite handles this automatically |
| Fonts not loading | Google Fonts CDN may be blocked in sandbox; remove `@import` and use system fonts