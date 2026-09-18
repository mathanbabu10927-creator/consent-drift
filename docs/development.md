# Development guide

This project keeps the setup intentionally lightweight.

## 1) Create a Python virtual environment

From the repository root:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
```

On Windows PowerShell:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

## 2) Install dependencies

```bash
pip install -r requirements.txt
```

## 3) Run the FastAPI server

```bash
uvicorn app.main:app --reload
```

The app will run locally at:

- http://127.0.0.1:8000/
- http://127.0.0.1:8000/health

## 4) Run tests

```bash
cd backend
PYTHONPATH=. pytest tests
```

This project intentionally avoids databases, authentication, Docker, AI APIs, and Android-specific tooling until the next implementation phase.
