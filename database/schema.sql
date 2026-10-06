-- ==========================================================
-- ResearchLens Database Schema (PostgreSQL / Supabase)
-- ==========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    organization VARCHAR(255),
    role VARCHAR(50) DEFAULT 'researcher',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Research Projects Table
CREATE TABLE IF NOT EXISTS research_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    query TEXT NOT NULL,
    domain VARCHAR(100) DEFAULT 'General Science',
    status VARCHAR(50) DEFAULT 'draft', -- draft, running, completed, failed
    plan JSONB DEFAULT '{}'::jsonb,
    summary TEXT,
    key_findings JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Papers Table
CREATE TABLE IF NOT EXISTS papers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES research_projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    authors JSONB DEFAULT '[]'::jsonb,
    abstract TEXT,
    year INTEGER,
    journal_or_venue TEXT,
    doi VARCHAR(100),
    url TEXT,
    citation_count INTEGER DEFAULT 0,
    source VARCHAR(50) DEFAULT 'arXiv', -- arXiv, PubMed, OpenAlex, Semantic Scholar, Upload
    score NUMERIC(5, 2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Paper Analyses Table
CREATE TABLE IF NOT EXISTS paper_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paper_id UUID NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES research_projects(id) ON DELETE CASCADE,
    methodology TEXT,
    datasets_used JSONB DEFAULT '[]'::jsonb,
    sample_size TEXT,
    main_contributions JSONB DEFAULT '[]'::jsonb,
    strengths JSONB DEFAULT '[]'::jsonb,
    limitations JSONB DEFAULT '[]'::jsonb,
    relevance_score INTEGER CHECK (relevance_score BETWEEN 1 AND 10),
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Cross-Paper Comparison Matrix Table
CREATE TABLE IF NOT EXISTS paper_comparisons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES research_projects(id) ON DELETE CASCADE,
    matrix_data JSONB NOT NULL DEFAULT '[]'::jsonb,
    comparison_summary TEXT,
    key_tradeoffs JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Research Gaps Table
CREATE TABLE IF NOT EXISTS research_gaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES research_projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- Methodology, Dataset, Generalizability, Theoretical
    description TEXT NOT NULL,
    impact_level VARCHAR(50) DEFAULT 'High', -- High, Medium, Low
    supporting_evidence JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Future Directions Table
CREATE TABLE IF NOT EXISTS future_directions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES research_projects(id) ON DELETE CASCADE,
    proposal_title VARCHAR(255) NOT NULL,
    hypothesis TEXT NOT NULL,
    suggested_methodology TEXT NOT NULL,
    expected_challenges JSONB DEFAULT '[]'::jsonb,
    potential_impact TEXT,
    feasibility_score INTEGER CHECK (feasibility_score BETWEEN 1 AND 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Final Research Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES research_projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    executive_summary TEXT NOT NULL,
    markdown_content TEXT NOT NULL,
    table_of_contents JSONB DEFAULT '[]'::jsonb,
    format VARCHAR(20) DEFAULT 'markdown',
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Document Uploads Table
CREATE TABLE IF NOT EXISTS document_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES research_projects(id) ON DELETE SET NULL,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    extracted_text TEXT,
    parsed_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_research_projects_user_id ON research_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_papers_project_id ON papers(project_id);
CREATE INDEX IF NOT EXISTS idx_paper_analyses_paper_id ON paper_analyses(paper_id);
CREATE INDEX IF NOT EXISTS idx_research_gaps_project_id ON research_gaps(project_id);
CREATE INDEX IF NOT EXISTS idx_future_directions_project_id ON future_directions(project_id);
CREATE INDEX IF NOT EXISTS idx_reports_project_id ON reports(project_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS trg_update_users_timestamp ON users;
CREATE TRIGGER trg_update_users_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_update_projects_timestamp ON research_projects;
CREATE TRIGGER trg_update_projects_timestamp
    BEFORE UPDATE ON research_projects
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_update_paper_analyses_timestamp ON paper_analyses;
CREATE TRIGGER trg_update_paper_analyses_timestamp
    BEFORE UPDATE ON paper_analyses
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_update_reports_timestamp ON reports;
CREATE TRIGGER trg_update_reports_timestamp
    BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();
