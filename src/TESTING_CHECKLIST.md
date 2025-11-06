# CineMatch - Testing Checklist ✅

Use this checklist to verify everything is working correctly.

---

## 🎬 Core Features

### ✅ TMDB Integration (Real Movies)
- [ ] Movies load with real posters (not placeholder images)
- [ ] Movie titles, ratings, and descriptions are accurate
- [ ] Genre filtering works based on user preferences
- [ ] Settings shows "Using Default API Key - Real Data Active"

### ✅ Session Management (Fixed!)
**Test with 2 browsers:**

**Browser 1 (Chrome):**
- [ ] Create account with username (e.g., "Alice")
- [ ] Click "Create Session"
- [ ] Select genres and vibe
- [ ] Note the 6-character session code (e.g., "ABC123")
- [ ] Click "Start Swiping"

**Browser 2 (Firefox/Incognito):**
- [ ] Create account with different username (e.g., "Bob")
- [ ] Click "Join Session"
- [ ] Enter the session code from Browser 1
- [ ] Should see "Session joined successfully" or similar
- [ ] Select genres and vibe
- [ ] Click "Start Swiping"

**Verify Session:**
- [ ] Both browsers show session code in header
- [ ] Session member count shows "2 members" (or similar)
- [ ] No "Session not found" errors

### ✅ Matching System
**Continue from session test above:**

**Browser 1:**
- [ ] Swipe RIGHT (like) on a movie (e.g., first movie)

**Browser 2:**
- [ ] Swipe through movies until you find the same movie
- [ ] Swipe RIGHT (like) on that same movie
- [ ] Should see match modal/notification! 🎉

**Both Browsers:**
- [ ] Click "Matches" tab
- [ ] Should see the matched movie
- [ ] Shows both usernames who matched

### ✅ Movie Swiping
- [ ] Left swipe or ✗ button = Nope (card flies left)
- [ ] Right swipe or ❤️ button = Like (card flies right)
- [ ] Smooth animations
- [ ] LIKE/NOPE text appears during swipe
- [ ] Counter shows remaining movies

---

## 🤖 AI Features

### ✅ AI Chat (Basic - No API Key)
- [ ] Click "AI" tab
- [ ] Type "recommend a movie" and send
- [ ] Should get a basic response (not super smart, but works)
- [ ] Ask about taste/preferences
- [ ] Gets response based on liked movies

### ✅ AI Chat (Smart - With Gemini API Key)

**Setup Gemini:**
- [ ] Click ⚙️ Settings
- [ ] Scroll to "Gemini API (AI Chat)" section
- [ ] Shows yellow dot (not configured)
- [ ] Visit https://aistudio.google.com/app/apikey
- [ ] Create API key
- [ ] Paste in CineMatch settings
- [ ] Click "Save"
- [ ] Should see green checkmark ✅

**Test Smart AI:**
- [ ] Click "AI" tab
- [ ] Should see "Powered by Gemini" badge
- [ ] Ask "What should I watch tonight?"
- [ ] Response should be intelligent and contextual
- [ ] Ask about specific movies
- [ ] Gets detailed, personalized responses

### ✅ AI Insights
- [ ] Click "AI" tab → "Insights" section
- [ ] Shows personality type (e.g., "The Visionary")
- [ ] Shows top genres
- [ ] Shows watching style
- [ ] Updates as you swipe more movies

### ✅ AI Recommendations
- [ ] Click "AI" tab → "Recommendations" section
- [ ] Shows 3 recommended movies
- [ ] Each has a reason why it's recommended
- [ ] Confidence score shown
- [ ] Based on your liked movies

---

## ⚙️ Settings

### ✅ TMDB API Settings
- [ ] Click ⚙️ Settings
- [ ] "TMDB API (Movies)" section shows green dot
- [ ] Says "Real movie data is active!"
- [ ] Optional field to add custom TMDB key
- [ ] Collapsible instructions visible

