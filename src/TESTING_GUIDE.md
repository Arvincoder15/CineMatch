# CineMatch Testing Guide

## Recent Fixes

### 1. Google Gemini API Integration ✅

**What was fixed:**
- Fixed the API key storage mechanism (was using an actual API key as the storage key name)
- Added better error logging for debugging API issues
- Improved UI feedback to show when Gemini is active vs using fallback responses
- Added automatic polling to detect when API key is added via settings

**How to test:**
1. Open the app and navigate to the AI chat section
2. Without a Gemini API key, you should see "Ask me about movies" subtitle
3. Click the Settings icon (⚙️) in the header
4. Click "📖 How to get Gemini API Key" to expand the instructions
5. Visit https://aistudio.google.com/app/apikey
6. Create a free API key (requires Google account)
7. Copy and paste the key in the "Google Gemini API Key" field
8. Click Save
9. The AI chat should now show "Powered by Gemini" badge
10. Ask questions like:
    - "What kind of movies do I like?"
    - "Recommend me some action movies"
    - "Tell me about my taste"
11. You should get intelligent, personalized responses from Gemini AI

**Expected behavior:**
- With API key: Smart, contextual responses from Google Gemini
- Without API key: Basic fallback responses (still functional)
- Console logs show detailed API responses for debugging

---

### 2. Multi-Device Session Management with Supabase ✅

**What was fixed:**
- Sessions are now stored in Supabase database (persistent across devices)
- Added real-time polling to sync session data across different browsers/devices
- SessionView now polls every 3 seconds to show new members joining
- Main app polls every 5 seconds while swiping to sync matches in real-time
- Added toast notifications when new users join a session

**How to test:**

#### Test 1: Create and Join from Same Device
1. Open the app in one browser tab (e.g., Chrome)
2. Create an account with username "Alice"
3. Click "Create Session"
4. Select genre preferences (e.g., Action, Sci-Fi)
5. Choose a vibe (e.g., "Epic Adventures")
6. Click "Continue"
7. **Copy the 6-character session code** (e.g., "ABC123")
8. Open the app in a NEW INCOGNITO/PRIVATE window
9. Create account with username "Bob"
10. Click "Join Session" tab
11. Enter the session code from step 7
12. Click "Join Session"
13. Select genre preferences for Bob
14. Click "Continue"

**Expected behavior:**
- Both Alice and Bob should see each other in the session members list
- When Bob joins, Alice should see a toast notification: "Bob joined the session!"
- Both users can click "Start Swiping" and begin independently

#### Test 2: Cross-Device Session (Real Multi-Device Test)
1. On Device 1 (e.g., your laptop):
   - Open the app
   - Create account as "Alice"
   - Create a session
   - Note the session code

2. On Device 2 (e.g., your phone or another computer):
   - Open the app
   - Create account as "Bob"
   - Join the session using Alice's code

3. Both devices should show both users in the session

#### Test 3: Real-Time Match Detection
1. Continue from Test 1 or Test 2 with both users in a session
2. Both Alice and Bob start swiping
3. Have both users swipe RIGHT ❤️ on the same movie
4. The second person to swipe right should see:
   - A match modal popup
   - A toast notification: "You matched with [username]!"
5. Go to the "Matches" tab
6. Both users should see the matched movie with both usernames

**Expected behavior:**
- Matches appear in real-time (within 5 seconds due to polling)
- Match modal shows the movie poster and friend's name
- Matches view shows all matched movies with list of users who liked them

#### Test 4: Multiple Simultaneous Sessions
1. Create Session A with Alice
2. Create Session B with Charlie (in different browser/device)
3. Have Bob join Session A
4. Have Dave join Session B
5. Both sessions should operate independently
6. Matches in Session A don't affect Session B

**Expected behavior:**
- Sessions are completely isolated
- Each session maintains its own user list and preferences
- No cross-contamination between sessions

---

## Troubleshooting

### Gemini API Issues

**Problem:** AI chat not responding or using fallback responses
- Check browser console (F12) for error messages
- Verify API key is saved (Settings → check for green checkmark)
- Make sure you copied the entire API key (starts with "AIza...")
- Check your Google Cloud API quota at https://console.cloud.google.com/

**Problem:** "Invalid API key" error
- Generate a new key at https://aistudio.google.com/app/apikey
- Make sure to enable the Generative AI API
- Try clearing localStorage and re-entering the key

### Session Management Issues

**Problem:** Session not found when joining
- Verify the 6-character code is correct (case-insensitive)
- Session may have expired (Supabase has data retention policies)
- Check browser console for network errors
- Verify Supabase connection is working (check `/health` endpoint)

**Problem:** New users not appearing in session
- Wait up to 3 seconds (polling interval)
- Check browser console for polling errors
- Refresh the page to force a session sync
- Verify both users have internet connection

**Problem:** Matches not syncing between devices
- Matches sync every 5 seconds while in the app
- Make sure both users are actively in the app
- Check that both users liked the same movie
- Verify session preferences are updating (check network tab)

---

## Technical Details

### API Endpoints

**Supabase Edge Functions:**
- `POST /sessions/create` - Create a new session
- `POST /sessions/join` - Join an existing session
- `GET /sessions/:code` - Get session details
- `POST /sessions/:code/preferences` - Update user preferences

**Gemini AI:**
- Uses `gemini-pro` model
- Free tier: 60 requests/minute, 1500/day
- API URL: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`

### Data Flow

1. User creates/joins session → Supabase stores session data
2. User swipes on movies → Preferences updated in Supabase
3. Background polling every 3-5 seconds → Syncs data across devices
4. Match detection → Client-side comparison of preferences
5. Match found → Modal shown + toast notification

### Storage

- **localStorage:**
  - `cinematch_current_user` - Current user data
  - `cinematch_current_session` - Current session code
  - `cinematch_gemini_api_key` - Gemini API key

- **Supabase KV Store:**
  - `session:{CODE}` - Session data with users and preferences
  - Automatically synced across all devices

---

## Known Limitations

1. **Polling Interval:** Changes may take up to 5 seconds to sync
   - Could be improved with WebSocket/real-time subscriptions
   
2. **Session Persistence:** Sessions persist in Supabase but no cleanup mechanism
   - Old sessions accumulate (could add expiration logic)
   
3. **API Rate Limits:** Gemini free tier has limits
   - 60 requests/minute should be sufficient for personal use
   
4. **Concurrent Swipes:** If users swipe at exact same time
   - Minor race condition possible (polling resolves within 5 seconds)

---

## Success Criteria

✅ **Gemini AI Working:**
- Badge shows "Powered by Gemini"
- Responses are contextual and intelligent
- Console shows successful API responses

✅ **Multi-Device Sessions Working:**
- Users on different devices can join same session
- Session members list updates automatically
- Matches sync across all devices
- Toast notifications appear when users join

✅ **Overall App Working:**
- Can create account and session
- Can join session with code
- Can swipe on movies
- Matches detected and displayed
- AI chat provides recommendations
