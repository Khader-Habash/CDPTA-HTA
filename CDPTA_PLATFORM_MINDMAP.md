# 🗺️ CDPTA Platform - Visual Mind Map

```
                                    ╔═══════════════════════════════════════════════════════════════════╗
                                    ║                    CDPTA PLATFORM                                   ║
                                    ║         Center for Drug Policy & Technology Assessment            ║
                                    ╚═══════════════════════════════════════════════════════════════════╝
                                                    │
                        ┌───────────────────────────┼───────────────────────────┐
                        │                           │                           │
            ┌───────────▼───────────┐   ┌───────────▼───────────┐   ┌───────────▼───────────┐
            │   AUTHENTICATION      │   │   DATA STORAGE        │   │   USER ROLES         │
            │                       │   │                       │   │                       │
            │  • Login/Logout       │   │  • localStorage       │   │  • APPLICANT          │
            │  • Register           │   │  • Supabase (opt)     │   │  • FELLOW             │
            │  • Password Reset     │   │  • Cross-tab sync     │   │  • PRECEPTOR          │
            │  • Token Management   │   │  • Real-time updates  │   │  • ADMIN              │
            └───────────────────────┘   └───────────────────────┘   └───────────────────────┘
                        │                           │                           │
                        └───────────────────────────┼───────────────────────────┘
                                                    │
                                    ┌───────────────▼────────────────┐
                                    │        APPLICATION CORE        │
                                    └───────────────┬────────────────┘
                                                    │
        ┌───────────────────────────────────────────┼───────────────────────────────────────────┐
        │                                           │                                           │
┌───────▼────────┐                     ┌───────────▼──────────┐                    ┌───────────▼──────────┐
│   APPLICANT    │                     │      FELLOW          │                    │   PRECEPTOR         │
│   FLOW         │                     │      FLOW            │                    │   FLOW              │
│                │                     │                      │                    │                     │
│ 1. Apply       │                     │ 1. Enroll in course  │                    │ 1. Manage Fellows   │
│    ├─ Step 1:  │                     │ 2. Access modules    │                    │ 2. Create courses   │
│    │  Personal │                     │ 3. Complete tasks    │                    │ 3. Grade work       │
│    ├─ Step 2:  │                     │ 4. Submit work       │                    │ 4. Monitor progress │
│    │  Education│                     │ 5. Take quizzes      │                    │ 5. Track progress   │
│    ├─ Step 3:  │                     │ 6. Track progress    │                    │                     │
│    │  Program  │                     │                      │                    │                     │
│    │  Info     │                     │ PAGES:               │                    │ PAGES:              │
│    ├─ Step 4:  │                     │ • Dashboard          │                    │ • Dashboard         │
│    │  Documents│                     │ • Courses            │                    │ • Manage Fellows    │
│    └─ Step 5:  │                     │ • Modules            │                    │ • Courses           │
│       Review   │                     │ • Assignments        │                    │ • Monitoring        │
│                │                     │ • Quizzes            │                    │                     │
│ PAGES:         │                     │                      │                    │                     │
│ • Dashboard    │                     │ FEATURES:            │                    │ FEATURES:           │
│ • Application  │                     │ • Course enrollment  │                    │ • Course creation   │
│ • Status       │                     │ • Progress tracking  │                    │ • Fellow management│
│ • Program Info │                     │ • Assignment submit  │                    │ • Grading system    │
│                │                     │ • Quiz taking        │                    │ • Progress reports  │
│ FEATURES:      │                     │                      │                    │                     │
│ • Application  │                     │ PERMISSIONS:         │                    │ PERMISSIONS:        │
│   submission   │                     │ • Read courses       │                    │ • Read users        │
│ • Document     │                     │ • Read assignments   │                    │ • Read fellows      │
│   upload       │                     │ • Update assignments │                    │ • Create courses    │
│ • Progress     │                     │ • Read modules       │                    │ • Update courses    │
│   tracking     │                     │ • Update profile     │                    │ • Create assignments│
│                │                     │                      │                    │ • Read assignments  │
│ PERMISSIONS:   │                     │                      │                    │ • Update assignments│
│ • Create app   │                     │                      │                    │                     │
│ • Update app   │                     │ ASSIGNED TO:         │                    │ AUTOMATIC           │
│ • Read app     │                     │ • Khader (Default)   │                    │ ASSIGNMENT:         │
│                │                     │   Preceptor          │                    │ • New Fellows →     │
│                │                     │                      │                    │   Khader            │
└────────────────┘                     └──────────────────────┘                    └─────────────────────┘
        │                                           │                                           │
        └───────────────────────────────────────────┼───────────────────────────────────────────┘
                                                    │
                                    ┌───────────────▼────────────────┐
                                    │         ADMIN FLOW             │
                                    │                                │
                                    │ 1. User Management             │
                                    │    • Create users              │
                                    │    • Edit users                │
                                    │    • Activate/deactivate       │
                                    │    • Reset passwords           │
                                    │    • Delete users              │
                                    │                                │
                                    │ 2. Application Review          │
                                    │    • View applications         │
                                    │    • Accept applicants         │
                                    │    • Reject applicants         │
                                    │    • Convert to Fellow         │
                                    │                                │
                                    │ 3. Announcement Management     │
                                    │    • Create announcements      │
                                    │    • Edit announcements        │
                                    │    • Delete announcements      │
                                    │    • Publish/draft             │
                                    │                                │
                                    │ 4. Preceptor Assignments       │
                                    │    • Manage relationships      │
                                    │    • Assign fellows            │
                                    │    • Track assignments         │
                                    │                                │
                                    │ 5. System Configuration        │
                                    │    • View analytics            │
                                    │    • Manage settings           │
                                    │    • System metrics            │
                                    │                                │
                                    │ PAGES:                         │
                                    │ • Dashboard                    │
                                    │ • User Management              │
                                    │ • Application Review           │
                                    │ • Announcements                │
                                    │ • Preceptor Assignments        │
                                    │ • Analytics                    │
                                    │ • System Settings              │
                                    │                                │
                                    │ PERMISSIONS: ALL               │
                                    │ • Full system access           │
                                    └────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════════════
                         DETAILED FEATURE BREAKDOWN
═══════════════════════════════════════════════════════════════════════════════════════

┌───────────────────────────────────────────────────────────────────────────────────┐
│                           APPLICATION FORM STRUCTURE                              │
└───────────────────────────────────────────────────────────────────────────────────┘

    Start Application
           │
           ▼
    ┌──────────────┐
    │  STEP 1      │  Personal Information
    │              │  ├─ Name
    │  PERSONAL    │  ├─ Email
    │  INFO        │  ├─ Phone
    │              │  ├─ Date of Birth
    │              │  └─ Address
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │  STEP 2      │  Educational Background
    │              │  ├─ Current Level
    │  EDUCATION   │  ├─ Institution
    │              │  ├─ Field of Study
    │              │  └─ Graduation Date
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │  STEP 3      │  Program Information (NEW)
    │              │  ├─ Can Travel? (checkbox)
    │  PROGRAM     │  │   └─ Travel Details (conditional)
    │  INFO        │  ├─ Why Join CDPTA? (required)
    │              │  └─ CDPTA Projects (checkbox)
    │              │      └─ Project Details (conditional)
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │  STEP 4      │  Documents
    │              │  ├─ Letter of Interest (required PDF)
    │  DOCUMENTS   │  ├─ CV (optional)
    │              │  └─ Transcripts (optional)
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │  STEP 5      │  Review & Submit
    │              │  ├─ Review all information
    │  REVIEW      │  ├─ Accept declaration
    │              │  └─ Submit Application
    └──────┬───────┘
           │
           ▼
    Application Submitted
           │
           ▼
    Admin Notified


┌───────────────────────────────────────────────────────────────────────────────────┐
│                           DATA STORAGE ARCHITECTURE                               │
└───────────────────────────────────────────────────────────────────────────────────┘

    User Action (e.g., Update Profile)
           │
           ▼
    ┌────────────────────────────────────────────────────────┐
    │  userSyncService.updateUserSync()                      │
    │  ┌──────────────────────────────────────────────────┐  │
    │  │  • Updates userService                           │  │
    │  │  • Updates localStorage ('cdpta_users')          │  │
    │  │  • Updates individual key ('user_{email}')       │  │
    │  │  • Updates profileData & permissions             │  │
    │  │  • Broadcasts to other tabs                      │  │
    │  └──────────────────────────────────────────────────┘  │
    └────────────────────────┬───────────────────────────────┘
                             │
           ┌─────────────────┼─────────────────┐
           │                 │                 │
           ▼                 ▼                 ▼
    ┌──────────┐      ┌──────────┐      ┌──────────┐
    │ Auth     │      │ Local    │      │ Other    │
    │ Context  │      │ Storage  │      │ Tabs     │
    │ Updated  │      │ Updated  │      │ Synced   │
    └──────────┘      └──────────┘      └──────────┘


┌───────────────────────────────────────────────────────────────────────────────────┐
│                           ROUTE PROTECTION SYSTEM                                 │
└───────────────────────────────────────────────────────────────────────────────────┘

    User Requests Protected Route
           │
           ▼
    ┌─────────────────┐
    │ ProtectedRoute  │
    │    Component    │
    └────────┬────────┘
           │
           ▼
    Is user authenticated?
           │
      ┌────┴────┐
      │         │
     Yes       No
      │         │
      │         ▼
      │    Redirect to /login
      │
      ▼
    Does user have required role?
           │
      ┌────┴────┐
      │         │
     Yes       No
      │         │
      │         ▼
      │    Redirect to /unauthorized
      │
      ▼
    Does user have required permission?
           │
      ┌────┴────┐
      │         │
     Yes       No
      │         │
      │         ▼
      │    Redirect to /unauthorized
      │
      ▼
    Render Protected Content


┌───────────────────────────────────────────────────────────────────────────────────┐
│                           COMPLETE USER JOURNEY                                   │
└───────────────────────────────────────────────────────────────────────────────────┘

    Public Landing Page (/)
           │
           ▼
    ┌──────────────────────────┐
    │ Choose Entry Point       │
    └───────────┬──────────────┘
                │
      ┌─────────┼─────────┐
      │         │         │
      ▼         ▼         ▼
    Login  Register   Apply Direct
      │         │         │
      │         │         ▼
      │         │    Fill Application
      │         │         │
      │         ▼         │
      │    Auto-login ────┘
      │         │
      └─────────┘
                │
                ▼
    Dashboard Redirect (Smart Routing)
                │
      ┌─────────┼─────────┐
      │         │         │
      ▼         ▼         ▼
   ADMIN   PRECEPTOR   FELLOW
      │         │         │
      │         │         ▼
      │         ▼     Enroll in
      │    Manage      courses
      │    Fellows         │
      │         │         ▼
      │         ▼    Access content
      │    Monitor         │
      │    Progress        ▼
      │              Submit work
      │                     │
      ▼                     │
    Manage                  │
    System                  │
      │                     │
      └─────────────────────┘
                    │
                    ▼
            Program Completion


═══════════════════════════════════════════════════════════════════════════════════════
                                 QUICK REFERENCE
═══════════════════════════════════════════════════════════════════════════════════════

USER CREDENTIALS:
─────────────────
Admin:     abeer@gmail.com    / password123
Preceptor: khader@gmail.com   / password123
Fellow:    zaid@gmail.com     / password123
Applicant: applicant@example.com / password123


KEY ROUTES:
───────────
Public:
  /                   → Landing page
  /login              → Login page
  /register           → Registration
  /apply              → Direct application
  /announcements      → Public announcements

Protected - Applicant:
  /applicant/dashboard     → Applicant dashboard
  /applicant/application   → Application form
  /applicant/status        → Application status
  /applicant/program-info  → Program information

Protected - Fellow:
  /fellow/dashboard    → Fellow dashboard
  /fellow/courses      → Browse courses
  /fellow/modules      → Learning modules
  /fellow/assignments  → View assignments
  /fellow/quizzes      → Take quizzes

Protected - Preceptor:
  /preceptor/dashboard  → Preceptor dashboard
  /preceptor/fellows    → Manage fellows
  /preceptor/courses    → Manage courses
  /preceptor/monitoring → Monitor progress

Protected - Admin:
  /admin/dashboard         → Admin dashboard
  /admin/users             → User management
  /admin/applications      → Review applications
  /admin/announcements     → Manage announcements
  /admin/preceptor-assignments → Manage assignments
  /admin/analytics         → View analytics
  /admin/settings          → System settings


LOCALSTORAGE KEYS:
──────────────────
'cdpta_users'                    → All users
'user_{email}'                   → Individual user with password
'applicationFormData'            → Current application draft
'cdpta_submitted_applications'   → Submitted applications
'application_{id}'               → Individual application data
'document_{type}'                → Uploaded documents
'cdpta_courses'                  → All courses
'cdpta_announcements'            → All announcements


AUTOMATIC ASSIGNMENTS:
──────────────────────
• New Fellows automatically assigned to Khader (default preceptor)
• Fellow → Preceptor relationship created automatically
• Khader's profile updated with new fellow in fellowsAssigned


SYNCHRONIZATION:
────────────────
• Real-time updates across browser tabs
• localStorage as primary storage
• Supabase as optional backup
• Cross-tab sync via StorageEvent
• Automatic data consistency via userSyncService


═══════════════════════════════════════════════════════════════════════════════════════
                                 END OF MIND MAP
═══════════════════════════════════════════════════════════════════════════════════════
