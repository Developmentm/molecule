# LexTrack — Law Firm Case Management

A case, client, time-tracking and billing management system for law firms, built with Next.js (App Router), Prisma + SQLite, and Tailwind CSS.

## Features

- **Lawyer Management** — lawyers, partners & associate partners, hourly rates, in-charge flag
- **Client Management** — client directory with linked matters
- **Matter List** — cases linked to clients, lawyers, location & status
- **In Charge** — matters grouped by the lawyer in charge
- **Time Management** — log billable time, browse/filter time records, generate reports with CSV export
- **Disbursement Management** — track out-of-pocket case expenses
- **Leave Management** — apply for and approve/reject lawyer leave
- **Invoice / Billing** — generate invoices from unbilled time & disbursements, print/save as PDF, email to client, track Draft/Sent/Paid status
- **Settings** — firm profile, invoice numbering, default billing rate
- **Report Management** — firm-wide summary of hours, billing and disbursements
- **Subadmin Management** — admin-only user management

## Getting Started

```bash
npm install
cp .env.example .env
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo login

```
Email: admin@lawfirm.test
Password: admin123
```

## Tech Stack

- Next.js 16 (App Router, Server Actions)
- Prisma ORM + SQLite
- Tailwind CSS
- jose (JWT sessions) + bcryptjs (password hashing)
- Zod (validation)
