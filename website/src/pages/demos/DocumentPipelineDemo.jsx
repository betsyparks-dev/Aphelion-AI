import { useState } from 'react'

const sampleInvoices = [
  {
    name: 'invoice_acme.pdf',
    extracted: {
      vendor: 'Acme Supply Co.',
      invoiceNumber: 'INV-2025-0842',
      date: '2025-06-15',
      dueDate: '2025-07-15',
      subtotal: '$4,250.00',
      tax: '$382.50',
      total: '$4,632.50',
      lineItems: [
        { description: 'Office desks (x8)', quantity: 8, unitPrice: '$350.00', total: '$2,800.00' },
        { description: 'Office chairs (x10)', quantity: 10, unitPrice: '$145.00', total: '$1,450.00' },
      ]
    }
  },
  {
    name: 'contract_global.pdf',
    extracted: {
      vendor: 'GlobalTech Solutions',
      invoiceNumber: 'CT-2025-331',
      date: '2025-06-10',
      dueDate: '2025-07-10',
      subtotal: '$12,000.00',
      tax: '$1,080.00',
      total: '$13,080.00',
      lineItems: [
        { description: 'Software license (annual)', quantity: 1, unitPrice: '$8,000.00', total: '$8,000.00' },
        { description: 'Implementation services', quantity: 40, unitPrice: '$100.00', total: '$4,000.00' },
      ]
    }
  },
  {
    name: 'form_purchase-request.pdf',
    extracted: {
      vendor: 'OfficePlus Direct',
      invoiceNumber: 'PO-2025-182',
      date: '2025-06-01',
      dueDate: '2025-06-30',
      subtotal: '$875.50',
      tax: '$78.80',
      total: '$954.30',
      lineItems: [
        { description: 'Paper (10 cases)', quantity: 10, unitPrice: '$45.00', total: '$450.00' },
        { description: 'Toner cartridges (x6)', quantity: 6, unitPrice: '$65.00', total: '$390.00' },
        { description: 'Shipping', quantity: 1, unitPrice: '$35.50', total: '$35.50' },
      ]
    }
  }
]

export default function DocumentPipelineDemo() {
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedData, setProcessedData] = useState(null)

  const processDocument = (doc) => {
    setSelectedDoc(doc)
    setIsProcessing(true)
    setProcessedData(null)

    // Simulate processing delay
    setTimeout(() => {
      setProcessedData(doc.extracted)
      setIsProcessing(false)
    }, 1500 + Math.random() * 1000)
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #f59e0b, #d97706)', 
        color: 'white', 
        padding: '3rem 2rem 2rem',
        borderRadius: '16px 16px 0 0',
        textAlign: 'center'
      }}>
        <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'block' }}>📄</span>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Document Data Extraction Pipeline</h1>
        <p style={{ opacity: 0.85 }}>Upload a document and watch AI extract structured data instantly</p>
      </div>

      <div style={{ background: 'white', padding: '2rem', borderRadius: '0 0 16px 16px' }}>
        <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Sample Documents</h3>
        <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          Click any document below to simulate the AI processing pipeline. In production, you'd upload real PDFs.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {sampleInvoices.map((doc, i) => (
            <button
              key={i}
              onClick={() => processDocument(doc)}
              style={{
                padding: '1.25rem',
                border: `2px solid ${selectedDoc?.name === doc.name ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: '12px',
                background: selectedDoc?.name === doc.name ? 'rgba(99,102,241,0.04)' : 'white',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.5rem' }}>📄 {doc.name}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                {doc.extracted.vendor}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                {doc.extracted.total}
              </div>
            </button>
          ))}
        </div>

        {/* Processing animation */}
        {isProcessing && (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-alt)', borderRadius: '12px', marginBottom: '2rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem', animation: 'pulse 1.5s ease-in-out infinite' }}>
              🔄
            </div>
            <h4 style={{ fontWeight: 600 }}>Processing Document...</h4>
            <div style={{ marginTop: '0.75rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>
              <span>📄 OCR scanning...</span><br />
              <span>🔍 Entity extraction...</span><br />
              <span>📊 Data structuring...</span>
            </div>
            <div style={{ marginTop: '1rem', height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', animation: 'shimmer 1.5s ease-in-out infinite' }} />
            </div>
          </div>
        )}

        {/* Extracted data */}
        {processedData && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontWeight: 700, color: '#16a34a' }}>✅ Data Extracted Successfully</h3>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(JSON.stringify(processedData, null, 2))
                }}
                style={{ padding: '0.4rem 1rem', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Copy JSON
              </button>
            </div>

            <div style={{ background: 'var(--bg-alt)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  ['Vendor', processedData.vendor],
                  ['Invoice #', processedData.invoiceNumber],
                  ['Date', processedData.date],
                  ['Due Date', processedData.dueDate],
                  ['Subtotal', processedData.subtotal],
                  ['Tax', processedData.tax],
                  ['Total', processedData.total],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>{label}</div>
                    <div style={{ fontWeight: 600 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <h4 style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Line Items</h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem' }}>Description</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem 0.75rem' }}>Qty</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem 0.75rem' }}>Unit Price</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem 0.75rem' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {processedData.lineItems.map((item, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.5rem 0.75rem' }}>{item.description}</td>
                      <td style={{ textAlign: 'right', padding: '0.5rem 0.75rem' }}>{item.quantity}</td>
                      <td style={{ textAlign: 'right', padding: '0.5rem 0.75rem' }}>{item.unitPrice}</td>
                      <td style={{ textAlign: 'right', padding: '0.5rem 0.75rem', fontWeight: 600 }}>{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd', fontSize: '0.85rem', color: '#0369a1' }}>
              <strong>⚙️ Pipeline steps:</strong> PDF upload → OCR text extraction → NLP entity recognition → 
              data validation → structured JSON output → API delivery to accounting system
            </div>
          </div>
        )}

        {!processedData && !isProcessing && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
            Select a document above to see the extraction pipeline in action
          </div>
        )}
      </div>
    </div>
  )
}