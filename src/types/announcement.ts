export enum AnnouncementType {
  GENERAL = 'general',
  APPLICATION = 'application',
  PROGRAM = 'program',
  EVENT = 'event',
  RESEARCH = 'research',
  PARTNERSHIP = 'partnership',
}

export enum AnnouncementPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface Announcement {
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
  attachments?: AnnouncementAttachment[];
  targetAudience?: string[]; // User roles this announcement is relevant for
  expiresAt?: string; // Optional expiration date
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementAttachment {
  id: string;
  name: string;
  url: string;
  type: 'pdf' | 'doc' | 'docx' | 'image' | 'link';
  size?: number; // File size in bytes
}

export interface AnnouncementFilter {
  type?: AnnouncementType;
  priority?: AnnouncementPriority;
  isImportant?: boolean;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
  search?: string;
}

export interface AnnouncementStats {
  total: number;
  byType: Record<AnnouncementType, number>;
  byPriority: Record<AnnouncementPriority, number>;
  recent: number; // Count of announcements from last 30 days
  important: number;
}

