# Invoice Follow-Up Assistant

An AI-powered invoice follow-up tool for freelancers, consultants, and
small agencies. Connects to Stripe, detects overdue invoices, drafts
AI follow-up emails per client, and lets the user approve before
sending.

## Status
Milestone 0 — project skeleton, deployed, not yet functional.

## Tech stack
- **Frontend + backend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Database + auth:** Supabase
- **AI:** Claude API (Anthropic)
- **Email sending:** Resend
- **Payments data source:** Stripe (read-only, restricted API key)
- **Hosting:** Vercel

## Folder structure
```
app/            Pages and routes
app/api/        Server-side logic (Stripe, AI, email)
components/     Reusable UI pieces
lib/            Shared helper functions (Supabase client, Stripe client, etc.)
types/          Shared TypeScript types
```

## Running locally
```
npm install
npm run dev
```
Then open http://localhost:3000

## Environment variables
Copy `.env.example` to `.env.local` and fill in real values as each
milestone introduces them.
