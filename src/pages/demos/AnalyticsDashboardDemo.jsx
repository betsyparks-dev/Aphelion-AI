import { useState } from 'react'

const monthlyData = [
  { month: 'Jan', revenue: 42000, expenses: 31000, customers: 180, satisfaction: 88 },
  { month: 'Feb', revenue: 45000, expenses: 32500, customers: 195, satisfaction: 90 },
  { month: 'Mar', revenue: 51000, expenses: 34000, customers: 220, satisfaction: 87 },
  { month: 'Apr', revenue: 48000, expenses: 35500, customers: 205, satisfaction: 91 },
  { month: 'May', revenue: 54000, expenses: 36000, customers: 240, satisfaction: 92 },
  { month: 'Jun', revenue: 58000, expenses: 38000, customers: 265, satisfaction: 89 },
  { month: 'Jul', revenue: 62000, expenses: 39500, customers: 290, satisfaction: 93 },
  { month: 'Aug', revenue: 60000, expenses: 41000, customers: 280, satisfaction: 90 },
  { month: 'Sep', revenue: 65000, expenses: 42000, customers: 310, satisfaction: 91 },
  { month: 'Oct', revenue: 68000, expenses: 43000, customers: 335, satisfaction: 94 },
  { month: 'Nov', revenue: 72000, expenses: 45000, customers: 360, satisfaction: 92 },
  { month: 'Dec', revenue: 79000, expenses: 47000, customers: 400, satisfaction: 95 },
]

const productData = [
  { name: 'AI Chatbot', revenue: 185000, growth: '+32%' },
  { name: 'Doc Processing', revenue: 142000, growth: '+28%' },
  { name: 'Analytics Dashboard', revenue: 98000, growth: '+45%' },
  { name: 'Training Workshops', revenue: 76000, growth: '+18%' },
  { name: 'Custom Integration', revenue: 52000, growth: '+22%' },
]

const maxRevenue = Math.max(...monthlyData.map(d => d.revenue))
const maxExpenses = Math.max(...monthlyData.map(d => d.expenses))

