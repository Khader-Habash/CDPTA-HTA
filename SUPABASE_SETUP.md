# Supabase Setup Guide for CDPTA Platform

This guide will help you set up Supabase for real-time cross-device synchronization.

## Overview

The CDPTA platform now supports real-time synchronization across devices using Supabase. This enables:

- **Real-time announcements** - Announcements created by admins appear instantly on all devices
- **User management** - Admin controls for activating/deactivating users and resetting passwords
- **Application tracking** - Applications submitted on one device appear immediately in admin dashboards
- **Course sync** - Courses, assignments, and quizzes sync in real-time

## Features

### With Supabase Configured:
✅ Real-time updates across all devices  
✅ Persistent data storage in PostgreSQL  
✅ Row-level security policies  
✅ Admin user controls (activate/deactivate, password reset)  
✅ Scalable to thousands of users  

### Without Supabase (Fallback Mode):
⚠️ Data stored in localStorage (per-device only)  
⚠️ Polling updates every 5 seconds  
⚠️ Password reset not available  
⚠️ Limited to single-device use  

---

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in (or create a free account)
2. Click **"New Project"**
3. Fill in the details:
   - **Name**: `cdpta-platform`
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest to your users
   - **Pricing Plan**: Free tier is sufficient for testing
4. Click **"Create new project"** and wait 1-2 minutes for setup

---

## Step 2: Run the Database Schema

1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Open the file `supabase-schema.sql` from your project root
3. Copy the entire contents
4. Paste into the Supabase SQL Editor
5. Click **"Run"** (or press Ctrl/Cmd + Enter)
6. You should see: **"Success. No rows returned"**

This creates all tables, indexes, security policies, and enables realtime subscriptions.

---

## Step 3: Get Your API Keys

1. In Supabase, go to **"Project Settings"** (gear icon in left sidebar)
2. Click **"API"** in the settings menu
3. You'll see:
   - **Project URL** (e.g., `https://abcdefghijk.supabase.co`)
   - **anon public** key (starts with `eyJhbG...`)

---

## Step 4: Configure Environment Variables

### Local Development:

1. Create a `.env` file in your project root (if it doesn't exist):
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. Restart your dev server:
   ```bash
   npm run dev
   ```

### Vercel Deployment:

1. Go to your Vercel dashboard
2. Select your project (`cdpta-3`)
3. Go to **Settings** → **Environment Variables**
4. Add two variables:
   - **Name**: `VITE_SUPABASE_URL`  
     **Value**: Your Supabase Project URL
   - **Name**: `VITE_SUPABASE_ANON_KEY`  
     **Value**: Your Supabase anon key
5. Click **"Save"**
6. Redeploy your project (or push a new commit)

---

## Step 5: Verify Everything Works

### Test Real-time Announcements:
1. Log in as **Admin** on Device 1 (`admin@example.com` / `password123`)
2. Go to **Admin Dashboard** → **Manage Announcements**
3. Create a new announcement
4. On Device 2 (or another browser), open the **Home Page**
5. The new announcement should appear **instantly** without refreshing

### Test User Management:
1. As Admin, go to **User Management**
2. Click the **Key icon** next to any user to reset their password
3. Click the **Ban/CheckCircle icon** to activate/deactivate users
4. Try creating a new user with the **Create User** button

### Test Cross-Device Application Sync:
1. On Device 1, log in as **Applicant** (`applicant@example.com` / `password123`)
2. Submit an application
3. On Device 2, log in as **Admin**
4. Go to **Application Review** - the new application should appear immediately

---

## Troubleshooting

### "Realtime not configured" in console
- Check that your `.env` file has the correct `VITE_` prefix
- Restart your dev server after adding environment variables
- Verify the Supabase URL and key are correct

### "Failed to fetch" or network errors
- Check your Supabase project is active (not paused)
- Verify your API URL is correct (no trailing slashes)
- Check browser console for detailed error messages

### Data not syncing
- Open browser DevTools → Console
- Look for "Realtime update" messages
- If you see "polling fallback", Supabase isn't connected
- Check environment variables are set correctly

### Password reset not working
- Password reset requires Supabase Auth
- In fallback mode (localStorage), password reset will show an error
- Ensure you've run the database schema SQL

---

## Security Notes

- ✅ **Row-level security** is enabled on all tables
- ✅ **Admins** can manage all data
- ✅ **Users** can only modify their own records
- ✅ **Applicants** can only see their own applications
- ✅ API keys are safe to expose in client-side code (they're "anon" keys)
- ⚠️ Never commit real `.env` files to Git

---

## Cost Estimate (Supabase Free Tier)

| Feature | Free Tier Limit |
|---------|----------------|
| Database Storage | 500 MB |
| Bandwidth | 5 GB/month |
| Realtime Connections | 200 concurrent |
| Auth Users | 50,000 monthly active |

**This is sufficient for:**
- 100-500 users
- ~10,000 announcements
- ~5,000 applications
- Unlimited courses/quizzes

For larger deployments, consider Supabase Pro ($25/month).

---

## Next Steps

1. **Test locally** - Verify realtime updates work on `localhost`
2. **Deploy to Vercel** - Add environment variables and redeploy
3. **Invite users** - Create accounts for preceptors and fellows
4. **Monitor usage** - Check Supabase dashboard for usage stats

---

## Support

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Vercel Env Vars**: [vercel.com/docs/environment-variables](https://vercel.com/docs/environment-variables)
- **GitHub Issues**: Open an issue in your repository

---

## Optional: Disable Supabase (Use LocalStorage Only)

If you prefer to keep using localStorage without Supabase:

1. Don't set the environment variables
2. The app will automatically fall back to localStorage + polling
3. All features work, but without cross-device sync

---

**Happy Coding! 🚀**





