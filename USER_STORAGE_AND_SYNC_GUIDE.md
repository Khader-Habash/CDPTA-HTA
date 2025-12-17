# User Storage and Cross-Browser Synchronization Guide

## 🎯 Quick Summary

| Feature | Current Status | Location |
|---------|---------------|----------|
| **User Storage** | localStorage (browser-specific) | `localStorage` API |
| **Registration Storage** | `registeredUsers` array | Browser localStorage |
| **Admin User Storage** | `cdpta_users` array | Browser localStorage |
| **Authentication Keys** | `user_{email}` individual keys | Browser localStorage |
| **Cross-Tab Sync (Same Browser)** | ✅ Works instantly | StorageEvent API |
| **Cross-Browser Sync** | ❌ Not available | Requires Supabase |
| **Cross-Device Sync** | ❌ Not available | Requires Supabase |

---

## 📋 Current User Storage Implementation

### How New Users Are Saved

The system currently uses **localStorage** (browser storage) to save user data. Users are stored in multiple locations:

#### 1. **Registration Flow** (New Applicants)
When a user registers via the registration form (`/register`):

**Storage Location**: `localStorage.getItem('registeredUsers')`

**Code**: `src/services/authService.ts` → `register()` method (lines 133-186)

```133:171:src/services/authService.ts
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userExists = existingUsers.some((u: any) => u.email === data.email);
      
      if (userExists) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: UserRole.APPLICANT, // New registrations are applicants
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        permissions: [
          { resource: 'application', action: 'create' },
          { resource: 'application', action: 'update' }
        ],
        profileData: {
          phone: data.phone || '',
          bio: '',
          applicationStatus: 'pending',
          applicationDate: new Date().toISOString(),
          documents: []
        }
      };

      // Save to localStorage
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
```

**What's Saved:**
- User ID (auto-generated: `user-{timestamp}`)
- Email, First Name, Last Name
- Role: `APPLICANT`
- Permissions, Profile Data
- Creation/Update timestamps

**Note**: Password is temporarily stored during registration but is NOT saved to `registeredUsers` array for security.

---

#### 2. **Admin User Creation** (Admin Panel)
When an admin creates a user via the Admin User Management panel:

**Storage Location**: 
- `localStorage.getItem('cdpta_users')` (main storage)
- `localStorage.getItem('user_{email}')` (individual user with password for authentication)

**Code**: `src/services/userService.ts` → `createUser()` method (lines 227-298)

```227:298:src/services/userService.ts
  async createUser(data: CreateUserData): Promise<User> {
    // Skip Supabase for now and use localStorage directly
    // TODO: Fix Supabase email validation issues later
    console.log('🔵 Creating user with localStorage only (Supabase disabled for debugging)');

    // LocalStorage fallback
    const users = getLocalUsers();
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const newUser: User = {
      id: `user-${timestamp}-${randomSuffix}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      isActive: data.isActive ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profileData: data.role === UserRole.FELLOW ? {
        cohort: data.cohort || '2024A',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        mentor: 'user-khader-preceptor',
      } : {},
    };

    users.push(newUser);
    saveLocalUsers(users);
    
    // If creating a fellow, automatically assign to Khader (preceptor)
    if (data.role === UserRole.FELLOW) {
      try {
        const { preceptorAssignmentService } = await import('./preceptorAssignmentService');
        
        // Create automatic assignment to Khader
        await preceptorAssignmentService.createAssignment({
          preceptorId: 'user-khader-preceptor',
          fellowId: newUser.id,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
          notes: 'Automatically assigned to Khader upon fellow creation',
          department: 'Health Technology Assessment',
          cohort: data.cohort || '2024A',
          assignmentType: 'primary',
          workload: 'full',
        });
        
        console.log('✅ Fellow automatically assigned to Khader:', {
          fellowId: newUser.id,
          fellowName: `${data.firstName} ${data.lastName}`,
          preceptorId: 'user-khader-preceptor'
        });
      } catch (error) {
        console.error('❌ Failed to auto-assign fellow to Khader:', error);
      }
    }
    
    // Also save user with password for authentication (authService format)
    const userWithPassword = {
      ...newUser,
      password: data.password,
    };
    localStorage.setItem(`user_${data.email}`, JSON.stringify(userWithPassword));
    
    console.log('✅ User created and saved for authentication:', {
      email: data.email,
      role: data.role,
      storageKey: `user_${data.email}`
    });
    
    return newUser;
  },
```

**What's Saved:**
- Main storage: `cdpta_users` array
- Individual key: `user_{email}` with password for login authentication
- Automatic preceptor assignment if role is FELLOW

---

### Complete localStorage Keys Summary

| Key | Purpose | Contains |
|-----|---------|----------|
| `registeredUsers` | New applicant registrations | Array of applicant user objects |
| `cdpta_users` | Main user database | Array of all users (admin, preceptor, fellow, applicant) |
| `user_{email}` | Authentication data | Individual user object WITH password for login |
| `cdpta_current_user` | Current session | Currently logged-in user |
| `token` | Auth token | JWT token for authentication |
| `refreshToken` | Refresh token | Token for refreshing auth session |

---

## ❌ Problem: Browser-Specific Storage

**localStorage is NOT synchronized across browsers/devices.**

This means:
- ✅ Users created in **Chrome** are only available in Chrome
- ✅ Users created in **Firefox** are only available in Firefox
- ✅ Users created on **Device A** are NOT available on **Device B**
- ✅ Clearing browser data will **delete all users**

---

## ✅ Solution: Enable Supabase for Cloud Storage

Your project already has Supabase configured but it's currently **disabled** for user management. To enable cross-browser synchronization, you need to:

### Option 1: Enable Supabase (Recommended)

#### Step 1: Configure Environment Variables

Create or update `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

