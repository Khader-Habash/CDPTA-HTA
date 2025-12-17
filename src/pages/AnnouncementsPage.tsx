import React, { useState, useEffect } from 'react';
import { Announcement } from '@/types/announcement';
import { announcementService } from '@/services/announcementService';
import { onStorageChange } from '@/utils/storageSync';
import AnnouncementCard from '@/components/AnnouncementCard';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Link } from 'react-router-dom';
import { Megaphone, ArrowLeft, Settings } from 'lucide-react';

const AnnouncementsPage: React.FC = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnnouncements();
    
    // Listen for changes from other tabs
    const cleanup = onStorageChange((e) => {
      if (e.key === 'cdpta_announcements') {
        console.log('🔔 Announcements changed, reloading...');
        loadAnnouncements();
      }
    });
    
    return cleanup;
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      console.log('📢 AnnouncementsPage: Loading announcements...');
      const data = await announcementService.getAnnouncements();
      console.log('📢 AnnouncementsPage: Received data:', data);
      setAnnouncements(data);
    } catch (error) {
      console.error('❌ AnnouncementsPage: Failed to load announcements:', error);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2" size={16} />
                Back to Home
              </Button>
            </Link>
            {user?.role === UserRole.ADMIN && (
              <Link to="/admin/announcements">
                <Button variant="primary" size="sm">
                  <Settings className="mr-2" size={16} />
                  Manage Announcements
                </Button>
              </Link>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <Megaphone className="text-primary-600" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Announcements</h1>
              <p className="text-gray-600 mt-1">
                Stay updated with the latest news and information
              </p>
            </div>
          </div>
        </div>

        {/* Announcements Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading announcements...</p>
          </div>
        ) : announcements.length === 0 ? (
          <Card>
            <Card.Body>
              <div className="text-center py-12">
                <Megaphone className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No announcements yet
                </h3>
                <p className="text-gray-600">
                  Check back later for updates and news
                </p>
              </div>
            </Card.Body>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {announcements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                compact={false}
                showAuthor={true}
                showTags={true}
              />
            ))}
          </div>
        )}

        {/* Stats */}
        {!loading && announcements.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            <p>Showing {announcements.length} announcement{announcements.length !== 1 ? 's' : ''}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;

