# Quick Fix: CORS Errors

## 🚨 The Issue

CORS errors are blocking all Supabase requests. This is usually **NOT a real CORS issue** but rather:
- RLS (Row Level Security) blocking requests
- Or environment variables not set correctly

---

## ✅ Quick Fix Steps

### Step 1: Temporarily Disable RLS (Test)

**Run this in Supabase SQL Editor:**

```sql
-- Temporarily disable RLS to test
ALTER TABLE public.applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements DISABLE ROW LEVEL SECURITY;
```

**Then test:**
- Submit an application
- Check if CORS errors disappear
- If yes → It's RLS, not CORS (we'll fix policies)
- If no → Different issue

---

### Step 2: Verify Environment Variables

**Check `.env` file:**

```env
VITE_SUPABASE_URL=https://hyuigdjzxiqnrqfppmgm.supabase.co
VITE_SUPABASE_ANON_KEY=your-full-anon-key-here
```

**Important:**
- No trailing slash on URL
- Full anon key (starts with `eyJhbGci...`)
- Restart dev server after changes: `npm run dev`

---

### Step 3: Test Connection

**In browser console, run:**

```javascript
const { createClient } = await import('@supabase/supabase-js');
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const { data, error } = await supabase.from('applications').select('count');
console.log('Test:', { data, error });
```

**If error exists, copy it exactly!**

---

## 🎯 Most Likely: RLS Issue

**Modern Supabase handles CORS automatically.**

If you're seeing "CORS errors", it's usually:
1. **RLS blocking the request** (90% of cases)
2. Environment variables wrong (9% of cases)
3. Network/firewall (1% of cases)

**Disable RLS (Step 1) to confirm!**



