import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo" style={{ marginBottom: '1rem' }}>
              <span className="logo-icon">A</span>
              <span className="logo-text">Aphelion <span className="logo-accent">AI</span></span>
            </div>
            <p className="footer-tagline">
              Practical AI solutions with clear ROI. No hype. No black boxes.
            </p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/services">Services</Link>
            <Link to="/demos">Demos</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="footer-links">
            <h4>Services</h4>
            <Link to="/services">AI Strategy</Link>
            <Link to="/services">Chatbot Deployment</Link>
            <Link to="/services">Document Processing</Link>
            <Link to="/services">Analytics Dashboards</Link>
            <Link to="/services">Team Training</Link>
          </div>

          <div className="footer-contact">
            <h4>Contact</h4>
            <p>hello@aphelion-ai.com</p>
            <p>1-800-AI-HELION</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Aphelion AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}