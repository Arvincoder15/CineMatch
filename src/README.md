# 🎬 CineMatch

> Tinder for movies! Swipe with friends to find your perfect movie match.

**CineMatch** is a collaborative movie discovery app where you and your friends swipe through real movies, and when you both like the same one — it's a match! 🎉

Built with React, TypeScript, Tailwind CSS, TMDB API, Google Gemini AI, and Supabase.

---

## 🚨 Getting Errors? Read This First!

**If you see "Failed to fetch" errors**, don't worry! It's a simple 5-minute fix.

**→ Go to [SUMMARY_OF_FIX.md](./SUMMARY_OF_FIX.md) for explanation + solution**  
**→ Or jump straight to [QUICK_FIX.md](./QUICK_FIX.md) for the 4 commands**

---

## ✨ Features

### 🎥 Real Movie Data
- Fetches **real movies** from TMDB (The Movie Database)
- **Actual movie posters**, ratings, and descriptions
- Genre-based filtering and personalized recommendations
- Pre-configured API key — works out of the box!

### 👥 Collaborative Sessions
- Create or join sessions with a 6-character code
- See all session members
- Real-time match detection when friends like the same movie
- Works across different browsers and devices

### 💕 Tinder-Style Swiping
- Smooth swipe animations (left = nope, right = like)
- Visual feedback with LIKE/NOPE indicators
- Touch-friendly for mobile devices
- Keyboard shortcuts (arrow keys)

### 🤖 AI-Powered Features
- **AI Chat Assistant** - Ask for recommendations, insights, and more
- **Personalized Insights** - Discover your movie personality
- **Smart Recommendations** - Get suggestions based on your taste
- Powered by Google Gemini (optional, free tier available)

### 🎯 Match System
- Instant notifications when you match with friends
- View all matches in dedicated tab
- See who you matched with on each movie
- Perfect for planning movie nights!

---

## 🚀 Quick Start

### ⚠️ Getting "Failed to Fetch" Errors? 

**→ Read [START_HERE.md](./START_HERE.md) for a 5-minute fix!**

Before using CineMatch, you **must deploy the Supabase Edge Function** (one-time setup):

```bash
npm install -g supabase           # Install CLI
supabase login                     # Login to Supabase
supabase functions deploy make-server-ec9c6d6c --project-ref jeknmdvhzzkxenegpgxk
```

**Without this**, you'll see **"Failed to fetch"** errors.

