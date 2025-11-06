# CineMatch Deployment Guide

## Issue: "TypeError: Failed to fetch"

If you're seeing errors like:
- "Error creating session: TypeError: Failed to fetch"
- "Error completing preferences: TypeError: Failed to fetch"

This means the **Supabase Edge Function needs to be deployed**. The backend code exists in your project but hasn't been deployed to Supabase yet.

## Solution: Deploy the Supabase Edge Function

### Prerequisites

1. Install the Supabase CLI:
   ```bash
   # macOS/Linux
   brew install supabase/tap/supabase
   
   # Windows (using Scoop)
   scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
   scoop install supabase
   
   # Or use npm
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

### Deployment Steps

1. **Link your project** (if not already linked):
   ```bash
   supabase link --project-ref jeknmdvhzzkxenegpgxk
   ```

2. **Deploy the Edge Function**:
   ```bash
   supabase functions deploy make-server-ec9c6d6c --project-ref jeknmdvhzzkxenegpgxk
   ```

3. **Verify deployment**:
   - Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/jeknmdvhzzkxenegpgxk/functions)
   - You should see the `make-server-ec9c6d6c` function listed
   - Click on it to see logs and details

4. **Test the deployment**:
   ```bash
   curl https://jeknmdvhzzkxenegpgxk.supabase.co/functions/v1/make-server-ec9c6d6c/health
   ```
   
   You should see: `{"status":"ok"}`

### Alternative: Deploy via Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/jeknmdvhzzkxenegpgxk/functions)
2. Click "Create a new function"
3. Name it: `make-server-ec9c6d6c`
4. Copy the contents of `/supabase/functions/server/index.tsx` and `/supabase/functions/server/kv_store.tsx`
5. Deploy the function

## Troubleshooting

### Function not deploying?

Check that you have the correct directory structure:
```
supabase/
  └── functions/
      └── server/
          ├── index.tsx
          └── kv_store.tsx
```

### Still getting errors after deployment?

1. Check the function logs in the Supabase Dashboard
2. Verify your Supabase project ID matches: `jeknmdvhzzkxenegpgxk`
3. Make sure CORS is enabled (it should be by default in the function)

### Testing locally (optional)

You can test the function locally before deploying:

```bash
# Start local Supabase
supabase start

# Serve the function locally
supabase functions serve make-server-ec9c6d6c

# Update the API_URL in /lib/session-manager.ts to use localhost
# const API_URL = 'http://localhost:54321/functions/v1/make-server-ec9c6d6c';
```

## Next Steps

After deploying the Edge Function:

1. Refresh your CineMatch application
2. Try creating a new session
3. The "Failed to fetch" errors should be resolved
4. Test multi-user functionality by opening the app in multiple browsers

## Support

If you continue to experience issues:
- Check the [Supabase Edge Functions documentation](https://supabase.com/docs/guides/functions)
- Review the function logs in your Supabase Dashboard
- Ensure your Supabase project is active and not paused
