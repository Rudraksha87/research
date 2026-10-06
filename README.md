# 🔬 RESEARCHLENS
### AI Research & Knowledge Discovery Agent

> **Hackathon Theme:** *"AI for Research & Knowledge Discovery"*  
> **Official Challenge:** Researchers, professionals, and organizations often struggle to find, organize, analyze, and synthesize information from diverse sources, making research workflows time-consuming and knowledge discovery inefficient.

---

## 📌 Executive Overview

**ResearchLens** is an autonomous AI-powered research agent designed to help students, researchers, and professionals thoroughly investigate complex scientific inquiries. 

Unlike generic chatbots or simple PDF summarizers, ResearchLens solves the fundamental question of scientific progress:
- **"What has already been researched?"**
- and more critically: **"What is still missing?"**

The core differentiator of ResearchLens is **Research Gap Discovery**—surfacing repeated author-reported limitations, conflicting empirical results, absent datasets, unvalidated operational conditions, and unsolved practical bottlenecks across retrieved literature.

---

## 🎯 Benchmark Hackathon Demo Scenario

**Demo Research Question:**
> *"How is artificial intelligence being used for crop disease detection?"*

### End-to-End Workflow:
```
User Enters Research Question
       ↓
Research Planner (Keywords, Subtopics, Strategy)
       ↓
Multi-Source Academic Search (Semantic Scholar, arXiv, Crossref)
       ↓
Deduplication & Semantic Ranking (Top 10 Papers)
       ↓
Paper Analysis (Problem, Objective, Method, Dataset, Results, Limitations, Future Work)
       ↓
Cross-Paper Comparison Table (Paper | Method | Dataset | Results | Limitations + Synthesized Insights)
       ↓
Research Gap Discovery (Repeated Limitations, Absent Datasets, In-the-Wild Validation Blind Spots)
       ↓
Future Research Directions (3–5 Prospective Proposals with Feasibility & Impact)
       ↓
Evidence-Backed Research Report (9-Section Markdown Report with Live DOI/URL Links)
```

---

## 🚀 Key Features

1. **Research Planner (`researchPlanner.js`)**:
   Decomposes inquiries into important concepts, related keywords, boolean search terms, subtopics, and information extraction targets.

2. **Real Multi-Source Academic Search (`paperSearchService.js`)**:
   Queries live academic repositories in real time:
   - **Semantic Scholar API**
   - **arXiv API** (Atom XML parsed via `fast-xml-parser`)
   - **Crossref API**
   Normalizes papers to unified format: `{ title, authors, abstract, year, source, url, doi, citationCount }`, resolves duplicates via title/DOI hash, and scores papers by relevance, recency, and citation authority.

3. **Structured Paper Analysis (`paperAnalysis.js`)**:
   Extracts 8 structured scientific dimensions per paper:
   - `researchProblem`
   - `objective`
   - `methodology`
   - `dataset`
   - `keyFindings`
   - `results`
   - `limitations`
   - `futureWork`

4. **Cross-Study Comparison Matrix (`paperComparison.js`)**:
   Generates a 5-column horizontally scrollable comparative table (`Paper | Method | Dataset | Results | Limitations`) and synthesizes 5 literature-wide insights:
   - Most common methodologies
   - Most frequently used datasets
   - Strongest approaches
   - Areas where results disagree
   - Common limitations

5. **Research Gap Discovery (`researchGapDetector.js` — The Core Differentiator)**:
   Systematically identifies:
   - Repeated limitations across studies
   - Under-researched areas
   - Contradictory findings
   - Missing datasets (e.g., lack of real-world multi-season field imagery)
   - Missing methodologies
   - Unsolved practical problems (edge deployment, ultra-low power)
   - Areas with insufficient real-world validation  
   *Includes provenance badges for trust:* `Evidence-backed`, `AI Interpretation`, `Suggested Direction`.

