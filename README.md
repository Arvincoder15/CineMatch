# 🎬 CineMatch

Find a movie everyone actually wants to watch.

CineMatch is a collaborative movie-matching app built with React and Vite. Create a session, invite friends, swipe through movies together, get shared matches, and chat with AI for better recommendations.

## ✨ Highlights

- 🎞️ Swipe through movies with a fast, app-like interface
- 👥 Create shared sessions with friends
- 💘 See mutual matches when multiple users like the same movie
- 🤖 Chat with Gemini for taste-aware movie suggestions
- 🔄 Sync sessions across devices with Supabase
- 🌗 Light and dark theme support
- 🛟 Local fallback mode when backend services are not configured

## 🧰 Tech Stack

- React 18
- Vite 6
- TypeScript
- Radix UI
- Motion
- Supabase Edge Functions + Realtime
- TMDB API
- Google Gemini API

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create your environment file

```bash
cp .env.example .env
```

### 3. Add your environment variables

```env
VITE_TMDB_API_KEY=
VITE_GEMINI_API_KEY=
VITE_SUPABASE_PROJECT_ID=
VITE_SUPABASE_ANON_KEY=
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
```

## 🔐 Environment Variables

| Variable | Purpose |
| --- | --- |
| `VITE_TMDB_API_KEY` | Enables live movie data from TMDB |
| `VITE_GEMINI_API_KEY` | Enables Gemini-powered AI chat |
| `VITE_SUPABASE_PROJECT_ID` | Connects the app to your Supabase project |
| `VITE_SUPABASE_ANON_KEY` | Enables frontend access to Supabase services |

## 🧠 How The App Behaves Without Keys

- Without `VITE_TMDB_API_KEY`, live TMDB movie fetching is unavailable until a key is added.
- Without `VITE_GEMINI_API_KEY`, AI chat falls back to local responses.
- Without Supabase config, sessions work in local-only mode and will not sync across devices.

## ☁️ Supabase Deployment

This project expects a Supabase edge function named `make-server-ec9c6d6c`.

Deploy it with:

```bash
supabase functions deploy make-server-ec9c6d6c
```

## 🛡️ Security Notes

- Secrets are loaded from environment variables, not stored in source code.
- `.env` files are ignored by Git.
- User-provided API keys entered in the app are stored in browser local storage only.
- If any keys were previously committed, rotate them before publishing or sharing the repository.

## 📁 Project Structure

```text
.
├── index.html
├── package.json
├── src/
│   ├── components/
│   ├── lib/
│   ├── styles/
│   ├── supabase/
│   └── utils/
└── vite.config.ts
```

## ✅ GitHub Checklist

- Fill in `.env` locally
- Keep `.env` untracked
- Rotate any previously exposed keys
- Run `npm run build`
- Push to GitHub

## 🎥 Summary

CineMatch is built to make group movie decisions less painful: swipe fast, compare taste, sync live, and let AI help break the tie.