# ResearchLens System Architecture & Data Flow

ResearchLens is designed as an agentic literature intelligence and scientific synthesis platform.

```mermaid
graph TD
    User([User / Researcher]) -->|Query / Paper Upload| UI[React 18 + Tailwind Frontend]
    UI -->|REST API / JWT| API[Express API Gateway]
    
    subgraph "Backend Orchestration"
        API --> AuthCtrl[Auth & Session Controller]
        API --> ResCtrl[Research Controller]
        API --> DocCtrl[Document Ingestion Controller]
        
        ResCtrl --> Planner[AI Research Planner (Gemini)]
        Planner --> SearchSvc[Multi-source Paper Search]
        SearchSvc --> Ranker[Paper Ranking & Deduplication]
        Ranker --> Analyzer[Deep Paper Analyzer (Gemini)]
        Analyzer --> Comparator[Comparative Matrix Synthesizer]
        Comparator --> GapDetector[Research Gap Detector]
        GapDetector --> FutureRoadmap[Future Directions Generator]
        FutureRoadmap --> ReportGen[Synthesis Report Generator]
    end

    subgraph "Storage Layer"
        API <--> DB[(Supabase / PostgreSQL)]
        DocCtrl <--> FS[Local Storage / S3 Uploads]
    end
```

## Key Architectural Principles

1. **Modular AI Pipeline**:
   The AI reasoning pipeline is broken into single-responsibility services (`researchPlanner.js`, `paperAnalysis.js`, `paperComparison.js`, `researchGapDetector.js`, `futureResearch.js`, `reportGenerator.js`). This enables targeted temperature settings, model swaps, and clear failure recovery.

2. **Deduplication and Semantic Scoring**:
   Before sending papers to Gemini, papers collected across multiple databases (or user PDF uploads) are normalized by DOI and fuzzy-matched by title to eliminate redundant tokens.

3. **Fallback & Resiliency Mode**:
   If Gemini API keys are not supplied or hit rate limits, the system seamlessly defaults to high-fidelity analytical fallback heuristics so development and visual testing never break.

4. **Multi-Tenancy & Data Isolation**:
   All research queries, extracted paper metadata, matrices, and generated reports belong to a parent project tagged with the authenticated user's UUID.
