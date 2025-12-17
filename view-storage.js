// View Website Storage - Run this in Browser Console (F12)

console.log('='.repeat(60));
console.log('CDPTA Platform - Storage Overview');
console.log('='.repeat(60));

// Get all localStorage keys
const allKeys = Object.keys(localStorage);
const relevantKeys = allKeys.filter(key => 
  key.includes('cdpta') || 
  key.includes('application') || 
  key.includes('user_') || 
  key.includes('document_') || 
  key.includes('token') ||
  key.includes('announcement') ||
  key.includes('course') ||
  key.includes('assignment')
);

console.log('\n📊 Storage Statistics:');
console.log('Total localStorage keys:', allKeys.length);
console.log('Relevant keys:', relevantKeys.length);
console.log('='.repeat(60));

// Calculate storage size
let totalSize = 0;
relevantKeys.forEach(key => {
  const size = (localStorage.getItem(key)?.length || 0) + key.length;
  totalSize += size;
});
console.log(`Total storage used: ${(totalSize / 1024).toFixed(2)} KB`);
console.log('='.repeat(60));

// Show detailed breakdown
console.log('\n🔑 Storage Keys Breakdown:\n');

// Applications
const applications = JSON.parse(localStorage.getItem('cdpta_submitted_applications') || '[]');
console.log(`📝 Applications: ${applications.length} submitted`);
if (applications.length > 0) {
  applications.forEach((app, i) => {
    console.log(`   ${i + 1}. ${app.personalInfo?.firstName || 'Unknown'} ${app.personalInfo?.lastName || ''} - Status: ${app.metadata?.status || 'unknown'}`);
  });
}

// Users
const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
const userKeys = relevantKeys.filter(k => k.startsWith('user_') && !k.includes('update'));
console.log(`\n👥 Users: ${registeredUsers.length} registered, ${userKeys.length} individual keys`);
if (registeredUsers.length > 0) {
  registeredUsers.slice(0, 5).forEach((user, i) => {
    console.log(`   ${i + 1}. ${user.email} (${user.role})`);
  });
  if (registeredUsers.length > 5) {
    console.log(`   ... and ${registeredUsers.length - 5} more`);
  }
}

// Announcements
const announcements = JSON.parse(localStorage.getItem('cdpta_announcements') || '[]');
console.log(`\n📢 Announcements: ${announcements.length}`);

// Courses
const courses = JSON.parse(localStorage.getItem('staff_courses') || '[]');
console.log(`\n📚 Courses: ${courses.length}`);

// Documents
const documentKeys = relevantKeys.filter(k => k.startsWith('document_'));
console.log(`\n📄 Documents: ${documentKeys.length} uploaded`);
documentKeys.forEach(key => {
  const docType = key.replace('document_', '');
  console.log(`   - ${docType}`);
});

// Application Draft
const draftApp = localStorage.getItem('applicationFormData');
console.log(`\n✍️  Application Draft: ${draftApp ? 'Yes (saved)' : 'No'}`);

// Auth Tokens
const token = localStorage.getItem('token');
const refreshToken = localStorage.getItem('refreshToken');
console.log(`\n🔐 Authentication: ${token ? 'Logged in' : 'Not logged in'}`);
if (token) {
  console.log(`   - Token: ${token.substring(0, 20)}...`);
}

console.log('\n' + '='.repeat(60));
console.log('💡 Tip: Run this in console to see detailed storage');
console.log('='.repeat(60));

// Return summary object
return {
  totalKeys: allKeys.length,
  relevantKeys: relevantKeys.length,
  totalSizeKB: (totalSize / 1024).toFixed(2),
  applications: applications.length,
  users: registeredUsers.length,
  announcements: announcements.length,
  courses: courses.length,
  documents: documentKeys.length,
  hasDraft: !!draftApp,
  isLoggedIn: !!token
};



