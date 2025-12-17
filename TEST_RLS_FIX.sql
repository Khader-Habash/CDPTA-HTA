-- ================================================
-- TEST: Disable RLS to Check if It's Blocking Requests
-- ================================================
-- This will temporarily disable RLS to test if CORS errors
-- are actually RLS blocking requests (which browsers report as CORS)
-- ================================================

-- Disable RLS on all tables
ALTER TABLE public.applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes DISABLE ROW LEVEL SECURITY;

-- ================================================
-- AFTER TESTING:
-- ================================================
-- If CORS errors disappear after running this:
-- ✅ It's RLS blocking (not real CORS)
-- ✅ Next: Create proper RLS policies (see FIX_RLS_POLICIES.sql)
--
-- If CORS errors remain:
-- ❌ It's a different issue (environment variables, network, etc.)
-- ================================================



