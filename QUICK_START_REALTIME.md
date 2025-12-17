# 🚀 Quick Start: Enable Real-Time Multi-User Sync

## ⚡ 3 Steps to Enable Real-Time

### Step 1: Run SQL in Supabase (2 minutes)

1. Go to: https://app.supabase.com → Your Project
2. **SQL Editor** → **New Query**
3. Copy this SQL:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.applications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE public.courses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.assignments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quizzes;
```

4. Click **Run**
5. Done! ✅

### Step 2: Verify Real-Time is Enabled (30 seconds)

1. In Supabase Dashboard: **Database** → **Replication**
2. Check that all 6 tables are listed
3. Done! ✅

### Step 3: Test It! (1 minute)

1. **Open app in Chrome** → Submit an application
2. **Open app in Firefox** (different browser) → Admin panel
3. **Application appears INSTANTLY!** 🎉
4. Done! ✅

---

## ✅ That's It!

Your app now has:
- ✅ Real-time multi-user sync
- ✅ Cross-browser synchronization
- ✅ Instant updates for all users
- ✅ Shared data across all devices

---

## 🎯 What Changed

**Before**: localStorage only → No cross-browser sync
**Now**: Supabase PRIMARY → Real-time multi-user sync!

---

## 📝 Full Documentation

See `SUPABASE_PRIMARY_STORAGE_SETUP.md` for complete details.



