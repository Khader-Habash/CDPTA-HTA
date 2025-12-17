import React, { useState, useEffect } from 'react';
import { CalendarEvent } from '@/types/courseManagement';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Video,
  FileText,
  Award,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Search,
  Download,
  ExternalLink,
  Bell,
  BellOff,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';
import { clsx } from 'clsx';

interface CalendarView {
  type: 'month' | 'week' | 'day';
  label: string;
}

interface EventFilter {
  type: CalendarEvent['type'] | 'all';
  status: 'upcoming' | 'past' | 'all';
}

const FellowCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewType, setViewType] = useState<CalendarView['type']>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<EventFilter>({ type: 'all', status: 'upcoming' });

  // Mock calendar events
  const mockEvents: CalendarEvent[] = [
    {
      id: 'event-1',
      title: 'Formulary Management Lecture',
      description: 'Comprehensive lecture on formulary development and management principles',
      startDate: '2024-02-15T10:00:00Z',
      endDate: '2024-02-15T12:00:00Z',
      type: 'lecture',
      location: 'Room 101, CDPTA Building',
      courseId: 'rotation-1',
      isVirtual: false,
      attendees: ['fellow-1', 'fellow-2', 'fellow-3'],
      createdBy: 'staff-1',
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: '2024-02-01T00:00:00Z',
    },
    {
      id: 'event-2',
      title: 'Literature Search Workshop',
      description: 'Hands-on workshop on database searching and PICO methodology',
      startDate: '2024-02-16T14:00:00Z',
      endDate: '2024-02-16T17:00:00Z',
      type: 'workshop',
      location: 'Computer Lab, CDPTA Building',
      courseId: 'rotation-2',
      isVirtual: false,
      attendees: ['fellow-1', 'fellow-2', 'fellow-3'],
      createdBy: 'staff-2',
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: '2024-02-01T00:00:00Z',
    },
    {
      id: 'event-3',
      title: 'Biostatistics Quiz',
      description: 'Multiple-choice assessment on biostatistical concepts',
      startDate: '2024-02-20T09:00:00Z',
      endDate: '2024-02-20T10:00:00Z',
      type: 'exam',
      location: 'Online',
      courseId: 'rotation-3',
      isVirtual: true,
      meetingLink: 'https://quiz.cdpta.org/biostatistics',
      attendees: ['fellow-1', 'fellow-2', 'fellow-3'],
      createdBy: 'staff-3',
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: '2024-02-01T00:00:00Z',
    },
    {
      id: 'event-4',
      title: 'Clinical Trial Appraisal Deadline',
      description: 'Submit written appraisal of two randomized controlled trials',
      startDate: '2024-02-25T23:59:59Z',
      endDate: '2024-02-25T23:59:59Z',
      type: 'deadline',
      courseId: 'rotation-4',
      isVirtual: false,
      attendees: ['fellow-1', 'fellow-2', 'fellow-3'],
      createdBy: 'staff-4',
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: '2024-02-01T00:00:00Z',
    },
    {
      id: 'event-5',
      title: 'Journal Club Session',
      description: 'Discussion of recent pharmacoeconomics research',
      startDate: '2024-02-22T11:00:00Z',
      endDate: '2024-02-22T12:00:00Z',
      type: 'meeting',
      location: 'Conference Room A',
      courseId: 'rotation-5',
      isVirtual: false,
      attendees: ['fellow-1', 'fellow-2', 'fellow-3'],
      createdBy: 'staff-5',
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: '2024-02-01T00:00:00Z',
    },
    {
      id: 'event-6',
      title: 'Decision Modeling Workshop',
      description: '1.5-day intensive workshop on decision analytical modeling',
      startDate: '2024-03-01T09:00:00Z',
      endDate: '2024-03-02T17:00:00Z',
      type: 'workshop',
      location: 'Training Center',
      courseId: 'rotation-6',
      isVirtual: false,
      attendees: ['fellow-1', 'fellow-2', 'fellow-3'],
      createdBy: 'staff-6',
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: '2024-02-01T00:00:00Z',
    },
    {
      id: 'event-7',
      title: 'HTA Program Midpoint Review',
      description: 'Individual progress review meetings with supervisors',
      startDate: '2024-03-10T09:00:00Z',
      endDate: '2024-03-10T17:00:00Z',
      type: 'meeting',
      location: 'Various Offices',
      courseId: 'final-project',
      isVirtual: false,
      attendees: ['fellow-1', 'fellow-2', 'fellow-3'],
      createdBy: 'staff-1',
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: '2024-02-01T00:00:00Z',
    }
  ];

  const calendarViews: CalendarView[] = [
    { type: 'month', label: 'Month' },
    { type: 'week', label: 'Week' },
    { type: 'day', label: 'Day' },
  ];

  const eventTypes = [
    { value: 'all', label: 'All Events', color: 'bg-gray-100 text-gray-800' },
    { value: 'lecture', label: 'Lectures', color: 'bg-blue-100 text-blue-800' },
    { value: 'workshop', label: 'Workshops', color: 'bg-green-100 text-green-800' },
    { value: 'exam', label: 'Exams', color: 'bg-red-100 text-red-800' },
    { value: 'meeting', label: 'Meetings', color: 'bg-purple-100 text-purple-800' },
    { value: 'deadline', label: 'Deadlines', color: 'bg-orange-100 text-orange-800' },
    { value: 'assignment_due', label: 'Assignments', color: 'bg-yellow-100 text-yellow-800' },
  ];

  const getEventIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'lecture':
        return <FileText className="text-blue-600" size={16} />;
      case 'workshop':
        return <Users className="text-green-600" size={16} />;
      case 'exam':
        return <Award className="text-red-600" size={16} />;
      case 'meeting':
        return <Users className="text-purple-600" size={16} />;
      case 'deadline':
        return <AlertCircle className="text-orange-600" size={16} />;
      case 'assignment_due':
        return <FileText className="text-yellow-600" size={16} />;
      default:
        return <CalendarIcon className="text-gray-600" size={16} />;
    }
  };

  const getEventColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'lecture':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'workshop':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'exam':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'meeting':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'deadline':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'assignment_due':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventStatus = (event: CalendarEvent) => {
    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    
    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'ongoing';
    return 'past';
  };

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'text-blue-600';
      case 'ongoing':
        return 'text-green-600';
      case 'past':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filter.type === 'all' || event.type === filter.type;
    const eventStatus = getEventStatus(event);
    const matchesStatus = filter.status === 'all' || eventStatus === filter.status;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getEventsForWeek = (startDate: Date) => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate >= startDate && eventDate <= endDate;
    });
  };

  const getUpcomingEvents = () => {
    const now = new Date();
    return filteredEvents
      .filter(event => new Date(event.startDate) > now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, 5);
  };

  const navigateCalendar = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    switch (viewType) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    setCurrentDate(newDate);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDay = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {monthNames[month]} {year}
          </h2>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
          
          {days.map((day, index) => {
            const dayEvents = getEventsForDate(day);
            const isCurrentMonth = day.getMonth() === month;
            const isToday = day.toDateString() === new Date().toDateString();
            const isSelected = day.toDateString() === selectedDate.toDateString();
            
            return (
              <div
                key={index}
                className={clsx(
                  'min-h-[100px] p-2 border border-gray-200 cursor-pointer hover:bg-gray-50',
                  !isCurrentMonth && 'bg-gray-50 text-gray-400',
                  isToday && 'bg-blue-50 border-blue-300',
                  isSelected && 'bg-primary-50 border-primary-300'
                )}
                onClick={() => setSelectedDate(day)}
              >
                <div className={clsx(
                  'text-sm font-medium mb-1',
                  isToday && 'text-blue-600',
                  isSelected && 'text-primary-600'
                )}>
                  {day.getDate()}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map(event => (
                    <div
                      key={event.id}
                      className={clsx(
                        'text-xs p-1 rounded truncate cursor-pointer hover:shadow-sm',
                        getEventColor(event.type)
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(event);
                      }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const weekEvents = getEventsForWeek(startOfWeek);
    const weekDays = [];
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day);
    }
    
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Week of {startOfWeek.toLocaleDateString()}
          </h2>
        </div>
        
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day, index) => {
            const dayEvents = getEventsForDate(day);
            const isToday = day.toDateString() === new Date().toDateString();
            
            return (
              <div key={index} className="space-y-2">
                <div className={clsx(
                  'text-center p-2 rounded-lg',
                  isToday && 'bg-blue-100 text-blue-800'
                )}>
                  <div className="text-sm font-medium">
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-lg font-bold">{day.getDate()}</div>
                </div>
                
                <div className="space-y-2">
                  {dayEvents.map(event => (
                    <div
                      key={event.id}
                      className={clsx(
                        'p-2 rounded-lg cursor-pointer hover:shadow-sm',
                        getEventColor(event.type)
                      )}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="text-xs font-medium truncate">
                        {event.title}
                      </div>
                      <div className="text-xs opacity-75">
                        {formatTime(event.startDate)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate);
    const isToday = currentDate.toDateString() === new Date().toDateString();
    
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {currentDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h2>
        </div>
        
        <div className="space-y-4">
          {dayEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No events scheduled for this day
            </div>
          ) : (
            dayEvents.map(event => (
              <Card
                key={event.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedEvent(event)}
              >
                <Card.Content className="p-4">
                  <div className="flex items-start space-x-3">
                    {getEventIcon(event.type)}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock size={14} />
                          <span>{formatTime(event.startDate)} - {formatTime(event.endDate)}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin size={14} />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getEventColor(event.type)}`}>
                        {event.type}
                      </span>
                      <span className={`text-xs ${getEventStatusColor(getEventStatus(event))}`}>
                        {getEventStatus(event)}
                      </span>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderEventDetails = () => {
    if (!selectedEvent) return null;
    
    const status = getEventStatus(selectedEvent);
    
    return (
      <div className="space-y-6">
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getEventIcon(selectedEvent.type)}
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedEvent.title}</h2>
                  <p className="text-gray-600">{selectedEvent.description}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedEvent(null)}>
                  ← Back
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Clock className="text-gray-600" size={16} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Date & Time</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(selectedEvent.startDate)} • {formatTime(selectedEvent.startDate)} - {formatTime(selectedEvent.endDate)}
                    </p>
                  </div>
                </div>
                
                {selectedEvent.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="text-gray-600" size={16} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Location</p>
                      <p className="text-sm text-gray-600">{selectedEvent.location}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  <Users className="text-gray-600" size={16} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Type</p>
                    <p className="text-sm text-gray-600 capitalize">{selectedEvent.type}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${getEventColor(selectedEvent.type)}`}>
                    {selectedEvent.type}
                  </span>
                  <span className={`text-sm ${getEventStatusColor(status)}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
                
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex space-x-3">
                {status === 'upcoming' && (
                  <Button>
                    <Bell size={16} className="mr-2" />
                    Set Reminder
                  </Button>
                )}
                {selectedEvent.location && !selectedEvent.isVirtual && (
                  <Button variant="outline">
                    <MapPin size={16} className="mr-2" />
                    Get Directions
                  </Button>
                )}
                {selectedEvent.isVirtual && (
                  <Button variant="outline">
                    <Video size={16} className="mr-2" />
                    Join Online
                  </Button>
                )}
                <Button variant="outline">
                  <Download size={16} className="mr-2" />
                  Add to Calendar
                </Button>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    );
  };

  const renderUpcomingEvents = () => (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-semibold">Upcoming Events</h3>
      </Card.Header>
      <Card.Content>
        <div className="space-y-3">
          {getUpcomingEvents().map(event => (
            <div
              key={event.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setSelectedEvent(event)}
            >
              <div className="flex items-center space-x-3">
                {getEventIcon(event.type)}
                <div>
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-600">
                    {formatDate(event.startDate)} • {formatTime(event.startDate)}
                  </p>
                </div>
              </div>
              <ChevronRight className="text-gray-400" size={16} />
            </div>
          ))}
        </div>
      </Card.Content>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600">View your schedule, deadlines, and important events</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Export Calendar
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <select
              value={filter.type}
              onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value as CalendarEvent['type'] | 'all' }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {eventTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <select
              value={filter.status}
              onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value as 'upcoming' | 'past' | 'all' }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
              <option value="all">All</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Calendar Navigation */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-2">
            {calendarViews.map(view => (
              <Button
                key={view.type}
                variant={viewType === view.type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewType(view.type)}
              >
                {view.label}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigateCalendar('prev')}>
              <ChevronLeft size={16} />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateCalendar('next')}>
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </Card>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {selectedEvent ? renderEventDetails() : (
              <>
                {viewType === 'month' && renderMonthView()}
                {viewType === 'week' && renderWeekView()}
                {viewType === 'day' && renderDayView()}
              </>
            )}
          </div>
          
          <div className="lg:col-span-1">
            {renderUpcomingEvents()}
          </div>
        </div>
      )}
    </div>
  );
};

export default FellowCalendar;