📖 **Help**: [START_HERE.md](./START_HERE.md) | [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) | [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### For Users

1. **Open CineMatch** in your browser
2. **Create an account** - Just enter a username
3. **Create or Join a Session:**
   - Create: Get a 6-character code to share with friends
   - Join: Enter a friend's code
4. **Select Your Preferences:**
   - Pick favorite genres (Action, Comedy, etc.)
   - Choose your vibe (Chill, Intense, etc.)
5. **Start Swiping!**
   - Swipe right on movies you'd watch
   - When friends swipe right too → Match!

### Optional: Enable Smart AI

For intelligent AI chat responses:
1. Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click ⚙️ Settings → Gemini API section
3. Paste your key and save
4. Enjoy personalized movie recommendations! 🎬

---

## 📚 Documentation

### 🚀 Getting Started (Read These First!)
- **[SUMMARY_OF_FIX.md](./SUMMARY_OF_FIX.md)** - **📋 START HERE** - Overview of the error fix
- **[QUICK_FIX.md](./QUICK_FIX.md)** - **⚡ 4 commands** - Fastest solution (2 min)
- **[START_HERE.md](./START_HERE.md)** - Quick 5-minute fix with explanation
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Step-by-step deployment checklist
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Detailed deployment instructions
- **[QUICK_START.md](./QUICK_START.md)** - User guide for using the app

### 🐛 Problem Solving
- **[ERROR_RESOLUTION.md](./ERROR_RESOLUTION.md)** - Fix "Failed to fetch" errors
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues and solutions
- **[DEPLOYMENT_FIX_SUMMARY.md](./DEPLOYMENT_FIX_SUMMARY.md)** - Technical details of the fix

### 📖 Technical Docs
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and data flow
- **[CHANGES.md](./CHANGES.md)** - Recent changes and updates
- **[TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)** - Comprehensive testing guide
- **[FILES_CHANGED_SUMMARY.txt](./FILES_CHANGED_SUMMARY.txt)** - List of modified files

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **Shadcn/ui** - Component library
- **Motion (Framer Motion)** - Animations
- **Lucide React** - Icons
- **Sonner** - Toast notifications

### Backend
- **Supabase** - Backend as a Service
- **Hono** - Web framework for Edge Functions
- **PostgreSQL** - Database (Supabase)
- **Deno** - Runtime for Edge Functions

### External APIs
- **TMDB API** - Real movie data
- **Google Gemini API** - AI chat (optional)

---

## 🏗️ Architecture

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Browser 1  │      │   Browser 2  │      │   Browser N  │
│   (User A)   │      │   (User B)   │      │   (User N)   │
└──────┬───────┘      └──────┬───────┘      └──────┬───────┘
       │                     │                      │
       │    React Frontend (Vite + TypeScript)     │
       │                     │                      │
       └──────────┬──────────┴──────────┬───────────┘
                  │                     │
          ┌───────▼─────────┐   ┌──────▼──────────┐
          │  TMDB API       │   │  Gemini API     │
          │  (Movies)       │   │  (AI Chat)      │
          └─────────────────┘   └─────────────────┘
                  │
          ┌───────▼────────────────────────────────┐
          │   Supabase Backend                     │
          │   - Session Management                 │
          │   - User Preferences                   │
          │   - Match Detection                    │
          └────────────────────────────────────────┘
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed diagrams.

---

## 📁 Project Structure

```
cinematch/
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # Shadcn components
│   │   ├── AIChat.tsx       # AI chat interface
│   │   ├── AIView.tsx       # AI tab with insights
│   │   ├── ApiSettings.tsx  # API key configuration
│   │   ├── AuthView.tsx     # Login screen
│   │   ├── GenrePreferences.tsx
│   │   ├── Header.tsx
│   │   ├── MatchesView.tsx
│   │   ├── MatchModal.tsx
│   │   ├── MovieCard.tsx
│   │   ├── SessionSetup.tsx
│   │   ├── SessionView.tsx
│   │   └── SwipeView.tsx
│   ├── lib/                 # Utility libraries
│   │   ├── ai-service.ts    # AI/Gemini integration
│   │   ├── session-manager.ts # Session management
│   │   └── tmdb-api.ts      # TMDB API client
│   ├── styles/
│   │   └── globals.css      # Global styles
│   ├── utils/
│   │   └── supabase/
│   │       └── info.tsx     # Supabase config
│   └── App.tsx              # Main app component
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx    # API endpoints
│           └── kv_store.tsx # Database wrapper
├── QUICK_START.md           # User guide
├── CHANGES.md               # Changelog
├── ARCHITECTURE.md          # Architecture docs
├── TESTING_CHECKLIST.md     # Testing guide
└── README.md                # This file
```

---

## 🔑 API Keys

### TMDB API (Pre-configured ✅)
- Already integrated with key: `3ff5c79eca8ed5d1dda6b893bc66ca6e`
- Fetches real movies with actual posters
- No setup required!

### Gemini API (Optional)
- Free tier: 60 requests/minute
- Get key at: https://aistudio.google.com/app/apikey
- Add in Settings → Gemini API section
- Without it: basic mock AI responses work fine

---

## 🧪 Testing

### Test Sessions with Friends

**Option 1: Same Device**
1. Browser 1 (Chrome): Create session → Get code
2. Browser 2 (Incognito): Join session with code
3. Both swipe → See matches!

**Option 2: Different Devices**
1. Your phone: Create session → Share code
2. Friend's device: Join with code
3. Swipe together → Match on movies!

See [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) for comprehensive tests.

---

## 🎨 Key Features

- **🎬 Real Movie Data**: Integration with TMDB API for authentic movie information
- **👥 Collaborative Sessions**: Create or join sessions wit
h friends using unique codes
- **💕 Swipe Interface**: Smooth Tinder-style swipe animations with visual feedback
- **🤖 AI-Powered**: Smart recommendations and conversational AI assistant
- **📊 User Stats**: Detailed insights about your movie taste and preferences
- **⌨️ Keyboard Shortcuts**: Full keyboard support for power users
- **🔄 Undo Feature**: Made a mistake? Easily undo your swipes
- **🔍 Search & Filter**: Find matches quickly with powerful search and filtering
- **📱 Responsive**: Beautiful experience on desktop, tablet, and mobile
- **🎯 Match Detection**: Instant notifications when you and friends like the same movie

See [FEATURES.md](./FEATURES.md) for the complete feature list!

---

## 🤝 Contributing

Feel free to:
- Report bugs
- Suggest features
- Improve documentation
- Add tests

---

## 📄 License

MIT License - feel free to use this project however you'd like!

---

## 🎯 What Makes CineMatch Special?

Unlike other movie recommendation apps:
- ✅ **Collaborative** - Find movies you AND your friends want to watch
- ✅ **Real Data** - Actual TMDB movies, not mocks
- ✅ **AI-Powered** - Smart recommendations based on your taste
- ✅ **Fun UI** - Tinder-style swiping is addictive!
- ✅ **No Setup** - Works immediately, no API keys required
- ✅ **Cross-Platform** - Works on any browser, any device

---

## 📞 Support

Having issues?
1. Check [START_HERE.md](./START_HERE.md) for setup help
2. Read [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues
3. Review [TESTING_GUIDE.md](./TESTING_GUIDE.md) for testing tips
4. Inspect browser console for detailed errors

---

## 🎉 Enjoy!

Start swiping, find matches, and enjoy movies with friends! 🎬🍿