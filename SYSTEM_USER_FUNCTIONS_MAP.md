# 🗺️ CDPTA Platform - Complete User Functions Map

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [User Roles & Permissions](#user-roles--permissions)
3. [Authentication System](#authentication-system)
4. [Role-Based Features](#role-based-features)
5. [Application Workflow](#application-workflow)
6. [Data Flow Architecture](#data-flow-architecture)
7. [Service Layer](#service-layer)
8. [Component Architecture](#component-architecture)

---

## 🎯 System Overview

### Platform Purpose
The CDPTA (Center for Drug Policy & Technology Assessment) Platform is a comprehensive fellowship management system for tracking applicants, managing fellows, monitoring preceptor relationships, and administering the program.

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Storage**: localStorage + Supabase (optional)
- **Forms**: React Hook Form + Zod validation

### Key Features
✅ Multi-role system (Applicant, Fellow, Preceptor, Admin)  
✅ Application submission and tracking  
✅ Document upload and management  
✅ Real-time cross-tab synchronization  
✅ Role-based access control  
✅ Course and assignment management  
✅ Preceptor-fellow assignment system  

---

## 👥 User Roles & Permissions

### Role Hierarchy
```
ADMIN (Highest)
  ↓
PRECEPTOR
  ↓
FELLOW
  ↓
APPLICANT (Lowest)
```

### 1. APPLICANT Role

#### **Purpose**
Users who want to apply for the CDPTA Fellowship Program

#### **Default Credentials**
- Email: `applicant@example.com`
- Password: `password123`

#### **Permissions**
```typescript
permissions: [
  { resource: 'application', action: 'create' },
  { resource: 'application', action: 'update' },
  { resource: 'application', action: 'read' }
]
```

#### **Available Pages**
1. **Dashboard** (`/applicant/dashboard`)
   - Application progress tracking
   - Application status display
   - Quick actions
   - Application window information

2. **Application Form** (`/applicant/application`)
   - **Step 1**: Personal Information
   - **Step 2**: Educational Background
   - **Step 3**: Program Information (NEW)
     - Travel ability
     - Why join CDPTA? (required)
     - CDPTA projects engagement
   - **Step 4**: Documents
     - Letter of Interest PDF (required)
     - CV (optional)
     - Transcripts (optional)
   - **Step 5**: Review & Submit

3. **Application Status** (`/applicant/status`)
   - View application submission status
   - Track review progress
   - See decision timeline

4. **Program Information** (`/applicant/program-info`)
   - Learn about the fellowship
   - View program requirements
   - Access resources

#### **Functions Available**
```typescript
// Primary Actions
- Submit fellowship application
- Track application status
- Upload required documents
- Edit application (before submission)
- View program information

// Data Access
- Read own application data
- Read program information
- Read own status

// Restrictions
- Cannot edit submitted applications
- Cannot access other users' data
- Cannot manage system settings
```

#### **How It Works**

**Application Flow:**
```
1. User visits /apply or /register
   ↓
2. Fills out 5-step application form
   ↓
3. Auto-saves progress to localStorage
   ↓
4. Submits final application
   ↓
5. Data saved to localStorage + Supabase (if configured)
   ↓
6. Admin notified via event bus
   ↓
7. Redirects to home page
```

**Data Storage:**
- Application data → `applicationFormData` (localStorage)
- Submitted apps → `cdpta_submitted_applications` (localStorage)
- User data → `cdpta_users` + `user_{email}` (localStorage)

---

### 2. FELLOW Role

#### **Purpose**
Accepted applicants who are actively participating in the fellowship program

#### **Default Credentials**
- Email: `zaid@gmail.com`
- Password: `password123`

#### **Permissions**
```typescript
permissions: [
  { resource: 'courses', action: 'read' },
  { resource: 'assignments', action: 'read' },
  { resource: 'assignments', action: 'update' },
  { resource: 'modules', action: 'read' },
  { resource: 'profile', action: 'update' }
]
```

#### **Available Pages**
1. **Dashboard** (`/fellow/dashboard`)
   - Course overview
   - Upcoming assignments
   - Progress tracking
   - Notifications

2. **Learning Modules** (`/fellow/modules`)
   - Access course materials
   - View module content
   - Track completion

3. **My Projects** (`/fellow/projects`)
   - View assigned projects
   - Track project progress
   - Submit project updates

4. **Courses** (`/fellow/courses`)
   - Browse available courses
   - Enroll in courses
   - View course details

5. **Course Detail** (`/fellow/courses/:courseId`)
   - Course content
   - Assignments
   - Progress tracking

6. **Assignments** (`/fellow/assignments`)
   - View assignments
   - Submit work
   - Track submission status

7. **Quizzes** (`/fellow/quizzes`)
   - Take quizzes
   - View results
   - Track performance

#### **Functions Available**
```typescript
// Primary Actions
- Enroll in courses
- Submit assignments
- Take quizzes
- View grades
- Access learning materials
- Track progress

// Data Access
- Read enrolled courses
- Read assignments
- Read module content
- Read own grades

// Restrictions
- Cannot create courses
- Cannot manage other fellows
- Cannot access admin features
```

#### **How It Works**

**Course Enrollment:**
```
1. Fellow browses available courses
   ↓
2. Clicks "Enroll" on a course
   ↓
3. Course enrollment saved to localStorage
   ↓
4. Fellow can access course content
```

**Assignment Submission:**
```
1. Fellow views assignment in "Assignments" page
   ↓
2. Opens assignment details
   ↓
3. Uploads/submits work
   ↓
4. Assignment marked as submitted
   ↓
5. Preceptor can review submission
```

---

### 3. PRECEPTOR Role

#### **Purpose**
Staff members who mentor fellows and manage courses

#### **Default Credentials**
- Email: `khader@gmail.com`
- Password: `password123`

#### **Permissions**
```typescript
permissions: [
  { resource: 'users', action: 'read' },
  { resource: 'fellows', action: 'read' },
  { resource: 'fellows', action: 'update' },
  { resource: 'courses', action: 'read' },
  { resource: 'courses', action: 'create' },
  { resource: 'courses', action: 'update' },
  { resource: 'assignments', action: 'read' },
  { resource: 'assignments', action: 'create' },
  { resource: 'assignments', action: 'update' }
]
```

#### **Available Pages**
1. **Dashboard** (`/preceptor/dashboard`)
   - Assigned fellows overview
   - Active courses
   - Upcoming tasks
   - Monitoring alerts

2. **Manage Fellows** (`/preceptor/fellows`)
   - View assigned fellows
   - Monitor progress
   - Provide feedback

3. **Courses** (`/preceptor/courses`)
   - Create courses
   - Edit existing courses
   - Manage course content
   - Add assignments

4. **Monitoring** (`/preceptor/monitoring`)
   - Track fellow progress
   - View progress reports
   - Monitor activity

#### **Functions Available**
```typescript
// Primary Actions
- Create and manage courses
- Assign fellows to courses
- Create assignments and quizzes
- Monitor fellow progress
- Provide feedback
- Generate progress reports

// Data Access
- Read all fellows
- Read course data
- Read assignments
- Update fellow status

// Restrictions
- Cannot manage system settings
- Cannot create users
- Cannot access admin analytics
```

#### **How It Works**

**Course Creation:**
```
1. Preceptor navigates to "Courses" page
   ↓
2. Clicks "Create Course"
   ↓
3. Fills out course form (title, description, modules)
   ↓
4. Adds assignments and quizzes
   ↓
5. Publishes course
   ↓
6. Fellows can enroll
```

**Fellow Assignment:**
```
1. Admin creates a fellow user
   ↓
2. System automatically assigns to Khader (default preceptor)
   ↓
3. Khader's profile updated: fellowsAssigned++
   ↓
4. Khader can see fellow in "Manage Fellows"
   ↓
5. Khader monitors fellow progress
```

---

### 4. ADMIN Role

#### **Purpose**
System administrators with full access to all features

#### **Default Credentials**
- Email: `abeer@gmail.com`
- Password: `password123`

#### **Permissions**
```typescript
permissions: [
  { resource: 'users', action: 'create' },
  { resource: 'users', action: 'read' },
  { resource: 'users', action: 'update' },
  { resource: 'users', action: 'delete' },
  { resource: 'system', action: 'read' },
  { resource: 'announcements', action: 'create' },
  { resource: 'announcements', action: 'update' },
  { resource: 'announcements', action: 'delete' }
]
```

#### **Available Pages**
1. **Dashboard** (`/admin/dashboard`)
   - System overview
   - User statistics
   - Application statistics
   - Quick actions

2. **User Management** (`/admin/users`)
   - Create users
   - Edit users
   - Activate/deactivate users
   - Reset passwords
   - Delete users

3. **Application Review** (`/admin/applications`)
   - View all applications
   - Review applications
   - Accept/reject applicants
   - Convert applicant to fellow

4. **Announcement Management** (`/admin/announcements`)
   - Create announcements
   - Edit announcements
   - Delete announcements
   - Publish/draft

5. **Preceptor Assignments** (`/admin/preceptor-assignments`)
   - Manage fellow-preceptor relationships
   - Assign/update assignments
   - Track assignments

6. **Analytics** (`/admin/analytics`)
   - User analytics
   - Application analytics
   - System metrics

7. **System Settings** (`/admin/settings`)
   - Configure system
   - Manage settings

#### **Functions Available**
```typescript
// Primary Actions
- Create/manage users
- Review and process applications
- Manage announcements
- Assign preceptors to fellows
- View system analytics
- Configure system settings

// Data Access
- Read all users
- Read all applications
- Read all data
- Write/update all data
- Delete data

// No Restrictions
- Full system access
```

#### **How It Works**

**Application Processing:**
```
1. Applicant submits application
   ↓
2. Application appears in Admin "Application Review"
   ↓
3. Admin reviews application
   ↓
4. Admin clicks "Accept Applicant"
   ↓
5. System creates fellow user
   ↓
6. Fellow automatically assigned to Khader
   ↓
7. Application status updated to "accepted"
   ↓
8. Fellow can now login
```

**User Creation:**
```
1. Admin navigates to "User Management"
   ↓
2. Clicks "Create User"
   ↓
3. Fills out user form (email, name, role, password)
   ↓
4. Selects role (Fellow, Preceptor, Admin)
   ↓
5. System creates user with proper permissions
   ↓
6. If Fellow: automatically assigned to Khader
   ↓
7. User can now login
```

---

## 🔐 Authentication System

### AuthContext (`src/contexts/AuthContext.tsx`)

**Purpose**: Manages authentication state across the entire application

#### **State Managed**
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

#### **Available Functions**

**1. login(credentials)**
```typescript
// What it does:
- Validates credentials
- Retrieves user data
- Syncs user data via userSyncService
- Stores tokens in localStorage
- Updates auth context state
- Returns success/error

// Flow:
User enters credentials → authService.login() → 
userSyncService.getSyncedUser() → 
Store tokens → Update context → Redirect to dashboard
```

**2. register(data)**
```typescript
// What it does:
- Creates new user account
- Sets role to APPLICANT
- Stores in localStorage
- Auto-logs in user
- Redirects to application

// Flow:
Fill registration form → authService.register() → 
Create user with APPLICANT role → 
Store in localStorage → Auto-login → 
Redirect to /applicant/application
```

**3. logout()**
```typescript
// What it does:
- Clears auth tokens
- Resets auth state
- Redirects to home page

// Flow:
Click logout → authService.logout() → 
Clear localStorage → Reset state → 
window.location.href = '/'
```

**4. hasRole(roles)**
```typescript
// What it does:
- Checks if current user has specific role(s)

// Example:
hasRole(UserRole.ADMIN) → returns true/false
hasRole([UserRole.ADMIN, UserRole.PRECEPTOR]) → 
returns true if user has ANY of these roles
```

**5. hasPermission(resource, action)**
```typescript
// What it does:
- Checks if user has specific permission

// Example:
hasPermission('courses', 'create') → returns true/false
```

**6. updateUser(updates)**
```typescript
// What it does:
- Updates current user's data
- Syncs across all storage locations
- Updates permissions if role changed
- Broadcasts to other tabs

// Flow:
Call updateUser({ firstName: 'New' }) → 
userSyncService.updateUserSync() → 
Update localStorage + individual keys → 
Broadcast storage event → Update context
```

**7. refreshUserData()**
```typescript
// What it does:
- Reloads user data from storage
- Ensures UI shows latest data

// Use case:
After admin updates user, fellow can refresh
to see updated information
```

---

## 📊 Data Flow Architecture

### Storage Layers

#### **Layer 1: localStorage - User Data**
```typescript
Keys:
- 'cdpta_users' → Array of all users
- 'user_{email}' → Individual user with password
- 'cdpta_current_user' → Currently logged-in user

Purpose:
- User authentication
- User management
- Offline access
```

#### **Layer 2: localStorage - Application Data**
```typescript
Keys:
- 'applicationFormData' → Current application draft
- 'cdpta_submitted_applications' → All submitted apps
- 'application_{id}' → Individual application data
- 'document_{type}' → Uploaded documents

Purpose:
- Application persistence
- Document storage
- Auto-save functionality
```

#### **Layer 3: localStorage - Real-time Sync**
```typescript
Keys:
- 'user_update_{userId}' → User update events
- Storage events → Cross-tab communication

Purpose:
- Real-time updates across tabs
- Sync state between browser instances
```

### Synchronization Flow

```
┌─────────────────────────────────────────────┐
│         USER ACTION (e.g., update)          │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│     userSyncService.updateUserSync()        │
│  - Updates userService                      │
│  - Updates localStorage cdpta_users         │
│  - Updates individual user_{email} key      │
│  - Updates profileData & permissions        │
│  - Broadcasts to other tabs                 │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│     AuthContext State Updated               │
│  - user object updated                      │
│  - UI re-renders with new data              │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│     Other Tabs Listen for Updates           │
│  - Receives storage event                   │
│  - Updates their auth context               │
│  - UI automatically updates                 │
└─────────────────────────────────────────────┘
```

---

## 🔧 Service Layer

### Core Services

#### **1. authService** (`src/services/authService.ts`)
```typescript
Methods:
- login(credentials) → AuthResponse
- register(data) → AuthResponse
- logout() → void
- getCurrentUser() → User
- refreshToken(token) → AuthResponse
- verifyToken(token) → User

Data Source:
- localStorage
- CLEAN_USERS constant
- Individual user keys (user_{email})
```

#### **2. userService** (`src/services/userService.ts`)
```typescript
Methods:
- getAllUsers() → User[]
- getUserById(id) → User
- createUser(data) → User
- updateUser(id, updates) → User
- deleteUser(id) → void
- toggleUserStatus(id) → User
- resetUserPassword(id, password) → void

Data Source:
- localStorage ('cdpta_users')
- Auto-assigns fellows to Khader
- Maintains preceptor-fellow relationships
```

#### **3. userSyncService** (`src/services/userSyncService.ts`) [NEW]
```typescript
Methods:
- getSyncedUser(userId) → User
- updateUserSync(userId, updates, options) → User
- createUserSync(userData) → User
- syncAllUsers() → void
- startListeningForUpdates(callback) → cleanup function

Purpose:
- Ensures user data consistency across all storage
- Manages role-based profile data
- Manages permissions
- Handles cross-tab synchronization
```

#### **4. applicationService** (`src/services/applicationService.ts`)
```typescript
Methods:
- submitApplication(data) → ApplicationResponse
- getApplicationById(id) → Application
- getAllApplications() → Application[]

Data Flow:
submitApplication() → 
- Save to localStorage 'cdpta_submitted_applications'
- Save to Supabase (if configured)
- Emit APPLICATION_SUBMITTED event
- Broadcast to other tabs
```

#### **5. announcementService** (`src/services/announcementService.ts`)
```typescript
Methods:
- getAllAnnouncements() → Announcement[]
- getAnnouncementById(id) → Announcement
- createAnnouncement(data) → Announcement
- updateAnnouncement(id, updates) → Announcement
- deleteAnnouncement(id) → void

Features:
- Real-time sync across tabs
- localStorage + Supabase
- Broadcasting system
```

#### **6. preceptorAssignmentService** (`src/services/preceptorAssignmentService.ts`)
```typescript
Methods:
- getAssignments(filter) → PreceptorAssignment[]
- createAssignment(data) → PreceptorAssignment
- updateAssignment(id, updates) → PreceptorAssignment
- deleteAssignment(id) → void
- getFellowsByPreceptor(preceptorId) → Fellow[]

Purpose:
- Manages fellow-preceptor relationships
- Updates preceptor's profile with assigned fellows
- Tracks assignment status
```

#### **7. courseService** (`src/services/courseService.ts`)
```typescript
Methods:
- getAllCourses() → Course[]
- getCourseById(id) → Course
- createCourse(data) → Course
- updateCourse(id, updates) → Course
- deleteCourse(id) → void

Data Storage:
- localStorage 'cdpta_courses'
- Includes modules, assignments, quizzes
```

#### **8. notificationService** (`src/services/notificationService.ts`)
```typescript
Methods:
- getNotifications(userId) → Notification[]
- markAsRead(notificationId) → void
- deleteNotification(notificationId) → void
- createNotification(data) → Notification

Purpose:
- In-app notifications
- Toast notifications
- Real-time updates
```

---

## 🧩 Component Architecture

### Layout Components

#### **Layout** (`src/components/layout/Layout.tsx`)
```typescript
Purpose: Wraps all authenticated pages
Components: Header + Sidebar + Main content

Features:
- Role-based sidebar navigation
- Notification bell
- User profile menu
- Responsive design
```

#### **Header** (`src/components/layout/Header.tsx`)
```typescript
Features:
- Site logo/name
- User profile menu
- Notification bell
- Logout button
- Mobile menu
```

#### **Sidebar** (`src/components/layout/Sidebar.tsx`)
```typescript
Features:
- Dynamic navigation based on user role
- Active route highlighting
- Collapsible on mobile
- Role-based menu items

Navigation Items:
- Common: Dashboard (all roles)
- Applicant: My Application, Program Info, Status
- Fellow: Learning Modules, Projects, Courses, Assignments, Quizzes
- Preceptor: Fellows, Courses, Monitoring
- Admin: Users, Applications, Announcements, Analytics, Settings
```

### Protected Components

#### **ProtectedRoute** (`src/components/ProtectedRoute.tsx`)
```typescript
Purpose: Route-level access control

Checks:
1. Is user authenticated? → Redirect to /login
2. Does user have required role? → Check hasRole()
3. Does user have required permissions? → Check hasPermission()
4. All checks pass → Render children

Usage:
<ProtectedRoute requiredRoles={[UserRole.ADMIN]}>
  <AdminPage />
</ProtectedRoute>
```

### Form Components

#### **Application Steps**
1. **PersonalInfoStep** - Basic user information
2. **AcademicBackgroundStep** - Education history
3. **ProgramInfoStep** - Why join, travel, projects
4. **DocumentUploadStep** - File uploads
5. **ReviewStep** - Final review and submission

### UI Components (`src/components/ui/`)
```typescript
- Button: Primary action buttons
- Card: Content containers
- Input: Form inputs
- LoadingSpinner: Loading states
- Toaster: Toast notifications
```

---

## 🔄 Application Workflow

### Complete Application Journey

```
┌─────────────────────────────────────────────────────┐
│  STEP 1: User Visits Landing Page                   │
│  - Public homepage at /                             │
│  - Options: Login, Register, or Apply Directly      │
└─────────────────┬───────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────┐
│  STEP 2: User Chooses Path                          │
│                                                      │
│  PATH A: Direct Application (No Account)           │
│    → /apply → Fill form → Submit → System creates  │
│      account → User can then login                  │
│                                                      │
│  PATH B: Registration First                         │
│    → /register → Create account → Auto-login →     │
│      Redirect to /applicant/application             │
│                                                      │
│  PATH C: Existing User Login                        │
│    → /login → Enter credentials → Validate →        │
│      Redirect to role-based dashboard               │
└─────────────────┬───────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────┐
│  STEP 3: Application Submission Process             │
│                                                      │
│  1. Fill Step 1: Personal Info                      │
│  2. Fill Step 2: Educational Background             │
│  3. Fill Step 3: Program Information                │
│  4. Upload Step 4: Documents (Letter of Interest)   │
│  5. Review Step 5: Final review                     │
│  6. Accept declaration & Submit                     │
│  7. Success message → Auto-redirect to /            │
│                                                      │
│  Data Saved:                                        │
│  - applicationFormData (localStorage)               │
│  - cdpta_submitted_applications (localStorage)      │
│  - Supabase (if configured)                         │
│  - Event bus notification                           │
└─────────────────┬───────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────┐
│  STEP 4: Admin Processing                           │
│                                                      │
│  1. Admin sees new application in Review page       │
│  2. Admin reviews application                       │
│  3. Admin clicks "Accept"                           │
│  4. System creates Fellow user                      │
│  5. Fellow auto-assigned to Khader (Preceptor)      │
│  6. Application status → "accepted"                 │
│  7. Fellow can now login with provided credentials  │
└─────────────────┬───────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────┐
│  STEP 5: Fellow Experience                          │
│                                                      │
│  1. Fellow logs in                                  │
│  2. Lands on Fellow Dashboard                       │
│  3. Can enroll in courses                           │
│  4. Can access learning modules                     │
│  5. Can submit assignments                          │
│  6. Can take quizzes                                │
│  7. Khader (Preceptor) monitors progress            │
└─────────────────────────────────────────────────────┘
```

---

## 🔐 Security & Access Control

### Route Protection Strategy

```typescript
// Public Routes (No Authentication)
- / (landing page)
- /login
- /register
- /forgot-password
- /apply
- /terms
- /privacy
- /announcements

// Protected Routes (All Roles)
- /dashboard
- /profile
- /settings
- /notifications

// Role-Specific Routes
- /applicant/* → APPLICANT only
- /fellow/* → FELLOW only
- /preceptor/* → PRECEPTOR only
- /admin/* → ADMIN only
```

### Permission Checking Flow

```
User Requests Protected Resource
         ↓
ProtectedRoute Checks
         ↓
Is Authenticated? ──No──→ Redirect to /login
         ↓ Yes
Has Required Role? ──No──→ Redirect to /unauthorized
         ↓ Yes
Has Required Permission? ──No──→ Redirect to /unauthorized
         ↓ Yes
Render Protected Content
```

---

## 📝 Key Data Structures

### User Object
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: Permission[];
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  profileData: {
    // Applicant fields
    applicationStatus?: 'pending' | 'under_review' | 'accepted' | 'rejected';
    
    // Fellow fields
    cohort?: string;
    mentor?: string;
    
    // Preceptor fields
    fellowsAssigned?: FellowInfo[];
  };
}
```

### Application Object
```typescript
interface ApplicationFormData {
  personalInfo: { /* ... */ };
  education: { /* ... */ };
  programInfo: {
    canTravel: boolean;
    travelReason?: string;
    whyJoinCDPTA: string;  // REQUIRED
    engagedInCDPTAProjects: boolean;
    projectDetails?: string;
  };
  documents: {
    letterOfInterest: ApplicationDocument | null;  // REQUIRED
    cv: ApplicationDocument | null;
    transcript: ApplicationDocument | null;
  };
  metadata: {
    status: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected';
  };
}
```

---

## 🎯 Key User Interactions

### 1. Applicant Submits Application
```
Trigger: Click "Submit Application" on Review step

Process:
1. Validate all required fields
2. Check declaration accepted
3. Generate application ID
4. Mark status as 'submitted'
5. Save to localStorage
6. Save to cdpta_submitted_applications
7. Emit APPLICATION_SUBMITTED event
8. Show success toast
9. Wait 3 seconds
10. Navigate to / (React Router)

Result:
- Application marked as submitted
- Admin can review in Application Review page
- Applicant cannot edit anymore
```

### 2. Admin Accepts Application
```
Trigger: Admin clicks "Accept Applicant"

Process:
1. Create new Fellow user
2. Set Fellow role and permissions
3. Create preceptor assignment (assign to Khader)
4. Update Khader's profile (add to fellowsAssigned)
5. Mark application as 'accepted'
6. Fellow can now login

Result:
- New Fellow account created
- Fellow visible in Khader's "Manage Fellows"
- Fellow can access all fellow features
```

### 3. Fellow Enrolls in Course
```
Trigger: Fellow clicks "Enroll" on course

Process:
1. Add course to fellow's enrolled courses
2. Update localStorage
3. Show success toast
4. Course appears in Fellow's courses list

Result:
- Fellow has access to course content
- Fellow can see assignments
- Fellow can submit work
```

### 4. Preceptor Creates Course
```
Trigger: Preceptor fills "Create Course" form

Process:
1. Fill course details (title, description, modules)
2. Add assignments and quizzes
3. Publish course
4. Save to localStorage cdpta_courses
5. Course available for Fellows to enroll

Result:
- Course visible in course list
- Fellows can enroll
- Preceptor can manage course content
```

---

## 🔧 System Configuration

### Environment Variables
```env
VITE_SUPABASE_URL=https://hyuigdjzxiqnrqfppmgm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### LocalStorage Keys
```typescript
'cdpta_users' → All users
'user_{email}' → Individual user with password
'applicationFormData' → Current application draft
'cdpta_submitted_applications' → Submitted apps
'application_{id}' → Individual application
'document_{type}' → Uploaded documents
'cdpta_courses' → All courses
'cdpta_announcements' → All announcements
```

### Supabase Integration (Optional)
- Falls back to localStorage if not configured
- Provides real-time sync across devices
- Database backup and persistence
- Row Level Security (RLS) for data protection

---

## 📊 Navigation Flow

```
Public Pages
    ↓
/ (Landing Page)
    ↓
User chooses: Login | Register | Apply Directly
    ↓
┌───────────┬──────────────┬───────────────┐
│           │              │               │
Login    Register    Apply Directly
│           │              │
│           ↓              ↓
│      Create Account   Fill Form
│           │              │
│           ↓              │
│      Auto-login ←────────┘
│           │
└───────────┘
    ↓
Dashboard Redirect (Smart Routing)
    ↓
┌──────────────────────────────────────┐
│      Check User Role                 │
└───────────┬──────────────────────────┘
            ↓
    ┌───────┴────────┐
    │                │
Applicant?      Other Roles?
    │                │
    ↓                ↓
Check if        Role Dashboard
app started
    │
    ↓
Has App? ─No→ Welcome Page → Application
    │
    ↓ Yes
Dashboard
```

---

## 🎓 Understanding Each Role's Journey

### APPLICANT Journey
```
1. Discover program → Landing page
2. Apply → Fill 5-step form
3. Upload documents → Letter of Interest required
4. Submit → Wait for review
5. Check status → Track application
6. If accepted → Become Fellow
7. If rejected → View feedback (if provided)
```

### FELLOW Journey
```
1. Login → Fellow Dashboard
2. Enroll in courses → Browse and select
3. Access modules → Learn content
4. Complete assignments → Submit work
5. Take quizzes → Test knowledge
6. Track progress → Monitor completion
7. Work on projects → Collaborate with preceptor
```

### PRECEPTOR Journey
```
1. Login → Preceptor Dashboard
2. View assigned fellows → Monitor progress
3. Create courses → Develop content
4. Manage assignments → Create tasks
5. Review submissions → Grade work
6. Provide feedback → Guide fellows
7. Generate reports → Track metrics
```

### ADMIN Journey
```
1. Login → Admin Dashboard
2. Manage users → Create/edit/delete
3. Review applications → Accept/reject
4. Create announcements → Broadcast messages
5. Assign preceptors → Manage relationships
6. View analytics → Track metrics
7. Configure system → Manage settings
```

---

## 🚀 Quick Start Guide

### For Applicants
```
1. Go to https://your-domain.com
2. Click "Apply Now" or navigate to /apply
3. Fill out the 5-step application form
4. Upload required documents (Letter of Interest)
5. Submit application
6. Track status in Dashboard
```

### For Admins
```
1. Login with admin credentials
2. Go to Application Review page
3. Review applications
4. Accept applicants to create Fellow accounts
5. Fellows will be auto-assigned to Khader (default preceptor)
6. Monitor system through Dashboard
```

### For Fellows
```
1. Login with Fellow credentials
2. Enroll in courses from Courses page
3. Access learning materials
4. Submit assignments before deadlines
5. Take quizzes to test knowledge
6. Track your progress
```

### For Preceptors
```
1. Login with Preceptor credentials
2. View assigned fellows
3. Create courses and assignments
4. Monitor fellow progress
5. Provide feedback and guidance
6. Generate progress reports
```

---

## 🔍 Troubleshooting

### Common Issues

**Issue**: Can't login
```typescript
Check:
1. Correct email format
2. Correct password (password123 for demo users)
3. User exists in localStorage
4. Console for errors
5. localStorage keys: 'cdpta_users', 'user_{email}'
```

**Issue**: Application not saving
```typescript
Check:
1. Browser console for errors
2. localStorage quota (5MB limit)
3. applicationFormData key exists
4. Network tab for failed requests
```

**Issue**: File upload not working
```typescript
Check:
1. File size (max 5-10MB)
2. File format (.pdf, .doc, .docx)
3. localStorage available space
4. Console for upload errors
```

**Issue**: Cross-tab sync not working
```typescript
Check:
1. Storage events are firing
2. Browser supports storage events
3. userSyncService is initialized
4. No localStorage errors
```

---

## 📚 Summary

This CDPTA Platform is a comprehensive fellowship management system with:

✅ **4 User Roles**: Applicant, Fellow, Preceptor, Admin  
✅ **Role-Based Access Control**: Each role has specific permissions  
✅ **5-Step Application Process**: Simple, guided application flow  
✅ **Document Management**: Required Letter of Interest upload  
✅ **User Synchronization**: Centralized sync across all storage  
✅ **Real-time Updates**: Cross-tab synchronization  
✅ **Preceptor-Fellow Relationships**: Automatic assignments  
✅ **Course Management**: Create, enroll, and track courses  
✅ **Assignment System**: Submit and grade assignments  

### Key Features Implemented:
- ✅ Application form with travel ability, why join CDPTA, and project engagement
- ✅ Required Letter of Interest PDF upload
- ✅ User sync service for data consistency
- ✅ Submission redirect to home page
- ✅ Auto-assignment of fellows to preceptors
- ✅ Real-time cross-tab updates
- ✅ Role-based navigation and permissions

This is a production-ready platform with complete user management, application processing, and fellowship tracking capabilities.
