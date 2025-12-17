import React, { useState, useMemo } from 'react';
import { Announcement, AnnouncementFilter, AnnouncementType, AnnouncementPriority } from '@/types/announcement';
import AnnouncementCard from '@/components/AnnouncementCard';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  Search,
  Filter,
  Calendar,
  Tag,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  SortAsc,
  SortDesc,
  Grid,
  List,
  RefreshCw,
} from 'lucide-react';
import { clsx } from 'clsx';

interface AnnouncementListProps {
  announcements: Announcement[];
  onAnnouncementClick?: (announcement: Announcement) => void;
  showFilters?: boolean;
  showSearch?: boolean;
  showSort?: boolean;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  className?: string;
}

type SortOption = 'date-desc' | 'date-asc' | 'priority' | 'title' | 'type';

const AnnouncementList: React.FC<AnnouncementListProps> = ({
  announcements,
  onAnnouncementClick,
  showFilters = true,
  showSearch = true,
  showSort = true,
  viewMode = 'list',
  onViewModeChange,
  className,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<AnnouncementFilter>({});
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Filter and search announcements
  const filteredAnnouncements = useMemo(() => {
    let filtered = announcements;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (announcement) =>
          announcement.title.toLowerCase().includes(searchLower) ||
          announcement.content.toLowerCase().includes(searchLower) ||
          announcement.excerpt?.toLowerCase().includes(searchLower) ||
          announcement.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Type filter
    if (filters.type) {
      filtered = filtered.filter(announcement => announcement.type === filters.type);
    }

    // Priority filter
    if (filters.priority) {
      filtered = filtered.filter(announcement => announcement.priority === filters.priority);
    }

    // Important filter
    if (filters.isImportant !== undefined) {
      filtered = filtered.filter(announcement => announcement.isImportant === filters.isImportant);
    }

    // Date filters
    if (filters.dateFrom) {
      filtered = filtered.filter(announcement => announcement.date >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      filtered = filtered.filter(announcement => announcement.date <= filters.dateTo!);
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(announcement =>
        announcement.tags?.some(tag => filters.tags!.includes(tag))
      );
    }

    return filtered;
  }, [announcements, searchTerm, filters]);

  // Sort announcements
  const sortedAnnouncements = useMemo(() => {
    const sorted = [...filteredAnnouncements];

    switch (sortBy) {
      case 'date-desc':
        return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'date-asc':
        return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case 'priority':
        const priorityOrder = {
          [AnnouncementPriority.URGENT]: 4,
          [AnnouncementPriority.HIGH]: 3,
          [AnnouncementPriority.MEDIUM]: 2,
          [AnnouncementPriority.LOW]: 1,
        };
        return sorted.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'type':
        return sorted.sort((a, b) => a.type.localeCompare(b.type));
      default:
        return sorted;
    }
  }, [filteredAnnouncements, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({});
  };

  const getSortIcon = () => {
    return sortBy.includes('desc') ? <SortDesc size={16} /> : <SortAsc size={16} />;
  };

  const getPriorityIcon = (priority: AnnouncementPriority) => {
    switch (priority) {
      case AnnouncementPriority.URGENT:
        return <AlertCircle className="text-red-600" size={16} />;
      case AnnouncementPriority.HIGH:
        return <AlertCircle className="text-orange-600" size={16} />;
      case AnnouncementPriority.MEDIUM:
        return <Clock className="text-yellow-600" size={16} />;
      case AnnouncementPriority.LOW:
        return <CheckCircle className="text-gray-600" size={16} />;
      default:
        return <CheckCircle className="text-gray-600" size={16} />;
    }
  };

  const getTypeIcon = (type: AnnouncementType) => {
    switch (type) {
      case AnnouncementType.APPLICATION:
        return <User className="text-blue-600" size={16} />;
      case AnnouncementType.PROGRAM:
        return <Calendar className="text-green-600" size={16} />;
      case AnnouncementType.EVENT:
        return <Calendar className="text-purple-600" size={16} />;
      case AnnouncementType.RESEARCH:
        return <Tag className="text-orange-600" size={16} />;
      case AnnouncementType.PARTNERSHIP:
        return <Tag className="text-indigo-600" size={16} />;
      default:
        return <Tag className="text-gray-600" size={16} />;
    }
  };

  return (
    <div className={clsx('space-y-6', className)}>
      {/* Search and Controls */}
      {(showSearch || showFilters || showSort) && (
        <Card className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            {showSearch && (
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search announcements..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center space-x-2">
              {/* View Mode Toggle */}
              {onViewModeChange && (
                <div className="flex border border-gray-300 rounded-md">
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onViewModeChange('list')}
                    className="rounded-r-none"
                  >
                    <List size={16} />
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onViewModeChange('grid')}
                    className="rounded-l-none"
                  >
                    <Grid size={16} />
                  </Button>
                </div>
              )}

              {/* Sort */}
              {showSort && (
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="priority">Priority</option>
                  <option value="title">Title</option>
                  <option value="type">Type</option>
                </select>
              )}

              {/* Filters */}
              {showFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilterPanel(!showFilterPanel)}
                  className={clsx(
                    'flex items-center',
                    showFilterPanel && 'bg-primary-50 border-primary-300'
                  )}
                >
                  <Filter size={16} className="mr-2" />
                  Filters
                </Button>
              )}

              {/* Clear Filters */}
              {(searchTerm || Object.keys(filters).length > 0) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="flex items-center"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Filter Panel */}
          {showFilterPanel && showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={filters.type || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      type: e.target.value ? e.target.value as AnnouncementType : undefined
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Types</option>
                    <option value={AnnouncementType.GENERAL}>General</option>
                    <option value={AnnouncementType.APPLICATION}>Application</option>
                    <option value={AnnouncementType.PROGRAM}>Program</option>
                    <option value={AnnouncementType.EVENT}>Event</option>
                    <option value={AnnouncementType.RESEARCH}>Research</option>
                    <option value={AnnouncementType.PARTNERSHIP}>Partnership</option>
                  </select>
                </div>

                {/* Priority Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={filters.priority || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      priority: e.target.value ? e.target.value as AnnouncementPriority : undefined
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Priorities</option>
                    <option value={AnnouncementPriority.URGENT}>Urgent</option>
                    <option value={AnnouncementPriority.HIGH}>High</option>
                    <option value={AnnouncementPriority.MEDIUM}>Medium</option>
                    <option value={AnnouncementPriority.LOW}>Low</option>
                  </select>
                </div>

                {/* Important Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Importance
                  </label>
                  <select
                    value={filters.isImportant === undefined ? '' : filters.isImportant.toString()}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      isImportant: e.target.value === '' ? undefined : e.target.value === 'true'
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All</option>
                    <option value="true">Important Only</option>
                    <option value="false">Not Important</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {sortedAnnouncements.length} announcement{sortedAnnouncements.length !== 1 ? 's' : ''} found
        </p>
        {sortedAnnouncements.length !== announcements.length && (
          <p className="text-sm text-gray-500">
            (filtered from {announcements.length} total)
          </p>
        )}
      </div>

      {/* Announcements Grid/List */}
      {sortedAnnouncements.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-gray-500">
            <Search size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements found</h3>
            <p className="text-gray-600">
              {searchTerm || Object.keys(filters).length > 0
                ? 'Try adjusting your search or filters'
                : 'No announcements have been published yet'}
            </p>
          </div>
        </Card>
      ) : (
        <div className={clsx(
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        )}>
          {sortedAnnouncements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              onClick={onAnnouncementClick}
              compact={viewMode === 'grid'}
              showAuthor={true}
              showTags={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementList;

