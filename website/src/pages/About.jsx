export default function About() {
  const values = [
    { label: 'Transparency', text: 'We explain how every solution works in plain language. No black boxes, no magic — just clear, understandable AI.' },
    { label: 'ROI First', text: 'Every engagement starts with measurable goals. If a project won\'t deliver clear value, we\'ll tell you before you invest.' },
    { label: 'Practicality', text: 'We build solutions that work in the real world — with your existing tools, your team\'s skill level, and your budget.' },
    { label: 'Partnership', text: 'We don\'t just hand over a deliverable and leave. We train your team, provide ongoing support, and stay engaged.' },
  ]

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>About Aphelion AI</h1>
          <p>Practical AI solutions from a team that understands business</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>We Bridge the Gap Between AI Hype and Real Results</h2>
              <p>
                Most businesses know they should be using AI — but they don't have in-house machine learning 
                expertise, and they've been burned by overpriced consultants who deliver buzzwords instead of 
                working software.
              </p>
              <p>
                Aphelion AI was founded to change that. We're a team of engineers and strategists who believe 
                AI should be practical, transparent, and profitable. Every engagement starts with your business 
                goals — not with a technology looking for a problem to solve.
              </p>
              <p>
                Whether you need a customer support chatbot, a document processing pipeline, or a complete 
                AI strategy, we deliver working solutions with clear ROI. No hype. No black boxes. Just results.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>Our Values</h3>
              <ul className="values-list">
                {values.map((v, i) => (
                  <li key={i}>
                    <strong>{v.label}</strong>
                    <span style={{ color: 'var(--text-light)' }}>{v.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-label">Why Choose Us</span>
          <h2 className="section-title">What Sets Aphelion AI Apart</h2>

          <div className="card-grid" style={{ textAlign: 'left' }}>
            <div className="card">
              <div className="card-icon purple">🏗️</div>
              <h3>You Get Working Software</h3>
              <p>Not a slide deck or a proof of concept that never ships. Every engagement delivers production-ready solutions your team can use immediately.</p>
            </div>
            <div className="card">
              <div className="card-icon cyan">📈</div>
              <h3>Measurable Outcomes</h3>
              <p>We define success metrics upfront — cost savings, time reduction, revenue increase — and report against them throughout the engagement.</p>
            </div>
            <div className="card">
              <div className="card-icon amber">🔧</div>
              <h3>Tools You Already Use</h3>
              <p>We integrate with your existing stack. No ripping out your CRM or ERP. AI that works with what you have.</p>
            </div>
            <div className="card">
              <div className="card-icon green">🎓</div>
              <h3>Knowledge Transfer</h3>
              <p>We train your team so you're not dependent on us forever. Documentation, workshops, and ongoing support built into every engagement.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}