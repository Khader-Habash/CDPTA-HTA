# ⚠️ CRITICAL: CORS Errors Blocking Supabase

## 🔴 The Problem

Your console shows:
- ❌ CORS errors blocking Supabase REST API
- ❌ WebSocket connection failures
- ⚠️ App falling back to localStorage

**This blocks all Supabase functionality!**

---

## ✅ IMMEDIATE FIX: Disable RLS Temporarily

**This will tell us if it's RLS blocking (most likely) or real CORS:**

### Step 1: Run in Supabase SQL Editor

```sql
-- Temporarily disable RLS to test
ALTER TABLE public.applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements DISABLE ROW LEVEL SECURITY;
```

### Step 2: Test Your App

1. **Refresh browser**
2. **Submit an application**
3. **Check Admin panel**

**If CORS errors disappear:**
- ✅ It's RLS blocking (not real CORS)
- ✅ Fix RLS policies (see Step 3)

**If CORS errors remain:**
- Check environment variables
- Check Supabase project status
- Check network/firewall

---

## 🔧 Step 3: Fix RLS Policies (After Testing)

**Once you confirm it's RLS, create proper policies:**

```sql
-- Re-enable RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own applications
CREATE POLICY "Users can insert their own applications"
ON public.applications FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow admins to view all applications
CREATE POLICY "Admins can view all applications"
ON public.applications FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Allow users to view their own applications
CREATE POLICY "Users can view their own applications"
ON public.applications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
```

---

## 🎯 Why This Happens

**Modern Supabase handles CORS automatically.**

If you see "CORS errors", it's usually:
1. **RLS blocking the request** (99% of cases)
   - Browser reports as CORS
   - Actually RLS/auth issue
   - Solution: Fix RLS policies

2. **Environment variables wrong** (1% of cases)
   - Check `.env` file
   - Restart dev server

---

## 📋 Quick Checklist

- [ ] Run Step 1 (disable RLS temporarily)
- [ ] Test app - do CORS errors disappear?
- [ ] If yes → Fix RLS policies (Step 3)
- [ ] If no → Check environment variables
- [ ] Restart dev server after changes

---

## ✅ Expected Result

**After disabling RLS:**
- ✅ CORS errors should disappear
- ✅ Supabase queries should work
- ✅ Applications should save/load from Supabase

**Then fix RLS policies to secure your data properly!**

---

**Run Step 1 now - this will immediately tell us if it's RLS or something else!**