6. **Future Research Directions (`futureResearch.js`)**:
   Formulates 3–5 prospective research proposals detailing target problem, why existing literature is insufficient, possible methodology, expected breakthrough, and feasibility.

7. **Publication-Grade 9-Section Report (`reportGenerator.js`)**:
   Compiles comprehensive Markdown report adhering to Section 13:
   1. Research Question
   2. Executive Summary
   3. Research Landscape
   4. Papers Analyzed
   5. Methodology Comparison (Markdown table)
   6. Key Findings
   7. Research Gaps
   8. Future Research Directions
   9. References (every paper linked to real source URL/DOI; zero fabricated citations)

8. **Document Upload & Analysis (`documentAnalysisService.js`)**:
   Enables researchers to upload local manuscripts (PDF/DOCX/TXT) via Multer. Uses `pdf-parse` to extract text and automatically dissects the paper across the standard analytical dimensions.

9. **Secure Authentication & Data Isolation**:
   - Passwords hashed using `bcrypt` (salted rounds)
   - Stateless JWT tokens (stored in localStorage)
   - Request validation powered by `Zod`
   - Zero sensitive server errors or stack traces leaked to clients

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | Single Page Application (SPA) architecture |
| **Routing** | React Router v6 | Client-side routing across all 12 platform views |
| **Styling** | Tailwind CSS, Lucide React | Modern dark-mode scientific aesthetic |
| **HTTP Client** | Axios | Frontend-to-Backend REST communication |
| **Backend** | Node.js, Express.js | Modular REST API gateway & agent orchestrator |
| **Authentication** | JWT, bcryptjs | Secure user authentication and session management |
| **Validation** | Zod | Strict schema validation of incoming API payloads |
| **File Ingestion** | Multer, pdf-parse | Multipart PDF document uploads & text extraction |
| **Database** | Supabase PostgreSQL | Relational persistence with foreign keys & indexes |
| **AI Synthesis** | Google Gemini API | Structured extraction, comparison & gap discovery |
| **Academic APIs** | Semantic Scholar, arXiv, Crossref | Live academic paper retrieval & indexing |

---

## 🏛️ Application Architecture

```
                    React Frontend (:5173)
                              |
                           Axios
                              |
                    Express API (:5000)
                              |
       ┌──────────────────────┼──────────────────────┐
       │                      │                      │
  Supabase / PostgreSQL   Gemini AI           Academic Sources
 (Users, Projects,      (Planner, Gap        - Semantic Scholar
  Papers, Analyses,      Detector, Report     - arXiv API (XML)
  Gaps, Reports)         Synthesis)          - Crossref API
```

---

## 📂 Project Structure

