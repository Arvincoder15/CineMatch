# CineMatch - Quick Start Guide 🎬

## What's Working Right Now ✅

1. **Real Movies** - TMDB API is configured, fetching real movies with actual posters
2. **User Sessions** - Create/join sessions with friends (now works across browsers!)
3. **Movie Swiping** - Tinder-style swipe interface with smooth animations
4. **Matching** - When you and friends swipe right on same movie → Instant match!
5. **Genre Preferences** - Personalized movie recommendations based on your taste
6. **AI Chat** - Basic responses work, real AI available with Gemini API key

---

## How to Use CineMatch

### 1️⃣ **Create an Account**
- Enter your username
- Click "Get Started"

### 2️⃣ **Start or Join Session**
- **Create Session** - Start a new session, get a 6-character code
- **Join Session** - Enter a friend's code to join their session

### 3️⃣ **Select Preferences**
- Pick your favorite genres (Action, Comedy, Sci-Fi, etc.)
- Choose your vibe (Chill, Intense, Emotional, etc.)
- These personalize your movie recommendations!

### 4️⃣ **Start Swiping**
- ← Swipe LEFT (or click ✗) = Nope
- → Swipe RIGHT (or click ❤️) = Like
- When you and a friend both like the same movie → **MATCH!** 🎉

### 5️⃣ **View Matches**
- Click "Matches" in navigation
- See all movies you matched with friends
- Perfect for planning movie nights!

### 6️⃣ **Chat with AI**
- Click "AI" in navigation
- Ask for movie recommendations
- Get insights about your taste
- **Pro tip:** Add Gemini API key for smarter responses!

---

## 🔑 Optional: Enable Smart AI Chat

The AI chat works with basic responses, but for truly intelligent, context-aware answers:

### Get Free Gemini API Key (2 minutes)
1. Visit: https://aistudio.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key

### Add to CineMatch
1. Click ⚙️ Settings icon (top navigation)
2. Scroll to "Gemini API (AI Chat)"
3. Paste your API key
4. Click "Save"
5. Done! 🎉

**Free tier:** 60 requests/minute, 1,500/day - plenty for personal use!

---

## 🧪 Test Sessions with Friends

### Option 1: Same Device (Testing)
1. Open CineMatch in normal browser window
2. Create session → Get code (e.g., "ABC123")
3. Open incognito/private window
4. Join session with code "ABC123"
5. Swipe in both windows → See matches!

### Option 2: Different Devices (Real Use)
1. You: Create session on your phone/laptop
2. Share the code with friends (text, Discord, etc.)
3. Friends: Enter code on their devices
4. Everyone swipes → Find common movies! 🍿

---

## 📱 Navigation

- **🎬 Swipe** - Main swiping interface
- **🤖 AI** - Chat with AI assistant, view recommendations & insights
- **❤️ Matches** - See all movies you matched with friends
- **⚙️ Settings** - Configure API keys (TMDB, Gemini)
- **🚪 Logout** - Exit current session (top-right corner)

---

## 💡 Pro Tips

1. **Genre Preferences Matter** - The more specific your genre choices, the better your recommendations
2. **Swipe at the Same Time** - More fun when everyone is online swiping together!
3. **Check Matches Often** - New matches appear as friends swipe
4. **Use AI for Recommendations** - Ask "What should I watch next?" for personalized suggestions
5. **Session Codes Never Expire** - You can always rejoin with the same code

---

## 🎯 Example AI Questions

Once you have Gemini configured, try asking:

- "Recommend a movie for Friday night"
- "What do my movie choices say about me?"
- "I'm in the mood for something like Inception"
- "What genres do I like the most?"
- "Suggest a movie my friends and I will all enjoy"

---

## 🐛 Troubleshooting

### "Failed to fetch" or "Cannot connect to server" errors
- **IMPORTANT:** The Supabase Edge Function needs to be deployed first!
- See [DEPLOYMENT_GUIDE.md](/DEPLOYMENT_GUIDE.md) for step-by-step instructions
- Quick fix: Run `supabase functions deploy make-server-ec9c6d6c`
- Without deployment, session creation/joining won't work

### "Session not found" error
- ✅ **Fixed!** Sessions now work across browsers
- Double-check the code (case-insensitive, but must be exact)
- Make sure session creator has completed preferences
- Ensure the Supabase Edge Function is deployed (see above)

### No matches showing
- Both users must swipe right on the same movie
- Try refreshing the page to see latest matches
- Check the "Matches" tab in navigation

### AI not responding well
- Add Gemini API key for better responses (see above)
- Without Gemini, you get basic mock responses

### Movies not loading
- TMDB API is pre-configured, should work automatically
- Check internet connection
- Refresh page

---

## 🎉 Ready to Start!

That's it! CineMatch is ready to use. Create a session, invite friends, and find your perfect movie together!

**Questions?** Check `/CHANGES.md` for technical details about what's been implemented.
