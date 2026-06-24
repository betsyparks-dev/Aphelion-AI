import { useState } from 'react'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setError(null)

    const form = e.target
    const data = {
      name: form.name.value,
      email: form.email.value,
      company: form.company.value,
      service_interest: form.service.value,
      message: form.message.value,
    }

    try {
      const res = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Something went wrong')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
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

              {error && (
                <div style={{ padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', marginBottom: '1rem', color: '#991b1b', fontSize: '0.9rem' }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={sending}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '1rem', opacity: sending ? 0.7 : 1 }}
              >
                {sending ? 'Sending...' : 'Send Message →'}
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
                <p style={{ color: 'var(--text-light)' }}>aphelion-ai-34ef2666@ctomail.io</p>
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