export default function AnalyticsDashboardDemo() {
  const [query, setQuery] = useState('')
  const [queryResult, setQueryResult] = useState(null)
  const [querying, setQuerying] = useState(false)

  const handleQuery = () => {
    if (!query.trim()) return
    setQuerying(true)
    
    setTimeout(() => {
      const lower = query.toLowerCase()
      let answer = ''
      
      if (lower.includes('best') || lower.includes('top') || lower.includes('highest revenue')) {
        const best = productData.reduce((a, b) => a.revenue > b.revenue ? a : b)
        answer = `Your top-performing product is the **${best.name}** with $${(best.revenue / 1000).toFixed(0)}K in revenue this year, growing at ${best.growth}.`
      } else if (lower.includes('growth') || lower.includes('growing')) {
        const fastest = productData.reduce((a, b) => parseInt(a.growth) > parseInt(b.growth) ? a : b)
        answer = `The fastest-growing product is **${fastest.name}** at ${fastest.growth} growth this year.`
      } else if (lower.includes('total revenue') || lower.includes('all revenue') || lower.includes('total')) {
        const total = monthlyData.reduce((s, d) => s + d.revenue, 0)
        answer = `Your total revenue for the year is **$${(total / 1000).toFixed(0)}K**, with December being the strongest month at $${monthlyData[11].revenue.toLocaleString()}.`
      } else if (lower.includes('profit') || lower.includes('margin')) {
        const totalRev = monthlyData.reduce((s, d) => s + d.revenue, 0)
        const totalExp = monthlyData.reduce((s, d) => s + d.expenses, 0)
        const margin = ((totalRev - totalExp) / totalRev * 100).toFixed(1)
        answer = `Your overall profit margin is **${margin}%**. Total revenue: $${(totalRev / 1000).toFixed(0)}K, Total expenses: $${(totalExp / 1000).toFixed(0)}K.`
      } else if (lower.includes('customer') || lower.includes('satisfaction')) {
        const avgSat = (monthlyData.reduce((s, d) => s + d.satisfaction, 0) / monthlyData.length).toFixed(0)
        const totalCust = monthlyData[monthlyData.length - 1].customers
        answer = `Your average customer satisfaction score is **${avgSat}%**. You currently have **${totalCust} active customers**, and the trend is strongly positive.`
      } else if (lower.includes('trend') || lower.includes('forecast') || lower.includes('future')) {
        answer = `Based on your current trajectory, we forecast **$85K-$92K in monthly revenue** by Q1 next year — approximately **18-22% growth** from current levels.`
      } else {
        answer = `I found data on **${monthlyData.length} months** of operations. Try asking about: "total revenue", "best selling product", "profit margin", "customer satisfaction", or "growth trends".`
      }
      
      setQueryResult(answer)
      setQuerying(false)
    }, 1000)
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #22c55e, #16a34a)', 
        color: 'white', 
        padding: '3rem 2rem 2rem',
        borderRadius: '16px 16px 0 0',
        textAlign: 'center'
      }}>
        <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'block' }}>📊</span>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>AI Analytics Dashboard</h1>
        <p style={{ opacity: 0.85 }}>Ask questions in plain English — get instant answers with data</p>
      </div>

      {/* Natural language query bar */}
      <div style={{ background: 'white', padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleQuery()}
            placeholder="Ask a question... (e.g., 'What was our best selling product?' or 'Total revenue this year')"
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              border: '2px solid var(--border)',
              borderRadius: '8px',
              fontSize: '0.95rem',
              outline: 'none'
            }}
          />
          <button
            onClick={handleQuery}
            disabled={querying || !query.trim()}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: querying ? 'not-allowed' : 'pointer',
              opacity: querying || !query.trim() ? 0.6 : 1
            }}
          >
            {querying ? 'Searching...' : 'Ask →'}
          </button>
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {['Total revenue this year', 'Best selling product', 'What is our profit margin?', 'Customer satisfaction trend', 'Growth forecast'].map((q, i) => (
            <button
              key={i}
              onClick={() => { setQuery(q); }}
              style={{
                padding: '0.35rem 0.85rem',
                background: 'var(--bg-alt)',
                border: '1px solid var(--border)',
                borderRadius: '100px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                color: 'var(--text-light)',
              }}
            >
              {q}
            </button>
          ))}
        </div>

        {queryResult && (
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.95rem', lineHeight: 1.6 }}>
            <strong>💡 Answer:</strong> {queryResult}
          </div>
        )}
      </div>

      {/* Dashboard content */}
      <div style={{ background: 'white', padding: '2rem', borderRadius: '0 0 16px 16px' }}>
        {/* KPI cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Annual Revenue', value: '$704K', change: '+24%', color: '#22c55e' },
            { label: 'Active Customers', value: '400', change: '+55%', color: '#6366f1' },
            { label: 'Avg Satisfaction', value: '91%', change: '+3%', color: '#06b6d4' },
            { label: 'Avg Profit Margin', value: '38.4%', change: '+5%', color: '#f59e0b' },
          ].map((kpi, i) => (
            <div key={i} style={{ padding: '1.25rem', background: 'var(--bg-alt)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>{kpi.label}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1 }}>{kpi.value}</div>
              <div style={{ fontSize: '0.85rem', color: kpi.color, fontWeight: 600, marginTop: '0.25rem' }}>{kpi.change} vs last year</div>
            </div>
          ))}
        </div>

        {/* Revenue vs Expenses Chart (CSS-based bar chart) */}
        <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Monthly Revenue vs Expenses</h3>
        <div style={{ background: 'var(--bg-alt)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: 200, position: 'relative', marginTop: '1rem' }}>
            {/* Y-axis labels */}
            <div style={{ position: 'absolute', left: -40, top: 0, fontSize: '0.7rem', color: 'var(--text-light)' }}>$80K</div>
            <div style={{ position: 'absolute', left: -40, top: '25%', fontSize: '0.7rem', color: 'var(--text-light)' }}>$60K</div>
            <div style={{ position: 'absolute', left: -40, top: '50%', fontSize: '0.7rem', color: 'var(--text-light)' }}>$40K</div>
            <div style={{ position: 'absolute', left: -40, top: '75%', fontSize: '0.7rem', color: 'var(--text-light)' }}>$20K</div>
            
            {monthlyData.map((d, i) => {
              const revHeight = (d.revenue / maxRevenue) * 180
              const expHeight = (d.expenses / maxExpenses) * 180
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, height: 200, justifyContent: 'flex-end' }}>
                  <div style={{ width: '100%', height: revHeight, background: 'linear-gradient(180deg, #6366f1, #818cf8)', borderRadius: '4px 4px 0 0', minHeight: 4, transition: 'height 0.3s' }} title={`${d.month}: $${d.revenue.toLocaleString()}`} />
                  <div style={{ width: '100%', height: expHeight, background: 'linear-gradient(180deg, #f59e0b, #fbbf24)', borderRadius: '4px 4px 0 0', minHeight: 4, transition: 'height 0.3s' }} title={`${d.month}: $${d.expenses.toLocaleString()}`} />
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-light)', marginTop: 4 }}>{d.month}</div>
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '1rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 12, height: 12, background: '#6366f1', borderRadius: 3 }} />
              <span>Revenue</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 12, height: 12, background: '#f59e0b', borderRadius: 3 }} />
              <span>Expenses</span>
            </div>
          </div>
        </div>

        {/* Product breakdown */}
        <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Revenue by Product</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Product</th>
                <th style={{ textAlign: 'right', padding: '0.75rem' }}>Revenue</th>
                <th style={{ textAlign: 'right', padding: '0.75rem' }}>Growth</th>
                <th style={{ padding: '0.75rem', width: '40%' }}></th>
              </tr>
            </thead>
            <tbody>
              {productData.map((p, i) => {
                const maxPct = productData[0].revenue
                const pct = (p.revenue / maxPct) * 100
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>{p.name}</td>
                    <td style={{ textAlign: 'right', padding: '0.75rem' }}>${(p.revenue / 1000).toFixed(0)}K</td>
                    <td style={{ textAlign: 'right', padding: '0.75rem', color: '#22c55e', fontWeight: 600 }}>{p.growth}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #6366f1, #06b6d4)', borderRadius: 4 }} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd', fontSize: '0.85rem', color: '#0369a1' }}>
          <strong>⚡ Demo Mode:</strong> This dashboard uses sample data. In production, we connect to your live data sources (CRM, ERP, analytics tools) 
          and build custom dashboards with real-time updates, scheduled reports, and natural-language querying powered by AI.
        </div>
      </div>
    </div>
  )
}