const services = [
  {
    icon: '🎯',
    iconClass: 'purple',
    title: 'AI Strategy & Roadmap',
    desc: 'We start by understanding your business — your workflows, pain points, and goals. Then we identify where AI can have the biggest impact and build a phased roadmap with clear milestones and ROI projections. You\'ll know exactly what to expect, when, and at what cost.',
    deliverables: 'Current-state assessment, opportunity matrix, phased implementation roadmap, ROI projections, risk analysis',
    timeline: '2–4 weeks'
  },
  {
    icon: '🤖',
    iconClass: 'cyan',
    title: 'Chatbot Deployment',
    desc: 'Custom AI chatbots for customer support, lead qualification, internal IT helpdesk, or any repeated inquiry workflow. We train them on your knowledge base and integrate them with your existing tools. Response time drops from hours to seconds.',
    deliverables: 'Trained chatbot, integration connectors, analytics dashboard, training guide for your team',
    timeline: '3–6 weeks'
  },
  {
    icon: '📄',
    iconClass: 'amber',
    title: 'Document Processing Pipeline',
    desc: 'Stop manually entering data from invoices, contracts, forms, and reports. Our pipeline extracts, classifies, and validates data automatically — feeding it straight into your accounting, CRM, or document management system.',
    deliverables: 'Processing pipeline, data validation rules, API/webhook connectors, processing dashboard, error-handling workflows',
    timeline: '4–8 weeks'
  },
  {
    icon: '📊',
    iconClass: 'green',
    title: 'Analytics Dashboards',
    desc: 'AI-powered dashboards that let anyone in your organization ask questions in plain English and get answers instantly. Surface trends, anomalies, and opportunities that would take days to find manually.',
    deliverables: 'Interactive dashboard, natural-language query interface, scheduled reports, data source connectors, training session',
    timeline: '4–6 weeks'
  },
  {
    icon: '🎓',
    iconClass: 'rose',
    title: 'Team Training & Upskilling',
    desc: 'Hands-on workshops tailored to your team\'s skill level and your business needs. From "what is AI" basics to advanced prompt engineering and workflow automation — we make AI accessible and practical.',
    deliverables: 'Custom curriculum, hands-on exercises, reference guides, follow-up support session',
    timeline: '1–3 days (on-site or remote)'
  },
  {
    icon: '🔗',
    iconClass: 'indigo',
    title: 'Custom Integration',
    desc: 'Already using AI tools but need them to talk to each other? We build custom connectors and middleware so your AI stack works as one unified system — no manual data shuffling.',
    deliverables: 'Integration architecture, connectors/APIs, documentation, deployment scripts, monitoring setup',
    timeline: '2–6 weeks'
  },
]

export default function Services() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Our Services</h1>
          <p>End-to-end AI implementation services tailored to your business</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {services.map((s, i) => (
            <div
              key={i}
              className="card"
              style={{
                marginBottom: '2rem',
                padding: '2.5rem',
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                gap: '2rem',
                alignItems: 'start'
              }}
            >
              <div className={`card-icon ${s.iconClass}`} style={{ width: 56, height: 56, fontSize: '1.75rem', flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>{s.title}</h3>
                <p style={{ color: 'var(--text-light)', lineHeight: 1.7, marginBottom: '1rem' }}>{s.desc}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                  <strong>Deliverables:</strong> {s.deliverables}
                </p>
              </div>
              <div style={{
                background: 'var(--bg-alt)',
                padding: '0.75rem 1.25rem',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'center',
                minWidth: 100
              }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Timeline</div>
                <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>{s.timeline}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section section-alt" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 className="section-title">Not Sure What You Need?</h2>
          <p className="section-subtitle" style={{ margin: '0 auto 2rem' }}>
            We'll start with a free consultation to assess your needs and recommend the right approach.
          </p>
          <a href="/contact" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
            Book a Free Consultation →
          </a>
        </div>
      </section>
    </>
  )
}