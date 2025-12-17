# Quick Debug Checklist - Real-Time Not Working

## ✅ Quick Checks (5 minutes)

### Check 1: Environment Variables

**In your `.env` file, verify:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-key-here
```

**In browser console, run:**
```javascript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing');
```

**If missing:**
- Add to `.env` file
- Restart dev server: `npm run dev`

---

### Check 2: Application Saves to Supabase

**After submitting an application, run in console:**
```javascript
const { createClient } = await import('@supabase/supabase-js');
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const { data, error } = await supabase.from('applications').select('*');
console.log('Applications:', data);
console.log('Error:', error);
```

**If error exists:**
- Copy the error message
- Likely RLS or permission issue

**If data is empty:**
- Application didn't save
- Check console when submitting for errors

---

### Check 3: Real-Time Subscription

**In Admin panel console, look for:**
```
✅ Real-time subscription active - multi-user sync enabled!
```

**If you DON'T see this:**
- Real-time subscription failed
- Check Supabase connection
- Check if real-time SQL was run

---

### Check 4: RLS Policies

**In Supabase Dashboard:**
1. Go to **Database** → **Tables** → `applications`
2. Click **Policies** tab
3. Check if policies exist

**If no policies or errors:**
- Temporarily disable RLS:
```sql
ALTER TABLE public.applications DISABLE ROW LEVEL SECURITY;
```

---

### Check 5: Real-Time Enabled

**In Supabase Dashboard:**
1. Go to **Database** → **Replication**
2. Check if `applications` table is listed

**If NOT listed:**
- Run `supabase-realtime-setup-safe.sql`
- Or manually add:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.applications;
```

---

## 🎯 Most Common Issues

1. **Environment variables not set** → Add to `.env`, restart server
2. **RLS blocking requests** → Disable RLS temporarily to test
3. **Real-time not enabled** → Run real-time SQL
4. **CORS/Network errors** → Usually RLS or auth issue

---

## 🚀 Quick Test Steps

1. **Disable RLS temporarily:**
   ```sql
   ALTER TABLE public.applications DISABLE ROW LEVEL SECURITY;
   ```

2. **Submit application in Browser 1**

3. **Check Browser 2 Admin panel**

4. **If works:**
   - Re-enable RLS
   - Fix RLS policies

5. **If doesn't work:**
   - Check console errors
   - Check environment variables
   - Check Supabase connection

---

**Run through these checks and tell me what you find!**



