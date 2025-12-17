import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CourseDetails, CourseModule, CourseContent, Assignment } from '@/types/course';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  BookOpen,
  Play,
  FileText,
  Calendar,
  Clock,
  Users,
  Award,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Circle,
  Download,
  ExternalLink,
  MessageCircle,
  BarChart3,
  Star,
  Target,
  AlertCircle,
  Video,
  File,
  Link as LinkIcon,
  Headphones,
  Image as ImageIcon
} from 'lucide-react';
import { clsx } from 'clsx';

// Mock course data
const mockCourseData: CourseDetails = {
  id: '1',
  code: 'ECO00049M-T2-A',
  title: 'Module 2- Health Economics: Concepts & Analysis',
  description: 'This module provides a comprehensive introduction to health economics, covering fundamental concepts, analytical methods, and real-world applications.',
  instructor: 'Dr. Sarah Johnson',
  instructors: [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@university.edu',
      role: 'instructor',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: '2', 
      name: 'Prof. Michael Chen',
      email: 'michael.chen@university.edu',
      role: 'instructor',
      avatar: '/api/placeholder/40/40'
    }
  ],
  term: '2024/25',
  credits: 15,
  maxStudents: 50,
  enrolledStudents: 42,
  startDate: '2024-09-01',
  endDate: '2024-12-15',
  status: 'published',
  color: 'border-l-accent-600',
  modules: [
    {
      id: 'module-1',
      title: 'Introduction to Health Economics',
      description: 'Fundamental concepts and principles of health economics',
      order: 1,
      isPublished: true,
      estimatedDuration: 6,
      completionPercentage: 85,
      isCompleted: false,
      contents: [
        {
          id: 'content-1',
          title: 'Welcome to Health Economics',
          type: 'video',
          description: 'Introduction video covering course objectives and overview',
          duration: 15,
          isRequired: true,
          isCompleted: true,
          completedAt: '2024-09-05T10:30:00Z',
          timeSpent: 15
        },
        {
          id: 'content-2',
          title: 'Economic Principles in Healthcare',
          type: 'reading',
          description: 'Core economic concepts applied to healthcare systems',
          isRequired: true,
          isCompleted: true,
          completedAt: '2024-09-06T14:20:00Z',
          timeSpent: 45,
          resources: [
            {
              id: 'res-1',
              name: 'Health Economics Textbook Chapter 1',
              type: 'pdf',
              url: '/resources/chapter1.pdf',
              downloadable: true,
              size: 2500000
            }
          ]
        },
        {
          id: 'content-3',
          title: 'Supply and Demand in Healthcare',
          type: 'lecture',
          description: 'Understanding market forces in healthcare delivery',
          duration: 90,
          isRequired: true,
          isCompleted: false,
          resources: [
            {
              id: 'res-2',
              name: 'Lecture Slides',
              type: 'pdf',
              url: '/resources/lecture2-slides.pdf',
              downloadable: true
            },
            {
              id: 'res-3',
              name: 'Supplementary Reading',
              type: 'link',
              url: 'https://example.com/reading',
              downloadable: false
            }
          ]
        }
      ]
    },
    {
      id: 'module-2',
      title: 'Healthcare Market Analysis',
      description: 'Analyzing healthcare markets and economic efficiency',
      order: 2,
      isPublished: true,
      estimatedDuration: 8,
      completionPercentage: 25,
      isCompleted: false,
      contents: [
        {
          id: 'content-4',
          title: 'Market Failure in Healthcare',
          type: 'reading',
          description: 'Why healthcare markets often fail and government interventions',
          isRequired: true,
          isCompleted: true,
          availableFrom: '2024-09-15T00:00:00Z'
        },
        {
          id: 'content-5',
          title: 'Health Insurance Economics',
          type: 'video',
          description: 'Economic principles behind health insurance systems',
          duration: 60,
          isRequired: true,
          isCompleted: false,
          availableFrom: '2024-09-20T00:00:00Z'
        }
      ]
    }
  ],
  assignments: [
    {
      id: 'assign-1',
      title: 'Health Economics Essay',
      description: 'Analyze the economic principles in a healthcare system of your choice',
      instructions: 'Write a 2000-word essay analyzing the economic principles underlying a healthcare system of your choice. Include discussion of market failures, government interventions, and efficiency considerations.',
      type: 'essay',
      dueDate: '2024-10-15T23:59:00Z',
      availableFrom: '2024-09-01T00:00:00Z',
      points: 100,
      maxAttempts: 1,
      isGroupWork: false,
      status: 'in_progress',
      submittedAt: '2024-10-10T15:30:00Z'
    },
    {
      id: 'assign-2',
      title: 'Market Analysis Project',
      description: 'Group project analyzing a specific healthcare market',
      instructions: 'Work in groups of 3-4 to analyze a specific healthcare market. Present your findings in a 20-minute presentation.',
      type: 'project',
      dueDate: '2024-11-30T23:59:00Z',
      availableFrom: '2024-10-01T00:00:00Z',
      points: 150,
      maxAttempts: 1,
      isGroupWork: true,
      status: 'not_started'
    }
  ],
  announcements: [
    {
      id: 'ann-1',
      title: 'Welcome to Health Economics!',
      content: 'Welcome to the course. Please review the syllabus and complete the introductory module by Friday.',
      publishedAt: '2024-09-01T09:00:00Z',
      isImportant: true
    },
    {
      id: 'ann-2',
      title: 'Assignment 1 Guidelines',
      content: 'Additional guidelines for the first assignment have been posted. Please check the assignment section.',
      publishedAt: '2024-09-15T14:00:00Z',
      isImportant: false
    }
  ],
  progress: {
    courseId: '1',
    studentId: 'student-1',
    overallProgress: 55,
    timeSpent: 180,
    lastAccessed: '2024-09-20T10:30:00Z',
    moduleProgress: [
      {
        moduleId: 'module-1',
        progress: 85,
        timeSpent: 105,
        completedContents: ['content-1', 'content-2']
      },
      {
        moduleId: 'module-2',
        progress: 25,
        timeSpent: 75,
        completedContents: ['content-4']
      }
    ],
    grades: [
      {
        assignmentId: 'assign-1',
        grade: 85,
        maxGrade: 100,
        submittedAt: '2024-10-10T15:30:00Z',
        gradedAt: '2024-10-12T09:15:00Z'
      }
    ],
    achievements: [
      {
        id: 'ach-1',
        name: 'First Module Complete',
        description: 'Completed your first module',
        earnedAt: '2024-09-06T14:20:00Z',
        icon: 'trophy'
      }
    ]
  },
  settings: {
    allowLateSubmissions: true,
    latePenalty: 10,
    showGrades: true,
    allowDiscussions: true,
    requireCompletion: false
  }
};

