import React, { useState, useEffect } from 'react';
import { Announcement, AnnouncementFilter } from '@/types/announcement';
import { announcementService } from '@/services/announcementService';
import { onStorageChange } from '@/utils/storageSync';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import AnnouncementList from '@/components/AnnouncementList';
import AddAnnouncementForm from '@/components/AddAnnouncementForm';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toaster';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  BarChart3,
  RefreshCw,
} from 'lucide-react';

const AnnouncementManagement: React.FC = () => {
  const { addToast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [stats, setStats] = useState<{
    total: number;
    published: number;
    drafts: number;
    important: number;
  }>({
    total: 0,
    published: 0,
    drafts: 0,
    important: 0,
  });

  // Initial load only
  useEffect(() => {
    loadAnnouncements();
  }, []);

  // Separate effect for polling (doesn't reload on mount)
  useEffect(() => {
    // Listen for changes from other tabs (same browser) via localStorage
    const storageCleanup = onStorageChange((e) => {
      if (e.key === 'cdpta_announcements') {
        console.log('🔔 Announcements changed in another tab, reloading...');
        // Only reload if form is NOT open (don't interrupt user)
        if (!showForm && !editingAnnouncement) {
          loadAnnouncements();
        }
      }
    });
    
    // Poll Supabase every 10 seconds for cross-device changes (ONLY when form is closed)
    let pollInterval: NodeJS.Timeout | null = null;
    
    if (isSupabaseConfigured() && supabase && !showForm && !editingAnnouncement) {
      console.log('⏰ Starting polling for cross-device sync (every 10 seconds)...');
      
      pollInterval = setInterval(() => {
        loadAnnouncements();
      }, 10000); // Poll every 10 seconds
    } else if (showForm || editingAnnouncement) {
      console.log('⏰ Polling paused (form is open)');
    }
    
    return () => {
      storageCleanup();
      if (pollInterval) {
        console.log('⏰ Stopping polling');
        clearInterval(pollInterval);
      }
    };
  }, [showForm, editingAnnouncement]); // Re-run when form opens/closes

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await announcementService.getAdminAnnouncements();
      
      console.log(`📋 Loaded ${data.length} announcements, updating state...`);
      setAnnouncements(data);
      
      // Calculate stats
      const published = data.filter(a => a.isPublished).length;
      const drafts = data.filter(a => !a.isPublished).length;
      const important = data.filter(a => a.isImportant).length;
      
      setStats({
        total: data.length,
        published,
        drafts,
        important,
      });
      
      console.log(`✅ State updated - Total: ${data.length}, Published: ${published}`);
    } catch (error) {
      console.error('Failed to load announcements:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load announcements',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async (data: Partial<Announcement>) => {
    try {
      await announcementService.createAnnouncement(data);
      addToast({
        type: 'success',
        title: 'Success',
        message: 'Announcement created successfully',
      });
      setShowForm(false);
      loadAnnouncements();
    } catch (error) {
      console.error('Failed to create announcement:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to create announcement',
      });
    }
  };

  const handleUpdateAnnouncement = async (data: Partial<Announcement>) => {
    if (!editingAnnouncement) return;

    try {
      await announcementService.updateAnnouncement(editingAnnouncement.id, data);
      addToast({
        type: 'success',
        title: 'Success',
        message: 'Announcement updated successfully',
      });
      setEditingAnnouncement(null);
      setShowForm(false);
      loadAnnouncements();
    } catch (error) {
      console.error('Failed to update announcement:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update announcement',
      });
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    try {
      await announcementService.deleteAnnouncement(id);
      addToast({
        type: 'success',
        title: 'Success',
        message: 'Announcement deleted successfully',
      });
      loadAnnouncements();
      setSelectedAnnouncement(null);
    } catch (error) {
      console.error('Failed to delete announcement:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete announcement',
      });
    }
  };

  const handleTogglePublish = async (announcement: Announcement) => {
    try {
      await announcementService.togglePublishStatus(announcement.id);
      addToast({
        type: 'success',
        title: 'Success',
        message: `Announcement ${announcement.isPublished ? 'unpublished' : 'published'} successfully`,
      });
      loadAnnouncements();
    } catch (error) {
      console.error('Failed to toggle publish status:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update announcement',
      });
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setShowForm(true);
    setSelectedAnnouncement(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingAnnouncement(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4 text-primary-600" size={32} />
          <p className="text-gray-600">Loading announcements...</p>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}
          </h1>
        </div>
        <AddAnnouncementForm
          initialData={editingAnnouncement || undefined}
          onSubmit={editingAnnouncement ? handleUpdateAnnouncement : handleCreateAnnouncement}
          onCancel={handleCancelForm}
        />
      </div>
    );
  }

  if (selectedAnnouncement) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Announcement Details</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedAnnouncement(null)}
          >
            Back to List
          </Button>
        </div>

        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    selectedAnnouncement.isPublished
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedAnnouncement.isPublished ? 'Published' : 'Draft'}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium rounded bg-primary-100 text-primary-800">
                    {selectedAnnouncement.type}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800">
                    {selectedAnnouncement.priority}
                  </span>
                </div>
                <h2 className="text-2xl font-bold">{selectedAnnouncement.title}</h2>
              </div>
            </div>
          </Card.Header>
          <Card.Content>
            <div className="space-y-6">
              {selectedAnnouncement.excerpt && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Excerpt</h3>
                  <p className="text-gray-600 italic">{selectedAnnouncement.excerpt}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Content</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedAnnouncement.content}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Author</h3>
                  <p className="text-gray-900">{selectedAnnouncement.authorName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Created</h3>
                  <p className="text-gray-900">
                    {new Date(selectedAnnouncement.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {selectedAnnouncement.tags && selectedAnnouncement.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAnnouncement.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedAnnouncement.targetAudience && selectedAnnouncement.targetAudience.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Target Audience</h3>
                  <p className="text-gray-900">{selectedAnnouncement.targetAudience.join(', ')}</p>
                </div>
              )}

              {selectedAnnouncement.expiresAt && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Expiration Date</h3>
                  <p className="text-gray-900">
                    {new Date(selectedAnnouncement.expiresAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </Card.Content>
          <Card.Footer>
            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTogglePublish(selectedAnnouncement)}
              >
                {selectedAnnouncement.isPublished ? (
                  <>
                    <EyeOff size={16} className="mr-2" />
                    Unpublish
                  </>
                ) : (
                  <>
                    <Eye size={16} className="mr-2" />
                    Publish
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(selectedAnnouncement)}
              >
                <Edit size={16} className="mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteAnnouncement(selectedAnnouncement.id)}
                className="text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} className="mr-2" />
                Delete
              </Button>
            </div>
          </Card.Footer>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcement Management</h1>
          <p className="text-gray-600">Create and manage platform announcements</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus size={16} className="mr-2" />
          Create Announcement
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <Card.Content>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <BarChart3 className="text-gray-600" size={24} />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-green-600">{stats.published}</p>
              </div>
              <Eye className="text-green-600" size={24} />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-gray-600">{stats.drafts}</p>
              </div>
              <EyeOff className="text-gray-600" size={24} />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Important</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.important}</p>
              </div>
              <BarChart3 className="text-yellow-600" size={24} />
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id} className="hover:shadow-md transition-shadow">
            <Card.Content>
              <div className="flex items-start justify-between">
                <div className="flex-1 cursor-pointer" onClick={() => setSelectedAnnouncement(announcement)}>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      announcement.isPublished
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {announcement.isPublished ? 'Published' : 'Draft'}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded bg-primary-100 text-primary-800">
                      {announcement.type}
                    </span>
                    {announcement.isImportant && (
                      <span className="px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800">
                        Important
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {announcement.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {announcement.excerpt || announcement.content}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>By {announcement.authorName}</span>
                    <span>•</span>
                    <span>{new Date(announcement.date).toLocaleDateString()}</span>
                    {announcement.expiresAt && (
                      <>
                        <span>•</span>
                        <span>Expires {new Date(announcement.expiresAt).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTogglePublish(announcement)}
                  >
                    {announcement.isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(announcement)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>
        ))}

        {announcements.length === 0 && (
          <Card className="p-8 text-center">
            <div className="text-gray-500">
              <BarChart3 size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements yet</h3>
              <p className="text-gray-600 mb-4">
                Create your first announcement to get started
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus size={16} className="mr-2" />
                Create Announcement
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AnnouncementManagement;






