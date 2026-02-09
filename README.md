# Second Brain — AI-Powered Knowledge System

An intelligent knowledge management platform that captures, organizes, and surfaces knowledge using AI. Built with Next.js 16, Prisma, and a pluggable AI provider system.

---

## Features

### Core

- **Knowledge Capture** — Rich form with title, content, type (Note/Link/Insight), tags, source URL, and file upload
- **Smart Dashboard** — Searchable, filterable grid/list view with sorting, pagination, and skeleton loaders
- **AI Summarization** — Auto-generate concise summaries for any knowledge item
- **AI Auto-Tagging** — Intelligently categorize content with suggested tags
- **Conversational Query** — Ask natural language questions answered from your knowledge base
- **Public API** — `GET /api/public/brain/query?q=...` returns JSON answers with sources
- **Embeddable Widget** — iframe-ready search widget at `/embed`

### Bonus

- **Graph Visualization** — React Flow-powered knowledge graph showing tag-based relationships
- **Authentication** — NextAuth v5 with credentials (email/password)
- **File Upload** — Drag-and-drop with react-dropzone (PDF, TXT, MD up to 10MB)
- **Command Palette** — `⌘K` search shortcut in the navbar
- **Accessibility** — ARIA labels, keyboard navigation, focus management

### UI/UX

- **Dark Theme** — Beautiful dark design with violet/blue accents
- **Framer Motion** — Scroll-triggered animations, parallax hero, hover effects
- **Skeleton Loaders** — Every data-fetching state has loading UI
- **Micro-interactions** — Intentional hover states, transitions, and visual feedback
- **Responsive** — Desktop-first, mobile-friendly

---

## Tech Stack

| Layer      | Technology                                |
| ---------- | ----------------------------------------- |
| Framework  | Next.js 16.1.6 (App Router, Turbopack)    |
| Language   | TypeScript 5                              |
| Styling    | Tailwind CSS v4                           |
| Animations | Framer Motion 12                          |
| Database   | PostgreSQL via Neon                       |
| ORM        | Prisma 7                                  |
| Auth       | NextAuth v5 (beta)                        |
| AI         | OpenAI → Gemini → Ollama (fallback chain) |
| Graph      | @xyflow/react (React Flow)                |
| UI         | Lucide icons, cmdk, react-hot-toast       |

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or [Neon](https://neon.tech))
- At least one AI provider key (OpenAI, Gemini) or Ollama running locally

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/second-brain.git
cd second-brain

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database URL and AI keys

# 4. Generate Prisma client
npx prisma generate

# 5. Run database migrations
npx prisma db push

# 6. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

```env
# Database (required) - Use Neon pooled connection with timeout params
# Make sure hostname has -pooler for the pooled connection
DATABASE_URL="postgresql://user:password@ep-xxx-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&connect_timeout=15&pool_timeout=15"

# Direct connection for Prisma CLI (migrations, db push) - no pooler
DIRECT_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require&connect_timeout=15"

# NextAuth (required)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret"
AUTH_SECRET="same-as-nextauth-secret"

# AI Providers (configure at least one)
OPENAI_API_KEY=""        # Primary - GPT-4o-mini + text-embedding-3-small
GEMINI_API_KEY=""        # Fallback - Gemini 2.0 Flash + text-embedding-004
OLLAMA_URL=""            # Local fallback - llama3.2 + nomic-embed-text
```

---

## Project Structure

```
second-brain/
├── app/
│   ├── (landing)/page.tsx       # Landing page with parallax
│   ├── dashboard/page.tsx       # Main knowledge dashboard
│   ├── capture/page.tsx         # Knowledge capture form
│   ├── item/[id]/page.tsx       # Item detail view
│   ├── graph/page.tsx           # Knowledge graph visualization
│   ├── docs/page.tsx            # Architecture documentation
│   ├── embed/page.tsx           # Embeddable widget
│   ├── auth/                    # Sign in / Sign up
│   └── api/
│       ├── knowledge/           # CRUD endpoints
│       ├── ai/                  # Summarize, auto-tag, query
│       ├── public/brain/query/  # Public API
│       ├── tags/                # Tag management
│       └── upload/              # File upload
├── components/
│   ├── ui/                      # Button, Input, Card, Badge, Modal, etc.
│   ├── knowledge/               # KnowledgeCard, KnowledgeForm, AiChat
│   ├── layout/                  # Navbar, Sidebar, Providers
│   └── animations/              # FadeIn, StaggerChildren
├── lib/
│   ├── db.ts                    # Prisma client singleton
│   ├── auth.ts                  # NextAuth configuration
│   ├── utils.ts                 # Utility functions (cn, formatDate, etc.)
│   └── ai/
│       ├── provider.ts          # AI abstraction layer
│       ├── openai.ts            # OpenAI implementation
│       ├── gemini.ts            # Gemini implementation
│       └── ollama.ts            # Ollama implementation
├── prisma/
│   └── schema.prisma            # Database schema
├── types/
│   └── index.ts                 # TypeScript type definitions
└── prisma.config.ts             # Prisma 7 configuration
```

---

## API Reference

### Authenticated Endpoints (require session)

| Method | Endpoint             | Description                                 |
| ------ | -------------------- | ------------------------------------------- |
| GET    | `/api/knowledge`     | List items (search, filter, sort, paginate) |
| POST   | `/api/knowledge`     | Create item (with optional AI enrichment)   |
| GET    | `/api/knowledge/:id` | Get single item                             |
| PUT    | `/api/knowledge/:id` | Update item                                 |
| DELETE | `/api/knowledge/:id` | Delete item                                 |
| POST   | `/api/ai/summarize`  | Summarize content                           |
| POST   | `/api/ai/auto-tag`   | Auto-tag content                            |
| POST   | `/api/ai/query`      | Query knowledge base                        |
| GET    | `/api/tags`          | List all tags with counts                   |
| POST   | `/api/upload`        | Upload file                                 |

### Public Endpoints (no auth required)

```bash
# Query the knowledge base
curl "https://sec-brain.niheshr.com/api/public/brain/query?q=What+is+React"

# Response
{
  "answer": "Based on your notes, React is...",
  "sources": [{ "id": "...", "title": "...", "excerpt": "..." }],
  "timestamp": "2026-02-07T12:00:00Z"
}
```

### Embeddable Widget

```html
<iframe
  src="https://sec-brain.niheshr.com/embed"
  width="400"
  height="500"
  frameborder="0"
  style="border-radius: 12px;"
></iframe>
```

---

## Architecture

See the full documentation at [`/docs`](https://sec-brain.niheshr.com/docs) covering:

1. **Portable Architecture** — Layered design with swappable components (AI providers, database, auth)
2. **Principles-Based UX** — 5 design principles: Progressive Disclosure, Contextual Intelligence, Graceful Degradation, Consistent Feedback, Keyboard-First
3. **Agent Thinking** — Background automation: auto-tagging, summarization, embedding generation
4. **Infrastructure Mindset** — Public API and embeddable widget for external access

### AI Provider Fallback Chain

```
OpenAI (GPT-4o-mini) → Gemini (2.0 Flash) → Ollama (local)
```

The system automatically selects the first available provider based on configured API keys.

---

## Deployment

### Vercel + Neon

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Create a [Neon](https://neon.tech) PostgreSQL database
4. Set environment variables in Vercel dashboard
5. Deploy

---

## License

MIT
