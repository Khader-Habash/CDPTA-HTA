# CDPTA Platform - Quick Reference Card

## 🌐 Live Application
**Production URL:** https://cdpta-3-kyonqqity-zothmans-projects.vercel.app

---

## 🔑 Login Credentials

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | admin@example.com | password123 | Full system access |
| **Preceptor** | preceptor@example.com | password123 | Course & fellow management |
| **Fellow** | fellow@example.com | password123 | Learning & courses |
| **Applicant** | applicant@example.com | password123 | Application process |

---

## 🎯 Role Capabilities

### Admin
- ✅ Full system access
- ✅ User management
- ✅ Create preceptors/fellows
- ✅ System settings
- ✅ Analytics
- ✅ Application review

### Preceptor (formerly Staff)
- ✅ Create courses
- ✅ Create quizzes/exams
- ✅ Create assignments
- ✅ Upload materials (PDF, etc.)
- ✅ Manage fellows
- ✅ Track progress
- ❌ Cannot access admin functions

### Fellow
- ✅ View courses
- ✅ Take quizzes/exams
- ✅ Submit assignments
- ✅ Track progress
- ❌ Cannot create courses
- ❌ Cannot create quizzes/assignments

### Applicant
- ✅ Submit application
- ✅ Track application status
- ✅ View program info
- ❌ No access to courses

---

## 🚀 Quick Actions

### As Admin - Create New User
```
1. Login → admin@example.com
2. Admin Dashboard → User Management
3. Click "Create User" button
4. Fill form (Preceptor or Fellow)
5. Generate password (optional)
6. Send invitation email (optional)
7. Click "Create User"
```

### As Preceptor - Create Course
```
1. Login → preceptor@example.com
2. Preceptor Dashboard
3. Course Management
4. Create new course
5. Add modules
6. Upload materials (PDFs, videos)
7. Publish
```

### As Preceptor - Create Quiz
```
1. Login → preceptor@example.com
2. Course Management
3. Create Quiz
4. Add questions:
   - Multiple choice
   - True/False
   - Short answer
   - Essay
5. Set points per question
6. Set correct answers
7. Publish
```

### As Fellow - Take Course
```
1. Login → fellow@example.com
2. My Courses
3. Select course
4. Complete modules
5. Take quizzes
6. Submit assignments
```

---

## 📁 File Upload Support

### Supported Formats
- 📄 **Documents:** .pdf, .doc, .docx
- 📊 **Presentations:** .ppt, .pptx
- 🎥 **Videos:** .mp4, .avi, .mov
- 🎵 **Audio:** .mp3, .wav
- 🖼️ **Images:** .jpg, .jpeg, .png

### Where to Upload
- Assignment creation
- Course materials
- Module resources
- Quiz attachments

---

## 🏗️ Course Structure

```
Course
├── Module 1
│   ├── 📖 Lectures
│   ├── 📄 Materials (PDFs, videos)
│   ├── ✅ Quizzes
│   └── 📝 Assignments
├── Module 2
│   └── ...
└── Module 3
    └── ...
```

---

## 🔄 Navigation Routes

### Admin Routes
- `/admin/dashboard` - Main dashboard
- `/admin/users` - User management
- `/admin/applications` - Application review
- `/admin/announcements` - Announcement management
- `/admin/settings` - System settings
- `/admin/analytics` - Analytics

### Preceptor Routes
- `/preceptor/dashboard` - Main dashboard
- `/preceptor/profile` - Profile
- `/preceptor/fellows` - Manage fellows
- `/preceptor/courses` - Course management

### Fellow Routes
- `/fellow/dashboard` - Main dashboard
- `/fellow/profile` - Profile
- `/fellow/modules` - Learning modules
- `/fellow/courses` - My courses
- `/fellow/projects` - My projects

### Applicant Routes
- `/applicant/dashboard` - Main dashboard
- `/applicant/application` - Application form
- `/applicant/status` - Application status
- `/applicant/program-info` - Program info

### Common Routes
- `/` - Home page
- `/login` - Login page
- `/register` - Registration
- `/profile` - User profile
- `/settings` - User settings

---

## 🛠️ Admin User Creation

### Auto-Generate Features
1. **Password Generator**
   - Click "Generate Secure Password"
   - 12 characters with special chars
   - Displayed for admin to save

