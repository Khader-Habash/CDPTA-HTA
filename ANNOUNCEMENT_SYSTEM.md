# Announcement Management System

## Overview

The CDPTA platform now includes a comprehensive announcement management system that allows administrators to create, manage, and publish announcements to users on the main page.

## Features

### For Administrators

1. **Create Announcements**
   - Rich text content with title, body, and excerpt
   - Multiple announcement types: General, Application, Program, Event, Research, Partnership
   - Priority levels: Low, Medium, High, Urgent
   - Tag system for better organization
   - Target specific user roles (Applicants, Fellows, Staff, Admins)
   - Set expiration dates for time-sensitive announcements
   - Mark announcements as important
   - Save as draft or publish immediately
   - Preview before publishing

2. **Manage Announcements**
   - View all announcements (published and drafts)
   - Edit existing announcements
   - Delete announcements
   - Toggle publish/unpublish status
   - View statistics (total, published, drafts, important)

3. **Access**
   - Navigate to `/admin/announcements` or
   - Click "Manage Announcements" in the Admin Dashboard Quick Actions

### For Users

1. **View Announcements**
   - Latest 3 announcements displayed on the home page
   - Click "View All" to see all published announcements
   - Visual indicators for importance and priority
   - Filter announcements by type, priority, tags
   - Search announcements by content

## File Structure

```
src/
├── components/
│   ├── AddAnnouncementForm.tsx          # Form component for creating/editing announcements
│   ├── AnnouncementCard.tsx             # Display card for individual announcements
│   └── AnnouncementList.tsx             # List view with filtering and sorting
├── pages/
│   ├── admin/
│   │   └── AnnouncementManagement.tsx   # Admin page for managing announcements
│   ├── HomePage.tsx                      # Updated to display announcements
│   └── dashboards/
│       └── AdminDashboard.tsx            # Added announcement management link
├── services/
│   └── announcementService.ts            # API service for announcement operations
├── types/
│   └── announcement.ts                   # TypeScript interfaces and enums
└── routes/
    └── AppRoutes.tsx                     # Added announcement management route
```

## Usage Instructions

### Creating an Announcement

1. Log in as an administrator
2. Navigate to Admin Dashboard
3. Click "Manage Announcements" in Quick Actions
4. Click "Create Announcement" button
5. Fill in the form:
   - **Title**: Short, descriptive title
   - **Type**: Select the appropriate category
   - **Priority**: Set the urgency level
   - **Content**: Main announcement text
   - **Excerpt**: Brief summary (auto-generated if left empty)
   - **Tags**: Add relevant keywords
   - **Target Audience**: Select which user roles should see this
   - **Expiration Date**: Optional end date
   - **Mark as Important**: Highlight this announcement
   - **Publish Immediately**: Make it visible right away
6. Click "Preview" to see how it will look
7. Click "Publish" or "Save Draft"

### Managing Announcements

1. **Edit**: Click the edit icon on any announcement
2. **Delete**: Click the trash icon and confirm
3. **Publish/Unpublish**: Click the eye icon to toggle visibility
4. **View Details**: Click anywhere on the announcement card

### Viewing Announcements (Users)

1. Log in to the platform
2. Go to the Home page
3. See the "Latest Announcements" section
4. Click "View All" to see all published announcements
5. Use filters and search to find specific announcements

## Data Structure

### Announcement Interface

```typescript
interface Announcement {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  date: string;
  type: AnnouncementType;
  priority: AnnouncementPriority;
  isImportant: boolean;
  isPublished: boolean;
  authorId: string;
  authorName: string;
  tags?: string[];
  targetAudience?: string[];
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Announcement Types

- `GENERAL`: General announcements
- `APPLICATION`: Application-related news
- `PROGRAM`: Program updates
- `EVENT`: Upcoming events
- `RESEARCH`: Research opportunities
- `PARTNERSHIP`: Partnership announcements

### Priority Levels

- `LOW`: Minor updates
- `MEDIUM`: Standard announcements
- `HIGH`: Important information
- `URGENT`: Time-sensitive, critical announcements

## API Service Methods

```typescript
// Get published announcements for users
announcementService.getAnnouncements(filter?: AnnouncementFilter)

// Get all announcements for admins (including drafts)
announcementService.getAdminAnnouncements(filter?: AnnouncementFilter)

// Get single announcement
announcementService.getAnnouncementById(id: string)

// Create new announcement
announcementService.createAnnouncement(data: Partial<Announcement>)

// Update announcement
announcementService.updateAnnouncement(id: string, data: Partial<Announcement>)

// Delete announcement
announcementService.deleteAnnouncement(id: string)

// Toggle publish status
announcementService.togglePublishStatus(id: string)

