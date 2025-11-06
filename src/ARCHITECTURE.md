# CineMatch Architecture 🏗️

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     CineMatch Application                    │
└─────────────────────────────────────────────────────────────┘

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
          │   ┌─────────────────────────────────┐  │
          │   │  Hono Server (Edge Function)    │  │
          │   │  - Session Management           │  │
          │   │  - User Preferences             │  │
          │   │  - Match Detection              │  │
          │   └─────────┬───────────────────────┘  │
          │             │                           │
          │   ┌─────────▼───────────────────────┐  │
          │   │  PostgreSQL Database            │  │
          │   │  - kv_store_ec9c6d6c table      │  │
          │   │  - Session data                 │  │
          │   │  - User preferences             │  │
          │   └─────────────────────────────────┘  │
          └────────────────────────────────────────┘
```

---

## Data Flow

### 1. User Authentication & Session Creation

```
User Opens App
      │
      ├──> Enter Username
      │         │
      │         ├──> Create Account (Store in localStorage)
      │         │
      │         ├──> Choose: Create or Join Session?
      │         │
      ├──> Create Session
      │         │
      │         ├──> Generate 6-char code
      │         ├──> POST /sessions/create
      │         ├──> Store in Supabase KV Store
      │         └──> Return session code to user
      │
      └──> Join Session
                │
                ├──> Enter session code
                ├──> POST /sessions/join
                ├──> Fetch from Supabase KV Store
                ├──> Add user to session.users[]
                └──> Return session data
```

### 2. Genre Preferences & Movie Loading

```
User in Session
      │
      ├──> Select Genres (Action, Comedy, etc.)
      ├──> Select Vibe (Chill, Intense, etc.)
      │
      ├──> POST /sessions/join (update user prefs)
      │
      └──> Load Movies
                │
                ├──> If genres selected
                │         └──> fetchMoviesByUserPreferences()
                │                   └──> TMDB /discover/movie?with_genres=...
                │
                └──> Else
                          └──> fetchPopularMovies()
                                    └──> TMDB /movie/popular
```

### 3. Swiping & Matching

```
User Swipes on Movie
      │
      ├──> Swipe LEFT (Nope)
      │         └──> Do nothing
      │
      └──> Swipe RIGHT (Like)
                │
                ├──> Add to likedMovies array
                │
                ├──> POST /sessions/:code/preferences
                │         └──> Update session.preferences[userId] in Supabase
                │
                ├──> GET /sessions/:code (refresh)
                │         └──> Fetch updated session data
                │
                └──> Check for Matches
                          │
                          ├──> Get all users who liked this movie
                          ├──> If 2+ users (including current user)
                          │         │
                          │         ├──> Show Match Modal! 🎉
                          │         ├──> Toast notification
                          │         └──> Add to matches list
                          │
                          └──> Continue swiping
```

### 4. AI Chat Flow

```
User Sends Message to AI
      │
      ├──> Check if Gemini API key exists
      │
      ├──> YES: Gemini API
      │         │
      │         ├──> Build context from liked movies
      │         ├──> POST to Gemini API
      │         │         {
      │         │           model: "gemini-pro",
      │         │           prompt: systemPrompt + userMessage
      │         │         }
      │         └──> Return AI response
      │
      └──> NO: Mock Response
                │
                ├──> Parse user message keywords
                ├──> Return pre-written response
                └──> Suggest adding Gemini key
```

---

## API Endpoints

### Supabase Backend (Hono Server)

```
Base URL: https://{projectId}.supabase.co/functions/v1/make-server-ec9c6d6c
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/sessions/create` | Create new session |
| `POST` | `/sessions/join` | Join existing session |
| `GET` | `/sessions/:code` | Get session by code |
| `POST` | `/sessions/:code/preferences` | Update user preferences |

#### Request/Response Examples

**Create Session:**
```json
POST /sessions/create
{
  "code": "ABC123",
  "user": {
    "id": "user_12345",
    "username": "Alice",
    "genres": ["action", "sci-fi"],
    "vibe": "intense"
  }
}

Response:
{
  "success": true,
  "session": {
    "code": "ABC123",
    "createdAt": 1234567890,
    "users": [...],
    "preferences": {}
  }
}
```

**Join Session:**
```json
POST /sessions/join
{
  "code": "ABC123",
  "user": {
    "id": "user_67890",
    "username": "Bob",
    "genres": ["comedy", "romance"],
    "vibe": "chill"
  }
}

