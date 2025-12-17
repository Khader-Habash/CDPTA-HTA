# Debugging Application Save Issue

## Steps to Debug

1. Open browser console (F12)
2. Submit an application
3. Check for these console messages:
   - `✅ Application saved to localStorage for admin view`
   - `📢 Application broadcasted to all tabs (local)`
   - `✅ Application submitted event emitted successfully`

4. In console, run this command to check localStorage:
   ```javascript
   const apps = JSON.parse(localStorage.getItem('cdpta_submitted_applications') || '[]');
   console.log('Applications in localStorage:', apps);
   console.log('Number of applications:', apps.length);
   apps.forEach((app, i) => {
     console.log(`App ${i}:`, {
       id: app.id,
       status: app.metadata?.status,
       applicantName: app.personalInfo?.firstName + ' ' + app.personalInfo?.lastName,
       submittedAt: app.submittedAt
     });
   });
   ```

5. Check if admin page is receiving the data:
   - Open Admin > Application Review page
   - Check console for:
     - `🚀 Fetching applications from Supabase...` or
     - `⚠️ Supabase not configured, using localStorage for applications`
     - `✅ Loaded X applications from localStorage`

6. If applications exist but don't show:
   - Check status filter - should be "All Status" or "Submitted"
   - Check if `app.metadata.status === 'submitted'` for each app

## Common Issues

1. **Status not 'submitted'**: Application might have status 'draft' or undefined
2. **Missing personalInfo**: Application data structure might be incomplete
3. **localStorage cleared**: Browser might have cleared localStorage
4. **Admin page not refreshing**: Need to manually refresh or check event listeners

## Quick Fix Test

Run this in console to manually add a test application:

```javascript
const testApp = {
  id: 'TEST-' + Date.now(),
  applicantId: 'test-user',
  submittedAt: new Date().toISOString(),
  personalInfo: {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com'
  },
  metadata: {
    status: 'submitted',
    applicationId: 'TEST-' + Date.now(),
    submittedAt: new Date().toISOString()
  }
};

const apps = JSON.parse(localStorage.getItem('cdpta_submitted_applications') || '[]');
apps.push(testApp);
localStorage.setItem('cdpta_submitted_applications', JSON.stringify(apps));
console.log('✅ Test application added. Refresh admin page.');
```



