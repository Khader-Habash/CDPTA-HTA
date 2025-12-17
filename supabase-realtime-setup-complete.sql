-- ================================================
-- SUPABASE REALTIME SETUP - COMPLETE
-- Enable real-time synchronization for ALL tables
-- ================================================

-- Enable Realtime for all tables that need cross-user sync
-- This allows clients to subscribe to INSERT, UPDATE, DELETE events

-- Applications - Real-time updates when applications are submitted/updated
ALTER PUBLICATION supabase_realtime ADD TABLE public.applications;

-- Users - Real-time updates when users are created/updated
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;

-- Announcements - Real-time updates when announcements are created/updated
ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;

-- Courses - Real-time updates when courses are created/updated
ALTER PUBLICATION supabase_realtime ADD TABLE public.courses;

-- Assignments - Real-time updates when assignments are created/updated
ALTER PUBLICATION supabase_realtime ADD TABLE public.assignments;

-- Quizzes - Real-time updates when quizzes are created/updated
ALTER PUBLICATION supabase_realtime ADD TABLE public.quizzes;

-- ================================================
-- HOW TO RUN THIS:
-- ================================================
-- 1. Go to: https://app.supabase.com
-- 2. Select your project
-- 3. Click "SQL Editor" in the left sidebar
-- 4. Click "+ New query"
-- 5. Copy and paste this entire file
-- 6. Click "RUN" (or press Ctrl+Enter)
-- 7. You should see: "Success. No rows returned"
-- ================================================

-- VERIFY REALTIME IS ENABLED:
-- 1. Go to: Database → Replication
-- 2. You should see all tables listed:
--    - applications ✅
--    - users ✅
--    - announcements ✅
--    - courses ✅
--    - assignments ✅
--    - quizzes ✅
-- ================================================

-- TESTING REAL-TIME:
-- After running this SQL:
-- 1. Open your app on Device 1 (e.g., your computer)
-- 2. Open your app on Device 2 (e.g., your phone or another computer)
-- 3. Create/edit data on Device 1
-- 4. Device 2 should update INSTANTLY without refresh!
-- ================================================



