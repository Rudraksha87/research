# Database Management & Supabase Setup

This directory contains the database migration scripts and seed data for **ResearchLens**.

## Setup Instructions

### Option 1: Supabase Cloud / Self-Hosted

1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Create a new project or select an existing one.
3. Navigate to the **SQL Editor** in the left sidebar.
4. Copy and paste the contents of `schema.sql` and click **Run**.
5. Copy and paste the contents of `seed.sql` and click **Run** to populate initial mock data.
6. Retrieve your Project URL and `anon` / `service_role` keys from **Project Settings > API**.
7. Populate `backend/.env` with:
   ```env
   SUPABASE_URL=https://<your-project-id>.supabase.co
   SUPABASE_KEY=<your-service-role-or-anon-key>
   ```

### Option 2: Local PostgreSQL

If running local PostgreSQL without Supabase:
```bash
psql -U postgres -d postgres -c "CREATE DATABASE researchlens;"
psql -U postgres -d researchlens -f schema.sql
psql -U postgres -d researchlens -f seed.sql
```

## Seed User Credentials
- **Email**: `dr.alex@researchlens.ai`
- **Password**: `Password123!`
