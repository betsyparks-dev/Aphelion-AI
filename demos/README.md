# Aphelion AI — Demo Projects

Standalone versions of the Aphelion AI demo projects for client demonstrations.

## Available Demos

### 🤖 Customer Support Chatbot
Interactive chatbot UI with simulated AI responses. Supports optional real OpenAI API integration.
- **Status:** Embedded in website (`/demos/chatbot`)
- **Source:** `website/src/pages/demos/ChatbotDemo.jsx`

### 📄 Document Processing Pipeline
Extract structured data from invoices, contracts, and forms. Demonstrates OCR → NLP → JSON workflow.
- **Status:** Embedded in website (`/demos/document-pipeline`)
- **Source:** `website/src/pages/demos/DocumentPipelineDemo.jsx`

### 📊 Analytics Dashboard
KPI cards, bar charts, and natural-language querying. Ask questions in plain English.
- **Status:** Embedded in website (`/demos/analytics-dashboard`)
- **Source:** `website/src/pages/demos/AnalyticsDashboardDemo.jsx`

## Running Demos Locally

Each demo is a React component within the website. To run:

```bash
cd website
npm install
npm run dev
```

Then visit:
- `http://localhost:3000/demos/chatbot`
- `http://localhost:3000/demos/document-pipeline`
- `http://localhost:3000/demos/analytics-dashboard`

## Customization

Contact us to build a custom demo tailored to your data and use case.