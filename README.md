# TaskBoard

> A high-performance, real-time Kanban project management tool with a sleek Glassmorphism aesthetic. Move a card on your phone — watch it slide on your desktop instantly.

---

## ✨ Features

- **Real-time Syncing** — Powered by Supabase WebSockets. Changes propagate instantly across all connected devices.
- **Secure Authentication** — Social login via Google OAuth 2.0.
- **Drag & Drop** — Intuitive interface built with `@dnd-kit` for a smooth, accessible experience.
- **Glassmorphism UI** — Dark-themed design with backdrop blurs and high-end CSS effects.
- **Optimistic Updates** — RTK Query cache updates instantly on drag, with automatic rollback if the server fails.
- **Data Persistence** — PostgreSQL database with Row Level Security (RLS) ensuring strict user data privacy.

---

## 🚀 Tech Stack

| Layer | Technology |
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS |
| Backend / Database | Supabase (PostgreSQL), PostgREST API |
| Auth | Supabase Auth, Google OAuth 2.0 |
| State Management | Redux Toolkit, RTK Query |
| Drag & Drop | @dnd-kit/core |

---

## 🛠️ Getting Started

### 1. Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works perfectly)

### 2. Installation

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your board in action.

---

## 🔐 Database Schema & Security

This project uses Row Level Security (RLS) to ensure users can only access their own tasks.

```sql
-- Task table
CREATE TABLE tasks (
  id          UUID      PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID      REFERENCES auth.users(id),
  title       TEXT      NOT NULL,
  description TEXT,
  status      TEXT      DEFAULT 'todo',
  priority    TEXT      DEFAULT 'low',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policy: users can only read and write their own tasks
CREATE POLICY "Users can manage their own tasks"
ON tasks FOR ALL
USING (auth.uid() = user_id);
```

---

## 📜 License

Distributed under the MIT License.