// Get statistics
announcementService.getAnnouncementStats()
```

## Future Enhancements

- Email notifications for important announcements
- Rich text editor with formatting
- File attachments support
- Scheduled publishing
- Analytics (views, clicks)
- Comment system
- Push notifications
- Multi-language support

## Notes

- Currently uses mock data stored in memory
- In production, connect to a real backend API
- Announcements are automatically filtered by expiration date for users
- Only admins can see drafts and expired announcements
- Target audience filtering allows role-specific announcements


## Overview

The CDPTA platform now includes a comprehensive announcement management system that allows administrators to create, manage, and publish announcements to users on the main page.

## Features

### For Administrators

1. **Create Announcements**
   - Rich text content with title, body, and excerpt
   - Multiple announcement types: General, Application, Program, Event, Research, Partnership
   - Priority levels: Low, Medium, High, Urgent
   - Tag system for better organization
   - Target specific user roles (Applicants, Fellows, Staff, Admins)
   - Set expiration dates for time-sensitive announcements
   - Mark announcements as important
   - Save as draft or publish immediately
   - Preview before publishing

2. **Manage Announcements**
   - View all announcements (published and drafts)
   - Edit existing announcements
   - Delete announcements
   - Toggle publish/unpublish status
   - View statistics (total, published, drafts, important)

3. **Access**
   - Navigate to `/admin/announcements` or
   - Click "Manage Announcements" in the Admin Dashboard Quick Actions

### For Users

1. **View Announcements**
   - Latest 3 announcements displayed on the home page
   - Click "View All" to see all published announcements
   - Visual indicators for importance and priority
   - Filter announcements by type, priority, tags
   - Search announcements by content

## File Structure

```
src/
├── components/
│   ├── AddAnnouncementForm.tsx          # Form component for creating/editing announcements
│   ├── AnnouncementCard.tsx             # Display card for individual announcements
│   └── AnnouncementList.tsx             # List view with filtering and sorting
├── pages/
│   ├── admin/
│   │   └── AnnouncementManagement.tsx   # Admin page for managing announcements
│   ├── HomePage.tsx                      # Updated to display announcements
│   └── dashboards/
│       └── AdminDashboard.tsx            # Added announcement management link
├── services/
│   └── announcementService.ts            # API service for announcement operations
├── types/
│   └── announcement.ts                   # TypeScript interfaces and enums
└── routes/
    └── AppRoutes.tsx                     # Added announcement management route
```

## Usage Instructions

### Creating an Announcement

1. Log in as an administrator
2. Navigate to Admin Dashboard
3. Click "Manage Announcements" in Quick Actions
4. Click "Create Announcement" button
5. Fill in the form:
   - **Title**: Short, descriptive title
   - **Type**: Select the appropriate category
   - **Priority**: Set the urgency level
   - **Content**: Main announcement text
   - **Excerpt**: Brief summary (auto-generated if left empty)
   - **Tags**: Add relevant keywords
   - **Target Audience**: Select which user roles should see this
   - **Expiration Date**: Optional end date
   - **Mark as Important**: Highlight this announcement
   - **Publish Immediately**: Make it visible right away
6. Click "Preview" to see how it will look
7. Click "Publish" or "Save Draft"

### Managing Announcements

1. **Edit**: Click the edit icon on any announcement
2. **Delete**: Click the trash icon and confirm
3. **Publish/Unpublish**: Click the eye icon to toggle visibility
4. **View Details**: Click anywhere on the announcement card

### Viewing Announcements (Users)

1. Log in to the platform
2. Go to the Home page
3. See the "Latest Announcements" section
4. Click "View All" to see all published announcements
5. Use filters and search to find specific announcements

## Data Structure

### Announcement Interface

```typescript
interface Announcement {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  date: string;
  type: AnnouncementType;
  priority: AnnouncementPriority;
  isImportant: boolean;
  isPublished: boolean;
  authorId: string;
  authorName: string;
  tags?: string[];
  targetAudience?: string[];
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Announcement Types

- `GENERAL`: General announcements
- `APPLICATION`: Application-related news
- `PROGRAM`: Program updates
- `EVENT`: Upcoming events
- `RESEARCH`: Research opportunities
- `PARTNERSHIP`: Partnership announcements

### Priority Levels

- `LOW`: Minor updates
- `MEDIUM`: Standard announcements
- `HIGH`: Important information
- `URGENT`: Time-sensitive, critical announcements

## API Service Methods

```typescript
// Get published announcements for users
announcementService.getAnnouncements(filter?: AnnouncementFilter)

// Get all announcements for admins (including drafts)
announcementService.getAdminAnnouncements(filter?: AnnouncementFilter)

// Get single announcement
announcementService.getAnnouncementById(id: string)

// Create new announcement
announcementService.createAnnouncement(data: Partial<Announcement>)

// Update announcement
announcementService.updateAnnouncement(id: string, data: Partial<Announcement>)

// Delete announcement
announcementService.deleteAnnouncement(id: string)

// Toggle publish status
announcementService.togglePublishStatus(id: string)

// Get statistics
announcementService.getAnnouncementStats()
```

## Future Enhancements

- Email notifications for important announcements
- Rich text editor with formatting
- File attachments support
- Scheduled publishing
- Analytics (views, clicks)
- Comment system
- Push notifications
- Multi-language support

## Notes

- Currently uses mock data stored in memory
- In production, connect to a real backend API
- Announcements are automatically filtered by expiration date for users
- Only admins can see drafts and expired announcements
- Target audience filtering allows role-specific announcements















