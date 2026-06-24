import { Link } from 'react-router-dom'

const demos = [
  {
    icon: '🤖',
    iconClass: 'cyan',
    title: 'Customer Support Chatbot',
    desc: 'An AI-powered chatbot that handles customer inquiries, support tickets, and FAQs. Trained on your knowledge base and integrated with your support platform. Reduces response time by up to 70% and handles 80% of common inquiries automatically.',
    tech: ['LLM Integration', 'Vector Search', 'React UI', 'API Gateway'],
    link: '/demos/chatbot',
    status: 'Live Demo',
  },
  {
    icon: '📄',
    iconClass: 'amber',
    title: 'Invoice Data Extraction Pipeline',
    desc: 'Upload a PDF invoice and watch as the system automatically extracts vendor name, invoice number, date, line items, totals, and tax. Outputs structured JSON ready to feed into your accounting system.',
    tech: ['PDF Parsing', 'OCR', 'NLP Classification', 'JSON Output'],
    link: '/demos/document-pipeline',
    status: 'Live Demo',
  },
  {
    icon: '📊',
    iconClass: 'green',
    title: 'Sales Analytics Dashboard',
    desc: 'An interactive dashboard that visualizes sales trends, forecasts, and anomalies. Ask questions in plain English — "What was our best-selling product last quarter?" — and get instant answers with charts.',
    tech: ['Data Visualization', 'Natural Language Query', 'Real-time Data'],
    link: '/demos/analytics-dashboard',
    status: 'Live Demo',
  },
]

export default function Demos() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Demo Projects</h1>
          <p>See what Aphelion AI can build for your business</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="section-subtitle" style={{ marginBottom: '2rem' }}>
            These demos showcase the kind of solutions we build for our clients. Each one can be customized 
            to your specific workflows, data, and tools. Click any demo to try it live.
          </p>

          <div className="card-grid">
            {demos.map((d, i) => (
              <div className="demo-card" key={i}>
                <div className="demo-card-body">
                  <div className={`card-icon ${d.iconClass}`} style={{ marginBottom: '1.25rem' }}>
                    {d.icon}
                  </div>
                  <h3>{d.title}</h3>
                  <p>{d.desc}</p>
                  <div className="demo-tech">
                    {d.tech.map((t, j) => (
                      <span className="tech-tag" key={j}>{t}</span>
                    ))}
                  </div>
                </div>
                <div className="demo-card-footer">
                  <span style={{ fontSize: '0.9rem', color: '#16a34a', fontWeight: 600 }}>
                    ● {d.status}
                  </span>
                  <Link to={d.link} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                    Try Demo →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 className="section-title">Want a Custom Demo?</h2>
          <p className="section-subtitle" style={{ margin: '0 auto 2rem' }}>
            Every business is different. Let's build a demo tailored to your specific data and use case.
          </p>
          <Link to="/contact" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
            Request a Custom Demo →
          </Link>
        </div>
      </section>
    </>
  )
}