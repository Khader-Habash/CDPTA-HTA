# Fix: CORS Errors Blocking Supabase

## 🔍 The Problem

You're seeing:
```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading 
the remote resource at https://hyuigdjzxiqnrqfppmgm.supabase.co/rest/v1/applications
```

This is blocking **all Supabase requests**, not just real-time!

---

## ✅ Solutions

### Solution 1: Verify Environment Variables

**Check your `.env` file has the correct values:**

```env
VITE_SUPABASE_URL=https://hyuigdjzxiqnrqfppmgm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important:**
- URL must start with `https://` (not `http://`)
- No trailing slash
- Key must be the full anon key from Supabase

**After changing `.env`:**
- Restart dev server: Stop (Ctrl+C) and run `npm run dev` again

---

### Solution 2: Check Supabase Project Settings

**CORS should be handled automatically, but verify:**

1. **Go to**: https://app.supabase.com
2. **Select your project**
3. **Settings** → **API**
4. **Check "Enable CORS"** is on (usually automatic)

---

### Solution 3: Disable RLS Temporarily (Test)

**CORS errors might actually be RLS blocking requests:**

Run this in Supabase SQL Editor:

```sql
-- Temporarily disable RLS to test if CORS is the real issue
ALTER TABLE public.applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements DISABLE ROW LEVEL SECURITY;
```

**Then test again:**
- If CORS errors disappear → It's an RLS/auth issue, not CORS
- If CORS errors remain → It's a real CORS issue

---

### Solution 4: Check Network/Firewall

**Your network might be blocking requests:**

1. **Try different network** (mobile hotspot)
2. **Check if corporate firewall** is blocking
3. **Try incognito/private mode** (disable extensions)

---

### Solution 5: Verify Supabase Project is Active

**Check project status:**

1. **Go to**: Supabase Dashboard
2. **Check if project shows "Active"**
3. **Check for any warnings/errors**
4. **Verify project hasn't been paused**

---

## 🔧 Quick Diagnostic

**Run this in browser console to test Supabase connection:**

```javascript
// Test basic Supabase connection
const { createClient } = await import('@supabase/supabase-js');

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('URL:', supabaseUrl);
console.log('Key exists:', !!supabaseKey);

const supabase = createClient(supabaseUrl, supabaseKey);

// Test simple query
const { data, error } = await supabase.from('applications').select('count');

console.log('Test result:', { data, error });
```

**What to look for:**
- If `error` shows CORS → Real CORS issue
- If `error` shows permission/RLS → RLS issue
- If `data` works → Connection is fine, check app code

---

## 🎯 Most Likely Causes

1. **RLS blocking requests** (most common - shows as CORS but isn't)
2. **Environment variables incorrect** or not loaded
3. **Supabase project paused** or inactive
4. **Network/firewall blocking** requests

---

## ✅ Recommended Steps

1. **Disable RLS temporarily** (Solution 3) to test
2. **Verify environment variables** (Solution 1)
3. **Check project status** (Solution 5)
4. **Run diagnostic** (Solution 5) to see exact error

---

## 📝 What the Error Means

**"CORS request did not succeed"** usually means:
- The request never reached Supabase (network/firewall)
- OR Supabase rejected it (RLS/auth)
- OR Connection failed (project inactive)

**Modern Supabase handles CORS automatically**, so if you're seeing this, it's usually:
- RLS blocking the request
- Network issue
- Project configuration issue

---

**Try Solution 3 first (disable RLS) - this will tell us if it's actually a CORS issue or RLS blocking!**



