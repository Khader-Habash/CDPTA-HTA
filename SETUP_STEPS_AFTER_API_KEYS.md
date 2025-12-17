# Step-by-Step Setup Guide: After Getting API Keys

## ✅ Step 1: Add Environment Variables

### For Local Development:

1. **Create or update `.env` file** in your project root directory (`C:\Users\Home\CDPTA 3\.env`)

2. **Add your Supabase credentials:**
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1pZCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQwOTk5OTk5LCJleHAiOjE5NTY1NzU5OTl9.your-anon-key-here
   ```

   **Replace:**
   - `https://your-project-id.supabase.co` with your actual **Project URL**
   - `eyJhbG...` with your actual **anon public** key

3. **Save the file**

4. **Restart your development server:**
   ```bash
   # Stop the current server (Ctrl+C)
   # Then start again
   npm run dev
   ```

   **Important:** Environment variables are only loaded when the server starts, so you MUST restart!

---

### For Production (Vercel):

1. Go to your Vercel dashboard: https://vercel.com
2. Select your project (`cdpta-3`)
3. Go to **Settings** → **Environment Variables**
4. Click **"Add New"**
5. Add two variables:

   **Variable 1:**
   - **Key:** `VITE_SUPABASE_URL`
   - **Value:** Your Supabase Project URL
   - **Environments:** Production, Preview, Development (check all)
   - Click **Save**

   **Variable 2:**
   - **Key:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** Your Supabase anon key
   - **Environments:** Production, Preview, Development (check all)
   - Click **Save**

6. **Redeploy your project:**
   - Go to **Deployments** tab
   - Click **"..."** on the latest deployment
   - Click **"Redeploy"**
   - Or push a new commit to trigger automatic deployment

---

## ✅ Step 2: Run Database Schema

1. **Open Supabase Dashboard:**
   - Go to https://app.supabase.com
   - Select your project

2. **Open SQL Editor:**
   - Click **"SQL Editor"** in the left sidebar
   - Click **"New query"**

3. **Copy the schema:**
   - Open `supabase-schema.sql` from your project root
   - Select all (Ctrl+A) and copy (Ctrl+C)
   - The file should be at: `C:\Users\Home\CDPTA 3\supabase-schema.sql`

4. **Paste and run:**
   - Paste the entire schema into the SQL Editor
   - Click **"Run"** button (or press Ctrl+Enter / Cmd+Enter)
   - Wait for execution to complete

5. **Verify success:**
   - You should see: **"Success. No rows returned"** or similar success message
   - If you see errors, check the error message and fix any issues

6. **Verify tables were created:**
   - Click **"Table Editor"** in the left sidebar
   - You should see these tables:
     - ✅ `users`
     - ✅ `announcements`
     - ✅ `applications`
     - ✅ `courses`
     - ✅ `assignments`
     - ✅ `quizzes`

---

## ✅ Step 3: Verify Configuration

### Check if Supabase is Connected:

1. **Open your app in the browser** (http://localhost:5173 or your dev URL)

2. **Open Browser Console** (F12 → Console tab)

3. **Check for Supabase connection:**
   - Look for messages like: `✅ Loaded users from Supabase`
   - If you see `🔵 Loading users from localStorage`, Supabase is not configured correctly

4. **Test user registration:**
   - Go to `/register`
   - Create a test user
   - Check browser console for: `✅ User registered successfully in Supabase`
   - Go to Supabase Dashboard → **Authentication** → **Users** - you should see the new user

---

## ✅ Step 4: (Optional) Migrate Existing Users

If you have existing users in localStorage that you want to migrate:

### Option A: Use Browser Console (Quick Test)

1. Open browser console (F12)
2. Run this code:

```javascript
// Import the migration function
import { migrateUsersToSupabase } from '/src/utils/migrateUsersToSupabase.js';

// Check if migration is needed first
const { checkMigrationNeeded } = await import('/src/utils/migrateUsersToSupabase.js');
const status = await checkMigrationNeeded();
console.log('Migration status:', status);

// Run migration
if (status.needed) {
  const result = await migrateUsersToSupabase();
  console.log('Migration result:', result);
}
```

### Option B: Create Migration Page (Recommended)

I can create a migration page in the admin panel for you. Would you like me to do that?

---

## ✅ Step 5: Test Everything

### Test 1: User Registration
1. Go to `/register`
2. Fill out the form and submit
3. **Check:**
   - Browser console: Should show `✅ User registered successfully in Supabase`
   - Supabase Dashboard → **Authentication** → **Users**: New user should appear
   - Supabase Dashboard → **Table Editor** → **users**: User record should exist

### Test 2: Login
1. Logout (if logged in)
2. Go to `/login`
3. Login with the user you just created
4. **Check:**
   - Should login successfully
   - Browser console: Should show `✅ Login successful via Supabase`

### Test 3: Cross-Browser Sync
1. Create a user in **Chrome**
2. Open the app in **Firefox** (or another browser)
3. Try to login with the same user
4. **Should work!** (This is the whole point of Supabase)

### Test 4: Admin User Management
1. Login as admin (`abeer@gmail.com` / `password123`)
2. Go to **Admin Dashboard** → **User Management**
3. Try creating a new user
4. **Check:** User should appear in Supabase Dashboard

---

## 🔍 Troubleshooting

### Issue: "Supabase is not configured"
**Solution:**
- Check `.env` file exists and has correct variables
- Restart dev server after adding environment variables
- Check variable names: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (must start with `VITE_`)
- Check there are no extra spaces or quotes around values

### Issue: "Failed to fetch" or Network Errors
**Solution:**
- Verify your Supabase URL is correct (no trailing slash)
- Check your Supabase project is active (not paused)
- Check browser console for detailed error messages
- Verify API key is the `anon public` key (not the `service_role` key)

### Issue: Users not appearing in Supabase
**Solution:**
- Check browser console for errors
- Verify database schema was run successfully
- Check `users` table exists in Supabase Table Editor
- Try creating a new user to test

### Issue: Can't login with migrated users
**Solution:**
- Migration sets default password `password123` if password not found
- Try logging in with `password123`
- Or reset password in Supabase Dashboard → Authentication → Users

### Issue: Schema errors when running SQL
**Solution:**
- Make sure you're running the entire schema file
- Check if tables already exist (you can drop them first if needed)
- Look at the specific error message in Supabase SQL Editor
- Common issues: Missing extensions, duplicate table names

---

## 📋 Quick Checklist

- [ ] Added `VITE_SUPABASE_URL` to `.env` file
- [ ] Added `VITE_SUPABASE_ANON_KEY` to `.env` file
- [ ] Restarted dev server
- [ ] Ran `supabase-schema.sql` in Supabase SQL Editor
- [ ] Verified tables exist in Supabase Table Editor
- [ ] Tested user registration (creates in Supabase)
- [ ] Tested login (works with Supabase)
- [ ] (Optional) Migrated existing users
- [ ] (If deploying) Added environment variables to Vercel
- [ ] (If deploying) Redeployed to Vercel

---

## 🎉 Success Indicators

You'll know everything is working when:

1. ✅ Browser console shows: `✅ Loaded users from Supabase`
2. ✅ Users appear in Supabase Dashboard → Authentication → Users
3. ✅ Users appear in Supabase Dashboard → Table Editor → users
4. ✅ Login works across different browsers
5. ✅ New user registrations create records in Supabase

---

**Need help?** If you encounter any issues, check the browser console for error messages and let me know what you see!




