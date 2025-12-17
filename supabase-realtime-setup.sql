-- ================================================
-- SUPABASE REALTIME SETUP
-- Enable real-time synchronization for cross-device updates
-- ================================================

-- Step 1: Enable Realtime for the announcements table
-- This allows clients to subscribe to INSERT, UPDATE, DELETE events

ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;

-- Step 2: Verify Realtime is enabled
-- You can check in Supabase Dashboard > Database > Replication
-- The 'announcements' table should appear in the list

-- ================================================
-- HOW TO RUN THIS:
-- ================================================
-- 1. Go to: https://supabase.com/dashboard/project/hyuigdjzxiqnrqfppmgm
-- 2. Click "SQL Editor" in the left sidebar
-- 3. Click "+ New query"
-- 4. Copy and paste this entire file
-- 5. Click "RUN" (or press F5)
-- 6. You should see: "Success. No rows returned"
-- ================================================

-- TESTING:
-- After running this SQL:
-- 1. Open your app on Device 1 (e.g., your computer)
-- 2. Open your app on Device 2 (e.g., your phone or another computer)
-- 3. Create/edit an announcement on Device 1
-- 4. Device 2 should show a toast: "Announcement Changed"
-- 5. Device 2 should automatically reload and show the new/updated announcement
-- ================================================





