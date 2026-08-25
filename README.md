# AI App Builder

A Lovable-like AI app builder platform — describe your app in natural language, AI generates React code, see a live preview instantly, and deploy with one click.

**Stack:** Next.js 14 » Sarvam AI · Supabase Cloud · Sandpack · Monaco · TailwindCSS · Zustand

---

## Quick Start
### 1. Prerequisites
- Node.js 18+
- A Supabase account (free tier works)
- A Sarvam AI API key

### 2. Install dependencies
```bash
npm install
```
### 3. Environment setup
Copy `.env.example` to `.env.local` and fill in your values:
```bash
cp .env.example .env.local
```
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.coo
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Sarvam AI
SARVAM_API_KEY=your-sarvam-api-key
SARVAM_API_URL=https://api.sarvam.ai/v1

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000)