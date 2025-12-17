import React from 'react';
import { Announcement, AnnouncementType, AnnouncementPriority } from '@/types/announcement';
import Card from '@/components/ui/Card';
import {
  Calendar,
  User,
  Tag,
  ExternalLink,
  FileText,
  Image,
  Link as LinkIcon,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
} from 'lucide-react';
import { clsx } from 'clsx';

interface AnnouncementCardProps {
  announcement: Announcement;
  onClick?: (announcement: Announcement) => void;
  showAuthor?: boolean;
  showTags?: boolean;
  compact?: boolean;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  onClick,
  showAuthor = true,
  showTags = true,
  compact = false,
}) => {
  const getTypeIcon = (type: AnnouncementType) => {
    switch (type) {
      case AnnouncementType.APPLICATION:
        return <User className="text-blue-600" size={16} />;
      case AnnouncementType.PROGRAM:
        return <FileText className="text-green-600" size={16} />;
      case AnnouncementType.EVENT:
        return <Calendar className="text-purple-600" size={16} />;
      case AnnouncementType.RESEARCH:
        return <FileText className="text-orange-600" size={16} />;
      case AnnouncementType.PARTNERSHIP:
        return <LinkIcon className="text-indigo-600" size={16} />;
      default:
        return <FileText className="text-gray-600" size={16} />;
    }
  };

  const getPriorityColor = (priority: AnnouncementPriority) => {
    switch (priority) {
      case AnnouncementPriority.URGENT:
        return 'border-red-200 bg-red-50';
      case AnnouncementPriority.HIGH:
        return 'border-orange-200 bg-orange-50';
      case AnnouncementPriority.MEDIUM:
        return 'border-yellow-200 bg-yellow-50';
      case AnnouncementPriority.LOW:
        return 'border-gray-200 bg-gray-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'doc':
      case 'docx':
        return <FileText size={14} />;
      case 'image':
        return <Image size={14} />;
      case 'link':
        return <ExternalLink size={14} />;
      default:
        return <FileText size={14} />;
    }
  };

  return (
    <Card
      className={clsx(
        'cursor-pointer transition-all hover:shadow-md',
        getPriorityColor(announcement.priority),
        compact ? 'p-4' : 'p-6'
      )}
      onClick={() => onClick?.(announcement)}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {getTypeIcon(announcement.type)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className={clsx(
                  'font-semibold text-gray-900 truncate',
                  compact ? 'text-sm' : 'text-base'
                )}>
                  {announcement.title}
                </h3>
                {announcement.isImportant && (
                  <Star className="text-yellow-500 flex-shrink-0" size={16} />
                )}
              </div>
              
              {!compact && (
                <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                  {announcement.excerpt || announcement.content}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 flex-shrink-0">
            {getPriorityIcon(announcement.priority)}
            <Eye className="text-gray-400" size={16} />
          </div>
        </div>

        {/* Content for compact view */}
        {compact && (
          <p className="text-gray-600 text-sm line-clamp-1">
            {announcement.excerpt || announcement.content}
          </p>
        )}

        {/* Meta information */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Calendar size={12} className="mr-1" />
              {formatDate(announcement.date)}
            </div>
            
            {showAuthor && (
              <div className="flex items-center">
                <User size={12} className="mr-1" />
                {announcement.authorName}
              </div>
            )}
          </div>

          {/* Attachments indicator */}
          {announcement.attachments && announcement.attachments.length > 0 && (
            <div className="flex items-center space-x-1">
              {announcement.attachments.slice(0, 2).map((attachment, index) => (
                <div key={attachment.id} className="text-gray-400">
                  {getAttachmentIcon(attachment.type)}
                </div>
              ))}
              {announcement.attachments.length > 2 && (
                <span className="text-gray-400">+{announcement.attachments.length - 2}</span>
              )}
            </div>
          )}
        </div>

        {/* Tags */}
        {showTags && announcement.tags && announcement.tags.length > 0 && (
          <div className="flex items-center space-x-2">
            <Tag size={12} className="text-gray-400" />
            <div className="flex flex-wrap gap-1">
              {announcement.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {announcement.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{announcement.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Expiration warning */}
        {announcement.expiresAt && new Date(announcement.expiresAt) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
          <div className="flex items-center text-xs text-orange-600">
            <Clock size={12} className="mr-1" />
            Expires {formatDate(announcement.expiresAt)}
          </div>
        )}
      </div>
    </Card>
  );
};

export default AnnouncementCard;