```
ResearchLens/
├── .env.example              # Template environment variables
├── .gitignore                # Git ignore rules (node_modules, .env, uploads)
├── README.md                 # Complete system documentation
├── package.json              # Monorepo workspaces config
│
├── backend/                  # Node.js Express Backend
│   ├── .env.example          # Backend environment variables
│   ├── package.json          # Express dependencies
│   ├── uploads/              # Temporary storage for uploaded manuscripts
│   └── src/
│       ├── app.js            # Express application setup
│       ├── server.js         # HTTP server listener
│       ├── config/           # env.js, supabase.js
│       ├── controllers/      # auth, research, paper, analysis, document
│       ├── middleware/       # authMiddleware, uploadMiddleware, validation, error
│       ├── routes/           # authRoutes, researchRoutes, paperRoutes, analysisRoutes, documentRoutes
│       ├── services/
│       │   ├── ai/           # geminiService, researchPlanner, paperAnalysis, paperComparison, researchGapDetector, futureResearch, reportGenerator
│       │   ├── documents/    # documentAnalysisService (pdf-parse)
│       │   └── research/     # paperSearchService, duplicateRemovalService, paperRankingService
│       ├── utils/            # jwt, password, logger, formatters
│       └── validators/       # authValidators, researchValidators, documentValidators (Zod)
│
├── frontend/                 # React Vite Frontend
│   ├── .env.example          # Frontend environment variables
│   ├── index.html            # SPA entry HTML
│   ├── package.json          # React dependencies
│   ├── vite.config.js        # Vite dev & build configuration
│   ├── tailwind.config.js    # Tailwind theme configuration
│   └── src/
│       ├── App.jsx           # Root layout & route definitions
│       ├── main.jsx          # React DOM entry
│       ├── index.css         # Tailwind directives & dark theme styling
│       ├── components/
│       │   ├── common/       # Button, Navbar, Sidebar, Modal, ErrorMessage, LoadingSpinner
│       │   ├── dashboard/    # RecentResearch, ResearchHistory, StatsCard
│       │   └── research/     # ResearchInput, ResearchProgress, PaperCard, PaperAnalysis, ComparisonTable, ResearchGapCard, FutureDirectionCard, ReportViewer
│       ├── context/          # AuthContext
│       ├── hooks/            # useAuth
│       ├── pages/            # LandingPage, LoginPage, RegisterPage, DashboardPage, NewResearchPage, ResearchPage, PapersPage, AnalysisPage, ComparisonPage, ResearchGapsPage, FutureResearchPage, ReportPage
│       └── services/         # api.js, authService.js, researchService.js
│
└── database/                 # Supabase PostgreSQL schema
    ├── schema.sql            # Table definitions, constraints, foreign keys
    └── seed.sql              # Benchmark demo seed data
```

---

## 🔑 Environment Variables Setup

### Root & Backend `.env`:
Copy `.env.example` to `backend/.env`:
```bash
cp .env.example backend/.env
```

Fill in your configuration:
```env
PORT=5000
NODE_ENV=development

# Database / Supabase PostgreSQL
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-or-anon-key
SUPABASE_KEY=your-supabase-service-role-or-anon-key

# AI / Google Gemini API
GEMINI_API_KEY=your-google-gemini-api-key

# Academic APIs (Optional: Increases Semantic Scholar rate limit)
SEMANTIC_SCHOLAR_API_KEY=your-optional-semantic-scholar-api-key

# Security & JWT Authentication
JWT_SECRET=researchlens_super_secret_jwt_key_hackathon_2026
JWT_EXPIRES_IN=7d

# CORS Allowed Origin
CORS_ORIGIN=http://localhost:5173
```

> **Offline/Development Mode:** If `SUPABASE_URL` or `GEMINI_API_KEY` are not configured, ResearchLens automatically runs in-memory persistence and domain-grounded heuristic synthesis engines so the entire application functions immediately out of the box!

### Frontend `.env`:
Copy `frontend/.env.example` to `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 💻 Local Development Instructions

### 1. Install Dependencies
```bash
# From repository root
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 2. Run Backend & Frontend Concurrently
```bash
npm run dev
```

Or run individually:
```bash
# Terminal 1: Backend API
cd backend
npm run dev

# Terminal 2: Frontend Client
cd frontend
npm run dev
```

- **Frontend:** `http://localhost:5173`
- **Backend API Gateway:** `http://localhost:5000/api`
- **Health Check:** `http://localhost:5000/api/health`

---

