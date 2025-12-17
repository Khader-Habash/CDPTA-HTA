import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { BookOpen, Search, Grid, List, Calendar, Users, FileText, Eye, RefreshCw, Download } from 'lucide-react';

interface Course {
  id: string;
  code: string;
  title: string;
  status: 'open' | 'closed';
  color: string;
  instructor: string;
  term: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  maxStudents?: number;
  enrolledStudents?: number;
  category?: string;
  difficulty?: string;
}

const FellowCourses: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('All terms');
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load courses from localStorage (created by staff)
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = () => {
    setIsLoading(true);
    try {
      // First, try to load from fellow_courses (courses created by preceptors)
      const fellowCoursesData = localStorage.getItem('fellow_courses');
      if (fellowCoursesData) {
        const fellowCourses: Course[] = JSON.parse(fellowCoursesData).map((course: any) => ({
          id: course.id,
          code: course.code,
          title: course.title,
          status: course.status || 'open',
          color: getCourseColor(course.category),
          instructor: course.instructor,
          term: '2024/25',
          description: course.description,
          startDate: course.startDate,
          endDate: course.endDate,
          maxStudents: course.maxStudents,
          enrolledStudents: course.enrolledStudents,
          category: course.category,
          difficulty: course.difficulty
        }));
        
        setCourses(fellowCourses);
        console.log('Loaded courses from fellow_courses:', fellowCourses);
        return;
      }
      
      // Fallback: Load from staff_courses (legacy support)
      const storedCourses = localStorage.getItem('staff_courses');
      if (storedCourses) {
        const staffCourses = JSON.parse(storedCourses);
        
        // Convert staff courses to fellow course format
        const fellowCourses: Course[] = staffCourses.map((course: any) => ({
          id: course.id,
          code: course.code,
          title: course.title,
          status: course.status === 'published' ? 'open' : 'closed',
          color: getCourseColor(course.category),
          instructor: course.instructor,
          term: '2024/25', // Default term
          description: course.description,
          startDate: course.startDate,
          endDate: course.endDate,
          maxStudents: course.maxStudents,
          enrolledStudents: course.enrolledStudents,
          category: course.category,
          difficulty: course.difficulty
        }));
        
        setCourses(fellowCourses);
        console.log('Loaded courses from staff_courses:', fellowCourses);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getCourseColor = (category?: string) => {
    switch (category) {
      case 'Core': return 'border-l-course-blue';
      case 'Advanced': return 'border-l-accent-600';
      case 'Elective': return 'border-l-accent-500';
      default: return 'border-l-course-green';
    }
  };

  const getDefaultCourses = (): Course[] => [];

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCourseClick = (courseId: string) => {
    navigate(`/fellow/courses/${courseId}`);
  };

  const handleDownloadCourse = (course: Course) => {
    // Create a downloadable course summary
    const courseData = {
      title: course.title,
      code: course.code,
      instructor: course.instructor,
      description: course.description,
      term: course.term,
      status: course.status,
      startDate: course.startDate,
      endDate: course.endDate,
      downloadedAt: new Date().toISOString()
    };

    // Create and download JSON file
    const dataStr = JSON.stringify(courseData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${course.code}_${course.title.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('Course downloaded:', course.title);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600">Access your course materials and resources</p>
        </div>
        <Button 
          variant="outline" 
          onClick={loadCourses}
          disabled={isLoading}
          className="flex items-center space-x-2"
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          <span>{isLoading ? 'Loading...' : 'Refresh Courses'}</span>
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid size={16} />
            </Button>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search your courses"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">Terms</label>
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option>All terms</option>
                <option>2024/25</option>
                <option>2023/24</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">Filters</label>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                <option>All courses</option>
                <option>Active courses</option>
                <option>Completed courses</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          {isLoading ? 'Loading courses...' : `${filteredCourses.length} results`}
        </div>
      </div>

      {/* Course Grouping */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">2024/25</h2>
          
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading courses...</p>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-600">
                  {searchTerm ? `No courses match "${searchTerm}"` : 'No courses are available at the moment'}
                </p>
              </div>
            ) : (
              filteredCourses.map((course) => (
              <Card key={course.id} className={`hover:shadow-md transition-shadow cursor-pointer border-l-4 ${course.color}`}>
                <Card.Content>
                  <div className="flex items-start justify-between">
                    <div className="flex-1" onClick={() => handleCourseClick(course.id)}>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-gray-600">{course.code}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          course.status === 'open' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {course.status}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {course.title}
                      </h3>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Users size={14} />
                          <span>{course.instructor}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCourseClick(course.id)}
                        className="flex items-center space-x-1"
                      >
                        <Eye size={14} />
                        <span>View Course</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadCourse(course)}
                        className="flex items-center space-x-1"
                      >
                        <Download size={14} />
                        <span>Download</span>
                      </Button>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold">Quick Links</h3>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="text-primary-600" size={20} />
              <div>
                <p className="font-medium text-gray-900">Calendar</p>
                <p className="text-sm text-gray-600">View upcoming events</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="text-accent-600" size={20} />
              <div>
                <p className="font-medium text-gray-900">Assignments</p>
                <p className="text-sm text-gray-600">View due assignments</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <BookOpen className="text-course-green" size={20} />
              <div>
                <p className="font-medium text-gray-900">Resources</p>
                <p className="text-sm text-gray-600">Access course materials</p>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default FellowCourses;
