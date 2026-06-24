# Document Processing Pipeline Template

Automated data extraction from invoices, contracts, forms, and reports.

## Architecture

```
[PDF Upload] ──→ [OCR Engine] ──→ [NLP Parser] ──→ [Validator] ──→ [JSON Output]
                      │                │                │
                      ▼                ▼                ▼
              [Tesseract/      [LLM-based       [Schema
               AWS Textract]    Extraction]      Validation]
```

## Quick Start

### 1. PDF Parser Service

```python
# pipeline/parser.py
from pdfminer.high_level import extract_text
import re

def extract_text_from_pdf(file_path: str) -> str:
    """Extract raw text from PDF document."""
    text = extract_text(file_path)
    return text

def extract_fields(text: str) -> dict:
    """Extract structured fields using regex + LLM."""
    fields = {}
    
    # Regex patterns for common fields
    patterns = {
        'invoice_number': r'INV[-\s]?\d+',
        'date': r'\d{4}-\d{2}-\d{2}',
        'total': r'(?:Total|Amount Due)[:\s]*\$?([\d,]+\.\d{2})',
    }
    
    for field, pattern in patterns.items():
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            fields[field] = match.group(1) if '(' in pattern else match.group()
    
    return fields
```

### 2. LLM Enhancement

```python
# pipeline/llm_extract.py
from openai import OpenAI

client = OpenAI()

def extract_with_llm(text: str, schema: dict) -> dict:
    """Use LLM to extract structured data from text."""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": f"""
Extract the following fields from this document: {list(schema.keys())}
Return as JSON. If a field is not found, set it to null.
            """},
            {"role": "user", "content": text}
        ]
    )
    return response.choices[0].message.content
```

### 3. Output Schema

```json
{
  "vendor_name": "string",
  "document_type": "invoice|contract|form|report",
  "document_number": "string",
  "date": "YYYY-MM-DD",
  "due_date": "YYYY-MM-DD",
  "currency": "USD",
  "subtotal": 0.00,
  "tax": 0.00,
  "total": 0.00,
  "line_items": [
    {
      "description": "string",
      "quantity": 0,
      "unit_price": 0.00,
      "total": 0.00
    }
  ],
  "vendor_address": "string",
  "notes": "string"
}
```

## Integration Connectors

### Send to Accounting System (REST)

```python
import requests

def send_to_accounting(data: dict, webhook_url: str):
    response = requests.post(
        webhook_url,
        json=data,
        headers={"Content-Type": "application/json"}
    )
    return response.status_code == 200
```

## Error Handling

| Error | Action | Retry? |
|---|---|---|
| OCR failed (blurry PDF) | Return error, request new scan | No |
| Field not found | Mark as null, flag for review | Yes (reprocess) |
| Validation failed | Log mismatch, send to manual queue | No |
| API timeout | Retry up to 3 times with backoff | Yes |

## Deployment Checklist

- [ ] Choose OCR engine (Tesseract for self-hosted, AWS Textract for cloud)
- [ ] Define extraction schema for each document type
- [ ] Set up LLM API integration
- [ ] Configure validation rules
- [ ] Build webhook connectors for target systems
- [ ] Set up error queue for manual review
- [ ] Implement access controls for sensitive documents