# Website Storage Overview

## Storage Architecture

This application uses **two storage mechanisms**:

1. **localStorage** (Browser Storage) - Primary storage for offline/demo mode
2. **Supabase** (Cloud Database) - For cross-browser/device sync (when configured)

---

## localStorage Keys Used

### Application Data

| Key | Purpose | Used By |
|-----|---------|---------|
| `applicationFormData` | Current draft application data | Application Form Hook |
| `cdpta_submitted_applications` | All submitted applications (for admin) | Admin Application Review |
| `application_*` | Individual application storage | Application Service |

### User Data

| Key | Purpose | Used By |
|-----|---------|---------|
| `registeredUsers` | List of registered users | User Service |
| `user_*` | Individual user data (key format: `user_{email}`) | User Service, Auth Service |
| `token` | Authentication token | Auth Context |
| `refreshToken` | Refresh token for auth | Auth Context |

### Announcements

| Key | Purpose | Used By |
|-----|---------|---------|
| `cdpta_announcements` | All announcements | Announcement Service |

### Documents

| Key | Purpose | Used By |
|-----|---------|---------|
| `document_cv` | CV document data | Document Upload |
| `document_transcript` | Transcript document data | Document Upload |
| `document_letterOfInterest` | Letter of Interest document | Document Upload |

### Other Data

| Key | Purpose | Used By |
|-----|---------|---------|
| `CLEAN_USERS` | Default seed users | User Service |
| `notifications_*` | User notifications | Notification Service |

---

## Storage Structure Details

### 1. Application Storage

**Key**: `cdpta_submitted_applications`

**Structure**:
```typescript
Array<{
  id: string;                    // Application ID (e.g., "APP-1234567890")
  applicantId: string;           // User ID or "unknown"
  submittedAt: string;           // ISO date string
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    // ... other personal info fields
  };
  education: { /* ... */ };
  documents: { /* ... */ };
  metadata: {
    status: 'submitted' | 'draft' | 'under_review' | 'accepted' | 'rejected';
    applicationId: string;
    submittedAt: string;
    currentStep: number;
    totalSteps: number;
  };
}>
```

**Location**: `src/hooks/useApplicationForm.ts` (line 10: `SUBMITTED_APPS_KEY`)

---

### 2. User Storage

**Key**: `registeredUsers`

**Structure**:
```typescript
Array<User> // Array of user objects
```

**Individual User Keys**: `user_{email}`

**Structure**:
```typescript
{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'preceptor' | 'fellow' | 'applicant';
  password: string;  // Hashed or plain (for demo)
  permissions: Permission[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  profileData: {
    // Role-specific data
  };
}
```

**Location**: `src/services/userService.ts`, `src/services/authService.ts`

---

### 3. Announcement Storage

**Key**: `cdpta_announcements`

**Structure**:
```typescript
Array<{
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  published: boolean;
  createdBy: string;  // User ID
  createdAt: string;
  updatedAt: string;
}>
```

**Location**: `src/services/announcementService.ts`

---

## Supabase Storage (When Configured)

### Tables

1. **users** - User accounts and profiles
2. **applications** - Submitted applications
3. **announcements** - System announcements
4. **courses** - Course content
5. **assignments** - Course assignments
6. **quizzes** - Course quizzes

**Schema Location**: `supabase-schema.sql`

---

## Storage Priority (Fallback System)

### When Supabase is Configured:

1. **Try Supabase first** → Cloud database
2. **Fallback to localStorage** → If Supabase fails

### When Supabase is NOT Configured:

1. **Use localStorage only** → All data stored locally

---

## Storage Limitations

### localStorage Limits:
- **Size**: ~5-10MB per domain (browser-dependent)
- **Scope**: Per-browser (Chrome ≠ Firefox)
- **Persistence**: Cleared when user clears browser data
- **Sync**: Only within same browser/tabs

### Supabase Limits:
- **Size**: Depends on plan (Free tier: 500MB database)
- **Scope**: Cross-browser, cross-device
- **Persistence**: Permanent (cloud database)
- **Sync**: Real-time across all clients

---

## How to View Storage

### In Browser Console:

**View All localStorage Keys**:
```javascript
Object.keys(localStorage)
```

**View Specific Data**:
```javascript
// View submitted applications
JSON.parse(localStorage.getItem('cdpta_submitted_applications') || '[]')

// View registered users
JSON.parse(localStorage.getItem('registeredUsers') || '[]')

// View announcements
JSON.parse(localStorage.getItem('cdpta_announcements') || '[]')

// View current application draft
JSON.parse(localStorage.getItem('applicationFormData') || '{}')
```

**View Storage Size**:
```javascript
// Calculate total localStorage size
let total = 0;
for (let key in localStorage) {
  if (localStorage.hasOwnProperty(key)) {
    total += localStorage[key].length + key.length;
  }
}
console.log('Total localStorage size:', (total / 1024).toFixed(2), 'KB');
```

---

## Storage Cleanup

### Clear Specific Data:
```javascript
localStorage.removeItem('applicationFormData');  // Clear draft
localStorage.removeItem('cdpta_submitted_applications');  // Clear all applications
localStorage.removeItem('cdpta_announcements');  // Clear announcements
```

### Clear All Data:
```javascript
localStorage.clear();  // ⚠️ Clears EVERYTHING
```

---

## Storage Migration

### When Migrating to Supabase:

1. Data in localStorage is preserved
2. New data saves to Supabase
3. Old data remains in localStorage as backup
4. Admin page merges both sources

**Migration Script**: `src/utils/migrateUsersToSupabase.ts`

---

## Current Storage Status

Based on the codebase:

✅ **localStorage**: Fully implemented and working
✅ **Supabase**: Configured but experiencing CORS issues
⚠️ **Cross-browser sync**: Not working (requires Supabase fix)

---

## Recommendations

1. **For Development**: localStorage is sufficient
2. **For Production**: Fix Supabase for cross-browser sync
3. **For Testing**: Use browser console to inspect storage
4. **For Cleanup**: Clear localStorage periodically to avoid quota issues



