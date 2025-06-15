# Clerk Production Setup Guide

## The CORS Error You're Seeing

The error `Invalid HTTP Origin header` means your production domain isn't configured in Clerk. Here's how to fix it:

## Step 1: Configure Domains in Clerk Dashboard

1. **Go to your Clerk Dashboard**: https://dashboard.clerk.com
2. **Select your application**
3. **Navigate to "Domains" in the sidebar**
4. **Add your production domains**:
   - `media-get.site`
   - `www.media-get.site`
   - `http://www.media-get.site` (if using HTTP)
   - `https://www.media-get.site` (if using HTTPS)

## Step 2: Check Your Environment Variables

Make sure your production environment has the correct Clerk key:

```bash
# For production, use your LIVE key (not test key)
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_actual_production_key_here
```

## Step 3: Verify Your Deployment Configuration

### For Netlify:
1. Go to Site Settings → Environment Variables
2. Add: `VITE_CLERK_PUBLISHABLE_KEY` with your live key

### For Vercel:
1. Go to Project Settings → Environment Variables
2. Add: `VITE_CLERK_PUBLISHABLE_KEY` with your live key

### For Other Platforms:
Make sure the environment variable is set in your deployment platform.

## Step 4: SSL/HTTPS Configuration

If you're using HTTPS in production, make sure:
1. Your site is properly served over HTTPS
2. Your Clerk domain configuration includes the HTTPS version
3. No mixed content issues (HTTP resources on HTTPS pages)

## Step 5: Test the Configuration

After making these changes:
1. **Redeploy your application**
2. **Clear browser cache**
3. **Test the sign-in functionality**

## Common Issues and Solutions

### Issue: Still getting CORS errors
**Solution**: 
- Double-check domain spelling in Clerk dashboard
- Make sure you're using the correct publishable key (live vs test)
- Verify the domain includes the correct protocol (http/https)

### Issue: Sign-in button not appearing
**Solution**:
- Check browser console for JavaScript errors
- Verify the publishable key is correctly set
- Make sure the key starts with `pk_live_` for production

### Issue: Authentication works locally but not in production
**Solution**:
- Use different Clerk keys for development (pk_test_) and production (pk_live_)
- Configure separate domain lists for each environment

## Debug Steps

1. **Check browser console** for specific error messages
2. **Verify environment variables** are loaded correctly
3. **Test with a simple domain** first (like a subdomain)
4. **Contact Clerk support** if issues persist

## Production Checklist

- [ ] Production domain added to Clerk dashboard
- [ ] HTTPS properly configured
- [ ] Live publishable key set in environment variables
- [ ] Application redeployed after configuration changes
- [ ] Browser cache cleared for testing
- [ ] Sign-in/sign-up flow tested end-to-end

## Your Current Error Analysis

Based on your error:
- **Origin**: `http://www.media-get.site`
- **Clerk subdomain**: `clerk.media-get.site`
- **Issue**: The origin `http://www.media-get.site` is not in your Clerk allowed domains list

**Immediate Fix**: Add `www.media-get.site` to your Clerk domains configuration.