## 🗄️ Database Setup (Supabase PostgreSQL)

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** tab in your Supabase dashboard.
3. Paste and run the contents of [`database/schema.sql`](file:///c:/Users/rudra/.gemini/antigravity-ide/scratch/ResearchLens/database/schema.sql).
4. (Optional) Run [`database/seed.sql`](file:///c:/Users/rudra/.gemini/antigravity-ide/scratch/ResearchLens/database/seed.sql) to populate initial demo investigations.
5. Copy your **Project URL** and **Service Role API Key** into `backend/.env`.

---

## 📡 API Reference Documentation

### Authentication Endpoints
- `POST /api/auth/register` — Register new researcher (`email`, `password`, `fullName`, `organization`)
- `POST /api/auth/login` — Login and receive JWT access token (`email`, `password`)
- `GET /api/auth/me` — Retrieve authenticated user profile (Requires Bearer Token)

### Research Management
- `GET /api/research` — List research sessions for authenticated user
- `POST /api/research` — Initialize research investigation and formulate search plan (`query`, `domain`, `paperCount`, `depth`)
- `GET /api/research/:id` — Get research session details by ID
- `DELETE /api/research/:id` — Delete research session

### Research Workflow Pipeline (Section 28)
- `POST /api/research/:id/search` — Execute multi-source academic search across Semantic Scholar, arXiv, and Crossref
- `POST /api/research/:id/analyze` — Run deep LLM analysis extracting problem, methodology, dataset, results, and limitations
- `POST /api/research/:id/compare` — Generate 5-column comparative matrix and synthesized cross-paper insights
- `POST /api/research/:id/gaps` — Discover evidence-backed research gaps with trust badges
- `POST /api/research/:id/future` — Formulate 3–5 prospective future research directions
- `POST /api/research/:id/report` — Generate complete 9-section Markdown synthesis report
- `POST /api/research/:id/execute` — Execute entire research pipeline end-to-end

### Literature & Documents
- `GET /api/papers?projectId=:id` — Get all indexed papers for a research session
- `GET /api/papers/:id` — Get details of an individual paper
- `POST /api/documents/upload` — Upload manuscript (PDF) with Multer and extract structured analysis

---

## 🚢 Deployment Guide

### Frontend Deployment (Vercel / Netlify)
1. Push repository to GitHub.
2. Link the repository in **Vercel** or **Netlify**.
3. Set **Root Directory** to `frontend`.
4. Configure Build Command: `npm run build`.
5. Configure Output Directory: `dist`.
6. Add Environment Variable:
   - `VITE_API_BASE_URL` = `https://your-backend-api.onrender.com/api`

### Backend Deployment (Render / Railway / Fly.io)
1. Create a Web Service linked to the repository.
2. Set **Root Directory** to `backend`.
3. Set Build Command: `npm install`.
4. Set Start Command: `node src/server.js`.
5. Configure Environment Variables:
   - `PORT` = `5000` (or platform default)
   - `NODE_ENV` = `production`
   - `SUPABASE_URL` = `https://your-project.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = `your-key`
   - `GEMINI_API_KEY` = `your-gemini-key`
   - `JWT_SECRET` = `your-production-jwt-secret`
   - `CORS_ORIGIN` = `https://your-frontend.vercel.app`

---

## 🏆 Hackathon Demonstration Instructions

1. Navigate to the landing page at `http://localhost:5173`.
2. Click **View Demo** or log in with the demo researcher credentials:
   - **Email:** `dr.alex@researchlens.ai`
   - **Password:** `Password123!`
3. Click **+ New Research** or click the preset question:  
   *"How is artificial intelligence being used for crop disease detection?"*
4. Select **10 papers** and click **Start Research**.
5. Watch the animated 8-stage progress indicator execute each phase in real time.
6. Explore the results across all 7 workspace tabs:
   - **Overview:** Research question, metrics, and AI executive summary.
   - **Papers:** Real papers retrieved from arXiv, Semantic Scholar, and Crossref with direct DOI links.
   - **Analysis:** Structured 8-field analysis per paper.
   - **Comparison:** 5-column table (`Paper | Method | Dataset | Results | Limitations`) and cross-cutting insights.
   - **Research Gaps:** The core differentiator! Prominent cards highlighting repeated field degradation, absent multimodal datasets, and edge constraints with evidence badges.
   - **Future Research:** Prospective proposals formulated to solve the gaps.
   - **Report:** 9-section publication-grade report ready to Copy or Download.

---

## 📜 License

Built for the **AI for Research & Knowledge Discovery** Hackathon. Distributed under the MIT License.
#   r e s e a r c h  
 