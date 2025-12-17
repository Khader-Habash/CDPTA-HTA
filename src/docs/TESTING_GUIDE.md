# 🧪 CDPTA Testing Guide

## 🔗 Your Application
**URL: http://localhost:3001/**

---

## 🆕 **Testing New Applicant Flow**

### Step 1: Register a New Applicant
1. Go to: **http://localhost:3001/register**
2. Fill out the registration form:
   - **Role**: Select "Applicant"
   - **Email**: Use a unique email (e.g., `test123@example.com`)
   - **Password**: Any password (e.g., `password123`)
   - Fill other required fields
3. Click "Create Account"
4. **Expected Result**: 
   - ✅ Success message appears
   - ✅ Automatically redirected to application form
   - ✅ No need to manually navigate

### Step 2: Test Application Process
1. Start filling out the application form
2. **Expected Result**: 
   - ✅ Form saves automatically
   - ✅ Progress is tracked
3. Submit the application when ready
4. **Expected Result**: 
   - ✅ Success message appears
   - ✅ Application submitted successfully

### Step 3: Test Login with New Account
1. Go to: **http://localhost:3001/login**
2. Login with the credentials you just created
3. **Expected Result**: 
   - ✅ Login successful
   - ✅ Redirected to applicant dashboard (since you have application data)

---

## 🔄 **Testing Real-time Synchronization**

### Setup: Open Multiple Browser Windows
1. **Window 1**: Login as Admin
   - Email: `admin@cdpta.org`
   - Password: `admin123`
   - Navigate to: Admin Dashboard → Application Review

2. **Window 2**: Login as Fellow
   - Email: `fellow@cdpta.org`
   - Password: `fellow123`
   - Navigate to: Fellow Dashboard

### Test 1: Application Synchronization
1. **In Admin Window**: Go to Admin Dashboard
2. **Click**: "Simulate Application" button in the Realtime Demo section
3. **Expected Results**:
   - ✅ Toast notification appears: "Demo Application Submitted"
   - ✅ Console shows: "📧 Admin received application submission"
4. **Navigate**: To Application Review page
5. **Expected Result**:
   - ✅ New application appears at the top of the list
   - ✅ Shows "John Demo User" application

### Test 2: Assignment/Quiz Synchronization
1. **In Admin Window**: Click demo buttons:
   - "Create Assignment"
   - "Create Quiz"
   - "Create Module"
   - "Schedule Lecture"
2. **In Fellow Window**: Watch for notifications
3. **Expected Results**:
   - ✅ Toast notifications appear immediately
   - ✅ Console shows: "📚 Fellow received assignment creation"
   - ✅ "Recent Updates" section shows new items
   - ✅ All events appear in real-time

---

## 🔧 **Testing User Registration & Login**

### Test Demo Users (Pre-existing)
```
Admin:
- Email: admin@cdpta.org
- Password: admin123

Staff:
- Email: staff@cdpta.org
- Password: staff123

Fellow:
- Email: fellow@cdpta.org
- Password: fellow123

Applicant:
- Email: applicant@cdpta.org
- Password: applicant123
```

### Test New User Registration
1. **Create New Users**: Use the registration form
2. **Login Test**: Use the same credentials to login
3. **Expected Result**: 
   - ✅ Registration stores user in localStorage
   - ✅ Login works with new credentials
   - ✅ User data persists between sessions

---

## 🐛 **Debugging & Troubleshooting**

### Check Browser Console
- **F12** → Console tab
- Look for these log messages:
  - `🔥 EventBus: Emitting [event_name]`
  - `📧 Admin received application submission`
  - `📚 Fellow received assignment creation`

### Check LocalStorage
- **F12** → Application tab → Local Storage
- Look for:
  - `registeredUsers` - New user accounts
  - `applicationFormData` - Application progress
  - `token` - Authentication token

### Clear Data for Fresh Testing
```javascript
// Run in browser console to reset
localStorage.clear();
location.reload();
```

---

## ✅ **Expected Behaviors**

### ✅ New Applicant Flow
- Registration → Auto Login → Application Form
- No manual navigation required
- Smart routing based on application status

### ✅ Real-time Synchronization
- Events fire immediately across browser windows
- Toast notifications appear
- UI updates in real-time
- Console logs show event flow

### ✅ User Management
- New users can register and login
- User data persists
- Role-based routing works

---

## 🚨 **Common Issues & Solutions**

### Issue: "Invalid email or password"
**Solution**: Check the console for available users, or register a new account

### Issue: No real-time updates
**Solution**: 
1. Check browser console for event logs
2. Make sure both windows are on the same domain
3. Try refreshing both windows

### Issue: Registration not working
**Solution**: 
1. Check browser console for errors
2. Make sure all required fields are filled
3. Use a unique email address

---

## 🎯 **Success Criteria**

**✅ New Applicant Flow Works When:**
- Registration redirects to application form
- Returning users go to dashboard
- Smart routing based on application status

**✅ Real-time Sync Works When:**
- Demo buttons trigger immediate notifications
- Events appear in console logs
- UI updates across multiple windows
- Toast messages appear instantly

**✅ User Management Works When:**
- New users can register and login
- Authentication persists
- Role-based access works correctly
