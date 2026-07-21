# Memory-Augmented RAG Agent (Ollama + Next.js)
Premium Guide e-book: https://shop.beacons.ai/aiengineeringinsider/c262fbd7-2c5f-4167-bc46-aaeeebeb1779

An agentic Retrieval-Augmented Generation (RAG) system built with **FastAPI**, **LangGraph**, and **Ollama**, featuring a modern **Next.js 15 App Router** UI. The system supports user authentication, multi-tier conversation memory, and an interactive **14-Chapter Lab Suite** demonstrating advanced cognitive architectures.

---

## Features

- **Agentic RAG with LangGraph**: ReAct-style agent with tools for document retrieval and web search.
- **Ollama-First Stack**: Runs locally using `llama3.2` for chat and `nomic-embed-text` for vector embeddings.
- **Multi-Tier Memory Engine**:
  - **Short-Term/Working Context**: Active dialog context via LangGraph checkpointers.
  - **Long-Term Memory Layers**: Episodic events, distilled semantic facts, procedural preferences, and structured entities.
  - **Memory Write Path**: Automatic turn extraction, salience threshold filters, and Ebbinghaus forgetting decay.
  - **Memory Read Path**: Recency-weighted, importance-weighted, and Stanford Combined retrieval strategies.
  - **Consolidation & Conflicts**: Summarization hierarchies and contradiction resolution interfaces.
- **Privacy & Security**: isolated user namespacing, GDPR data portability exports, and permanent Right to be Forgotten purges.
- **Interactive Chapter Lab Suite**: Side-by-side RAG trials, search sandbox comparison, token budget sliders, and evaluation benchmark tests.

---

## Tech Stack

- **Backend**: FastAPI, LangGraph, LangChain Ollama, SQLAlchemy, Pydantic v2
- **Vector Store**: PostgreSQL + pgvector
- **Frontend**: Next.js 15, Tailwind CSS, Lucide Icons, React Context

---

## Installation & Setup

### Prerequisites
- **Python 3.12+**
- **Node.js 18+**
- **Docker** (to run the PostgreSQL + pgvector container)
- **Ollama** running locally

### 1. Ollama Dependencies
Pull the required chat and embedding models locally before launching the stack:
```bash
ollama pull llama3.2
ollama pull nomic-embed-text
```

### 2. Database Services
Launch the preconfigured PostgreSQL database with pgvector enabled via Docker:
```bash
docker compose up -d postgres
```
*Note: This brings up Postgres on port `5432` with a default password of `test` and database `langgraph_db`.*

### Docker Compose (Alternate — Run Full Stack in Containers)
If you prefer to run the entire backend and frontend suite inside containerized builds:
```bash
docker compose up --build
```
This will automatically compile the FastAPI and Next.js Dockerfiles and bind the ports `8000` (API) and `3000` (UI) to your local machine.

### 3. Environment Variables
Copy the template configuration file:
```bash
cp env.example .env
```
*(The default settings inside `.env` are preconfigured to connect to local Ollama and Docker Postgres out-of-the-box).*

### 4. Backend Server (FastAPI)
Create a Python virtual environment and run the backend server:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
- Interactive API Documentation will be available at: `http://localhost:8000/api/v1/docs`

### 5. Frontend Dashboard (Next.js 15)
Open a new terminal window, navigate to the frontend directory, and run the Next.js dev server:
```bash
cd frontend
npm install
npm run dev
```
- Open `http://localhost:3000` in your browser to launch the application.

## 🧪 Testing the Labs in the UI

The application features a dedicated **Interactive Lab Suite** (accessible via `/labs` or the sidebar in the UI) to test each conceptual memory chapter:

- **Lab 1 (Foundations)**: Test Stateless vs. Stateful Memory-Augmented RAG side-by-side.
- **Lab 2 (Memory Taxonomy)**: Seed, edit, and inspect `Episodic`, `Semantic`, `Procedural`, and `Entity` database records.
- **Lab 3 (Storage architectures)**: Extract SPO relational graph triples and run symbolic logic constraint rules over retrieved candidate sets.
- **Lab 4 (Write Path)**: Simulate writing turn phrases and inspect automatic salience threshold scores.
- **Lab 5 (Read Path)**: Compare retrieval scoring strategies (Cosine similarity, Stanford combined importance $\times$ recency $\times$ relevance).
- **Lab 6 (Consolidation)**: Run background summaries, prune expired rows, and resolve database contradiction conflicts.
- **Lab 7 (Token Budget)**: Adjust sliding token allocations between active queries, historical memories, and grounding documents.
- **Lab 8 (Multi-Tenancy & Blackboard)**: Log in as different tenants to verify tenant isolation, and test multi-agent shared blackboard writes.
- **Lab 9 (Evaluation)**: Run a 6-turn automated synthetic user simulation stressing the write-read loop.
- **Lab 10 (Privacy)**: Trigger Right-to-be-Forgotten purges and export raw GDPR portability files.
- **Lab 11 (MCP & Reasoning Graphs)**: Traversed thought-path hierarchies and test Model Context Protocol JSON-RPC endpoints.
- **Lab 12 (Caching & Tracing)**: Run Redis cache fetches and toggle LangSmith observability tracers.
- **Lab 13 (Capstone)**: Test end-to-end memory loops with full document-grounding controls.
- **Lab 14 (Tiered Cache Gateway)**: Compare fetch latencies of hot cached hits (~0.15ms) vs cold database fallback misses (~45ms).
