#NAGA CODEX

Interview-ready Next.js 15 demo with **Lesson Planner**, **Insights** (CSV + Gemini), and **Magic Chat** – all using **Gemini 2.5 Flash** (free tier). Deploy to Vercel in minutes.

## Tech stack (100% free)

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **AI:** Google Gemini 2.5 Flash (free tier)
- **Charts:** Recharts  
- **CSV:** PapaParse
- **Deploy:** Vercel (free)

## Features

1. **Lesson Planner** (`/lesson-planner`) – Thema, Klasse, Fach, Zeit → KI-Stundenplan mit Phasen, Materialien, Hausaufgaben + PDF/Drucken.
2. **Insights** (`/insights`) – CSV-Upload → Gemini-Analyse (Schwächen, Empfehlungen) + Dashboard-Charts.
3. **Magic Chat** (`/magic-chat`) – ChatGPT-Style Chat mit Streaming; Quiz, Ideen, Lösungen.

## Setup

```bash
# Clone (or use this folder)
cd paddy-demo

# Install dependencies (uses pnpm for lower memory use)
pnpm install

# Copy env and add your Gemini API key (https://aistudio.google.com/apikey)
cp .env.local.example .env.local
# Edit .env.local:
# GEMINI_API_KEY=your_key
# (optional) NEXT_PUBLIC_APP_URL=http://localhost:3000  # or your deployed domain

# Run dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

1. Push the repo to GitHub (or connect your Git provider).
2. In [Vercel](https://vercel.com/new), import the project.
3. Add **Environment Variables:**
   - `GEMINI_API_KEY` = your key
   - (optional) `NEXT_PUBLIC_APP_URL` = e.g. `https://schoolee-gamma.vercel.app` or your final domain
4. Deploy.

## Optional: n8n workflow (interview pitch)

The same “Lesson Plan from params” flow can run in **n8n**: Webhook receives `thema`, `klasse`, `fach`, `zeit` → call Gemini (or this app’s API) → return JSON.

To create the workflow via **n8n MCP**:

1. Run n8n (e.g. Docker or cloud) and get your **API URL** and **API key**.
2. Set env vars for the MCP: `N8N_API_URL`, `N8N_API_KEY`.
3. Use the MCP tool `n8n_create_workflow` to create the “Naga Codex Lesson Plan – Gemini” workflow (Webhook → HTTP Request to Gemini API → Respond to Webhook).

A workflow **"Naga Codex Lesson Plan – Gemini"** was created via MCP (Webhook → Build Prompt → Call Gemini → Respond to Webhook). Set `GEMINI_API_KEY` in n8n; after activation, POST to the webhook with body `{ "thema", "klasse", "fach", "zeit" }` and parse `candidates[0].content.parts[0].text` for the lesson plan JSON.

## Scripts

- `pnpm dev` – Development server
- `pnpm build` – Production build
- `pnpm start` – Start production server
- `pnpm lint` – ESLint

## Project structure

```
app/
  layout.tsx       # Navbar, theme, dark toggle
  page.tsx         # Landing (3 cards)
  lesson-planner/page.tsx
  insights/page.tsx
  magic-chat/page.tsx
  api/
    lesson-plan/route.ts
    insights/route.ts
    chat/route.ts
components/
  ui/              # shadcn
  navbar.tsx
  theme-toggle.tsx
  lesson-plan.tsx
lib/
  gemini.ts        # Gemini client (lesson, insights, chat/stream)
  mock-data.ts     # RAG context for lesson planner
  utils.ts
```

## Interview pitch

- **App:** Full Next.js 15 EdTech app with RAG-style lesson planning, CSV insights with Gemini, and streaming Magic Chat – all on Gemini 2.5 Flash free tier.
- **n8n:** Same use case can be automated in n8n: webhook → Gemini (or Next.js API) → lesson plan; demonstrates no-code/low-code integration with the same AI stack.
