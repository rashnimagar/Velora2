# VELORA — Trust-Focused E-Commerce Marketplace

A multi-vendor marketplace with seller verification, real-time buyer↔seller
messaging, and a trust-score system. Built as a full-stack portfolio project.

## Stack

- **Backend:** Django, Django REST Framework, SimpleJWT, Channels, PostgreSQL (SQLite for local dev), Redis, Celery
- **Frontend:** React 19, Vite, Tailwind CSS v4, Redux Toolkit, React Router, React Hook Form + Zod, Lucide React

## Project structure

```
velora/
├── backend/          # Django project (config, users, sellers, products, ...)
├── frontend/          # React + Vite app
└── backend_venv/      # Python virtual environment (not committed)
```

## Getting started

### Backend

```bash
cd backend
python -m venv ../backend_venv
../backend_venv/bin/pip install -r requirements.txt
cp .env.example .env
../backend_venv/bin/python manage.py migrate
../backend_venv/bin/python manage.py runserver
```

API health check: `GET /api/health/`

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Runs at `http://localhost:5173`.

## Development status

Being built step by step, one feature at a time, following the VELORA
Development Guide. Current stage: **Project Setup complete** — apps,
folder architecture, DRF/JWT/Channels config, custom User model, and the
Tailwind design-token theme are all in place and verified running.

Next up: **Authentication** (register, login, logout, password reset, JWT).
# Velora2