### ✅ Gemini API Settings
- [ ] "Gemini API (AI Chat)" section visible
- [ ] Shows status (green if configured, yellow if not)
- [ ] Input field for API key
- [ ] Link to Google AI Studio works
- [ ] Instructions collapsible/expandable
- [ ] Shows free tier info (60 req/min, 1500/day)

---

## 🎨 UI/UX

### ✅ Navigation
- [ ] Header shows CineMatch logo
- [ ] Navigation buttons work: Swipe, AI, Matches
- [ ] Settings icon in top-right
- [ ] Logout button in top-right corner
- [ ] Active tab highlighted

### ✅ Responsive Design
- [ ] Works on desktop (1920x1080)
- [ ] Works on tablet (768px width)
- [ ] Works on mobile (375px width)
- [ ] Touch swipe works on mobile
- [ ] All text readable on small screens

### ✅ Welcome Flow
- [ ] Login screen shows CineMatch logo
- [ ] Subtitle mentions "real TMDB data & movie posters"
- [ ] Username input works
- [ ] "Get Started" button enabled when username entered
- [ ] Transitions to session setup

### ✅ Session Setup
- [ ] Two big buttons: "Create Session" and "Join Session"
- [ ] Join session shows input for code
- [ ] Code input accepts 6 characters
- [ ] Error message if code not found
- [ ] Success when valid code entered

### ✅ Genre Preferences
- [ ] Shows 12 genre options with emojis
- [ ] Multi-select works (can pick multiple)
- [ ] Selected genres highlighted
- [ ] 5 vibe options shown
- [ ] Single-select for vibe
- [ ] "Continue" button disabled until selections made
- [ ] Shows session code if joining

### ✅ Session View
- [ ] Shows session code prominently
- [ ] Shows member count
- [ ] Lists all members in session
- [ ] "Start Swiping" button works
- [ ] Share code feature (optional)

---

## 🐛 Error Handling

### ✅ Network Errors
- [ ] If backend offline → Shows error message
- [ ] Failed to create session → Toast notification
- [ ] Failed to join session → "Session not found" error
- [ ] Movies fail to load → Falls back to mock data

### ✅ User Errors
- [ ] Empty session code → Error message
- [ ] Invalid session code → "Session not found"
- [ ] No genres selected → Button disabled
- [ ] No vibe selected → Button disabled

---

## 🔄 Data Persistence

### ✅ localStorage
- [ ] Refresh page → Still logged in
- [ ] Refresh page → Still in session
- [ ] Close and reopen browser → Session persists
- [ ] Logout → Clears all data

### ✅ Backend (Supabase)
- [ ] Session created → Stored in database
- [ ] Join session → User added to session
- [ ] Swipe right → Preferences updated in database
- [ ] Refresh → Session data reloads from backend

---

## 📊 Results Summary

Total Tests: **50+**

Fill in as you test:
- ✅ Passed: ____
- ❌ Failed: ____
- ⚠️ Partial: ____

---

## 🚨 Known Limitations

1. **No Real-Time Updates** - Need to refresh to see friends joining or swiping
   - *Potential Fix:* Add Supabase Realtime subscriptions
   
2. **Session Expiry** - Sessions never expire
   - *Potential Fix:* Add TTL or cleanup job

3. **No Session Validation** - Can join with any username
   - *Potential Fix:* Add username uniqueness check per session

4. **Limited Error Messages** - Some errors just log to console
   - *Potential Fix:* Add more user-facing error messages

---

## ✅ All Core Features Working?

If you checked most boxes above, CineMatch is working correctly! 🎉

**Session joining** and **AI chat** are the two main features that were just fixed.

---

## 📝 Notes

- Test sessions with actual different browsers, not just tabs
- Gemini API is optional - basic AI works without it
- TMDB API is pre-configured, no setup needed
- All API keys stored in browser, not server
