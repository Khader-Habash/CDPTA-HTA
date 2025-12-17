import React, { useState, useEffect } from 'react';
import { Course, CourseManagementAssignment, CalendarEvent, StudentProgress, CourseAnalytics, AssignmentCreationData, QuizCreationData } from '@/types/courseManagement';
import { CourseCreationData } from '@/types/course';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toaster';
import AddCourseForm from '@/components/AddCourseForm';
import AddAssignmentForm from '@/components/AddAssignmentForm';
import AddQuizForm from '@/components/AddQuizForm';
import EditCourseForm from '@/components/EditCourseForm';
import { courseService } from '@/services/courseService';
import { assignmentService } from '@/services/assignmentService';
import { preceptorAssignmentService } from '@/services/preceptorAssignmentService';
import { useNotificationCreator } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Book, 
  Users, 
  Calendar, 
  BarChart3, 
  Plus, 
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  Clock,
  Award,
  FileText,
  Video,
  CheckCircle,
  CheckSquare,
  AlertCircle,
  TrendingUp,
  Download
} from 'lucide-react';

const CourseManagement: React.FC = () => {
  const { addToast } = useToast();
  const { createAssignmentNotification } = useNotificationCreator();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'courses' | 'assignments' | 'calendar' | 'progress' | 'analytics'>('courses');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  const [showAddAssignmentForm, setShowAddAssignmentForm] = useState(false);
  const [showAddQuizForm, setShowAddQuizForm] = useState(false);
  const [showEditCourseForm, setShowEditCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseCreationData | null>(null);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [selectedCourseForAssignment, setSelectedCourseForAssignment] = useState<string>('');
  const [assignedFellows, setAssignedFellows] = useState<any[]>([]);
  const [isLoadingFellows, setIsLoadingFellows] = useState(false);
  const [quizzes, setQuizzes] = useState<any[]>([]);

  // Convert mockCourses to state so it can be updated
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'Drug Policy Fundamentals',
      description: 'Introduction to drug policy principles and regulatory frameworks',
      code: 'DPF-101',
      instructor: 'Dr. Sarah Johnson',
      instructorId: 'staff-1',
      duration: '8 weeks',
      startDate: '2024-01-15',
      endDate: '2024-03-15',
      maxStudents: 25,
      enrolledStudents: 18,
      status: 'active',
      category: 'Core',
      difficulty: 'beginner',
      prerequisites: [],
      learningObjectives: [
        'Understand global drug policy landscape',
        'Analyze regulatory frameworks',
        'Evaluate policy effectiveness'
      ],
      syllabus: [],
      resources: [],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      title: 'Health Technology Assessment',
      description: 'Advanced methodologies for health technology evaluation',
      code: 'HTA-201',
      instructor: 'Dr. Ahmed Al-Mansouri',
      instructorId: 'staff-2',
      duration: '10 weeks',
      startDate: '2024-02-01',
      endDate: '2024-04-15',
      maxStudents: 20,
      enrolledStudents: 15,
      status: 'active',
      category: 'Advanced',
      difficulty: 'advanced',
      prerequisites: ['DPF-101'],
      learningObjectives: [
        'Master HTA methodologies',
        'Conduct economic evaluations',
        'Apply decision-making frameworks'
      ],
      syllabus: [],
      resources: [],
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-02-01T00:00:00Z'
    }
  ]);

  // Filter courses based on search term
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Load quizzes from localStorage
  const loadQuizzes = () => {
    try {
      const storedQuizzes = localStorage.getItem('staff_quizzes');
      if (storedQuizzes) {
        const parsedQuizzes = JSON.parse(storedQuizzes);
        setQuizzes(parsedQuizzes);
      }
    } catch (error) {
      console.error('Error loading quizzes from storage:', error);
    }
  };

  // Load assigned fellows for this preceptor
  const loadAssignedFellows = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoadingFellows(true);
      const fellows = await preceptorAssignmentService.getFellowsByPreceptor(user.id);
      setAssignedFellows(fellows);
    } catch (error) {
      console.error('Error loading assigned fellows:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load assigned fellows'
      });
    } finally {
      setIsLoadingFellows(false);
    }
  };

  // Load courses from localStorage on component mount
  React.useEffect(() => {
    const loadCoursesFromStorage = () => {
      try {
        const storedCourses = localStorage.getItem('staff_courses');
        if (storedCourses) {
          const parsedCourses = JSON.parse(storedCourses);
          setCourses(prevCourses => {
            // Merge with existing courses, avoiding duplicates
            const existingIds = new Set(prevCourses.map(c => c.id));
            const newCourses = parsedCourses.filter((c: Course) => !existingIds.has(c.id));
            return [...prevCourses, ...newCourses];
          });
        }
      } catch (error) {
        console.error('Error loading courses from storage:', error);
      }
    };

    loadCoursesFromStorage();
    loadAssignedFellows();
    loadQuizzes();
  }, [user?.id]);

  const mockAssignments: CourseManagementAssignment[] = [
    {
      id: '1',
      courseId: '1',
      title: 'Policy Analysis Paper',
      description: 'Analyze a current drug policy and its effectiveness',
      type: 'assignment',
      instructions: 'Write a 3000-word analysis of a drug policy of your choice...',
      dueDate: '2024-02-15T23:59:00Z',
      totalPoints: 100,
      attempts: 1,
      status: 'published',
      attachments: [],
      submissions: [],
      createdAt: '2024-01-20T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z'
    },
    {
      id: '2',
      courseId: '1',
      title: 'Midterm Quiz',
      description: 'Quiz covering weeks 1-4 material',
      type: 'quiz',
      instructions: 'Multiple choice quiz on drug policy fundamentals',
      dueDate: '2024-02-28T15:00:00Z',
      totalPoints: 50,
      timeLimit: 60,
      attempts: 2,
      status: 'published',
      questions: [
        {
          id: '1',
          type: 'multiple_choice',
          question: 'What is the primary goal of harm reduction policies?',
          points: 5,
          options: [
            'Complete drug elimination',
            'Reducing drug-related harm',
            'Increasing law enforcement',
            'Mandatory treatment'
          ],
          correctAnswer: 'Reducing drug-related harm',
          order: 1
        }
      ],
      attachments: [],
      submissions: [],
      createdAt: '2024-01-25T00:00:00Z',
      updatedAt: '2024-01-25T00:00:00Z'
    }
  ];

  const mockEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Drug Policy Lecture',
      description: 'Introduction to international drug control conventions',
      type: 'lecture',
      startDate: '2024-02-20T10:00:00Z',
      endDate: '2024-02-20T11:30:00Z',
      location: 'Room 301',
      isVirtual: false,
      courseId: '1',
      attendees: ['fellow-1', 'fellow-2', 'fellow-3'],
      createdBy: 'staff-1',
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: '2024-02-01T00:00:00Z'
    },
    {
      id: '2',
      title: 'Assignment Due: Policy Analysis',
      type: 'assignment_due',
      startDate: '2024-02-15T23:59:00Z',
      endDate: '2024-02-15T23:59:00Z',
      courseId: '1',
      assignmentId: '1',
      attendees: [],
      createdBy: 'system',
      createdAt: '2024-01-20T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z',
      isVirtual: false
    }
  ];

  const mockProgress: StudentProgress[] = [
    {
      studentId: 'fellow-1',
      studentName: 'John Smith',
      email: 'john.smith@cdpta.org',
      courseId: '1',
      enrolledAt: '2024-01-15T00:00:00Z',
      lastActivity: '2024-02-10T14:30:00Z',
      overallProgress: 75,
      completedAssignments: 3,
      totalAssignments: 5,
      averageScore: 88.5,
      currentGrade: 'A-',
      attendance: [],
      assignmentScores: [
        {
          assignmentId: '1',
          assignmentTitle: 'Policy Analysis Paper',
          score: 85,
          totalPoints: 100,
          submittedAt: '2024-02-14T20:30:00Z',
          gradedAt: '2024-02-16T10:00:00Z'
        }
      ],
      moduleProgress: []
    },
    {
      studentId: 'fellow-2',
      studentName: 'Emma Wilson',
      email: 'emma.wilson@cdpta.org',
      courseId: '1',
      enrolledAt: '2024-01-15T00:00:00Z',
      lastActivity: '2024-02-12T09:15:00Z',
      overallProgress: 82,
      completedAssignments: 4,
      totalAssignments: 5,
      averageScore: 92.3,
      currentGrade: 'A',
      attendance: [],
      assignmentScores: [
        {
          assignmentId: '1',
          assignmentTitle: 'Policy Analysis Paper',
          score: 95,
          totalPoints: 100,
          submittedAt: '2024-02-13T18:45:00Z',
          gradedAt: '2024-02-15T16:30:00Z'
        }
      ],
      moduleProgress: []
    }
  ];

  const analytics: CourseAnalytics = {
    courseId: '1',
    totalStudents: 18,
    activeStudents: 16,
    averageProgress: 78.5,
    averageScore: 85.2,
    completionRate: 89,
    engagementMetrics: {
      averageTimeSpent: 180,
      forumPosts: 45,
      resourceViews: 320
    },
    assignmentStats: {
      submitted: 72,
      graded: 68,
      overdue: 4
    },
    upcomingDeadlines: mockAssignments.filter(a => new Date(a.dueDate) > new Date())
  };

  const TabButton = ({ 
    tab, 
    label, 
    icon: Icon,
    isActive 
  }: { 
    tab: typeof activeTab;
    label: string;
    icon: React.ComponentType<any>;
    isActive: boolean;
  }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        isActive 
          ? 'bg-primary-600 text-white' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateCourse = () => {
    console.log('Create course button clicked');
    setShowAddCourseForm(true);
  };

  const handleSaveCourse = async (courseData: CourseCreationData) => {
    try {
      console.log('Saving course with data:', courseData);
      
      // Use mock service for demo purposes
      const createdCourse = await courseService.mockCreateCourse(courseData);
      
      console.log('Course created:', createdCourse);
      
      // Convert CourseDetails to Course format and add to courses list
      const newCourse: Course = {
        id: createdCourse.id,
        title: createdCourse.title,
        description: createdCourse.description,
        code: createdCourse.code,
        instructor: createdCourse.instructor,
        instructorId: createdCourse.instructors[0]?.id || 'unknown',
        duration: `${Math.ceil((new Date(createdCourse.endDate).getTime() - new Date(createdCourse.startDate).getTime()) / (1000 * 60 * 60 * 24 * 7))} weeks`,
        startDate: createdCourse.startDate,
        endDate: createdCourse.endDate,
        maxStudents: createdCourse.maxStudents,
        enrolledStudents: createdCourse.enrolledStudents,
        status: createdCourse.status === 'published' ? 'active' : 'draft',
        category: courseData.category,
        difficulty: courseData.difficulty,
        prerequisites: courseData.prerequisites,
        learningObjectives: courseData.learningObjectives,
        syllabus: [],
        resources: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add the new course to the courses list
      setCourses(prevCourses => {
        const updatedCourses = [...prevCourses, newCourse];
        // Store courses in localStorage for persistence
        localStorage.setItem('staff_courses', JSON.stringify(updatedCourses));
        return updatedCourses;
      });
      
      // Notify fellows about the new course
      try {
        const { realtimeService } = await import('@/services/realtimeService');
        realtimeService.notifyCourseCreated(newCourse);
      } catch (error) {
        console.error('Error notifying fellows about course:', error);
      }
      
      addToast({
        type: 'success',
        title: 'Course Created',
        message: `Course "${courseData.title}" has been created successfully and added to your courses list`
      });
      
      setShowAddCourseForm(false);
      
    } catch (error) {
      console.error('Error in handleSaveCourse:', error);
      throw error; // Let the form handle the error
    }
  };

  const handleEditCourse = (course: Course) => {
    // Convert Course to CourseCreationData format
    const courseData: CourseCreationData = {
      title: course.title,
      code: course.code,
      description: course.description,
      instructor: course.instructor,
      term: 'Fall 2024', // Default term
      credits: 3, // Default credits
      maxStudents: course.maxStudents,
      startDate: course.startDate,
      endDate: course.endDate,
      status: course.status === 'active' ? 'published' : 'draft',
      color: '#3B82F6', // Default color
      syllabus: course.syllabus.join('\n'), // Convert array to string
      modules: [], // Default empty modules
      assignments: [], // Default empty assignments
      settings: {
        allowLateSubmissions: true,
        latePenalty: 10,
        showGrades: true,
        allowDiscussions: true,
        requireCompletion: true,
      },
    };
    
    setEditingCourse(courseData);
    setEditingCourseId(course.id);
    setShowEditCourseForm(true);
  };

  const handleUpdateCourse = async (courseData: CourseCreationData) => {
    try {
      console.log('Updating course with data:', courseData);
      
      // Find the course being edited
      const courseToUpdate = courses.find(c => c.id === editingCourseId);
      if (!courseToUpdate) {
        throw new Error('Course not found');
      }

      // Update the course in the courses list
      const updatedCourse: Course = {
        ...courseToUpdate,
        title: courseData.title,
        description: courseData.description,
        instructor: courseData.instructor,
        maxStudents: courseData.maxStudents,
        startDate: courseData.startDate,
        endDate: courseData.endDate,
        status: courseData.status === 'published' ? 'active' : 'draft',
        updatedAt: new Date().toISOString()
      };

      setCourses(prevCourses => {
        const updatedCourses = prevCourses.map(c => 
          c.id === courseToUpdate.id ? updatedCourse : c
        );
        // Store courses in localStorage for persistence
        localStorage.setItem('staff_courses', JSON.stringify(updatedCourses));
        return updatedCourses;
      });

      addToast({
        type: 'success',
        title: 'Course Updated',
        message: `Course "${courseData.title}" has been updated successfully`
      });

      setShowEditCourseForm(false);
      setEditingCourse(null);
      setEditingCourseId(null);

    } catch (error) {
      console.error('Error in handleUpdateCourse:', error);
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update course'
      });
    }
  };

  const handleDeleteCourse = (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      setCourses(prevCourses => {
        const updatedCourses = prevCourses.filter(c => c.id !== courseId);
        // Store courses in localStorage for persistence
        localStorage.setItem('staff_courses', JSON.stringify(updatedCourses));
        return updatedCourses;
      });

      addToast({
        type: 'success',
        title: 'Course Deleted',
        message: 'Course has been deleted successfully'
      });
    }
  };

  const handleCreateAssignment = () => {
    if (courses.length === 0) {
      addToast({
        type: 'error',
        title: 'No courses available',
        message: 'Please create a course first before adding assignments'
      });
      return;
    }
    setSelectedCourseForAssignment(courses[0].id); // Default to first course
    setShowAddAssignmentForm(true);
  };

  const handleCreateQuiz = () => {
    if (courses.length === 0) {
      addToast({
        type: 'error',
        title: 'No courses available',
        message: 'Please create a course first before adding quizzes'
      });
      return;
    }
    setSelectedCourseForAssignment(courses[0].id); // Default to first course
    setShowAddQuizForm(true);
  };

  const handleSaveAssignment = async (assignmentData: AssignmentCreationData) => {
    try {
      // Use mock service for demo purposes
      const createdAssignment = await assignmentService.mockCreateAssignment(assignmentData);
      
      console.log('Assignment created:', createdAssignment);
      
      // Send notification to enrolled students (mock implementation)
      const enrolledStudents = ['student1', 'student2', 'student3']; // Mock student IDs
      for (const studentId of enrolledStudents) {
        await createAssignmentNotification(
          studentId,
          assignmentData.title,
          'Health Technology Assessment Course', // Mock course name
          assignmentData.dueDate,
          undefined,
          undefined,
          `/courses/${assignmentData.courseId}/assignments/${createdAssignment.id}`
        );
      }
      
      addToast({
        type: 'success',
        title: 'Assignment Created',
        message: `Assignment "${assignmentData.title}" has been created successfully and notifications sent to students`
      });
      
      setShowAddAssignmentForm(false);
    } catch (error) {
      throw error; // Let the form handle the error
    }
  };

  const handleSaveQuiz = async (quizData: QuizCreationData) => {
    try {
      // Use mock service for demo purposes
      const createdQuiz = await assignmentService.mockCreateQuiz(quizData);
      
      console.log('Quiz created:', createdQuiz);
      
      // Send notification to enrolled students (mock implementation)
      const enrolledStudents = ['student1', 'student2', 'student3']; // Mock student IDs
      for (const studentId of enrolledStudents) {
        await createAssignmentNotification(
          studentId,
          quizData.title,
          'Health Technology Assessment Course', // Mock course name
          quizData.dueDate,
          undefined,
          undefined,
          `/courses/${quizData.courseId}/quizzes/${createdQuiz.id}`
        );
      }
      
      addToast({
        type: 'success',
        title: 'Quiz Created',
        message: `Quiz "${quizData.title}" has been created successfully and notifications sent to students`
      });
      
      setShowAddQuizForm(false);
    } catch (error) {
      throw error; // Let the form handle the error
    }
  };

  const handleCreateEvent = () => {
    addToast({
      type: 'info',
      title: 'Event Creation',
      message: 'Calendar event creation form would open here'
    });
  };

  return (
    <div className="space-y-6">
      {/* Add Course Form Modal */}
      {showAddCourseForm && (
        <AddCourseForm
          onClose={() => setShowAddCourseForm(false)}
          onSave={handleSaveCourse}
        />
      )}

      {/* Edit Course Form Modal */}
      {showEditCourseForm && editingCourse && (
        <EditCourseForm
          course={editingCourse}
          onSave={handleUpdateCourse}
          onCancel={() => {
            setShowEditCourseForm(false);
            setEditingCourse(null);
            setEditingCourseId(null);
          }}
        />
      )}

      {/* Add Assignment Form Modal */}
      {showAddAssignmentForm && (
        <AddAssignmentForm
          courseId={selectedCourseForAssignment}
          onClose={() => setShowAddAssignmentForm(false)}
          onSave={handleSaveAssignment}
        />
      )}

      {/* Add Quiz Form Modal */}
      {showAddQuizForm && (
        <AddQuizForm
          courseId={selectedCourseForAssignment}
          onClose={() => setShowAddQuizForm(false)}
          onSave={handleSaveQuiz}
        />
      )}
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600">
            Manage courses, assignments, calendar events, and track fellow progress
          </p>
          {assignedFellows.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-blue-600">
                📚 Assigned to {assignedFellows.length} fellow{assignedFellows.length !== 1 ? 's' : ''}: {assignedFellows.map(f => f.firstName).join(', ')}
              </p>
            </div>
          )}
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleCreateCourse}>
            <Plus size={16} className="mr-2" />
            New Course
          </Button>
          <Button variant="outline" onClick={handleCreateAssignment}>
            <FileText size={16} className="mr-2" />
            New Assignment
          </Button>
          <Button variant="outline" onClick={handleCreateEvent}>
            <Calendar size={16} className="mr-2" />
            New Event
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Book className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Active Courses</h3>
                <p className="text-2xl font-bold text-blue-600">{courses.filter(c => c.status === 'active').length}</p>
                <p className="text-xs text-gray-500">Total: {courses.length}</p>
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Assigned Fellows</h3>
                <p className="text-2xl font-bold text-green-600">{assignedFellows.length}</p>
                <p className="text-xs text-gray-500">Under your supervision</p>
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="text-purple-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Upcoming Events</h3>
                <p className="text-2xl font-bold text-purple-600">{mockEvents.length}</p>
                <p className="text-xs text-gray-500">This week</p>
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="text-orange-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Avg. Progress</h3>
                <p className="text-2xl font-bold text-orange-600">{analytics.averageProgress}%</p>
                <p className="text-xs text-gray-500">Score: {analytics.averageScore}%</p>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 pb-4">
        <TabButton 
          tab="courses" 
          label="Courses" 
          icon={Book}
          isActive={activeTab === 'courses'}
        />
        <TabButton 
          tab="assignments" 
          label="Assignments" 
          icon={FileText}
          isActive={activeTab === 'assignments'}
        />
        <TabButton 
          tab="calendar" 
          label="Calendar" 
          icon={Calendar}
          isActive={activeTab === 'calendar'}
        />
        <TabButton 
          tab="progress" 
          label="Fellow Progress" 
          icon={UserCheck}
          isActive={activeTab === 'progress'}
        />
        <TabButton 
          tab="analytics" 
          label="Analytics" 
          icon={BarChart3}
          isActive={activeTab === 'analytics'}
        />
      </div>

      {/* Tab Content */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline">
                <Filter size={16} className="mr-2" />
                Filter
              </Button>
            </div>
            <Button onClick={() => setShowAddCourseForm(true)}>
              <Plus size={16} className="mr-2" />
              Create New Course
            </Button>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600">
            Showing {filteredCourses.length} of {courses.length} courses
            {searchTerm && ` matching "${searchTerm}"`}
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <Card.Header>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{course.title}</h3>
                      <p className="text-sm text-gray-600">{course.code}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                      {course.status}
                    </span>
                  </div>
                </Card.Header>
                <Card.Content>
                  <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Instructor:</span>
                      <span className="font-medium">{course.instructor}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Duration:</span>
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Enrolled:</span>
                      <span>{course.enrolledStudents}/{course.maxStudents}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Difficulty:</span>
                      <span className="capitalize">{course.difficulty}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye size={14} className="mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEditCourse(course)}>
                      <Edit size={14} className="mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteCourse(course.id)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Assignments & Assessments</h2>
            <div className="flex space-x-2">
              <Button onClick={handleCreateAssignment}>
                <Plus size={16} className="mr-2" />
                Create Assignment
              </Button>
              <Button variant="outline" onClick={handleCreateQuiz}>
                <Plus size={16} className="mr-2" />
                Create Quiz
              </Button>
              <Button variant="outline" onClick={handleCreateQuiz}>
                <Plus size={16} className="mr-2" />
                Create Exam
              </Button>
            </div>
          </div>

          {/* Helper messages */}
          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
              <Book className="text-blue-600 mt-0.5" size={20} />
              <div>
                <h3 className="font-medium text-blue-900">Looking to create course modules?</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Modules are created within courses. Go to the <button onClick={() => setActiveTab('courses')} className="underline font-medium hover:text-blue-900">Courses tab</button> and click "Create New Course" to add modules and organize your course content.
                </p>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
              <CheckSquare className="text-green-600 mt-0.5" size={20} />
              <div>
                <h3 className="font-medium text-green-900">Creating Quizzes & Exams with Questions</h3>
                <p className="text-sm text-green-700 mt-1">
                  Click "Create Quiz" or "Create Exam" above to open the question builder. You can add <strong>Multiple Choice</strong>, <strong>True/False</strong>, <strong>Short Answer</strong>, and <strong>Essay (Open-ended)</strong> questions. Each question can have custom points and grading.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Show Assignments */}
            {mockAssignments.map((assignment) => (
              <Card key={assignment.id}>
                <Card.Content className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">{assignment.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          assignment.type === 'assignment' ? 'bg-blue-100 text-blue-800' :
                          assignment.type === 'quiz' ? 'bg-green-100 text-green-800' :
                          assignment.type === 'exam' ? 'bg-red-100 text-red-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {assignment.type}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                          {assignment.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{assignment.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Due Date:</span>
                          <p className="font-medium">{new Date(assignment.dueDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Points:</span>
                          <p className="font-medium">{assignment.totalPoints}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Submissions:</span>
                          <p className="font-medium">{assignment.submissions.length}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Time Limit:</span>
                          <p className="font-medium">{assignment.timeLimit ? `${assignment.timeLimit} min` : 'No limit'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Eye size={14} className="mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit size={14} className="mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Award size={14} className="mr-1" />
                        Grade
                      </Button>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))}

            {/* Show Quizzes */}
            {quizzes.map((quiz) => (
              <Card key={quiz.id}>
                <Card.Content className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">{quiz.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          quiz.type === 'quiz' ? 'bg-green-100 text-green-800' :
                          quiz.type === 'exam' ? 'bg-red-100 text-red-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {quiz.type}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Published
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{quiz.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Due Date:</span>
                          <p className="font-medium">{new Date(quiz.dueDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Points:</span>
                          <p className="font-medium">{quiz.totalPoints}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Questions:</span>
                          <p className="font-medium">{quiz.questions?.length || 0}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Time Limit:</span>
                          <p className="font-medium">{quiz.timeLimit ? `${quiz.timeLimit} min` : 'No limit'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Eye size={14} className="mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit size={14} className="mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Award size={14} className="mr-1" />
                        Grade
                      </Button>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Calendar Events</h2>
            <Button onClick={handleCreateEvent}>
              <Plus size={16} className="mr-2" />
              Create Event
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <Card.Header>
                <h3 className="font-semibold">Upcoming Events</h3>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {mockEvents.map((event) => (
                    <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{event.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.type === 'lecture' ? 'bg-blue-100 text-blue-800' :
                          event.type === 'assignment_due' ? 'bg-red-100 text-red-800' :
                          event.type === 'exam' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {event.type.replace('_', ' ')}
                        </span>
                      </div>
                      
                      {event.description && (
                        <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock size={14} />
                          <span>{new Date(event.startDate).toLocaleString()}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center space-x-1">
                            <span>📍</span>
                            <span>{event.location}</span>
                          </div>
                        )}
                        {event.isVirtual && (
                          <div className="flex items-center space-x-1">
                            <Video size={14} />
                            <span>Virtual</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <h3 className="font-semibold">Event Types</h3>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="font-medium">Lectures</span>
                    </div>
                    <span className="text-blue-600 font-semibold">
                      {mockEvents.filter(e => e.type === 'lecture').length}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="font-medium">Assignment Deadlines</span>
                    </div>
                    <span className="text-red-600 font-semibold">
                      {mockEvents.filter(e => e.type === 'assignment_due').length}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="font-medium">Exams</span>
                    </div>
                    <span className="text-orange-600 font-semibold">
                      {mockEvents.filter(e => e.type === 'exam').length}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Meetings</span>
                    </div>
                    <span className="text-green-600 font-semibold">
                      {mockEvents.filter(e => e.type === 'meeting').length}
                    </span>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'progress' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Fellow Progress Tracking</h2>
            <Button variant="outline">
              <Download size={16} className="mr-2" />
              Export Report
            </Button>
          </div>

          {/* Assigned Fellows Section */}
          {assignedFellows.length > 0 && (
            <Card>
              <Card.Header>
                <h3 className="font-semibold text-lg">Your Assigned Fellows</h3>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {assignedFellows.map((fellow) => (
                    <div key={fellow.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <Users className="h-5 w-5 text-green-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {fellow.firstName} {fellow.lastName}
                          </h4>
                          <p className="text-sm text-gray-500 truncate">{fellow.email}</p>
                        </div>
                      </div>
                      <div className="mb-3">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {fellow.cohort}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            addToast({
                              type: 'info',
                              title: 'Fellow Progress',
                              message: `Viewing progress for ${fellow.firstName} ${fellow.lastName}`
                            });
                          }}
                        >
                          <Eye size={14} />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setShowAddCourseForm(true);
                          }}
                        >
                          <Plus size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          )}

          {assignedFellows.length === 0 && (
            <Card>
              <Card.Content className="text-center py-12">
                <Users className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Assigned Fellows</h3>
                <p className="text-gray-600">You don't have any fellows assigned to you yet.</p>
                <p className="text-sm text-gray-500 mt-2">Contact an administrator to get fellows assigned to you.</p>
              </Card.Content>
            </Card>
          )}

          <div className="space-y-4">
            {mockProgress.map((progress) => (
              <Card key={progress.studentId}>
                <Card.Content className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-primary-600">
                          {progress.studentName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{progress.studentName}</h3>
                        <p className="text-gray-600">{progress.email}</p>
                        <p className="text-sm text-gray-500">
                          Last activity: {new Date(progress.lastActivity).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl font-bold text-primary-600">{progress.overallProgress}%</span>
                        <span className="text-sm text-gray-500">Complete</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        progress.currentGrade === 'A' || progress.currentGrade === 'A-' ? 'bg-green-100 text-green-800' :
                        progress.currentGrade === 'B+' || progress.currentGrade === 'B' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        Grade: {progress.currentGrade}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{progress.overallProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ width: `${progress.overallProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                    <div>
                      <span className="text-gray-500">Assignments:</span>
                      <p className="font-medium">{progress.completedAssignments}/{progress.totalAssignments}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Average Score:</span>
                      <p className="font-medium">{progress.averageScore}%</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Enrolled:</span>
                      <p className="font-medium">{new Date(progress.enrolledAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye size={14} className="mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Course Analytics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <Card.Header>
                <h3 className="font-semibold">Engagement Metrics</h3>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg. Time Spent:</span>
                    <span className="font-semibold">{analytics.engagementMetrics.averageTimeSpent} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Forum Posts:</span>
                    <span className="font-semibold">{analytics.engagementMetrics.forumPosts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Resource Views:</span>
                    <span className="font-semibold">{analytics.engagementMetrics.resourceViews}</span>
                  </div>
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <h3 className="font-semibold">Assignment Statistics</h3>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Submitted:</span>
                    <span className="font-semibold text-green-600">{analytics.assignmentStats.submitted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Graded:</span>
                    <span className="font-semibold text-blue-600">{analytics.assignmentStats.graded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Overdue:</span>
                    <span className="font-semibold text-red-600">{analytics.assignmentStats.overdue}</span>
                  </div>
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <h3 className="font-semibold">Performance Overview</h3>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completion Rate:</span>
                    <span className="font-semibold text-green-600">{analytics.completionRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Score:</span>
                    <span className="font-semibold">{analytics.averageScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Students:</span>
                    <span className="font-semibold">{analytics.activeStudents}/{analytics.totalStudents}</span>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>

          <Card>
            <Card.Header>
              <h3 className="font-semibold">Upcoming Deadlines</h3>
            </Card.Header>
            <Card.Content>
              {analytics.upcomingDeadlines.length > 0 ? (
                <div className="space-y-3">
                  {analytics.upcomingDeadlines.map((assignment) => (
                    <div key={assignment.id} className="flex justify-between items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div>
                        <h4 className="font-medium">{assignment.title}</h4>
                        <p className="text-sm text-gray-600">{assignment.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-yellow-600">
                          {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {assignment.totalPoints} points
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="mx-auto mb-2" size={32} />
                  <p>No upcoming deadlines</p>
                </div>
              )}
            </Card.Content>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
