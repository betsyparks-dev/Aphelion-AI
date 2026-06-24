import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Services from './pages/Services.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Demos from './pages/Demos.jsx'
import ChatbotDemo from './pages/demos/ChatbotDemo.jsx'
import DocumentPipelineDemo from './pages/demos/DocumentPipelineDemo.jsx'
import AnalyticsDashboardDemo from './pages/demos/AnalyticsDashboardDemo.jsx'

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/demos" element={<Demos />} />
          <Route path="/demos/chatbot" element={<ChatbotDemo />} />
          <Route path="/demos/document-pipeline" element={<DocumentPipelineDemo />} />
          <Route path="/demos/analytics-dashboard" element={<AnalyticsDashboardDemo />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}