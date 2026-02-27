# Molecule — AI Project Execution Platform

Production-style monorepo with modular TypeScript backend + Next.js frontend.

## Monorepo

- `apps/frontend` — Next.js App Router + Tailwind UI + role dashboards.
- `apps/backend` — Express + Prisma + JWT + RBAC + workflow state machine.
- `packages/ui` — shared UI tokens.
- `prisma/schema.prisma` — PostgreSQL schema.
- `docker/*` + `docker-compose.yml` — containerized local runtime.

## Features Implemented

- Authentication (`POST /auth/register`, `POST /auth/login`) with bcrypt + JWT.
- Role guards for Client, PM, Developer, Finance, Admin.
- Requirement submission + AI scoping chat (OpenAI + fallback mock).
- Quotation creation/status update + **PDFKit-generated** PDF export.
- Invoice generation + local receipt upload + finance verify/reject + **PDFKit-generated** PDF export.
- Workflow transition validation via state machine.
- Milestone auto-creation when payment is verified.
- Task status/time-log updates.
- Notifications endpoint with pagination.
- Project listing with search + filter + pagination.
- Admin analytics + user listing.
- Dark/light mode toggle persisted in localStorage.
- Mock email notifications (console logger) for quotation/invoice events.
- Demo data includes: admin, finance, PM, 2 devs, client, sample project, pending invoice, milestone in progress.

## Required Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

## Local Run (without Docker)

```bash
npm install
npm install -w @molecule/backend
npm install -w @molecule/frontend
npm run prisma:generate -w @molecule/backend
npm run prisma:push -w @molecule/backend
npm run seed -w @molecule/backend
npm run dev
```

## Docker Run (includes prisma push + seed on backend startup)

```bash
docker-compose up --build
```

Then:
- Frontend: `http://localhost:3000`
- API: `http://localhost:4000`
- Uploaded files: `http://localhost:4000/uploads/<filename>`

## Demo Credentials

All users use password: `Password123!`

- admin@molecule.dev
- finance@molecule.dev
- pm@molecule.dev
- dev1@molecule.dev
- dev2@molecule.dev
- client@molecule.dev

## API Map

- Auth:
  - `POST /auth/login`
  - `POST /auth/register`
- Requirement:
  - `POST /requirements`
  - `GET /requirements/:id`
  - `PUT /requirements/:id/workflow`
- AI Chat:
  - `POST /requirements/:id/chat`
- Quotation:
  - `POST /quotations`
  - `PUT /quotations/:id/status`
  - `GET /quotations/:id/pdf`
- Invoice:
  - `POST /invoices`
  - `POST /invoices/:id/receipt` (multipart form-data with `file` + `referenceNumber`)
  - `PUT /invoices/:id/verify`
  - `GET /invoices/:id/pdf`
- Project:
  - `GET /projects?search=&status=&page=&pageSize=`
  - `POST /projects/:id/milestones`
- Task:
  - `PUT /tasks/:id/status`
- Notifications:
  - `GET /notifications?page=&pageSize=`
- Admin:
  - `GET /admin/analytics`
  - `GET /admin/users`

## Test Commands

```bash
npm run test:api -w @molecule/backend
npm run test:e2e -w @molecule/backend
```