2. **Username Generator**
   - Enter first & last name
   - Auto-generates: `firstname.lastname`
   - Can be manually edited

3. **Email Invitation**
   - Check "Send invitation email"
   - Sends credentials to user
   - User can change password later

---

## 📋 Application Form Changes

### ✅ What's New
- Label: "Highest Educational Degree" (was "Current Level")
- Removed: "Prof" title option
- Removed: "High School" education level
- Removed: "Previous Education" section

### Available Titles
- Mr
- Ms
- Mrs
- Dr
- Other

### Available Education Levels
- Bachelor's Degree
- Master's Degree
- PhD
- Professional Degree (MD, PharmD, etc.)
- Other

---

## 🎓 Quiz/Exam Features

### Question Types
1. **Multiple Choice**
   - Add options
   - Mark correct answer
   - Assign points

2. **True/False**
   - Quick yes/no questions
   - Auto-generated options

3. **Short Answer**
   - Text input
   - Manual grading

4. **Essay**
   - Long-form response
   - Manual grading

5. **File Upload**
   - Submit files as answer
   - Manual grading

### Grading Features
- Points per question
- Correct answer tracking
- Explanation text
- Manual grading support
- Auto-grading for multiple choice

---

## 🔐 Password Requirements

- Minimum 8 characters
- Can include:
  - Letters (a-z, A-Z)
  - Numbers (0-9)
  - Special characters (!@#$%^&*)
- Users can change after first login

---

## 📊 Status Indicators

### User Status
- 🟢 **Active** - Can login and use system
- 🟡 **Pending** - Awaiting approval
- 🔴 **Inactive** - Cannot login
- ⛔ **Suspended** - Temporarily blocked

### Application Status
- 📝 **Draft** - Not submitted
- ⏳ **Pending** - Under review
- ✅ **Approved** - Accepted
- ❌ **Rejected** - Not accepted
- 🔄 **Needs Info** - Additional info required

### Course Status
- 📘 **Published** - Live and accessible
- 📕 **Draft** - In development
- 📙 **Archived** - No longer active

---

## 🐛 Troubleshooting

### Can't Login?
1. Check email spelling
2. Verify password
3. Check if account is active
4. Contact admin

### Can't See Courses? (Fellow)
1. Check if enrolled
2. Verify course is published
3. Check start date
4. Contact preceptor

### Can't Create Course? (Preceptor)
1. Verify logged in as preceptor
2. Check permissions
3. Clear browser cache
4. Contact admin

### File Upload Fails?
1. Check file size (<10MB)
2. Verify file format
3. Check internet connection
4. Try different browser

---

## 📞 Getting Help

### For Technical Issues
- Contact system administrator
- Email: admin@cdpta.org (demo)
- Check documentation files

### For Account Issues
- Admin can reset passwords
- Admin can update roles
- Admin can create new accounts

---

## 📚 Documentation Files

- `README.md` - Main documentation
- `DEPLOYMENT_INFO.md` - Deployment guide
- `FINAL_EDITS_SUMMARY.md` - Technical changes
- `WHATS_NEW.md` - User guide
- `PRECEPTOR_RENAME_FIX.md` - Latest fix details
- `QUICK_REFERENCE.md` - This file

---

## ✅ Recent Updates

### Latest (Current Session)
- ✅ Fixed Preceptor role (was broken)
- ✅ All UserRole.STAFF → UserRole.PRECEPTOR
- ✅ Mock data updated
- ✅ Permissions fixed
- ✅ Build & deploy successful

### Previous Updates
- ✅ All 12 requested edits completed
- ✅ Admin user creation feature added
- ✅ Application form streamlined
- ✅ Fellow dashboard cleaned up

---

## 🎯 Quick Tips

### For Best Experience
- Use latest Chrome/Firefox/Edge
- Enable JavaScript
- Allow cookies
- Stable internet connection

### For Preceptors
- Organize courses into modules
- Upload materials before publishing
- Set clear due dates
- Provide quiz explanations

### For Fellows
- Complete modules in order
- Review materials before quizzes
- Submit assignments early
- Track your progress

### For Admins
- Create users before start date
- Send invitation emails
- Monitor user activity
- Review applications promptly

---

**Last Updated:** Current Session  
**Version:** 2.0.0  
**Status:** ✅ All Systems Operational


## 🌐 Live Application
**Production URL:** https://cdpta-3-kyonqqity-zothmans-projects.vercel.app

---

## 🔑 Login Credentials

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | admin@example.com | password123 | Full system access |
| **Preceptor** | preceptor@example.com | password123 | Course & fellow management |
| **Fellow** | fellow@example.com | password123 | Learning & courses |
| **Applicant** | applicant@example.com | password123 | Application process |

---

## 🎯 Role Capabilities

### Admin
- ✅ Full system access
- ✅ User management
- ✅ Create preceptors/fellows
- ✅ System settings
- ✅ Analytics
- ✅ Application review

### Preceptor (formerly Staff)
- ✅ Create courses
- ✅ Create quizzes/exams
- ✅ Create assignments
- ✅ Upload materials (PDF, etc.)
- ✅ Manage fellows
- ✅ Track progress
- ❌ Cannot access admin functions

### Fellow
- ✅ View courses
- ✅ Take quizzes/exams
- ✅ Submit assignments
- ✅ Track progress
- ❌ Cannot create courses
- ❌ Cannot create quizzes/assignments

### Applicant
- ✅ Submit application
- ✅ Track application status
- ✅ View program info
- ❌ No access to courses

---

## 🚀 Quick Actions

### As Admin - Create New User
```
1. Login → admin@example.com
2. Admin Dashboard → User Management
3. Click "Create User" button
4. Fill form (Preceptor or Fellow)
5. Generate password (optional)
6. Send invitation email (optional)
7. Click "Create User"
```

### As Preceptor - Create Course
```
1. Login → preceptor@example.com
2. Preceptor Dashboard
3. Course Management
4. Create new course
5. Add modules
6. Upload materials (PDFs, videos)
7. Publish
```

### As Preceptor - Create Quiz
```
1. Login → preceptor@example.com
2. Course Management
3. Create Quiz
4. Add questions:
   - Multiple choice
   - True/False
   - Short answer
   - Essay
5. Set points per question
6. Set correct answers
7. Publish
```

### As Fellow - Take Course
```
1. Login → fellow@example.com
2. My Courses
3. Select course
4. Complete modules
5. Take quizzes
6. Submit assignments
```

---

## 📁 File Upload Support

### Supported Formats
- 📄 **Documents:** .pdf, .doc, .docx
- 📊 **Presentations:** .ppt, .pptx
- 🎥 **Videos:** .mp4, .avi, .mov
- 🎵 **Audio:** .mp3, .wav
- 🖼️ **Images:** .jpg, .jpeg, .png

### Where to Upload
- Assignment creation
- Course materials
- Module resources
- Quiz attachments

---

## 🏗️ Course Structure

```
Course
├── Module 1
│   ├── 📖 Lectures
│   ├── 📄 Materials (PDFs, videos)
│   ├── ✅ Quizzes
│   └── 📝 Assignments
├── Module 2
│   └── ...
└── Module 3
    └── ...
```

---

## 🔄 Navigation Routes

### Admin Routes
- `/admin/dashboard` - Main dashboard
- `/admin/users` - User management
- `/admin/applications` - Application review
- `/admin/announcements` - Announcement management
- `/admin/settings` - System settings
- `/admin/analytics` - Analytics

### Preceptor Routes
- `/preceptor/dashboard` - Main dashboard
- `/preceptor/profile` - Profile
- `/preceptor/fellows` - Manage fellows
- `/preceptor/courses` - Course management

### Fellow Routes
- `/fellow/dashboard` - Main dashboard
- `/fellow/profile` - Profile
- `/fellow/modules` - Learning modules
- `/fellow/courses` - My courses
- `/fellow/projects` - My projects

### Applicant Routes
- `/applicant/dashboard` - Main dashboard
- `/applicant/application` - Application form
- `/applicant/status` - Application status
- `/applicant/program-info` - Program info

### Common Routes
- `/` - Home page
- `/login` - Login page
- `/register` - Registration
- `/profile` - User profile
- `/settings` - User settings

---

## 🛠️ Admin User Creation

### Auto-Generate Features
1. **Password Generator**
   - Click "Generate Secure Password"
   - 12 characters with special chars
   - Displayed for admin to save

2. **Username Generator**
   - Enter first & last name
   - Auto-generates: `firstname.lastname`
   - Can be manually edited

3. **Email Invitation**
   - Check "Send invitation email"
   - Sends credentials to user
   - User can change password later

---

## 📋 Application Form Changes

### ✅ What's New
- Label: "Highest Educational Degree" (was "Current Level")
- Removed: "Prof" title option
- Removed: "High School" education level
- Removed: "Previous Education" section

### Available Titles
- Mr
- Ms
- Mrs
- Dr
- Other

### Available Education Levels
- Bachelor's Degree
- Master's Degree
- PhD
- Professional Degree (MD, PharmD, etc.)
- Other

---

## 🎓 Quiz/Exam Features

### Question Types
1. **Multiple Choice**
   - Add options
   - Mark correct answer
   - Assign points

2. **True/False**
   - Quick yes/no questions
   - Auto-generated options

3. **Short Answer**
   - Text input
   - Manual grading

4. **Essay**
   - Long-form response
   - Manual grading

5. **File Upload**
   - Submit files as answer
   - Manual grading

### Grading Features
- Points per question
- Correct answer tracking
- Explanation text
- Manual grading support
- Auto-grading for multiple choice

---

## 🔐 Password Requirements

- Minimum 8 characters
- Can include:
  - Letters (a-z, A-Z)
  - Numbers (0-9)
  - Special characters (!@#$%^&*)
- Users can change after first login

---

## 📊 Status Indicators

### User Status
- 🟢 **Active** - Can login and use system
- 🟡 **Pending** - Awaiting approval
- 🔴 **Inactive** - Cannot login
- ⛔ **Suspended** - Temporarily blocked

### Application Status
- 📝 **Draft** - Not submitted
- ⏳ **Pending** - Under review
- ✅ **Approved** - Accepted
- ❌ **Rejected** - Not accepted
- 🔄 **Needs Info** - Additional info required

### Course Status
- 📘 **Published** - Live and accessible
- 📕 **Draft** - In development
- 📙 **Archived** - No longer active

---

## 🐛 Troubleshooting

### Can't Login?
1. Check email spelling
2. Verify password
3. Check if account is active
4. Contact admin

### Can't See Courses? (Fellow)
1. Check if enrolled
2. Verify course is published
3. Check start date
4. Contact preceptor

### Can't Create Course? (Preceptor)
1. Verify logged in as preceptor
2. Check permissions
3. Clear browser cache
4. Contact admin

### File Upload Fails?
1. Check file size (<10MB)
2. Verify file format
3. Check internet connection
4. Try different browser

---

## 📞 Getting Help

### For Technical Issues
- Contact system administrator
- Email: admin@cdpta.org (demo)
- Check documentation files

### For Account Issues
- Admin can reset passwords
- Admin can update roles
- Admin can create new accounts

---

## 📚 Documentation Files

- `README.md` - Main documentation
- `DEPLOYMENT_INFO.md` - Deployment guide
- `FINAL_EDITS_SUMMARY.md` - Technical changes
- `WHATS_NEW.md` - User guide
- `PRECEPTOR_RENAME_FIX.md` - Latest fix details
- `QUICK_REFERENCE.md` - This file

---

## ✅ Recent Updates

### Latest (Current Session)
- ✅ Fixed Preceptor role (was broken)
- ✅ All UserRole.STAFF → UserRole.PRECEPTOR
- ✅ Mock data updated
- ✅ Permissions fixed
- ✅ Build & deploy successful

### Previous Updates
- ✅ All 12 requested edits completed
- ✅ Admin user creation feature added
- ✅ Application form streamlined
- ✅ Fellow dashboard cleaned up

---

## 🎯 Quick Tips

### For Best Experience
- Use latest Chrome/Firefox/Edge
- Enable JavaScript
- Allow cookies
- Stable internet connection

### For Preceptors
- Organize courses into modules
- Upload materials before publishing
- Set clear due dates
- Provide quiz explanations

### For Fellows
- Complete modules in order
- Review materials before quizzes
- Submit assignments early
- Track your progress

### For Admins
- Create users before start date
- Send invitation emails
- Monitor user activity
- Review applications promptly

---

**Last Updated:** Current Session  
**Version:** 2.0.0  
**Status:** ✅ All Systems Operational















