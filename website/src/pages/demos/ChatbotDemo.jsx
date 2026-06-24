import { useState, useRef, useEffect } from 'react'

const initialMessages = [
  { role: 'assistant', content: 'Hi there! I\'m an AI support assistant. How can I help you today? I can help with order status, returns, account questions, and more.' }
]

const responses = {
  'order status': 'Let me check on that. Based on your order history, your most recent order (#ORD-7842) is currently in transit and expected to arrive within 2-3 business days.',
  'return': 'Of course! You can return any item within 30 days of delivery. I\'ve initiated a return for you — you\'ll receive a prepaid shipping label via email shortly.',
  'price': 'Great question! We currently have a 15% discount on all subscription plans. Use code APHELION15 at checkout.',
  'account': 'I can help with account-related issues. You can reset your password at any time from the login page, or I can send you a password reset link right now.',
  'shipping': 'Standard shipping takes 3-5 business days. Express shipping (2 business days) is available for an additional fee. Free shipping on orders over $50!',
  'default': 'Thanks for reaching out! I\'ll connect you with our team who can help with your specific request. In the meantime, check out our FAQ page for quick answers.'
}

function getResponse(input) {
  const lower = input.toLowerCase()
  if (lower.includes('order') || lower.includes('status') || lower.includes('track')) return responses['order status']
  if (lower.includes('return') || lower.includes('refund')) return responses['return']
  if (lower.includes('price') || lower.includes('cost') || lower.includes('discount')) return responses['price']
  if (lower.includes('account') || lower.includes('password') || lower.includes('login')) return responses['account']
  if (lower.includes('shipping') || lower.includes('delivery')) return responses['shipping']
  return responses['default']
}

export default function ChatbotDemo() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [useRealAI, setUseRealAI] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMsg = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    // Simulate API delay
    await new Promise(r => setTimeout(r, 800 + Math.random() * 600))

    if (useRealAI && apiKey) {
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'You are a helpful customer support agent for Aphelion AI. Be concise and friendly.' },
              { role: 'user', content: input }
            ],
            max_tokens: 200
          })
        })
        const data = await res.json()
        const reply = data.choices?.[0]?.message?.content || 'Sorry, I couldn\'t process that.'
        setMessages(prev => [...prev, { role: 'assistant', content: reply }])
      } catch {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Error connecting to AI. Please check your API key and try again.' }])
      }
    } else {
      const reply = getResponse(input)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    }

    setIsLoading(false)
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #6366f1, #06b6d4)', 
        color: 'white', 
        padding: '3rem 2rem 2rem',
        borderRadius: '16px 16px 0 0',
        textAlign: 'center'
      }}>
        <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'block' }}>🤖</span>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>AI Customer Support Chatbot</h1>
        <p style={{ opacity: 0.85 }}>Ask about orders, returns, pricing, or anything else</p>
      </div>

      <div style={{ background: 'var(--bg-alt)', padding: '1rem 2rem', borderBottom: '1px solid var(--border)' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
          <input type="checkbox" checked={useRealAI} onChange={e => setUseRealAI(e.target.checked)} />
          Use real OpenAI API (requires API key)
        </label>
        {useRealAI && (
          <input
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="sk-..."
            style={{ marginTop: '0.5rem', width: '100%', padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.9rem' }}
          />
        )}
      </div>

      <div style={{ 
        background: 'white', 
        padding: '2rem',
        minHeight: 350,
        maxHeight: 450,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <div style={{
              maxWidth: '75%',
              padding: '0.75rem 1.25rem',
              borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: msg.role === 'user' ? 'var(--primary)' : 'var(--bg-alt)',
              color: msg.role === 'user' ? 'white' : 'var(--text)',
              fontSize: '0.95rem',
              lineHeight: 1.6
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ background: 'var(--bg-alt)', padding: '0.75rem 1.25rem', borderRadius: '16px 16px 16px 4px' }}>
              <span style={{ opacity: 0.5 }}>Typing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', padding: '1rem', background: 'white', borderTop: '1px solid var(--border)', borderRadius: '0 0 16px 16px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            fontSize: '0.95rem',
            outline: 'none'
          }}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading || !input.trim() ? 0.6 : 1
          }}
        >
          Send →
        </button>
      </div>

      <div style={{ padding: '1.5rem 2rem', background: 'var(--bg-alt)', borderRadius: '0 0 16px 16px', borderTop: '1px solid var(--border)' }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-light)', marginBottom: '0.75rem' }}>Try Asking</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {['What is my order status?', 'I want to return an item', 'Do you have any discounts?', 'Reset my password'].map((q, i) => (
            <button
              key={i}
              onClick={() => { setInput(q); setTimeout(() => document.querySelector('input[placeholder="Type your message..."]')?.focus(), 100) }}
              style={{
                padding: '0.4rem 1rem',
                background: 'white',
                border: '1px solid var(--border)',
                borderRadius: '100px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                color: 'var(--text-light)',
                transition: 'all 0.2s'
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
        <p style={{ fontSize: '0.9rem', color: '#166534', lineHeight: 1.6 }}>
          <strong>⚡ Demo Mode:</strong> This demo uses simulated responses by default. Toggle "Use real OpenAI API" above and enter your API key to use a real LLM. 
          In production, we secure the API key on the backend and add analytics, escalation, and knowledge base integration.
        </p>
      </div>
    </div>
  )
}