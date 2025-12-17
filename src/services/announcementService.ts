import { Announcement, AnnouncementFilter, AnnouncementStats, AnnouncementType, AnnouncementPriority } from '@/types/announcement';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { broadcastStorageChange } from '@/utils/storageSync';

// Mock data for development (fallback when Supabase is not configured)
// CLEARED - Use Supabase or empty array
const mockAnnouncements: Announcement[] = [];

/*
// OLD MOCK DATA - Commented out to force Supabase usage
const mockAnnouncementsOLD: Announcement[] = [
  {
    id: '1',
    title: 'Welcome to CDPTA Fellowship Program 2024',
    content: 'We are excited to welcome all new fellows to the Center for Drug Policy & Technology Assessment Fellowship Program. This program will provide you with comprehensive training in drug policy research, health economics, and technology assessment methodologies. Over the next year, you will work on cutting-edge research projects and collaborate with leading experts in the field.',
    excerpt: 'Welcome to the CDPTA Fellowship Program 2024. Get ready for an exciting year of research and learning.',
    date: new Date().toISOString(),
    type: AnnouncementType.PROGRAM,
    priority: AnnouncementPriority.HIGH,
    isImportant: true,
    isPublished: true,
    authorId: 'admin-1',
    authorName: 'Dr. Sarah Johnson',
    tags: ['fellowship', 'welcome', 'orientation'],
    targetAudience: ['fellow', 'applicant'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Application Deadline Extended - Apply by March 15',
    content: 'Great news! We have extended the application deadline for the 2024 CDPTA Fellowship Program to March 15, 2024. This gives prospective applicants additional time to prepare their application materials. Don\'t miss this opportunity to join our prestigious program.',
    excerpt: 'Application deadline extended to March 15, 2024. Apply now!',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    type: AnnouncementType.APPLICATION,
    priority: AnnouncementPriority.URGENT,
    isImportant: true,
    isPublished: true,
    authorId: 'admin-1',
    authorName: 'Dr. Sarah Johnson',
    tags: ['application', 'deadline'],
    targetAudience: ['applicant'],
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Research Seminar: Health Technology Assessment Methods',
    content: 'Join us for an interactive seminar on Health Technology Assessment Methods. Dr. Michael Chen will present the latest methodologies and case studies. Date: March 20, 2024, Time: 2:00 PM - 4:00 PM, Location: Conference Room A. All fellows are encouraged to attend.',
    excerpt: 'Research seminar on HTA methods with Dr. Michael Chen. March 20, 2:00 PM.',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    type: AnnouncementType.EVENT,
    priority: AnnouncementPriority.MEDIUM,
    isImportant: false,
    isPublished: true,
    authorId: 'staff-1',
    authorName: 'Program Coordinator',
    tags: ['seminar', 'research', 'hta'],
    targetAudience: ['fellow', 'staff'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'New Partnership with WHO for Global Health Research',
    content: 'CDPTA is proud to announce a new partnership with the World Health Organization (WHO) to advance global health research initiatives. This collaboration will provide our fellows with unique opportunities to contribute to international drug policy research and participate in WHO-led projects.',
    excerpt: 'New partnership with WHO announced for global health research collaboration.',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    type: AnnouncementType.PARTNERSHIP,
    priority: AnnouncementPriority.HIGH,
    isImportant: true,
    isPublished: true,
    authorId: 'admin-1',
    authorName: 'Dr. Sarah Johnson',
    tags: ['partnership', 'who', 'global-health'],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
*/

let announcementsStore = [...mockAnnouncements];

// LocalStorage key for persistence
const STORAGE_KEY = 'cdpta_announcements';

// Initialize from localStorage (or start with empty if nothing stored)
const initializeStore = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      announcementsStore = JSON.parse(stored);
      console.log('📦 Loaded announcements from localStorage:', announcementsStore.length);
    } else {
      // Start with empty - Supabase will populate
      announcementsStore = [];
      console.log('📦 No localStorage data, starting empty (will load from Supabase)');
    }
  } catch (error) {
    console.error('Error loading announcements from localStorage:', error);
    announcementsStore = [];
  }
};

// Save to localStorage and broadcast to other tabs
const saveToLocalStorage = () => {
  try {
    broadcastStorageChange(STORAGE_KEY, announcementsStore);
    console.log('📢 Announcements updated and broadcasted to all tabs');
  } catch (error) {
    console.error('Error saving announcements to localStorage:', error);
  }
};

// Initialize on module load
initializeStore();

