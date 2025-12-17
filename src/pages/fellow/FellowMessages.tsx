import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  MessageCircle,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Search,
  Filter,
  Plus,
  Archive,
  Trash2,
  Star,
  Reply,
  Forward,
  Eye,
  EyeOff,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  User,
  Settings,
  Download,
  Upload,
} from 'lucide-react';
import { clsx } from 'clsx';

interface Message {
  id: string;
  subject: string;
  content: string;
  sender: {
    id: string;
    name: string;
    email: string;
    role: 'staff' | 'admin' | 'fellow';
    avatar?: string;
  };
  recipients: {
    id: string;
    name: string;
    email: string;
    role: 'staff' | 'admin' | 'fellow';
  }[];
  timestamp: string;
  isRead: boolean;
  isImportant: boolean;
  isArchived: boolean;
  attachments?: MessageAttachment[];
  threadId?: string;
  replyTo?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'general' | 'assignment' | 'quiz' | 'deadline' | 'announcement' | 'system';
}

interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

interface MessageThread {
  id: string;
  subject: string;
  messages: Message[];
  lastMessage: Message;
  unreadCount: number;
  isImportant: boolean;
}

interface MessageFilter {
  status: 'all' | 'unread' | 'read' | 'important' | 'archived';
  category: Message['category'] | 'all';
  priority: Message['priority'] | 'all';
  sender: 'all' | 'staff' | 'admin' | 'fellow';
}

const FellowMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<MessageFilter>({
    status: 'all',
    category: 'all',
    priority: 'all',
    sender: 'all'
  });
  const [viewMode, setViewMode] = useState<'inbox' | 'sent' | 'drafts' | 'archived'>('inbox');
  const [composeMode, setComposeMode] = useState(false);
  const [newMessage, setNewMessage] = useState({
    subject: '',
    content: '',
    recipients: [] as string[],
    priority: 'medium' as Message['priority'],
    category: 'general' as Message['category']
  });

  // Mock messages data
  const mockMessages: Message[] = [
    {
      id: 'msg-1',
      subject: 'Assignment Feedback: Formulary Management Case Studies',
      content: 'Dear Fellow,\n\nI have reviewed your submission for the Formulary Management Case Studies assignment. Overall, your work demonstrates a strong understanding of the principles covered in the module.\n\nStrengths:\n- Excellent ABC analysis methodology\n- Well-structured case study responses\n- Good use of evidence to support recommendations\n\nAreas for improvement:\n- Consider including more cost-effectiveness analysis\n- Provide more detailed justifications for formulary decisions\n\nOverall Grade: 85/100\n\nPlease feel free to schedule a meeting if you would like to discuss your feedback in more detail.\n\nBest regards,\nDr. Sarah Ahmed\nHTA Program Coordinator',
      sender: {
        id: 'staff-1',
        name: 'Dr. Sarah Ahmed',
        email: 'sarah.ahmed@cdpta.org',
        role: 'staff'
      },
      recipients: [{
        id: 'fellow-1',
        name: 'Current Fellow',
        email: 'fellow@cdpta.org',
        role: 'fellow'
      }],
      timestamp: '2024-02-14T15:30:00Z',
      isRead: false,
      isImportant: true,
      isArchived: false,
      priority: 'medium',
      category: 'assignment',
      attachments: [{
        id: 'att-1',
        name: 'Assignment_Feedback.pdf',
        url: '/attachments/assignment-feedback.pdf',
        type: 'application/pdf',
        size: 1024000
      }]
    },
    {
      id: 'msg-2',
      subject: 'Upcoming Workshop: Decision Analytical Modeling',
      content: 'Hello Everyone,\n\nI hope this message finds you well. I wanted to remind you about the upcoming Decision Analytical Modeling workshop scheduled for March 1-2, 2024.\n\nWorkshop Details:\n- Date: March 1-2, 2024\n- Time: 9:00 AM - 5:00 PM\n- Location: Training Center, CDPTA Building\n- Duration: 1.5 days\n\nPreparation Required:\n- Please complete the pre-workshop reading materials\n- Bring your laptops with Excel installed\n- Review the TreeAge software tutorial\n\nThis workshop is crucial for your final project, so please ensure you attend both days.\n\nIf you have any questions or concerns, please don\'t hesitate to reach out.\n\nBest regards,\nDr. Mohammed Hassan\nWorkshop Coordinator',
      sender: {
        id: 'staff-2',
        name: 'Dr. Mohammed Hassan',
        email: 'mohammed.hassan@cdpta.org',
        role: 'staff'
      },
      recipients: [{
        id: 'fellow-1',
        name: 'Current Fellow',
        email: 'fellow@cdpta.org',
        role: 'fellow'
      }],
      timestamp: '2024-02-13T10:00:00Z',
      isRead: true,
      isImportant: true,
      isArchived: false,
      priority: 'high',
      category: 'announcement'
    },
    {
      id: 'msg-3',
      subject: 'Quiz Results: Biostatistics Fundamentals',
      content: 'Dear Fellow,\n\nYour Biostatistics Quiz has been graded. Here are your results:\n\nScore: 85/100 (85%)\n\nDetailed Results:\n- Question 1: 10/10 (Statistical concepts)\n- Question 2: 8/10 (Test selection)\n- Question 3: 7/10 (Result interpretation)\n\nOverall Performance: Good\n\nYou demonstrated solid understanding of basic biostatistical concepts. For question 3, consider reviewing the interpretation of p-values and confidence intervals.\n\nKeep up the excellent work!\n\nDr. Fatima Al-Zahra\nBiostatistics Instructor',
      sender: {
        id: 'staff-3',
        name: 'Dr. Fatima Al-Zahra',
        email: 'fatima.alzahra@cdpta.org',
        role: 'staff'
      },
      recipients: [{
        id: 'fellow-1',
        name: 'Current Fellow',
        email: 'fellow@cdpta.org',
        role: 'fellow'
      }],
      timestamp: '2024-02-12T14:30:00Z',
      isRead: true,
      isImportant: false,
      isArchived: false,
      priority: 'medium',
      category: 'quiz'
    },
    {
      id: 'msg-4',
      subject: 'System Maintenance Notification',
      content: 'Dear All,\n\nWe will be performing scheduled system maintenance on Sunday, February 18, 2024, from 2:00 AM to 4:00 AM (Jordan Time).\n\nDuring this time:\n- The platform will be temporarily unavailable\n- All ongoing sessions will be saved\n- No data will be lost\n\nWe apologize for any inconvenience this may cause. Please plan your work accordingly.\n\nIf you have any urgent matters, please contact the IT support team.\n\nThank you for your understanding.\n\nIT Support Team\nCDPTA',
      sender: {
        id: 'admin-1',
        name: 'IT Support Team',
        email: 'support@cdpta.org',
        role: 'admin'
      },
      recipients: [{
        id: 'fellow-1',
        name: 'Current Fellow',
        email: 'fellow@cdpta.org',
        role: 'fellow'
      }],
      timestamp: '2024-02-12T12:00:00Z',
      isRead: true,
      isImportant: false,
      isArchived: false,
      priority: 'medium',
      category: 'system'
    },
    {
      id: 'msg-5',
      subject: 'Deadline Reminder: Clinical Trial Appraisal',
      content: 'Dear Fellow,\n\nThis is a friendly reminder that your Clinical Trial Appraisal assignment is due in 3 days (February 25, 2024).\n\nAssignment Details:\n- Title: Clinical Trial Appraisal\n- Due Date: February 25, 2024, 11:59 PM\n- Submission Type: Written appraisal + file upload\n- Max Score: 120 points\n\nPlease ensure you:\n- Complete the appraisal of two RCTs and one systematic review\n- Use the provided evaluation criteria\n- Submit your work before the deadline\n\nIf you need any assistance or have questions, please don\'t hesitate to contact me.\n\nBest regards,\nDr. Omar Khalil\nClinical Research Coordinator',
      sender: {
        id: 'staff-4',
        name: 'Dr. Omar Khalil',
        email: 'omar.khalil@cdpta.org',
        role: 'staff'
      },
      recipients: [{
        id: 'fellow-1',
        name: 'Current Fellow',
        email: 'fellow@cdpta.org',
        role: 'fellow'
      }],
      timestamp: '2024-02-13T08:00:00Z',
      isRead: false,
      isImportant: true,
      isArchived: false,
      priority: 'high',
      category: 'deadline'
    }
  ];

  const mockThreads: MessageThread[] = [
    {
      id: 'thread-1',
      subject: 'Assignment Feedback: Formulary Management Case Studies',
      messages: [mockMessages[0]],
      lastMessage: mockMessages[0],
      unreadCount: 1,
      isImportant: true
    },
    {
      id: 'thread-2',
      subject: 'Upcoming Workshop: Decision Analytical Modeling',
      messages: [mockMessages[1]],
      lastMessage: mockMessages[1],
      unreadCount: 0,
      isImportant: true
    },
    {
      id: 'thread-3',
      subject: 'Quiz Results: Biostatistics Fundamentals',
      messages: [mockMessages[2]],
      lastMessage: mockMessages[2],
      unreadCount: 0,
      isImportant: false
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories', color: 'bg-gray-100 text-gray-800' },
    { value: 'general', label: 'General', color: 'bg-blue-100 text-blue-800' },
    { value: 'assignment', label: 'Assignments', color: 'bg-green-100 text-green-800' },
    { value: 'quiz', label: 'Quizzes', color: 'bg-purple-100 text-purple-800' },
    { value: 'deadline', label: 'Deadlines', color: 'bg-orange-100 text-orange-800' },
    { value: 'announcement', label: 'Announcements', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'system', label: 'System', color: 'bg-red-100 text-red-800' },
  ];

  const priorities = [
    { value: 'all', label: 'All Priorities', color: 'bg-gray-100 text-gray-800' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
  ];

  useEffect(() => {
    setMessages(mockMessages);
    setThreads(mockThreads);
  }, []);

  const getPriorityColor = (priority: Message['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: Message['category']) => {
    const categoryInfo = categories.find(c => c.value === category);
    return categoryInfo?.color || 'bg-gray-100 text-gray-800';
  };

  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const getSenderInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.sender.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filter.status === 'all' || 
                         (filter.status === 'unread' && !message.isRead) ||
                         (filter.status === 'read' && message.isRead) ||
                         (filter.status === 'important' && message.isImportant) ||
                         (filter.status === 'archived' && message.isArchived);
    const matchesCategory = filter.category === 'all' || message.category === filter.category;
    const matchesPriority = filter.priority === 'all' || message.priority === filter.priority;
    const matchesSender = filter.sender === 'all' || message.sender.role === filter.sender;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority && matchesSender;
  });

  const unreadCount = messages.filter(m => !m.isRead).length;
  const importantCount = messages.filter(m => m.isImportant && !m.isRead).length;

  const handleMarkAsRead = async (messageId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setMessages(prev => 
        prev.map(m => m.id === messageId ? { ...m, isRead: true } : m)
      );
    } catch (error) {
      console.error('Error marking message as read:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchiveMessage = async (messageId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setMessages(prev => 
        prev.map(m => m.id === messageId ? { ...m, isArchived: true } : m)
      );
    } catch (error) {
      console.error('Error archiving message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setMessages(prev => prev.filter(m => m.id !== messageId));
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Message sent:', newMessage);
      setComposeMode(false);
      setNewMessage({
        subject: '',
        content: '',
        recipients: [],
        priority: 'medium',
        category: 'general'
      });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageList = () => (
    <div className="space-y-2">
      {filteredMessages.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <MessageCircle className="mx-auto mb-4 text-gray-300" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
          <p>No messages match your current filters.</p>
        </div>
      ) : (
        filteredMessages.map(message => (
          <Card
            key={message.id}
            className={clsx(
              'cursor-pointer hover:shadow-md transition-shadow',
              !message.isRead && 'border-l-4 border-l-primary-500 bg-primary-50',
              message.isImportant && 'ring-2 ring-yellow-200'
            )}
            onClick={() => {
              setSelectedMessage(message);
              if (!message.isRead) {
                handleMarkAsRead(message.id);
              }
            }}
          >
            <Card.Content className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {getSenderInitials(message.sender.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={clsx(
                        'font-medium text-gray-900 truncate',
                        !message.isRead && 'font-semibold'
                      )}>
                        {message.subject}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {message.content}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {message.isImportant && (
                        <Star className="text-yellow-500" size={16} />
                      )}
                      {!message.isRead && (
                        <div className="w-2 h-2 bg-primary-500 rounded-full" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{message.sender.name}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(message.priority)}`}>
                        {message.priority}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(message.category)}`}>
                        {message.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {getTimeAgo(message.timestamp)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleArchiveMessage(message.id);
                        }}
                      >
                        <Archive size={14} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMessage(message.id);
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
        ))
      )}
    </div>
  );

  const renderMessageDetails = () => {
    if (!selectedMessage) return null;
    
    return (
      <div className="space-y-6">
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white text-lg font-medium">
                  {getSenderInitials(selectedMessage.sender.name)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedMessage.subject}</h2>
                  <p className="text-gray-600">
                    From: {selectedMessage.sender.name} ({selectedMessage.sender.email})
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Reply size={16} className="mr-2" />
                  Reply
                </Button>
                <Button variant="outline" size="sm">
                  <Forward size={16} className="mr-2" />
                  Forward
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedMessage(null)}>
                  ← Back
                </Button>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <span>Received: {new Date(selectedMessage.timestamp).toLocaleString()}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(selectedMessage.priority)}`}>
                  {selectedMessage.priority} Priority
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(selectedMessage.category)}`}>
                  {selectedMessage.category}
                </span>
                {selectedMessage.isImportant && (
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                    Important
                  </span>
                )}
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {selectedMessage.content}
                </p>
              </div>
            </div>
            
            {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Attachments</h3>
                <div className="space-y-2">
                  {selectedMessage.attachments.map(attachment => (
                    <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Paperclip className="text-gray-600" size={16} />
                        <div>
                          <h4 className="font-medium text-gray-900">{attachment.name}</h4>
                          <p className="text-sm text-gray-600">
                            {(attachment.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download size={16} className="mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-6 border-t border-gray-200">
              <div className="flex space-x-3">
                <Button>
                  <Reply size={16} className="mr-2" />
                  Reply
                </Button>
                <Button variant="outline">
                  <Forward size={16} className="mr-2" />
                  Forward
                </Button>
                <Button variant="outline" onClick={() => handleArchiveMessage(selectedMessage.id)}>
                  <Archive size={16} className="mr-2" />
                  Archive
                </Button>
                <Button variant="outline" onClick={() => handleDeleteMessage(selectedMessage.id)}>
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    );
  };

  const renderComposeMessage = () => (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Compose Message</h3>
          <Button variant="outline" size="sm" onClick={() => setComposeMode(false)}>
            Cancel
          </Button>
        </div>
      </Card.Header>
      <Card.Content>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              value={newMessage.subject}
              onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter message subject..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter recipient emails (comma-separated)..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={newMessage.priority}
                onChange={(e) => setNewMessage(prev => ({ ...prev, priority: e.target.value as Message['priority'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {priorities.slice(1).map(priority => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={newMessage.category}
                onChange={(e) => setNewMessage(prev => ({ ...prev, category: e.target.value as Message['category'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {categories.slice(1).map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              value={newMessage.content}
              onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter your message..."
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Paperclip size={16} className="mr-2" />
                Attach File
              </Button>
              <Button variant="outline" size="sm">
                <Smile size={16} className="mr-2" />
                Emoji
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setComposeMode(false)}>
                Save Draft
              </Button>
              <Button onClick={handleSendMessage} disabled={isLoading}>
                <Send size={16} className="mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </Card.Content>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Communicate with staff and fellow participants</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setComposeMode(true)}>
            <Plus size={16} className="mr-2" />
            Compose
          </Button>
          <Button variant="outline">
            <Settings size={16} className="mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageCircle className="text-blue-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="text-red-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="text-yellow-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Important</p>
              <p className="text-2xl font-bold text-gray-900">{importantCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Read</p>
              <p className="text-2xl font-bold text-gray-900">{messages.length - unreadCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="flex border border-gray-300 rounded-md">
              <Button
                variant={viewMode === 'inbox' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('inbox')}
                className="rounded-r-none"
              >
                Inbox ({unreadCount})
              </Button>
              <Button
                variant={viewMode === 'sent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('sent')}
                className="rounded-l-none rounded-r-none"
              >
                Sent
              </Button>
              <Button
                variant={viewMode === 'drafts' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('drafts')}
                className="rounded-l-none rounded-r-none"
              >
                Drafts
              </Button>
              <Button
                variant={viewMode === 'archived' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('archived')}
                className="rounded-l-none"
              >
                Archived
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Advanced Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filter.status}
              onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value as 'all' | 'unread' | 'read' | 'important' | 'archived' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="important">Important</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={filter.category}
              onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value as Message['category'] | 'all' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={filter.priority}
              onChange={(e) => setFilter(prev => ({ ...prev, priority: e.target.value as Message['priority'] | 'all' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {priorities.map(priority => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sender</label>
            <select
              value={filter.sender}
              onChange={(e) => setFilter(prev => ({ ...prev, sender: e.target.value as 'all' | 'staff' | 'admin' | 'fellow' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Senders</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
              <option value="fellow">Fellows</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          {composeMode ? renderComposeMessage() : (
            selectedMessage ? renderMessageDetails() : renderMessageList()
          )}
        </>
      )}
    </div>
  );
};

export default FellowMessages;
































