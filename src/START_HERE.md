# 🎬 START HERE - CineMatch Setup

## 🚨 You're Getting "Failed to Fetch" Errors

This is **expected** and **easy to fix**! Here's what's happening:

### The Problem
Your CineMatch app has all the code ready, but the **backend server** (Supabase Edge Function) needs to be **deployed** before it can work.

Think of it like this:
- ✅ Your frontend (what users see) = Ready
- ✅ Your backend code (in `/supabase/functions/`) = Written
- ❌ Your backend server (on Supabase) = **Not deployed yet**

### The Solution (5 minutes)

Follow this simple checklist:

---

## ✅ Quick Fix (Copy & Paste These Commands)

### Step 1: Install Supabase CLI
```bash
npm install -g supabase
```

### Step 2: Login
```bash
supabase login
```
A browser window will open. Sign in with your Supabase account.

### Step 3: Deploy Your Backend
```bash
supabase functions deploy make-server-ec9c6d6c --project-ref jeknmdvhzzkxenegpgxk
```

### Step 4: Verify It Worked
```bash
curl https://jeknmdvhzzkxenegpgxk.supabase.co/functions/v1/make-server-ec9c6d6c/health
```

**Expected response:** `{"status":"ok"}`

### Step 5: Test Your App
1. Refresh CineMatch in your browser
2. Create a session
3. ✅ It should work now!

---

## 📋 Need More Help?

### If the quick fix doesn't work:
1. **Full deployment guide**: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
2. **Step-by-step with screenshots**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
3. **Troubleshooting**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### Want to understand what happened?
- **Error explanation**: [ERROR_RESOLUTION.md](./ERROR_RESOLUTION.md)
- **Technical details**: [DEPLOYMENT_FIX_SUMMARY.md](./DEPLOYMENT_FIX_SUMMARY.md)

---

## 🎯 What to Expect

### Before Deploying
```
Error creating session: TypeError: Failed to fetch
Error completing preferences: TypeError: Failed to fetch
```

### After Deploying
```
✅ Session created: ABC123
✅ Preferences saved
✅ Matches syncing across devices
```

---

## ⏱️ Time Required

- **First time**: 5-10 minutes
- **After that**: App works instantly, no deployment needed again

---

## 🆘 Common Issues

### "Command not found: supabase"
**Fix**: Install the CLI first
```bash
npm install -g supabase
```

### "Not logged in"
**Fix**: Run the login command
```bash
supabase login
```

### "Still getting errors after deploying"
**Fix**: Verify the health endpoint
```bash
curl https://jeknmdvhzzkxenegpgxk.supabase.co/functions/v1/make-server-ec9c6d6c/health
```

If it doesn't return `{"status":"ok"}`, the deployment failed. Try deploying again.

---

## 📞 Quick Reference

| What You Want | Which Guide |
|---------------|-------------|
| Just fix the errors (fastest) | This page (above) |
| Step-by-step checklist | [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) |
| Detailed explanations | [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) |
| Understand the error | [ERROR_RESOLUTION.md](./ERROR_RESOLUTION.md) |
| Other issues | [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) |

---

## 🎉 After Deployment

Once deployed, you can:
- ✅ Create sessions with friends
- ✅ Swipe on real movies from TMDB
- ✅ Get instant matches
- ✅ Use AI recommendations (with Gemini key)
- ✅ Sync across devices in real-time

**The deployment is a one-time thing. After this, just use the app!**

---

## 💡 Pro Tip

Bookmark this page. If you ever see "Failed to fetch" errors again, come back here and run the deploy command. That's all you need!

---

Ready? **Scroll up and run those 4 commands!** 🚀
