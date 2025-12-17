# How to View Website Storage

## Quick View in Browser Console

1. **Open your website** in browser
2. **Press F12** (or Right-click → Inspect)
3. **Go to Console tab**
4. **Copy and paste this command**:

```javascript
// View Storage Overview
const allKeys = Object.keys(localStorage);
const relevantKeys = allKeys.filter(key => 
  key.includes('cdpta') || 
  key.includes('application') || 
  key.includes('user_') || 
  key.includes('document_') || 
  key.includes('token')
);

console.log('📊 Storage Overview:');
console.log('Total keys:', relevantKeys.length);
console.log('\n🔑 All Storage Keys:');
relevantKeys.forEach(key => {
  const size = (localStorage.getItem(key)?.length || 0) + key.length;
  console.log(`  ${key}: ${(size / 1024).toFixed(2)} KB`);
});

// Applications
const apps = JSON.parse(localStorage.getItem('cdpta_submitted_applications') || '[]');
console.log(`\n📝 Submitted Applications: ${apps.length}`);

// Users
const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
console.log(`👥 Registered Users: ${users.length}`);

// Announcements
const announcements = JSON.parse(localStorage.getItem('cdpta_announcements') || '[]');
console.log(`📢 Announcements: ${announcements.length}`);

// Auth
const token = localStorage.getItem('token');
console.log(`🔐 Logged In: ${token ? 'Yes' : 'No'}`);
```

---

## View Specific Data

### View All Submitted Applications:
```javascript
JSON.parse(localStorage.getItem('cdpta_submitted_applications') || '[]')
```

### View All Registered Users:
```javascript
JSON.parse(localStorage.getItem('registeredUsers') || '[]')
```

### View Current Application Draft:
```javascript
JSON.parse(localStorage.getItem('applicationFormData') || '{}')
```

### View All Announcements:
```javascript
JSON.parse(localStorage.getItem('cdpta_announcements') || '[]')
```

### View All localStorage Keys:
```javascript
Object.keys(localStorage)
```

---

## View Storage Size

```javascript
let total = 0;
Object.keys(localStorage).forEach(key => {
  total += localStorage.getItem(key).length + key.length;
});
console.log('Total storage:', (total / 1024).toFixed(2), 'KB');
console.log('Remaining:', ((5 * 1024 * 1024 - total) / 1024).toFixed(2), 'KB'); // Assuming 5MB limit
```

---

## Complete Storage Breakdown

See `STORAGE_OVERVIEW.md` for complete documentation of all storage keys and their purposes.



