-- Quick Fix: Temporarily Disable RLS to Test Cross-Browser Sync
-- Run this in Supabase SQL Editor to test if RLS is blocking requests

-- Step 1: Temporarily disable RLS on applications table
ALTER TABLE public.applications DISABLE ROW LEVEL SECURITY;

-- Step 2: Test your application submission and cross-browser sync
-- If it works now, the issue is RLS policies, not CORS!

-- Step 3: After testing, create proper RLS policies (see below)
-- Step 4: Then re-enable RLS

-- ========================================
-- Proper RLS Policies (Use After Testing)
-- ========================================

-- Re-enable RLS
-- ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
-- DROP POLICY IF EXISTS "Allow authenticated users to insert applications" ON public.applications;
-- DROP POLICY IF EXISTS "Admins can view all applications" ON public.applications;
-- DROP POLICY IF EXISTS "Users can view their own applications" ON public.applications;
-- DROP POLICY IF EXISTS "Users can create their own applications" ON public.applications;
-- DROP POLICY IF EXISTS "Admins can update all applications" ON public.applications;

-- Allow authenticated users to insert applications (temporarily permissive for testing)
-- CREATE POLICY "Allow authenticated users to insert applications"
-- ON public.applications
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (true);

-- Allow admins to view all applications
-- CREATE POLICY "Admins can view all applications"
-- ON public.applications
-- FOR SELECT
-- TO authenticated
-- USING (
--   EXISTS (
--     SELECT 1 FROM public.users 
--     WHERE id = auth.uid() AND role = 'admin'
--   )
-- );

-- Allow users to view their own applications (or applications with null user_id for unauthenticated submissions)
-- CREATE POLICY "Users can view their own applications"
-- ON public.applications
-- FOR SELECT
-- TO authenticated
-- USING (
--   auth.uid() = user_id 
--   OR user_id IS NULL  -- Allow viewing applications with null user_id (for unauthenticated submissions)
-- );

-- Allow admins to update all applications
-- CREATE POLICY "Admins can update all applications"
-- ON public.applications
-- FOR UPDATE
-- TO authenticated
-- USING (
--   EXISTS (
--     SELECT 1 FROM public.users 
--     WHERE id = auth.uid() AND role = 'admin'
--   )
-- );