const CourseViewer: React.FC = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<CourseDetails>(mockCourseData);
  const [activeTab, setActiveTab] = useState('modules');
  const [expandedModules, setExpandedModules] = useState<string[]>(['module-1']);
  const [selectedContent, setSelectedContent] = useState<CourseContent | null>(null);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const getContentIcon = (type: CourseContent['type']) => {
    switch (type) {
      case 'video': return <Video className="text-red-600" size={20} />;
      case 'lecture': return <Play className="text-blue-600" size={20} />;
      case 'reading': return <BookOpen className="text-green-600" size={20} />;
      case 'assignment': return <FileText className="text-orange-600" size={20} />;
      case 'quiz': return <Target className="text-purple-600" size={20} />;
      case 'discussion': return <MessageCircle className="text-teal-600" size={20} />;
      case 'resource': return <File className="text-gray-600" size={20} />;
      case 'live_session': return <Users className="text-pink-600" size={20} />;
      default: return <FileText className="text-gray-600" size={20} />;
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf': case 'doc': return <File className="text-red-600" size={16} />;
      case 'video': return <Video className="text-blue-600" size={16} />;
      case 'audio': return <Headphones className="text-green-600" size={16} />;
      case 'image': return <ImageIcon className="text-purple-600" size={16} />;
      case 'link': return <LinkIcon className="text-gray-600" size={16} />;
      default: return <File className="text-gray-600" size={16} />;
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const renderModuleContent = (content: CourseContent, moduleId: string) => (
    <div
      key={content.id}
      className="flex items-start space-x-4 p-4 ml-6 border-l-2 border-gray-200 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
      onClick={() => setSelectedContent(content)}
    >
      <div className="flex-shrink-0 mt-1">
        {getContentIcon(content.type)}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h5 className="text-sm font-medium text-gray-900 hover:text-primary-600">
              {content.title}
            </h5>
            {content.description && (
              <p className="text-sm text-gray-600 mt-1">{content.description}</p>
            )}
            
            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
              {content.duration && (
                <div className="flex items-center space-x-1">
                  <Clock size={12} />
                  <span>{formatDuration(content.duration)}</span>
                </div>
              )}
              {content.points && (
                <div className="flex items-center space-x-1">
                  <Star size={12} />
                  <span>{content.points} pts</span>
                </div>
              )}
              {content.dueDate && (
                <div className="flex items-center space-x-1">
                  <Calendar size={12} />
                  <span>Due {new Date(content.dueDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {content.resources && content.resources.length > 0 && (
              <div className="mt-2 space-y-1">
                {content.resources.map(resource => (
                  <div key={resource.id} className="flex items-center space-x-2 text-xs">
                    {getResourceIcon(resource.type)}
                    <span className="text-gray-600">{resource.name}</span>
                    {resource.size && (
                      <span className="text-gray-500">({formatFileSize(resource.size)})</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            {content.isCompleted ? (
              <CheckCircle className="text-green-600" size={20} />
            ) : (
              <Circle className="text-gray-400" size={20} />
            )}
            {content.isRequired && (
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                Required
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAssignmentCard = (assignment: Assignment) => (
    <Card key={assignment.id} className="hover:shadow-md transition-shadow">
      <Card.Content>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="text-orange-600" size={20} />
              <h4 className="text-lg font-medium text-gray-900">{assignment.title}</h4>
              <span className={clsx(
                'text-xs px-2 py-1 rounded-full font-medium',
                assignment.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                assignment.status === 'graded' ? 'bg-green-100 text-green-800' :
                assignment.status === 'late' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              )}>
                {assignment.status.replace('_', ' ')}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{assignment.description}</p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>Due {new Date(assignment.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star size={14} />
                <span>{assignment.points} points</span>
              </div>
              {assignment.isGroupWork && (
                <div className="flex items-center space-x-1">
                  <Users size={14} />
                  <span>Group work</span>
                </div>
              )}
            </div>

            {assignment.grade !== undefined && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-900">Grade</span>
                  <span className="text-lg font-bold text-green-900">
                    {assignment.grade}/{assignment.points}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <div className="ml-4">
            <Button size="sm" variant="outline">
              View Details
            </Button>
          </div>
        </div>
      </Card.Content>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-accent-600 to-accent-800 text-white rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-accent-200 text-sm mb-1">{course.code}</p>
            <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
            <p className="text-accent-100 mb-4">{course.description}</p>
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Users size={16} />
                <span>{course.enrolledStudents}/{course.maxStudents} students</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>{course.term}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award size={16} />
                <span>{course.credits} credits</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold">{course.progress?.overallProgress}%</div>
              <div className="text-sm">Complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      {course.progress && (
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold">Your Progress</h3>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {course.progress.overallProgress}%
                </div>
                <div className="text-sm text-gray-600">Overall Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatDuration(course.progress.timeSpent)}
                </div>
                <div className="text-sm text-gray-600">Time Spent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {course.progress.grades.length}
                </div>
                <div className="text-sm text-gray-600">Assignments Graded</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {course.progress.achievements.length}
                </div>
                <div className="text-sm text-gray-600">Achievements</div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Course Progress</span>
                <span>{course.progress.overallProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${course.progress.overallProgress}%` }}
                />
              </div>
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'modules', label: 'Course Content', icon: BookOpen },
            { id: 'assignments', label: 'Assignments', icon: FileText, count: course.assignments.length },
            { id: 'grades', label: 'Grades', icon: BarChart3 },
            { id: 'discussions', label: 'Discussions', icon: MessageCircle },
            { id: 'announcements', label: 'Announcements', icon: AlertCircle, count: course.announcements.length }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {tab.count && (
                  <span className="bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {activeTab === 'modules' && (
            <div className="space-y-6">
              {course.modules.map((module) => (
                <Card key={module.id}>
                  <Card.Content>
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleModule(module.id)}
                    >
                      <div className="flex items-center space-x-3">
                        {expandedModules.includes(module.id) ? (
                          <ChevronDown size={20} className="text-gray-400" />
                        ) : (
                          <ChevronRight size={20} className="text-gray-400" />
                        )}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {module.title}
                          </h3>
                          <p className="text-sm text-gray-600">{module.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {module.completionPercentage}% Complete
                          </div>
                          <div className="text-xs text-gray-500">
                            ~{module.estimatedDuration}h
                          </div>
                        </div>
                        <div className="w-16">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full"
                              style={{ width: `${module.completionPercentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {expandedModules.includes(module.id) && (
                      <div className="mt-6 space-y-2">
                        {module.contents.map(content => 
                          renderModuleContent(content, module.id)
                        )}
                      </div>
                    )}
                  </Card.Content>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'assignments' && (
            <div className="space-y-4">
              {course.assignments.map(renderAssignmentCard)}
            </div>
          )}

          {activeTab === 'grades' && course.progress && (
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold">Grade Summary</h3>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {course.progress.grades.map((grade) => {
                    const assignment = course.assignments.find(a => a.id === grade.assignmentId);
                    return (
                      <div key={grade.assignmentId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">{assignment?.title}</h4>
                          <p className="text-sm text-gray-600">
                            Submitted: {new Date(grade.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {grade.grade}/{grade.maxGrade}
                          </div>
                          <div className="text-sm text-gray-600">
                            {Math.round((grade.grade / grade.maxGrade) * 100)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card.Content>
            </Card>
          )}

          {activeTab === 'announcements' && (
            <div className="space-y-4">
              {course.announcements.map((announcement) => (
                <Card key={announcement.id}>
                  <Card.Content>
                    <div className="flex items-start space-x-3">
                      {announcement.isImportant && (
                        <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">
                          {announcement.title}
                        </h4>
                        <p className="text-gray-600 mb-2">{announcement.content}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(announcement.publishedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Info */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Course Information</h3>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Instructors:</span>
                  <div className="mt-1 space-y-2">
                    {course.instructors.map((instructor) => (
                      <div key={instructor.id} className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                        <span className="text-gray-600">{instructor.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Term:</span>
                  <p className="text-gray-600">{course.term}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Credits:</span>
                  <p className="text-gray-600">{course.credits} Credits</p>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Quick Actions */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Quick Actions</h3>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                <Button variant="outline" fullWidth size="sm">
                  <Download size={16} className="mr-2" />
                  Download Syllabus
                </Button>
                <Button variant="outline" fullWidth size="sm">
                  <MessageCircle size={16} className="mr-2" />
                  Contact Instructor
                </Button>
                <Button variant="outline" fullWidth size="sm">
                  <Calendar size={16} className="mr-2" />
                  View Calendar
                </Button>
              </div>
            </Card.Content>
          </Card>

          {/* Achievements */}
          {course.progress?.achievements && course.progress.achievements.length > 0 && (
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold">Achievements</h3>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {course.progress.achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <Award className="text-yellow-600" size={20} />
                      <div>
                        <p className="text-sm font-medium text-yellow-900">
                          {achievement.name}
                        </p>
                        <p className="text-xs text-yellow-700">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;
