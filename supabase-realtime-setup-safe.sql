-- ================================================
-- SUPABASE REALTIME SETUP - SAFE VERSION
-- This version checks if tables are already enabled
-- ================================================

-- Enable Real-Time for applications table (if not already enabled)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'applications'
        AND schemaname = 'public'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.applications;
        RAISE NOTICE 'Added applications to real-time';
    ELSE
        RAISE NOTICE 'applications already in real-time';
    END IF;
END $$;

-- Enable Real-Time for users table (if not already enabled)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'users'
        AND schemaname = 'public'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
        RAISE NOTICE 'Added users to real-time';
    ELSE
        RAISE NOTICE 'users already in real-time';
    END IF;
END $$;

-- Enable Real-Time for announcements table (if not already enabled)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'announcements'
        AND schemaname = 'public'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;
        RAISE NOTICE 'Added announcements to real-time';
    ELSE
        RAISE NOTICE 'announcements already in real-time';
    END IF;
END $$;

-- Enable Real-Time for courses table (if not already enabled)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'courses'
        AND schemaname = 'public'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.courses;
        RAISE NOTICE 'Added courses to real-time';
    ELSE
        RAISE NOTICE 'courses already in real-time';
    END IF;
END $$;

-- Enable Real-Time for assignments table (if not already enabled)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'assignments'
        AND schemaname = 'public'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.assignments;
        RAISE NOTICE 'Added assignments to real-time';
    ELSE
        RAISE NOTICE 'assignments already in real-time';
    END IF;
END $$;

-- Enable Real-Time for quizzes table (if not already enabled)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'quizzes'
        AND schemaname = 'public'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.quizzes;
        RAISE NOTICE 'Added quizzes to real-time';
    ELSE
        RAISE NOTICE 'quizzes already in real-time';
    END IF;
END $$;

-- ================================================
-- VERIFY REALTIME STATUS
-- ================================================
-- Check which tables are enabled for real-time
SELECT 
    tablename as "Table Name",
    'Enabled' as "Real-time Status"
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' 
AND schemaname = 'public'
ORDER BY tablename;

-- ================================================
-- EXPECTED RESULT:
-- You should see all 6 tables listed:
-- - applications
-- - users
-- - announcements
-- - courses
-- - assignments
-- - quizzes
-- ================================================