// Service functions
export const announcementService = {
  // Get all announcements with optional filtering
  async getAnnouncements(filter?: AnnouncementFilter): Promise<Announcement[]> {
    // PRIMARY: Load from Supabase (REQUIRED for multi-user real-time)
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase
          .from('announcements')
          .select('*')
          .eq('published', true);

        // Apply filters
        if (filter?.type) {
          query = query.eq('type', filter.type);
        }
        if (filter?.priority) {
          query = query.eq('priority', filter.priority);
        }
        if (filter?.search) {
          query = query.or(`title.ilike.%${filter.search}%,content.ilike.%${filter.search}%`);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
          console.error('❌ Supabase getAnnouncements error:', error);
          throw error; // Fail hard - we need Supabase
        }

        // Map Supabase data to Announcement type
        const announcements = (data || []).map(item => ({
          id: item.id,
          title: item.title,
          content: item.content,
          excerpt: item.content.substring(0, 150) + '...',
          date: item.created_at,
          type: AnnouncementType.GENERAL,
          priority: item.priority as AnnouncementPriority,
          isImportant: item.priority === 'high' || item.priority === 'urgent',
          isPublished: item.published,
          authorId: item.created_by,
          authorName: 'Admin User',
          tags: [],
          targetAudience: [],
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }));

        // Sync to localStorage for offline access (backup only)
        announcementsStore = announcements;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(announcementsStore));

        console.log(`✅ [PRIMARY] Loaded ${announcements.length} announcements from Supabase`);
        return announcements;
      } catch (error) {
        console.error('❌ Supabase getAnnouncements failed:', error);
        // Only fallback if Supabase is not configured
        if (!isSupabaseConfigured()) {
          console.warn('⚠️ Supabase not configured, using localStorage fallback');
        } else {
          throw error; // Fail hard if Supabase is configured but fails
        }
      }
    }

    // FALLBACK: Only use localStorage if Supabase is not configured
    console.log('📂 [FALLBACK] Loading announcements from localStorage');
    await new Promise(resolve => setTimeout(resolve, 300));

    let filtered = [...announcementsStore];

    // Apply filters
    if (filter) {
      if (filter.type) {
        filtered = filtered.filter(a => a.type === filter.type);
      }
      if (filter.priority) {
        filtered = filtered.filter(a => a.priority === filter.priority);
      }
      if (filter.isImportant !== undefined) {
        filtered = filtered.filter(a => a.isImportant === filter.isImportant);
      }
      if (filter.dateFrom) {
        filtered = filtered.filter(a => a.date >= filter.dateFrom!);
      }
      if (filter.dateTo) {
        filtered = filtered.filter(a => a.date <= filter.dateTo!);
      }
      if (filter.tags && filter.tags.length > 0) {
        filtered = filtered.filter(a =>
          a.tags?.some(tag => filter.tags!.includes(tag))
        );
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        filtered = filtered.filter(a =>
          a.title.toLowerCase().includes(searchLower) ||
          a.content.toLowerCase().includes(searchLower) ||
          a.excerpt?.toLowerCase().includes(searchLower)
        );
      }
    }

    // Filter out expired announcements (unless in admin mode)
    const now = new Date().toISOString();
    filtered = filtered.filter(a => !a.expiresAt || a.expiresAt > now);

    // Only return published announcements
    filtered = filtered.filter(a => a.isPublished);

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  // Get a single announcement by ID
  async getAnnouncementById(id: string): Promise<Announcement | null> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('announcements')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) return null;

        return {
          id: data.id,
          title: data.title,
          content: data.content,
          excerpt: data.content.substring(0, 150) + '...',
          date: data.created_at,
          type: AnnouncementType.GENERAL,
          priority: data.priority as AnnouncementPriority,
          isImportant: data.priority === 'high' || data.priority === 'urgent',
          isPublished: data.published,
          authorId: data.created_by,
          authorName: 'Admin',
          tags: [],
          targetAudience: [],
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      } catch (error) {
        console.error('Supabase error, falling back to localStorage:', error);
      }
    }

    await new Promise(resolve => setTimeout(resolve, 200));
    return announcementsStore.find(a => a.id === id) || null;
  },

  // Create a new announcement
  async createAnnouncement(data: Partial<Announcement>): Promise<Announcement> {
    if (isSupabaseConfigured() && supabase) {
      try {
        console.log('🚀 Creating announcement in Supabase:', { title: data.title, priority: data.priority });
        
        const { data: newData, error } = await supabase
          .from('announcements')
          .insert({
            title: data.title || '',
            content: data.content || '',
            priority: data.priority || 'medium',
            published: data.isPublished !== undefined ? data.isPublished : true,
            created_by: null, // Explicitly set to null (no auth yet)
          })
          .select()
          .single();

        if (error) {
          console.error('❌ Supabase insert error:', error);
          throw error;
        }

        console.log('✅ Supabase announcement created:', newData.id);

        const newAnnouncement = {
          id: newData.id,
          title: newData.title,
          content: newData.content,
          excerpt: newData.content.substring(0, 150) + '...',
          date: newData.created_at,
          type: data.type || AnnouncementType.GENERAL,
          priority: newData.priority as AnnouncementPriority,
          isImportant: newData.priority === 'high' || newData.priority === 'urgent',
          isPublished: newData.published,
          authorId: newData.created_by,
          authorName: data.authorName || 'Admin User',
          tags: data.tags || [],
          targetAudience: data.targetAudience || [],
          createdAt: newData.created_at,
          updatedAt: newData.updated_at,
        };

        // ALSO save to localStorage and broadcast for cross-tab sync
        announcementsStore = [newAnnouncement, ...announcementsStore];
        saveToLocalStorage();

        return newAnnouncement;
      } catch (error) {
        console.error('💥 Supabase error, falling back to localStorage:', error);
        // Fall through to localStorage code below
      }
    } else {
      console.log('⚠️ Supabase not configured, using localStorage only');
    }

    // LocalStorage fallback
    await new Promise(resolve => setTimeout(resolve, 400));

    const newAnnouncement: Announcement = {
      id: `ann-${Date.now()}`,
      title: data.title || '',
      content: data.content || '',
      excerpt: data.excerpt || data.content?.substring(0, 150) + '...',
      date: new Date().toISOString(),
      type: data.type || AnnouncementType.GENERAL,
      priority: data.priority || AnnouncementPriority.MEDIUM,
      isImportant: data.isImportant || false,
      isPublished: data.isPublished || false,
      authorId: 'current-user-id',
      authorName: 'Admin User',
      tags: data.tags || [],
      targetAudience: data.targetAudience || [],
      expiresAt: data.expiresAt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    announcementsStore = [newAnnouncement, ...announcementsStore];
    saveToLocalStorage();
    return newAnnouncement;
  },

  // Update an existing announcement
  async updateAnnouncement(id: string, data: Partial<Announcement>): Promise<Announcement> {
    if (isSupabaseConfigured() && supabase) {
      try {
        console.log('📝 Updating announcement in Supabase:', id);
        
        const { data: updatedData, error } = await supabase
          .from('announcements')
          .update({
            title: data.title,
            content: data.content,
            priority: data.priority,
            published: data.isPublished,
          })
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error('❌ Supabase update error:', error);
          throw error;
        }

        console.log('✅ Supabase announcement updated');

        const updatedAnnouncement = {
          id: updatedData.id,
          title: updatedData.title,
          content: updatedData.content,
          excerpt: updatedData.content.substring(0, 150) + '...',
          date: updatedData.created_at,
          type: data.type || AnnouncementType.GENERAL,
          priority: updatedData.priority as AnnouncementPriority,
          isImportant: updatedData.priority === 'high' || updatedData.priority === 'urgent',
          isPublished: updatedData.published,
          authorId: updatedData.created_by,
          authorName: data.authorName || 'Admin User',
          tags: data.tags || [],
          targetAudience: data.targetAudience || [],
          createdAt: updatedData.created_at,
          updatedAt: updatedData.updated_at,
        };

        // Sync to localStorage
        const index = announcementsStore.findIndex(a => a.id === id);
        if (index >= 0) {
          announcementsStore[index] = updatedAnnouncement;
        } else {
          announcementsStore = [updatedAnnouncement, ...announcementsStore];
        }
        saveToLocalStorage();

        return updatedAnnouncement;
      } catch (error) {
        console.error('💥 Supabase error, falling back to localStorage:', error);
      }
    }

    // LocalStorage fallback
    await new Promise(resolve => setTimeout(resolve, 400));

    const index = announcementsStore.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Announcement not found');
    }

    const updatedAnnouncement: Announcement = {
      ...announcementsStore[index],
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };

    announcementsStore[index] = updatedAnnouncement;
    saveToLocalStorage();
    return updatedAnnouncement;
  },

  // Delete an announcement
  async deleteAnnouncement(id: string): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      try {
        console.log('🗑️ Deleting announcement from Supabase:', id);
        
        const { error } = await supabase
          .from('announcements')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('❌ Supabase delete error:', error);
          throw error;
        }

        console.log('✅ Supabase announcement deleted');

        // Sync to localStorage
        announcementsStore = announcementsStore.filter(a => a.id !== id);
        saveToLocalStorage();
        
        return;
      } catch (error) {
        console.error('💥 Supabase error, falling back to localStorage:', error);
      }
    }

    // LocalStorage fallback
    await new Promise(resolve => setTimeout(resolve, 300));
    announcementsStore = announcementsStore.filter(a => a.id !== id);
    saveToLocalStorage();
  },

  // Toggle publish status
  async togglePublishStatus(id: string): Promise<Announcement> {
    const announcement = announcementsStore.find(a => a.id === id);
    if (!announcement) {
      throw new Error('Announcement not found');
    }

    return this.updateAnnouncement(id, {
      isPublished: !announcement.isPublished,
    });
  },

  // Get announcement statistics
  async getAnnouncementStats(): Promise<AnnouncementStats> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const stats: AnnouncementStats = {
      total: announcementsStore.length,
      byType: {
        [AnnouncementType.GENERAL]: 0,
        [AnnouncementType.APPLICATION]: 0,
        [AnnouncementType.PROGRAM]: 0,
        [AnnouncementType.EVENT]: 0,
        [AnnouncementType.RESEARCH]: 0,
        [AnnouncementType.PARTNERSHIP]: 0,
      },
      byPriority: {
        [AnnouncementPriority.LOW]: 0,
        [AnnouncementPriority.MEDIUM]: 0,
        [AnnouncementPriority.HIGH]: 0,
        [AnnouncementPriority.URGENT]: 0,
      },
      recent: 0,
      important: 0,
    };

    announcementsStore.forEach(announcement => {
      stats.byType[announcement.type]++;
      stats.byPriority[announcement.priority]++;
      
      if (announcement.isImportant) {
        stats.important++;
      }
      
      if (new Date(announcement.date) >= thirtyDaysAgo) {
        stats.recent++;
      }
    });

    return stats;
  },

  // Get announcements for admin (includes drafts and expired)
  async getAdminAnnouncements(filter?: AnnouncementFilter): Promise<Announcement[]> {
    // Use Supabase if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase
          .from('announcements')
          .select('*');

        // Apply filters
        if (filter?.type) {
          query = query.eq('type', filter.type);
        }
        if (filter?.priority) {
          query = query.eq('priority', filter.priority);
        }
        if (filter?.search) {
          query = query.or(`title.ilike.%${filter.search}%,content.ilike.%${filter.search}%`);
        }

        const { data, error } = await query.order('updated_at', { ascending: false });

        if (error) throw error;

        // Map Supabase data to Announcement type
        const announcements = (data || []).map(item => ({
          id: item.id,
          title: item.title,
          content: item.content,
          excerpt: item.content.substring(0, 150) + '...',
          date: item.created_at,
          type: AnnouncementType.GENERAL,
          priority: item.priority as AnnouncementPriority,
          isImportant: item.priority === 'high' || item.priority === 'urgent',
          isPublished: item.published,
          authorId: item.created_by,
          authorName: 'Admin User',
          tags: [],
          targetAudience: [],
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }));

        // Update local store (but DON'T broadcast - this is just a read operation)
        announcementsStore = announcements;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(announcementsStore));

        console.log(`📥 Admin loaded ${announcements.length} announcements from Supabase`);
        return announcements;
      } catch (error) {
        console.error('Supabase error, falling back to localStorage:', error);
      }
    }

    // LocalStorage fallback
    await new Promise(resolve => setTimeout(resolve, 300));

    let filtered = [...announcementsStore];

    // Apply filters (similar to getAnnouncements but without published/expired filtering)
    if (filter) {
      if (filter.type) {
        filtered = filtered.filter(a => a.type === filter.type);
      }
      if (filter.priority) {
        filtered = filtered.filter(a => a.priority === filter.priority);
      }
      if (filter.isImportant !== undefined) {
        filtered = filtered.filter(a => a.isImportant === filter.isImportant);
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        filtered = filtered.filter(a =>
          a.title.toLowerCase().includes(searchLower) ||
          a.content.toLowerCase().includes(searchLower)
        );
      }
    }

    return filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },
};

export default announcementService;






