import { 
  Notification, 
  NotificationType, 
  NotificationPriority, 
  NotificationChannel, 
  NotificationStatus,
  NotificationTemplate,
  NotificationPreferences,
  EmailNotificationData,
  CreateNotificationData,
  BulkNotificationData,
  EmailTemplateVariables,
  NotificationFilter,
  NotificationStats
} from '@/types/notification';
import { apiClient, apiUtils } from './apiClient';

class NotificationService {
  // Create a single notification
  async createNotification(data: CreateNotificationData): Promise<Notification> {
    try {
      const response = await apiUtils.post<Notification>('/notifications', data);
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error('Failed to create notification');
    }
  }

  // Create bulk notifications
  async createBulkNotifications(data: BulkNotificationData): Promise<Notification[]> {
    try {
      const response = await apiUtils.post<Notification[]>('/notifications/bulk', data);
      return response.data;
    } catch (error) {
      console.error('Error creating bulk notifications:', error);
      throw new Error('Failed to create bulk notifications');
    }
  }

  // Get user notifications
  async getUserNotifications(userId: string, filter?: NotificationFilter): Promise<Notification[]> {
    try {
      const params = new URLSearchParams();
      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, String(value));
          }
        });
      }
      
      const response = await apiUtils.get<Notification[]>(`/users/${userId}/notifications?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw new Error('Failed to fetch notifications');
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<Notification> {
    try {
      const response = await apiUtils.patch<Notification>(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw new Error('Failed to mark notification as read');
    }
  }

  // Mark all notifications as read for user
  async markAllAsRead(userId: string): Promise<void> {
    try {
      await apiUtils.patch(`/users/${userId}/notifications/read-all`);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw new Error('Failed to mark all notifications as read');
    }
  }

  // Archive notification
  async archiveNotification(notificationId: string): Promise<Notification> {
    try {
      const response = await apiUtils.patch<Notification>(`/notifications/${notificationId}/archive`);
      return response.data;
    } catch (error) {
      console.error('Error archiving notification:', error);
      throw new Error('Failed to archive notification');
    }
  }

  // Delete notification
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await apiUtils.delete(`/notifications/${notificationId}`);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw new Error('Failed to delete notification');
    }
  }

  // Get notification stats
  async getNotificationStats(userId: string): Promise<NotificationStats> {
    try {
      const response = await apiUtils.get<NotificationStats>(`/users/${userId}/notifications/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      throw new Error('Failed to fetch notification stats');
    }
  }

  // Send email notification
  async sendEmailNotification(data: EmailNotificationData): Promise<void> {
    try {
      await apiUtils.post('/notifications/email', data);
    } catch (error) {
      console.error('Error sending email notification:', error);
      throw new Error('Failed to send email notification');
    }
  }

  // Get notification templates
  async getNotificationTemplates(): Promise<NotificationTemplate[]> {
    try {
      const response = await apiUtils.get<NotificationTemplate[]>('/notification-templates');
      return response.data;
    } catch (error) {
      console.error('Error fetching notification templates:', error);
      throw new Error('Failed to fetch notification templates');
    }
  }

  // Get user notification preferences
  async getNotificationPreferences(userId: string): Promise<NotificationPreferences> {
    try {
      const response = await apiUtils.get<NotificationPreferences>(`/users/${userId}/notification-preferences`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      throw new Error('Failed to fetch notification preferences');
    }
  }

  // Update notification preferences
  async updateNotificationPreferences(userId: string, preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    try {
      const response = await apiUtils.patch<NotificationPreferences>(`/users/${userId}/notification-preferences`, preferences);
      return response.data;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw new Error('Failed to update notification preferences');
    }
  }

  // Mock methods for demo purposes
  async mockCreateNotification(data: CreateNotificationData): Promise<Notification> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const notification: Notification = {
      id: `notification-${Date.now()}`,
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      content: data.content,
      priority: data.priority,
      status: NotificationStatus.UNREAD,
      channels: data.channels,
      isRead: false,
      isArchived: false,
      isDeleted: false,
      actionUrl: data.actionUrl,
      actionText: data.actionText,
      actionData: data.actionData,
      relatedEntityId: data.relatedEntityId,
      relatedEntityType: data.relatedEntityType,
      scheduledAt: data.scheduledAt,
      sentAt: new Date().toISOString(),
      expiresAt: data.expiresAt,
      metadata: data.metadata,
      tags: data.tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Simulate email sending if email channel is enabled
    if (data.channels.includes(NotificationChannel.EMAIL)) {
      await this.mockSendEmail(notification);
    }

    console.log('Mock notification created:', notification);
    return notification;
  }

  async mockSendEmail(notification: Notification): Promise<void> {
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log(`Mock email sent to user ${notification.userId}:`, {
      subject: notification.title,
      message: notification.message,
      type: notification.type,
    });
  }

  async mockGetUserNotifications(userId: string, filter?: NotificationFilter): Promise<Notification[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // Mock notifications data
    const mockNotifications: Notification[] = [
      {
        id: '1',
        userId,
        type: NotificationType.COURSE_ASSIGNMENT,
        title: 'New Assignment Available',
        message: 'A new assignment "Policy Analysis Paper" has been added to your course.',
        priority: NotificationPriority.HIGH,
        status: NotificationStatus.UNREAD,
        channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
        isRead: false,
        isArchived: false,
        isDeleted: false,
        actionUrl: '/courses/1/assignments/1',
        actionText: 'View Assignment',
        relatedEntityId: '1',
        relatedEntityType: 'assignment',
        sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        userId,
        type: NotificationType.QUIZ_DUE,
        title: 'Quiz Due Soon',
        message: 'Your quiz "Drug Policy Fundamentals" is due in 24 hours.',
        priority: NotificationPriority.MEDIUM,
        status: NotificationStatus.UNREAD,
        channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
        isRead: false,
        isArchived: false,
        isDeleted: false,
        actionUrl: '/courses/1/quizzes/1',
        actionText: 'Take Quiz',
        relatedEntityId: '1',
        relatedEntityType: 'quiz',
        sentAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        userId,
        type: NotificationType.ASSIGNMENT_GRADED,
        title: 'Assignment Graded',
        message: 'Your assignment "Literature Review" has been graded. You received 85/100 points.',
        priority: NotificationPriority.MEDIUM,
        status: NotificationStatus.READ,
        channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
        isRead: true,
        isArchived: false,
        isDeleted: false,
        actionUrl: '/courses/1/assignments/2',
        actionText: 'View Feedback',
        relatedEntityId: '2',
        relatedEntityType: 'assignment',
        readAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        sentAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        userId,
        type: NotificationType.ANNOUNCEMENT,
        title: 'System Maintenance',
        message: 'Scheduled maintenance will occur on Sunday from 2:00 AM to 4:00 AM.',
        priority: NotificationPriority.LOW,
        status: NotificationStatus.READ,
        channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
        isRead: true,
        isArchived: false,
        isDeleted: false,
        sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
    ];

    // Apply filters if provided
    let filteredNotifications = mockNotifications;
    
    if (filter) {
      if (filter.isRead !== undefined) {
        filteredNotifications = filteredNotifications.filter(n => n.isRead === filter.isRead);
      }
      if (filter.type) {
        filteredNotifications = filteredNotifications.filter(n => n.type === filter.type);
      }
      if (filter.priority) {
        filteredNotifications = filteredNotifications.filter(n => n.priority === filter.priority);
      }
      if (filter.status) {
        filteredNotifications = filteredNotifications.filter(n => n.status === filter.status);
      }
    }

    return filteredNotifications;
  }

  async mockGetNotificationStats(userId: string): Promise<NotificationStats> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    return {
      total: 15,
      unread: 3,
      byType: {
        [NotificationType.COURSE_ASSIGNMENT]: 5,
        [NotificationType.QUIZ_DUE]: 3,
        [NotificationType.ASSIGNMENT_GRADED]: 4,
        [NotificationType.ANNOUNCEMENT]: 2,
        [NotificationType.SYSTEM_MAINTENANCE]: 1,
      } as Record<NotificationType, number>,
      byPriority: {
        [NotificationPriority.LOW]: 5,
        [NotificationPriority.MEDIUM]: 7,
        [NotificationPriority.HIGH]: 3,
        [NotificationPriority.URGENT]: 0,
      },
      byStatus: {
        [NotificationStatus.UNREAD]: 3,
        [NotificationStatus.READ]: 10,
        [NotificationStatus.ARCHIVED]: 2,
        [NotificationStatus.DELETED]: 0,
      },
      recent: 8, // Last 7 days
    };
  }

  async mockMarkAsRead(notificationId: string): Promise<Notification> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // Mock updated notification
    const updatedNotification: Notification = {
      id: notificationId,
      userId: 'current-user',
      type: NotificationType.COURSE_ASSIGNMENT,
      title: 'New Assignment Available',
      message: 'A new assignment "Policy Analysis Paper" has been added to your course.',
      priority: NotificationPriority.HIGH,
      status: NotificationStatus.READ,
      channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
      isRead: true,
      isArchived: false,
      isDeleted: false,
      actionUrl: '/courses/1/assignments/1',
      actionText: 'View Assignment',
      relatedEntityId: '1',
      relatedEntityType: 'assignment',
      readAt: new Date().toISOString(),
      sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return updatedNotification;
  }

  async mockMarkAllAsRead(userId: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Mock: Marked all notifications as read for user ${userId}`);
  }

  // Email template rendering
  renderEmailTemplate(template: string, variables: EmailTemplateVariables): string {
    let renderedTemplate = template;
    
    // Replace variables in template
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      renderedTemplate = renderedTemplate.replace(new RegExp(placeholder, 'g'), String(value || ''));
    });

    return renderedTemplate;
  }

  // Get default email templates
  getDefaultEmailTemplates(): Record<NotificationType, string> {
    return {
      [NotificationType.COURSE_ASSIGNMENT]: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Assignment Available</h2>
          <p>Hello {{userName}},</p>
          <p>A new assignment "<strong>{{assignmentName}}</strong>" has been added to your course "<strong>{{courseName}}</strong>".</p>
          <p><strong>Due Date:</strong> {{dueDate}}</p>
          <p><strong>Points:</strong> {{points}}</p>
          <div style="margin: 30px 0;">
            <a href="{{actionUrl}}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Assignment</a>
          </div>
          <p>Best regards,<br>CDPTA Team</p>
        </div>
      `,
      [NotificationType.QUIZ_DUE]: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Quiz Due Soon</h2>
          <p>Hello {{userName}},</p>
          <p>Your quiz "<strong>{{quizName}}</strong>" is due soon.</p>
          <p><strong>Due Date:</strong> {{dueDate}}</p>
          <p><strong>Time Limit:</strong> {{timeLimit}} minutes</p>
          <div style="margin: 30px 0;">
            <a href="{{actionUrl}}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Take Quiz</a>
          </div>
          <p>Best regards,<br>CDPTA Team</p>
        </div>
      `,
      [NotificationType.ASSIGNMENT_GRADED]: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Assignment Graded</h2>
          <p>Hello {{userName}},</p>
          <p>Your assignment "<strong>{{assignmentName}}</strong>" has been graded.</p>
          <p><strong>Grade:</strong> {{grade}}/{{totalPoints}}</p>
          <p><strong>Feedback:</strong> {{feedback}}</p>
          <div style="margin: 30px 0;">
            <a href="{{actionUrl}}" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Feedback</a>
          </div>
          <p>Best regards,<br>CDPTA Team</p>
        </div>
      `,
      [NotificationType.ANNOUNCEMENT]: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">{{title}}</h2>
          <p>Hello {{userName}},</p>
          <p>{{message}}</p>
          <div style="margin: 30px 0;">
            <a href="{{actionUrl}}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">{{actionText}}</a>
          </div>
          <p>Best regards,<br>CDPTA Team</p>
        </div>
      `,
    } as Record<NotificationType, string>;
  }
}

export const notificationService = new NotificationService();






