#### Step 2: Update User Services

The code already has Supabase integration but it's commented out. You need to:

1. **Enable Supabase in `userService.ts`**:
   - Currently: Uses localStorage only
   - Change to: Try Supabase first, fallback to localStorage

2. **Enable Supabase in `authService.ts`**:
   - Currently: Uses localStorage only
   - Change to: Create users in Supabase Auth + Database

#### Step 3: Set Up Supabase Database Schema

Run the SQL schema file that's already in your project:

- `supabase-schema.sql` - Creates tables structure
- `supabase-realtime-setup.sql` - Sets up real-time sync

#### Benefits:
- ✅ Users synced across ALL browsers and devices
- ✅ Data persists even if browser data is cleared
- ✅ Real-time updates across tabs/devices
- ✅ Secure password storage (hashed)
- ✅ Built-in authentication system

#### Trade-offs:
- Requires Supabase account (free tier available)
- Slight network latency (minimal)
- Need to migrate existing localStorage data

---

### Option 2: Manual Data Export/Import (Temporary Workaround)

If you want a quick solution without Supabase:

1. **Export users** from one browser:
```javascript
// Run in browser console on Browser A
const users = localStorage.getItem('cdpta_users');
const registered = localStorage.getItem('registeredUsers');
console.log(JSON.stringify({ users, registered }));
```

2. **Import users** to another browser:
```javascript
// Run in browser console on Browser B
const data = { /* paste exported data */ };
localStorage.setItem('cdpta_users', data.users);
localStorage.setItem('registeredUsers', data.registered);
```

**Limitations:**
- Manual process (must do for each browser)
- Not real-time (no automatic sync)
- Still browser-specific (no device sync)

---

### Option 3: Hybrid Approach (Recommended for Development)

Keep localStorage for development/testing, but add Supabase for production:

1. **Development**: Use localStorage (fast, no setup)
2. **Production**: Use Supabase (persistent, synchronized)

You can detect environment and switch:

```typescript
const useSupabase = import.meta.env.PROD || import.meta.env.VITE_USE_SUPABASE === 'true';
```

---

## 🔧 Implementation: Enable Supabase

If you want me to enable Supabase for user storage, I can:

1. ✅ Update `authService.ts` to save users to Supabase
2. ✅ Update `userService.ts` to read/write from Supabase
3. ✅ Create migration script to move existing localStorage users to Supabase
4. ✅ Update authentication to use Supabase Auth
5. ✅ Keep localStorage as fallback for offline mode

**Would you like me to implement this?** Just let me know and I'll:
- Enable Supabase integration
- Create migration utilities
- Test the synchronization
- Update all user-related services

---

## 📊 Current Storage Flow Diagram

```
┌─────────────────────────────────────────────────┐
│           USER REGISTRATION/CREATION            │
└──────────────────┬──────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
   REGISTRATION          ADMIN CREATE
        │                     │
        ▼                     ▼
┌──────────────┐    ┌──────────────────┐
│ authService  │    │   userService    │
│  .register() │    │   .createUser()  │
└──────┬───────┘    └────────┬─────────┘
       │                     │
       │                     │
       ▼                     ▼
┌─────────────────────────────────────┐
│         LOCALSTORAGE                │
│                                     │
│  • registeredUsers (array)          │
│  • cdpta_users (array)              │
│  • user_{email} (individual)        │
│                                     │
│  ❌ Only in THIS browser            │
│  ❌ Not synced across devices       │
└─────────────────────────────────────┘
```

## 🔄 Current Synchronization Status

### ✅ What Works (Same Browser)

**Cross-Tab Sync (Same Browser)**: ✅ **INSTANT**
- Uses `StorageEvent` API
- User updates broadcast to all tabs in the same browser
- Code: `userSyncService.broadcastUserUpdate()` (line 337)
- Listener: `userSyncService.startListeningForUpdates()` (line 358)

**Example**:
- Tab 1 (Chrome): Admin creates user → User appears instantly in Tab 2 (Chrome)

### ❌ What Doesn't Work (Different Browsers/Devices)

**Cross-Browser Sync**: ❌ **NOT AVAILABLE**
- Chrome → Firefox: No sync
- Edge → Safari: No sync
- Data isolated per browser

**Cross-Device Sync**: ❌ **NOT AVAILABLE**
- Desktop → Mobile: No sync
- Computer A → Computer B: No sync
- Each device has separate localStorage

**Why**: localStorage is a browser security feature - each browser/device has isolated storage.

---

## 🚀 Recommended Next Steps

1. **Short-term**: Use manual export/import for now if you need immediate cross-browser access
2. **Long-term**: Enable Supabase for full cloud synchronization
3. **Testing**: Test user creation/login in multiple browsers to verify sync

**Let me know which option you prefer, and I can help implement it!**