Response:
{
  "success": true,
  "session": {
    "code": "ABC123",
    "users": [user1, user2],
    ...
  }
}
```

**Update Preferences:**
```json
POST /sessions/:code/preferences
{
  "userId": "user_12345",
  "movieIds": [533535, 558449, 1184918]
}

Response:
{
  "success": true,
  "session": {...}
}
```

---

## External APIs

### TMDB API (The Movie Database)

```
Base URL: https://api.themoviedb.org/3
API Key: 3ff5c79eca8ed5d1dda6b893bc66ca6e (pre-configured)
```

**Endpoints Used:**
- `GET /movie/popular` - Get popular movies
- `GET /movie/{id}` - Get movie details
- `GET /discover/movie` - Discover movies by genre
- `GET /search/movie` - Search movies by title

**Example Request:**
```
GET /discover/movie?api_key={key}&with_genres=28,12&sort_by=popularity.desc
```

### Google Gemini API

```
Base URL: https://generativelanguage.googleapis.com/v1beta
Model: gemini-pro
```

**Request:**
```json
POST /models/gemini-pro:generateContent?key={apiKey}
{
  "contents": [{
    "parts": [{
      "text": "You are a movie assistant. User liked: [movies]. Question: recommend a movie"
    }]
  }],
  "generationConfig": {
    "temperature": 0.7,
    "maxOutputTokens": 200
  }
}
```

---

## Data Storage

### localStorage (Browser)

```javascript
Keys:
- cinematch_current_user         // Current logged-in user
- cinematch_current_session      // Current session code
- tmdb_api_key                   // Custom TMDB API key (optional)
- gemini_api_key                 // Gemini API key for AI chat
```

### Supabase Database (PostgreSQL)

```sql
Table: kv_store_ec9c6d6c

Schema:
- key (TEXT PRIMARY KEY)
- value (JSONB)

Data Format:
key: "session:ABC123"
value: {
  code: "ABC123",
  createdAt: 1234567890,
  users: [
    {
      id: "user_12345",
      username: "Alice",
      genres: ["action", "sci-fi"],
      vibe: "intense"
    }
  ],
  preferences: {
    "user_12345": [533535, 558449, 1184918]
  }
}
```

---

## State Management

### React State (App.tsx)

```typescript
State Variables:
- appState: 'auth' | 'session-setup' | 'preferences' | 'session-view' | 'app'
- currentUser: User | null
- currentSession: Session | null
- movies: Movie[]
- likedMovies: number[]
- matches: Match[]
- loading: boolean
- matchModal: { movie, friend } | null
- currentView: 'swipe' | 'ai' | 'matches'
```

### User Flow States

```
auth
  └──> session-setup
          ├──> preferences
          │       └──> session-view
          │               └──> app (main swiping interface)
          │
          └──> (back to session-setup if session not found)
```

---

## Security Considerations

### API Keys
- ✅ TMDB API key: Hardcoded default (rate limits apply to all users)
- ✅ Gemini API key: User-provided, stored in localStorage
- ✅ Supabase keys: Public anon key for frontend, service role for backend

### Authentication
- ⚠️ No real authentication (username-based only)
- ⚠️ Sessions are open (anyone with code can join)
- ⚠️ No user ownership validation

### Data Privacy
- ✅ All user data stored client-side (localStorage)
- ✅ Session data shared only via backend
- ✅ API keys never leave browser (except to respective APIs)

---

## Performance Optimizations

1. **Movie Loading:**
   - Fetch 20 movies at once
   - Cache in state to avoid re-fetching
   - Prefetch next page when running low

2. **Session Updates:**
   - Only fetch session on swipe (not real-time)
   - Batch preference updates

3. **AI Responses:**
   - 200 token limit on Gemini for faster responses
   - Fallback to mock responses on error

---

## Future Improvements

### Short Term
- [ ] Real-time updates (Supabase Realtime)
- [ ] Better error handling
- [ ] Loading states for all async operations
- [ ] Session expiry/cleanup

### Long Term
- [ ] User authentication (Supabase Auth)
- [ ] Movie trailers
- [ ] Watch provider integration
- [ ] Group chat
- [ ] Movie night scheduling
- [ ] Push notifications for matches
