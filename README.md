# CineMatch

CineMatch is a collaborative movie matching app built with React and Vite. It lets people create a session, invite friends, swipe through movies, compare taste, and use AI chat for movie recommendations.

## What It Does

- Create or join collaborative movie sessions
- Swipe through movies and find shared matches
- Sync session state across devices with Supabase when configured
- Chat with Gemini for taste-aware movie conversation when configured
- Pull live movie data from TMDB when configured
- Fall back to local mode when remote services are unavailable

## Stack

- React 18
- Vite 6
- TypeScript
- Radix UI
- Motion
- Supabase Edge Functions and Realtime
- TMDB API
- Google Gemini API

## Setup

### Install

```bash
npm install
```

### Configure environment variables

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Supported variables:

- `VITE_TMDB_API_KEY` for live TMDB movie data
- `VITE_GEMINI_API_KEY` for Gemini chat
- `VITE_SUPABASE_PROJECT_ID` for cross-device session sync
- `VITE_SUPABASE_ANON_KEY` for frontend access to Supabase

### Run locally

```bash
npm run dev
```

### Production build

```bash
npm run build
```

## Service Behavior

### TMDB

Without a TMDB key, the app can still run, but live movie fetching will not be available until a key is added through `.env` or the in-app API settings.

### Gemini

Without a Gemini key, the AI chat falls back to local responses. A user can also provide a Gemini key inside the app, and it will stay in that browser only.

### Supabase

Without Supabase config, the app falls back to local-only sessions. For real cross-device collaboration, configure the Supabase variables and deploy the edge function.

## Supabase Deployment

This app expects the session backend edge function named `make-server-ec9c6d6c`.

Example:

```bash
supabase functions deploy make-server-ec9c6d6c
```

## Security Notes

- Secrets are loaded from environment variables instead of being stored in source files.
- `.env` files are ignored by Git.
- User-provided API keys entered in the UI are stored in browser local storage only.
- If any old keys were previously committed, rotate them before publishing the repository.

## Project Structure

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

## GitHub Readiness Checklist

- Fill in `.env` locally
- Keep `.env` untracked
- Rotate any keys that were exposed earlier
- Run `npm run build`
- Push to GitHub