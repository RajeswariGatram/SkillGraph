# ⚡ SkillGraph — Enterprise Talent & Team Recommendation Platform

**SkillGraph** is an enterprise team assembly platform powered by **CognoDB** (managed openCypher graph database) and built with **FastAPI** and **React**.

When an engineering leader needs to staff a multi-skill initiative (e.g., *FastAPI + React + Cypher & CognoDB*), SkillGraph traverses graph node relationships to recommend optimal team combinations that collectively cover all required skills.

---

## 🧠 Why a Graph Database? (Evaluation Requirement)

### The Problem with Relational Databases (SQL)
In traditional relational schemas (PostgreSQL / MySQL), modeling organizational skills and cross-department collaboration requires multiple many-to-many junction tables:
- `employees` table
- `skills` table
- `employee_skills` junction table
- `departments` table
- `projects` table
- `employee_projects` junction table

Finding a multi-person team to cover $N$ skills requires performing **5 to 6 complex table JOINs** or expensive recursive Common Table Expressions (CTEs). As employee count, skill sets, and project records grow, SQL JOIN performance degrades exponentially due to CPU-intensive index scans across millions of junction rows.

### Why CognoDB (Graph Database) Earns Its Place
SkillGraph models talent as a native **Property Graph**:
- **Nodes**: `(:Employee)`, `(:Skill)`, `(:Department)`, `(:Project)`
- **Edges**: `[:HAS_SKILL]`, `[:BELONGS_TO]`, `[:WORKED_ON]`

#### 1. Index-Free Adjacency ($O(1)$ Traversal)
In CognoDB, relationships are stored as direct memory pointers between nodes rather than calculated at query time via foreign key index lookups. Traversal speed is proportional only to the subgraph visited, rendering queries millisecond-fast regardless of total database size.

#### 2. Declarative openCypher Traversal
A complex multi-hop path query that takes 30 lines of nested SQL JOINs can be written natively in 3 lines of openCypher:
```cypher
MATCH (e:Employee)-[:HAS_SKILL]->(s:Skill)
WHERE s.name IN $required_skills
WITH e, collect(DISTINCT s.name) AS skills
RETURN e.name AS name, e.title AS title, skills
```

---

## 🎨 Key Features

- 👥 **Assemble Optimal Teams**: Input required skills and select a custom team size ($1 \dots 10$ members) to calculate matching team combinations.
- 👤 **Add New Employee**: Create `(:Employee)` nodes and automatically wire `[:BELONGS_TO]` and `[:HAS_SKILL]` graph edges in CognoDB.
- 🏷️ **Add New Skill**: Dynamically instantiate new `(:Skill)` nodes (e.g., *GraphQL*, *Rust*, *PyTorch*) on the fly.
- 📁 **Employee Directory**: Explore all organizational talent cards with full profiles and skill badges.
- ℹ️ **Architecture Info Modal**: Access floating high-level architecture explanations.
- ⏳ **Graceful Error & Loading States**: Displays custom database connection health banners and spinning loaders.

---

## 🏗️ Tech Stack & Architecture

- **Backend**: Python 3.11, FastAPI, Pydantic v2, Async Neo4j openCypher Driver
- **Database**: CognoDB / Neo4j Cloud over encrypted Bolt Protocol (`bolt+s://`)
- **Frontend**: React 18, Vite, Vanilla CSS Glassmorphism Design System, Lucide Icons
- **Testing**: Pytest & HTTPX (Backend), Vitest (Frontend)

```
                       ┌─────────────────────────┐
                       │   React + Vite Frontend │
                       │    (Port 3000 / SPA)    │
                       └────────────┬────────────┘
                                    │ HTTP REST API
                                    ▼
                       ┌─────────────────────────┐
                       │     FastAPI Backend     │
                       │    (Port 8000 / REST)   │
                       └────────────┬────────────┘
                                    │ Bolt SSL Protocol
                                    ▼
                       ┌─────────────────────────┐
                       │  CognoDB Graph Database │
                       │     (openCypher Engine) │
                       └─────────────────────────┘
```

---

## ⚙️ Getting Started & Setup

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- Active CognoDB or Neo4j instance

### 2. Backend Setup
```bash
cd backend

# Create & activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your CognoDB credentials (COGNODB_URI, COGNODB_USER, COGNODB_PASSWORD)

# Seed database with initial graph nodes & relationships
python scripts/seed_data.py

# Run FastAPI server
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite dev server
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 🧪 Running Unit Tests

### Backend Tests (Pytest)
```bash
cd backend
pytest
```

### Frontend Tests (Vitest)
```bash
cd frontend
npm test
```

---

## 🔒 Security & Environment Variables

Connection secrets (`COGNODB_URI`, `COGNODB_PASSWORD`) are loaded dynamically via Pydantic `BaseSettings`. The `.env` file is excluded from version control via `.gitignore`. A template file ([`.env.example`](file:///c:/Users/gatra/cognodb/backend/.env.example)) is provided for repository reviewers.
