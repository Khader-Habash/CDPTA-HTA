# Debug: Real-Time Cross-Browser Sync Not Working

## 🔍 Step-by-Step Debugging

### Step 1: Check Browser Console (Both Browsers)

Open both browsers and check the console (F12 → Console tab):

**In Browser 1 (where you submit):**
Look for:
- ✅ `✅ [PRIMARY] Application saved to Supabase`
- ❌ `⚠️ Supabase insert failed`
- ❌ `❌ Supabase error`

**In Browser 2 (Admin panel):**
Look for:
- ✅ `✅ [PRIMARY] Loaded X applications from Supabase`
- ✅ `✅ Real-time subscription active - multi-user sync enabled!`
- ❌ `⚠️ Supabase fetch failed`
- ❌ `📂 [FALLBACK] Loading applications from localStorage`

---

### Step 2: Verify Supabase Connection

**Run this in Browser 1 Console:**
```javascript
// Check if Supabase is configured
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

// Try to connect
const { createClient } = await import('@supabase/supabase-js');
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Test query
const { data, error } = await supabase.from('applications').select('count');
console.log('Supabase test:', { data, error });
```

**What to look for:**
- If you see errors → Supabase not configured correctly
- If `data` is null → RLS or connection issue
- If `error` exists → Copy the error message

---

### Step 3: Check Real-Time Subscription Status

**In Browser 2 Console (Admin panel), run:**
```javascript
// Check if subscription is active
// Look for these messages in console:
// - "✅ Real-time subscription active"
// - "SUBSCRIBED" status
```

---

### Step 4: Verify Application Saved to Supabase

**In Browser 1, after submitting:**
```javascript
// Check if application is in Supabase
const { createClient } = await import('@supabase/supabase-js');
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const { data, error } = await supabase
  .from('applications')
  .select('*')
  .order('submitted_at', { ascending: false })
  .limit(5);

console.log('Applications in Supabase:', data);
console.log('Error:', error);
```

**If data is empty:**
- Application didn't save to Supabase
- Check for errors when submitting

---

### Step 5: Check RLS Policies

**In Supabase Dashboard:**
1. Go to **Authentication** → **Policies**
2. Select `applications` table
3. Check if policies exist:
   - Allow INSERT for authenticated users
   - Allow SELECT for admins
   - Allow SELECT for users (their own applications)

**If no policies or too restrictive:**
- Temporarily disable RLS to test:
```sql
ALTER TABLE public.applications DISABLE ROW LEVEL SECURITY;
```

---

## 🚨 Common Issues

### Issue 1: Supabase Not Configured
**Symptoms:**
- Console shows: `⚠️ Supabase not configured`
- All data uses localStorage

**Solution:**
- Check `.env` file has correct values
- Restart dev server after changing `.env`
- Check Vercel environment variables (if deployed)

### Issue 2: RLS Blocking Requests
**Symptoms:**
- Console shows: `❌ Supabase error: permission denied`
- Applications don't save

**Solution:**
- Disable RLS temporarily to test
- Or fix RLS policies

### Issue 3: Real-Time Not Enabled
**Symptoms:**
- No real-time updates
- Console doesn't show subscription messages

**Solution:**
- Run `supabase-realtime-setup-safe.sql` in Supabase
- Verify in Database → Replication

### Issue 4: CORS Errors
**Symptoms:**
- Console shows: `Cross-Origin Request Blocked`
- Network errors

**Solution:**
- Supabase handles CORS automatically (2025)
- If still seeing errors, check RLS policies
- Verify environment variables

---

## 🔧 Quick Fix: Test with RLS Disabled

**Run this in Supabase SQL Editor:**
```sql
-- Temporarily disable RLS to test
ALTER TABLE public.applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
```

**Then test again:**
1. Submit application in Browser 1
2. Check Admin in Browser 2
3. If it works → RLS is the issue (fix policies)
4. If it doesn't work → Different issue (check console errors)

---

## 📋 What to Report Back

Please check and tell me:

1. **What console messages do you see** when submitting?
2. **What console messages do you see** in Admin panel?
3. **Any error messages?** (copy them exactly)
4. **Does the application save to Supabase?** (run Step 4 check)
5. **Is real-time subscription active?** (check console for subscription messages)

This will help identify the exact problem!



