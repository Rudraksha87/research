# ResearchLens REST API Specification

Base URL: `http://localhost:5000/api`

All protected endpoints require an `Authorization` header formatted as:
`Authorization: Bearer <JWT_TOKEN>`

---

## 1. Authentication (`/auth`)

### `POST /auth/register`
Creates a new researcher account.
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!",
    "fullName": "Jane Doe",
    "organization": "Stanford University"
  }
  ```
- **Response**: `201 Created` with `{ user, token }`

### `POST /auth/login`
Authenticates a user.
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!"
  }
  ```
- **Response**: `200 OK` with `{ user, token }`

### `GET /auth/me`
Retrieves currently logged in user profile.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK` with `{ user }`

---

## 2. Research Projects (`/research`)

### `GET /research`
Lists all research projects for the current user.

### `POST /research`
Initiates a new research investigation.
- **Body**:
  ```json
  {
    "title": "Quantum Error Correction in Neutral Atom Arrays",
    "query": "How do topological surface codes scale with Rydberg neutral atom coherence times?",
    "domain": "Quantum Physics",
    "includeSearch": true
  }
  ```

### `GET /research/:id`
Retrieves research project details, status, key findings, and plan.

### `POST /research/:id/execute`
Triggers full end-to-end pipeline execution (Plan -> Search -> Analyze -> Compare -> Gaps -> Report).

---

## 3. Papers (`/papers`)

### `GET /papers?projectId=:id`
Lists all papers linked to a project.

### `POST /papers`
Manually adds an academic paper or citation reference.

### `GET /papers/:id`
Fetches individual paper details and citation metrics.

---

## 4. Analysis & Syntheses (`/analysis`)

### `GET /analysis/paper/:paperId`
Retrieves in-depth AI extraction (methodology, limitations, sample sizes).

### `GET /analysis/comparison/:projectId`
Fetches the synthesized cross-paper matrix comparison.

### `GET /analysis/gaps/:projectId`
Fetches identified research gaps and blind spots.

### `GET /analysis/future/:projectId`
Fetches proposed future directions and hypotheses.

### `GET /analysis/report/:projectId`
Fetches the full synthesized markdown report.

---

## 5. Document Ingestion (`/documents`)

### `POST /documents/upload`
Uploads a scientific paper (PDF or TXT).
- **Multipart Form Data**: `file` (binary), `projectId` (string)
- **Response**: `200 OK` with parsed text and extracted metadata.
