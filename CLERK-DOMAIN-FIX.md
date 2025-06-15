# Clerk Domain Configuration Fix

## Your Current Issue

You're getting CORS errors because your domains aren't properly configured in Clerk. Based on your error logs:

- Request from: `http://media-get.site` (no www)
- Previous request from: `http://www.media-get.site` (with www)
- Both are being rejected by Clerk

## Immediate Fix Steps

### 1. Add ALL Domain Variations to Clerk

Go to your [Clerk Dashboard](https://dashboard.clerk.com) → Your App → **Domains** and add:

```
media-get.site
www.media-get.site
http://media-get.site
http://www.media-get.site
https://media-get.site
https://www.media-get.site
```

### 2. Verify Your Publishable Key

Make sure you're using a **LIVE** key for production:
```
pk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

NOT a test key:
```
pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Check Your Environment Variables

In your deployment platform (Netlify/Vercel/etc.), verify:
```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_actual_key_here
```

### 4. Domain Redirect Configuration

Since you have both `media-get.site` and `www.media-get.site`, you should:

**Option A: Redirect www to non-www**
- Configure your DNS/hosting to redirect `www.media-get.site` → `media-get.site`
- Only add `media-get.site` to Clerk

**Option B: Redirect non-www to www**
- Configure your DNS/hosting to redirect `media-get.site` → `www.media-get.site`
- Only add `www.media-get.site` to Clerk

**Option C: Support both (current approach)**
- Add both domains to Clerk (as listed above)

## Quick Test

After making changes:

1. **Clear browser cache completely**
2. **Hard refresh** (Ctrl+F5 or Cmd+Shift+R)
3. **Try incognito/private browsing**
4. **Check browser console** for any remaining errors

## Debug Commands

Open browser console and run:
```javascript
// Check current origin
console.log('Current origin:', window.location.origin);

// Check if Clerk is loaded
console.log('Clerk loaded:', window.Clerk ? 'Yes' : 'No');

// Check environment variables (in development)
console.log('Clerk key prefix:', import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.substring(0, 8));
```

## Expected Result

After fixing, you should see:
- No CORS errors in browser console
- Sign-in button appears
- Authentication flow works properly

## If Still Not Working

1. **Double-check domain spelling** in Clerk dashboard
2. **Wait 5-10 minutes** for DNS/Clerk changes to propagate
3. **Try a different browser** to rule out caching issues
4. **Check Clerk status page**: https://status.clerk.com/