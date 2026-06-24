# Analytics Dashboard Template

AI-powered dashboards with natural-language querying.

## Architecture

```
[Data Sources] ──→ [ETL Pipeline] ──→ [Dashboard API] ──→ [React Frontend]
     │                    │                                       │
     ▼                    ▼                                       ▼
[CRM, ERP,       [Transform &     [Query Engine +     [Charts, Tables,
SQL, CSV]         Cleanse]         NL Interface]       NL Query Bar]
```

## Quick Start

### 1. Data Source Connector

```python
# connectors/sql_connector.py
import pandas as pd
from sqlalchemy import create_engine

class SQLDataSource:
    def __init__(self, connection_string: str):
        self.engine = create_engine(connection_string)
    
    def query(self, sql: str) -> pd.DataFrame:
        return pd.read_sql(sql, self.engine)
    
    def get_tables(self) -> list:
        return pd.read_sql(
            "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'",
            self.engine
        )['table_name'].tolist()
```

### 2. Natural Language Query Engine

```python
# query_engine/nl_to_sql.py
from openai import OpenAI

client = OpenAI()

def nl_to_sql(question: str, schema: str) -> str:
    """Convert natural language question to SQL query."""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": f"""
You are a SQL expert. Convert the user's question to a SQL query.
Database schema:
{schema}
Return ONLY the SQL query, no explanation.
            """},
            {"role": "user", "content": question}
        ]
    )
    return response.choices[0].message.content
```

### 3. Dashboard API Endpoints

```python
# api/dashboard.py
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class QueryRequest(BaseModel):
    question: str

class DashboardData(BaseModel):
    kpis: dict
    charts: list
    tables: list

@app.get("/api/dashboard/kpis")
async def get_kpis():
    """Return KPI cards data."""
    return {
        "revenue": {"value": 704000, "change": "+24%"},
        "customers": {"value": 400, "change": "+55%"},
        "satisfaction": {"value": 91, "change": "+3%"},
    }

@app.post("/api/query")
async def natural_language_query(request: QueryRequest):
    """Process natural language query."""
    sql = nl_to_sql(request.question, get_schema())
    result = execute_sql(sql)
    return {"question": request.question, "sql": sql, "result": result}
```

### 4. Frontend Chart Component

```jsx
// BarChart.jsx — Reusable chart component
export default function BarChart({ data, xKey, yKey, color = '#6366f1', height = 200 }) {
  const maxVal = Math.max(...data.map(d => d[yKey]))
  
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: '100%',
            height: `${(d[yKey] / maxVal) * (height - 20)}px`,
            background: color,
            borderRadius: '4px 4px 0 0',
            transition: 'height 0.3s'
          }} />
          <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: 4 }}>{d[xKey]}</div>
        </div>
      ))}
    </div>
  )
}
```

## Supported Data Sources

| Source | Type | Connector Available |
|---|---|---|
| PostgreSQL | SQL | ✅ |
| MySQL/MariaDB | SQL | ✅ |
| Salesforce | API | ✅ |
| HubSpot | API | ✅ |
| Google Analytics | API | ✅ |
| CSV/Excel | File | ✅ |
| REST APIs | HTTP | ✅ |

## Deployment Checklist

- [ ] Connect data sources (SQL databases, APIs, files)
- [ ] Define KPI metrics and calculations
- [ ] Configure NL query engine with schema
- [ ] Build dashboard UI (or customize the demo)
- [ ] Set up scheduled data refresh
- [ ] Configure user permissions (who sees what)
- [ ] Add export functionality (PDF, CSV)
- [ ] Set up alert thresholds