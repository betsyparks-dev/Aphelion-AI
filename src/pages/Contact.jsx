import { useState } from 'react'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // In production, this would send data to a backend endpoint
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <>
        <section className="page-header">
          <div className="container">
            <h1>Contact Us</h1>
            <p>We'd love to hear from you</p>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <div className="contact-form-wrapper form-success">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h3>Message Sent!</h3>
              <p>Thank you for reaching out. We'll get back to you within one business day.</p>
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Ready to get started? Drop us a message and we'll be in touch within one business day.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-form-wrapper">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input type="text" id="name" name="name" required placeholder="Jane Smith" />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input type="email" id="email" name="email" required placeholder="jane@company.com" />
              </div>

              <div className="form-group">
                <label htmlFor="company">Company Name</label>
                <input type="text" id="company" name="company" placeholder="Acme Corp" />
              </div>

              <div className="form-group">
                <label htmlFor="service">Service Interest</label>
                <select id="service" name="service">
                  <option value="">Select a service...</option>
                  <option value="strategy">AI Strategy & Roadmap</option>
                  <option value="chatbot">Chatbot Deployment</option>
                  <option value="document">Document Processing</option>
                  <option value="analytics">Analytics Dashboards</option>
                  <option value="training">Team Training</option>
                  <option value="custom">Custom Integration</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell us about your project, goals, and timeline..."
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}>
                Send Message →
              </button>
            </form>

            <div style={{
              marginTop: '3rem',
              padding: '2rem',
              background: 'var(--bg-alt)',
              borderRadius: 'var(--radius)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem'
            }}>
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>📧 Email</h4>
                <p style={{ color: 'var(--text-light)' }}>hello@aphelion-ai.com</p>
              </div>
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>📞 Phone</h4>
                <p style={{ color: 'var(--text-light)' }}>1-800-AI-HELION</p>
              </div>
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>📍 Location</h4>
                <p style={{ color: 'var(--text-light)' }}>San Francisco, CA</p>
              </div>
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>⏰ Response Time</h4>
                <p style={{ color: 'var(--text-light)' }}>Within one business day</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}