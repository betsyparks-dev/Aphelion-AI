import { Link } from 'react-router-dom'

const services = [
  {
    icon: '🎯',
    iconClass: 'purple',
    title: 'AI Strategy & Roadmap',
    desc: 'We assess your current operations, identify high-impact AI opportunities, and build a phased roadmap with clear ROI milestones.'
  },
  {
    icon: '🤖',
    iconClass: 'cyan',
    title: 'Chatbot Deployment',
    desc: 'Customer-facing or internal chatbots that handle inquiries, bookings, and support tickets — reducing response time by up to 70%.'
  },
  {
    icon: '📄',
    iconClass: 'amber',
    title: 'Document Processing',
    desc: 'Extract, classify, and process data from invoices, contracts, forms, and reports — eliminating manual data entry.'
  },
  {
    icon: '📊',
    iconClass: 'green',
    title: 'Analytics Dashboards',
    desc: 'AI-powered dashboards that surface insights from your data, with natural-language querying so anyone can ask questions.'
  },
  {
    icon: '🎓',
    iconClass: 'rose',
    title: 'Team Training & Upskilling',
    desc: 'Hands-on workshops to get your team comfortable using AI tools — from prompt engineering to workflow automation.'
  },
  {
    icon: '🔗',
    iconClass: 'indigo',
    title: 'Custom Integration',
    desc: 'Connect AI capabilities to your existing tools (CRM, ERP, support platform) for seamless workflows.'
  },
]

const stats = [
  { number: '70%', label: 'Faster response times' },
  { number: '40%', label: 'Cost reduction on average' },
  { number: '95%', label: 'Client satisfaction rate' },
  { number: '3×', label: 'Average ROI within 6 months' },
]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">
            AI That Actually <span className="gradient-text">Works</span> for Your Business
          </h1>
          <p className="hero-subtitle">
            We help small-to-medium businesses adopt AI technologies that save time, reduce costs, 
            and open new revenue streams — with clear ROI from day one. No hype. No black boxes.
          </p>
          <div className="hero-actions">
            <Link to="/contact" className="btn btn-primary">
              Get Started →
            </Link>
            <Link to="/demos" className="btn btn-secondary">
              View Demos
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section section-alt">
        <div className="container">
          <span className="section-label">What We Do</span>
          <h2 className="section-title">Full-Spectrum AI Services</h2>
          <p className="section-subtitle">
            From strategy to implementation, we guide you through every step of your AI journey.
          </p>

          <div className="card-grid">
            {services.map((s, i) => (
              <div className="card" key={i}>
                <div className={`card-icon ${s.iconClass}`}>{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section section-dark">
        <div className="container">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="stat-number">{s.number}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 className="section-title">Ready to Get Started?</h2>
          <p className="section-subtitle" style={{ margin: '0 auto 2rem' }}>
            Let's talk about how AI can transform your business. No commitment — just a conversation.
          </p>
          <Link to="/contact" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
            Book a Free Consultation →
          </Link>
        </div>
      </section>
    </>
  )
}