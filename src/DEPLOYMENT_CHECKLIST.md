# 🚀 Deployment Checklist

Quick checklist to get CineMatch working and fix the "Failed to fetch" errors.

---

## ✅ Step-by-Step Deployment

### 1. Prerequisites

- [ ] Node.js installed (for npm)
- [ ] Terminal/command line access
- [ ] Internet connection

### 2. Install Supabase CLI

Choose one method:

**Option A: Using npm (Recommended)**
```bash
npm install -g supabase
```

**Option B: Using Homebrew (macOS/Linux)**
```bash
brew install supabase/tap/supabase
```

**Option C: Using Scoop (Windows)**
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

- [ ] Supabase CLI installed
- [ ] Verify with: `supabase --version`

### 3. Login to Supabase

```bash
supabase login
```

- [ ] Logged in successfully
- [ ] Browser opened for authentication

### 4. Deploy the Edge Function

```bash
supabase functions deploy make-server-ec9c6d6c --project-ref jeknmdvhzzkxenegpgxk
```

- [ ] Deployment started
- [ ] No errors during deployment
- [ ] Function deployed successfully

### 5. Verify Deployment

**Test the health endpoint:**
```bash
curl https://jeknmdvhzzkxenegpgxk.supabase.co/functions/v1/make-server-ec9c6d6c/health
```

- [ ] Command returns: `{"status":"ok"}`
- [ ] No timeout or connection errors

**Check Supabase Dashboard:**
1. Go to: https://supabase.com/dashboard/project/jeknmdvhzzkxenegpgxk/functions
2. Look for `make-server-ec9c6d6c` function
3. Click on it to see logs

- [ ] Function appears in dashboard
- [ ] Function status is "Active"
- [ ] Logs are visible

### 6. Test the Application

**Test 1: Create Session**
- [ ] Open CineMatch in browser
- [ ] Enter username
- [ ] Click "Create Session"
- [ ] ✅ Receive 6-character session code (no error)

**Test 2: Join Session**
- [ ] Open incognito/private window
- [ ] Enter different username  
- [ ] Enter the session code from Test 1
- [ ] Click "Join Session"
- [ ] ✅ Successfully joins (no error)

**Test 3: Set Preferences**
- [ ] Select at least one genre
- [ ] Select a vibe
- [ ] Click "Continue to Movies"
- [ ] ✅ Proceeds to session view (no error)

**Test 4: Real-time Sync**
- [ ] Click "Start Swiping" in both windows
- [ ] Swipe right on same movie in both windows
- [ ] ✅ See "It's a Match!" modal
- [ ] ✅ Match appears in "Matches" tab

### 7. Final Verification

- [ ] No "Failed to fetch" errors
- [ ] No red warning banners
- [ ] Sessions persist across page refreshes
- [ ] Matches sync across devices

---

## 🐛 Troubleshooting Checklist

If something isn't working:

- [ ] Check internet connection
- [ ] Verify Supabase project ID: `jeknmdvhzzkxenegpgxk`
- [ ] Confirm function name: `make-server-ec9c6d6c`
- [ ] Check browser console for errors (F12)
- [ ] Review Supabase function logs
- [ ] Try redeploying: `supabase functions deploy make-server-ec9c6d6c --project-ref jeknmdvhzzkxenegpgxk`
- [ ] Clear browser cache and local storage
- [ ] Test in incognito mode

---

## 📋 Common Issues

### Issue: "Command not found: supabase"
**Fix**: Supabase CLI not installed properly
```bash
npm install -g supabase
```

### Issue: "Not logged in"
**Fix**: Run login command
```bash
supabase login
```

### Issue: "Project not found"
**Fix**: Verify project reference
```bash
supabase functions deploy make-server-ec9c6d6c --project-ref jeknmdvhzzkxenegpgxk
```

### Issue: Still getting "Failed to fetch"
**Fix**: Check health endpoint
```bash
curl https://jeknmdvhzzkxenegpgxk.supabase.co/functions/v1/make-server-ec9c6d6c/health
```

If it returns an error, function didn't deploy properly. Try redeploying.

---

## 📚 Documentation Reference

- **Detailed deployment**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Error explanations**: [ERROR_RESOLUTION.md](./ERROR_RESOLUTION.md)
- **All issues**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **Technical details**: [DEPLOYMENT_FIX_SUMMARY.md](./DEPLOYMENT_FIX_SUMMARY.md)

---

## 🎯 Success Criteria

You know everything is working when:

✅ No error messages when creating sessions  
✅ Friends can join from different devices  
✅ Swipes sync in real-time (within 5 seconds)  
✅ Matches appear for both users  
✅ Health endpoint returns `{"status":"ok"}`  
✅ Supabase dashboard shows active function  

---

## ⏱️ Estimated Time

- **First-time setup**: 5-10 minutes
- **Deployment only**: 2-3 minutes
- **Verification**: 2-3 minutes

**Total**: ~10-15 minutes for complete setup

---

## 🎉 You're Done!

Once all boxes are checked, CineMatch is fully deployed and ready to use!

Share the app with friends and start matching movies! 🍿
