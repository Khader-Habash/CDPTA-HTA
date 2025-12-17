# Supabase CORS Fix - Updated 2025

## ⚠️ Important Update

**Supabase has removed CORS configuration from the dashboard!** 

As of 2025, Supabase's REST API (PostgREST) automatically handles CORS with default headers. You **cannot** configure it through the dashboard anymore.

## 🔍 Why You're Getting CORS Errors

If you're seeing CORS errors, it's likely **NOT a CORS configuration issue**, but one of these:

### 1. **RLS (Row Level Security) Policies**
The most common cause! Your requests are being blocked by RLS policies.

### 2. **Authentication Issues**
User not properly authenticated, so RLS blocks the request.

### 3. **Missing Headers**
The request might be missing required headers.

## ✅ Solution: Check RLS Policies Instead

Since you can't configure CORS in the dashboard, let's check if it's actually RLS blocking your requests:

### Step 1: Check Your RLS Policies

1. Go to **Supabase Dashboard** → **Table Editor**
2. Click on `applications` table
3. Click **Policies** tab (or go to **Authentication** → **Policies**)
4. Make sure you have these policies:

```sql
-- Allow authenticated users to insert applications
CREATE POLICY "Users can insert their own applications"
ON public.applications
FOR INSERT
TO authenticated
WITH CHECK (true);  -- Temporarily allow all to test

-- Allow admins to view all applications  
CREATE POLICY "Admins can view all applications"
ON public.applications
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Allow users to view their own applications
CREATE POLICY "Users can view their own applications"
ON public.applications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
```

### Step 2: Temporarily Disable RLS for Testing

**⚠️ Only for testing! Re-enable after.**

1. Go to **SQL Editor** → **New Query**
2. Run this:

```sql
-- Temporarily disable RLS on applications table
ALTER TABLE public.applications DISABLE ROW LEVEL SECURITY;
```

3. **Test** if applications now sync across browsers
4. **If it works**, re-enable RLS and fix your policies:

```sql
-- Re-enable RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
```

### Step 3: Check Authentication

Make sure users are properly authenticated:

1. Check browser console for authentication errors
2. Verify token is being sent with requests
3. Check if `auth.uid()` returns a valid user ID

## 🔧 Alternative: Use Service Role Key (Server-Side Only)

**⚠️ WARNING: Never use service role key in client-side code!**

If you need to bypass RLS completely (not recommended), you'd need to:
1. Create a backend API
2. Use service role key server-side only
3. Call your API instead of Supabase directly

## 🎯 Real Solution: Fix RLS Policies

The CORS error is likely a **misleading error message**. The real issue is probably RLS blocking your requests.

### Create Proper RLS Policies

Run this in **SQL Editor**:

```sql
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own applications" ON public.applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON public.applications;
DROP POLICY IF EXISTS "Users can view their own applications" ON public.applications;

-- Allow ANY authenticated user to insert (for testing)
CREATE POLICY "Allow authenticated users to insert applications"
ON public.applications
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow admins to view all
CREATE POLICY "Admins can view all applications"
ON public.applications
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Allow users to view their own
CREATE POLICY "Users can view their own applications"
ON public.applications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR user_id IS NULL);
```

## 📊 Test if RLS is the Issue

1. **Disable RLS temporarily:**
   ```sql
   ALTER TABLE public.applications DISABLE ROW LEVEL SECURITY;
   ```

2. **Test application submission**

3. **If it works**, re-enable and fix policies:
   ```sql
   ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
   ```

4. **Then apply proper policies** (see above)

## ✅ Summary

**You can't configure CORS in Supabase dashboard anymore** - it's automatic.

**The real issue is likely RLS policies blocking your requests.**

**Fix:**
1. Check RLS policies
2. Temporarily disable RLS to test
3. If that fixes it, create proper RLS policies
4. Re-enable RLS

---

**Next Steps:**
1. Try disabling RLS on `applications` table
2. Test if cross-browser sync works
3. If yes, fix your RLS policies
4. Re-enable RLS



