# CineMatch Troubleshooting Guide

Quick reference for common issues and their solutions.

---

## 🚨 "Failed to fetch" / "Cannot connect to server" Error

**Symptom**: Getting errors when trying to create or join sessions.

**Cause**: Supabase Edge Function not deployed.

**Solution**:
```bash
# 1. Install Supabase CLI (if needed)
npm install -g supabase

# 2. Login
supabase login

# 3. Deploy the function
supabase functions deploy make-server-ec9c6d6c --project-ref jeknmdvhzzkxenegpgxk

# 4. Test it's working
curl https://jeknmdvhzzkxenegpgxk.supabase.co/functions/v1/make-server-ec9c6d6c/health
```

**Expected response**: `{"status":"ok"}`

**More info**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## 🔍 "Session not found" Error

**Symptom**: Getting error when trying to join a session with a code.

**Possible Causes**:
1. Session code is incorrect
2. Session creator hasn't finished setting up preferences
3. Backend not deployed

**Solutions**:
1. Double-check the code (it's case-insensitive but must be exact)
2. Wait for the session creator to complete their setup
3. Ensure backend is deployed (see above)

---

## 💔 No Matches Showing Up

**Symptom**: Swiped right on movies but not seeing matches.

**Possible Causes**:
1. Friends haven't swiped on the same movie yet
2. Need to refresh to see latest data
3. Not in the Matches tab

**Solutions**:
1. Wait for friends to swipe (or they swipe on different movies)
2. Refresh the page
3. Click "Matches" in the navigation bar
4. Both users must swipe RIGHT on the same movie

---

## 🤖 AI Not Responding / Generic Responses

**Symptom**: AI chat gives basic or unhelpful responses.

**Cause**: Gemini API key not configured.

**Solution**:
1. Get free API key: https://aistudio.google.com/app/apikey
2. Click ⚙️ Settings in CineMatch
3. Scroll to "Gemini API (AI Chat)" section
4. Paste your API key
5. Click "Save API Keys"

**Note**: Without Gemini key, AI will give basic mock responses.

---

## 🎬 Movies Not Loading

**Symptom**: No movies appearing or stuck on loading screen.

**Possible Causes**:
1. Internet connection issue
2. TMDB API issue (rare)
3. JavaScript error in console

**Solutions**:
1. Check internet connection
2. Refresh the page
3. Check browser console (F12) for errors
4. Clear browser cache and reload
5. TMDB API has fallback mock data, so this is rare

---

## 🔄 Session Not Syncing Across Devices

**Symptom**: Changes not appearing on other devices in the same session.

**Possible Causes**:
1. Backend not deployed
2. Network issue
3. Devices not in the same session

**Solutions**:
1. Ensure backend is deployed
2. Verify all devices are using the same session code
3. Refresh both devices
4. Check internet connectivity on all devices
5. Sessions sync every 5 seconds, so wait a moment

---

## 🚪 Can't Logout / Stuck in Session

**Symptom**: Can't get back to login screen.

**Solution**:
1. Click the logout icon (top-right corner)
2. If that doesn't work, clear browser local storage:
   - Press F12 to open dev tools
   - Go to "Application" or "Storage" tab
   - Find "Local Storage"
   - Delete all "cinematch_*" keys
   - Refresh page

---

## 📱 Mobile Swipe Not Working

**Symptom**: Can't swipe movies on mobile device.

**Solutions**:
1. Try using the ❤️ and ✕ buttons instead
2. Ensure touch events are enabled in browser
3. Try refreshing the page
4. Check if JavaScript is enabled

---

## 🔑 How to Reset Everything

If you want to start completely fresh:

1. **Clear user data**:
   ```javascript
   // In browser console (F12)
   localStorage.clear();
   location.reload();
   ```

2. **Clear session data** (backend):
   - Sessions are stored in Supabase KV store
   - They'll automatically expire over time
   - To manually clear, access Supabase Dashboard

---

## 🔍 Debugging Steps

When something isn't working:

1. **Check browser console** (F12):
   - Look for red error messages
   - Check Network tab for failed requests

2. **Check Supabase function logs**:
   - Go to [Supabase Dashboard](https://supabase.com/dashboard/project/jeknmdvhzzkxenegpgxk/functions)
   - Click on your function
   - View logs for errors

3. **Verify backend health**:
   ```bash
   curl https://jeknmdvhzzkxenegpgxk.supabase.co/functions/v1/make-server-ec9c6d6c/health
   ```

4. **Test in incognito mode**:
   - Rules out cache/extension issues

---

## 📞 Still Need Help?

1. Read the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
2. Check [QUICK_START.md](./QUICK_START.md)
3. Review [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details
4. Look at [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) for testing steps

---

## Common Error Messages & What They Mean

| Error Message | What It Means | Fix |
|--------------|---------------|-----|
| "Failed to fetch" | Backend not deployed | Deploy Supabase function |
| "Session not found" | Invalid code or session expired | Check code, try creating new session |
| "Cannot connect to server" | Backend unreachable | Deploy function + check internet |
| "Failed to create session" | Backend error | Check Supabase logs, redeploy function |
| "Failed to update preferences" | Backend error during swipe | Check backend deployment |
| "Failed to load movies" | TMDB API issue | Refresh page, check API key |

---

## Quick Command Reference

```bash
# Deploy backend
supabase functions deploy make-server-ec9c6d6c --project-ref jeknmdvhzzkxenegpgxk

# Test backend health
curl https://jeknmdvhzzkxenegpgxk.supabase.co/functions/v1/make-server-ec9c6d6c/health

# View function logs
supabase functions logs make-server-ec9c6d6c --project-ref jeknmdvhzzkxenegpgxk

# Local development
supabase start
supabase functions serve make-server-ec9c6d6c
```

---

**Last Updated**: Based on deployment fix implementation
