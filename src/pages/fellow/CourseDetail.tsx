import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Image, 
  Video, 
  Music, 
  File,
  Eye,
  Calendar,
  Users,
  BookOpen,
  Clock
} from 'lucide-react';

interface CourseMaterial {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'docx' | 'ppt' | 'pptx' | 'video' | 'audio' | 'image' | 'other';
  size: number;
  description?: string;
  uploadedAt: string;
  url?: string;
  downloadable: boolean;
}

interface CourseDetails {
  id: string;
  code: string;
  title: string;
  description: string;
  instructor: string;
  term: string;
  credits: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'upcoming';
  materials: CourseMaterial[];
  syllabus: string;
  learningObjectives: string[];
}

// Mock course data with materials
const mockCourseData: CourseDetails = {
  id: '1',
  code: 'Y2024-006170',
  title: '[ECO00024H-T1-A] Module 1- Basic Economic Concepts',
  description: 'This module introduces students to fundamental economic concepts and their application in healthcare settings. Students will learn about supply and demand, market structures, and economic evaluation methods.',
  instructor: 'Dr. Sarah Johnson',
  term: '2024/25',
  credits: 3,
  startDate: '2024-01-15',
  endDate: '2024-03-15',
  status: 'active',
  syllabus: 'Week 1: Introduction to Economics\nWeek 2: Supply and Demand\nWeek 3: Market Structures\nWeek 4: Healthcare Economics\nWeek 5: Economic Evaluation\nWeek 6: Cost-Benefit Analysis\nWeek 7: Review and Assessment',
  learningObjectives: [
    'Understand fundamental economic principles',
    'Apply economic concepts to healthcare',
    'Analyze market structures and their implications',
    'Evaluate healthcare interventions economically'
  ],
  materials: [
    {
      id: '1',
      name: 'Course Syllabus - Module 1.pdf',
      type: 'pdf',
      size: 245760, // 240 KB
      description: 'Complete course syllabus with weekly topics and assignments',
      uploadedAt: '2024-01-10T10:00:00Z',
      downloadable: true
    },
    {
      id: '2',
      name: 'Lecture 1 - Introduction to Economics.pptx',
      type: 'pptx',
      size: 15728640, // 15 MB
      description: 'PowerPoint presentation for the first lecture',
      uploadedAt: '2024-01-12T14:30:00Z',
      downloadable: true
    },
    {
      id: '3',
      name: 'Economic Principles Reading List.pdf',
      type: 'pdf',
      size: 524288, // 512 KB
      description: 'Required and recommended readings for the module',
      uploadedAt: '2024-01-08T09:15:00Z',
      downloadable: true
    },
    {
      id: '4',
      name: 'Supply and Demand Video Lecture.mp4',
      type: 'video',
      size: 104857600, // 100 MB
      description: 'Recorded lecture on supply and demand concepts',
      uploadedAt: '2024-01-14T16:45:00Z',
      downloadable: true
    },
    {
      id: '5',
      name: 'Assignment 1 Guidelines.pdf',
      type: 'pdf',
      size: 131072, // 128 KB
      description: 'Guidelines and requirements for the first assignment',
      uploadedAt: '2024-01-16T11:20:00Z',
      downloadable: true
    },
    {
      id: '6',
      name: 'Economic Analysis Template.xlsx',
      type: 'other',
      size: 32768, // 32 KB
      description: 'Excel template for economic analysis exercises',
      uploadedAt: '2024-01-18T13:10:00Z',
      downloadable: true
    }
  ]
};

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [selectedMaterial, setSelectedMaterial] = useState<CourseMaterial | null>(null);
  const [course, setCourse] = useState<CourseDetails | null>(null);

  // Load course data from localStorage (created by staff)
  useEffect(() => {
    const loadCourseData = () => {
      try {
        const storedCourses = localStorage.getItem('staff_courses');
        if (storedCourses) {
          const staffCourses = JSON.parse(storedCourses);
          const staffCourse = staffCourses.find((c: any) => c.id === courseId);
          
          if (staffCourse) {
            // Convert staff course to CourseDetails format
            const courseDetails: CourseDetails = {
              id: staffCourse.id,
              code: staffCourse.code,
              title: staffCourse.title,
              description: staffCourse.description,
              instructor: staffCourse.instructor,
              term: '2024/25',
              credits: 3, // Default credits
              startDate: staffCourse.startDate,
              endDate: staffCourse.endDate,
              status: staffCourse.status === 'active' ? 'active' : 'upcoming',
              syllabus: staffCourse.syllabus || 'Course syllabus will be available soon.',
              learningObjectives: staffCourse.learningObjectives || [
                'Understand course fundamentals',
                'Apply learned concepts',
                'Complete assignments successfully'
              ],
              materials: [] // Will be loaded separately
            };
            setCourse(courseDetails);
          } else {
            // Fallback to mock data if course not found
            setCourse(mockCourseData);
          }
        } else {
          // Fallback to mock data if no staff courses
          setCourse(mockCourseData);
        }
      } catch (error) {
        console.error('Error loading course data:', error);
        setCourse(mockCourseData);
      }
    };

    loadCourseData();
  }, [courseId]);

  // Use course data or fallback to mock
  const currentCourse = course || mockCourseData;

  // Load course materials from localStorage (uploaded by staff)
  const loadCourseMaterials = (): CourseMaterial[] => {
    try {
      const storedMaterials = localStorage.getItem(`course_materials_${courseId}`);
      if (storedMaterials) {
        return JSON.parse(storedMaterials);
      }
    } catch (error) {
      console.error('Error loading course materials:', error);
    }
    
    // If no materials found and this is course ID '1', populate with sample materials
    if (courseId === '1') {
      const sampleMaterials: CourseMaterial[] = [
        {
          id: 'sample-1',
          name: 'Introduction to Health Economics.pdf',
          type: 'pdf',
          size: 245760,
          description: 'Comprehensive introduction to health economics principles',
          uploadedAt: '2024-01-15T10:00:00Z',
          downloadable: true,
        },
        {
          id: 'sample-2',
          name: 'Economic Evaluation Methods.pptx',
          type: 'pptx',
          size: 15728640,
          description: 'PowerPoint presentation on economic evaluation methodologies',
          uploadedAt: '2024-01-16T14:30:00Z',
          downloadable: true,
        },
        {
          id: 'sample-3',
          name: 'Cost-Benefit Analysis Template.xlsx',
          type: 'other',
          size: 32768,
          description: 'Excel template for conducting cost-benefit analysis',
          uploadedAt: '2024-01-17T09:15:00Z',
          downloadable: true,
        },
        {
          id: 'sample-4',
          name: 'Healthcare Market Analysis.pdf',
          type: 'pdf',
          size: 524288,
          description: 'Detailed analysis of healthcare market structures',
          uploadedAt: '2024-01-18T16:45:00Z',
          downloadable: true,
        }
      ];
      
      // Store sample materials for future use
      localStorage.setItem(`course_materials_${courseId}`, JSON.stringify(sampleMaterials));
      return sampleMaterials;
    }
    
    return course.materials; // Fallback to mock data
  };

  const [courseMaterials] = useState<CourseMaterial[]>(loadCourseMaterials());

  const getFileIcon = (type: CourseMaterial['type']) => {
    switch (type) {
      case 'pdf': case 'doc': case 'docx': 
        return <FileText className="text-red-500" size={20} />;
      case 'ppt': case 'pptx': 
        return <FileText className="text-orange-500" size={20} />;
      case 'video': 
        return <Video className="text-purple-500" size={20} />;
      case 'audio': 
        return <Music className="text-green-500" size={20} />;
      case 'image': 
        return <Image className="text-blue-500" size={20} />;
      default: 
        return <File className="text-gray-500" size={20} />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = (material: CourseMaterial) => {
    console.log('Downloading material:', material.name);
    // In a real app, this would trigger an actual download
    // For now, we'll simulate it
    alert(`Downloading ${material.name}...`);
  };

  const handlePreview = (material: CourseMaterial) => {
    setSelectedMaterial(material);
    // In a real app, this would open a preview modal or new tab
    console.log('Previewing material:', material.name);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'upcoming': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/fellow/courses')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft size={16} />
          <span>Back to Courses</span>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{currentCourse.title}</h1>
          <p className="text-gray-600">{currentCourse.code} • {currentCourse.term}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentCourse.status)}`}>
          {currentCourse.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Description */}
          <Card>
            <Card.Header>
              <h2 className="text-lg font-semibold">Course Description</h2>
            </Card.Header>
            <Card.Content>
              <p className="text-gray-700">{currentCourse.description}</p>
            </Card.Content>
          </Card>

          {/* Course Materials */}
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Course Materials</h2>
                <span className="text-sm text-gray-500">{courseMaterials.length} files</span>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                {courseMaterials.map((material) => (
                  <div key={material.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3 flex-1">
                      {getFileIcon(material.type)}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{material.name}</h3>
                        {material.description && (
                          <p className="text-sm text-gray-600">{material.description}</p>
                        )}
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                          <span>{formatFileSize(material.size)}</span>
                          <span>Uploaded {new Date(material.uploadedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreview(material)}
                        className="flex items-center space-x-1"
                      >
                        <Eye size={14} />
                        <span>Preview</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(material)}
                        disabled={!material.downloadable}
                        className="flex items-center space-x-1"
                      >
                        <Download size={14} />
                        <span>Download</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Learning Objectives */}
          <Card>
            <Card.Header>
              <h2 className="text-lg font-semibold">Learning Objectives</h2>
            </Card.Header>
            <Card.Content>
              <ul className="space-y-2">
                {currentCourse.learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-primary-600 font-bold">{index + 1}.</span>
                    <span className="text-gray-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </Card.Content>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Info */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Course Information</h3>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Users className="text-gray-400" size={16} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Instructor</p>
                    <p className="text-sm text-gray-600">{currentCourse.instructor}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <BookOpen className="text-gray-400" size={16} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Credits</p>
                    <p className="text-sm text-gray-600">{currentCourse.credits}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="text-gray-400" size={16} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Duration</p>
                    <p className="text-sm text-gray-600">
                      {new Date(currentCourse.startDate).toLocaleDateString()} - {new Date(currentCourse.endDate).toLocaleDateString()}
                    </p>
                  </div>
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
                <Button variant="outline" className="w-full justify-start">
                  <FileText size={16} className="mr-2" />
                  View Assignments
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar size={16} className="mr-2" />
                  Course Calendar
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users size={16} className="mr-2" />
                  Class Discussions
                </Button>
              </div>
            </Card.Content>
          </Card>

          {/* Course Progress */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Your Progress</h3>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">Materials Viewed</p>
                    <p className="text-gray-600">4/6</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Assignments</p>
                    <p className="text-gray-600">2/3</p>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>

      {/* Material Preview Modal */}
      {selectedMaterial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Preview: {selectedMaterial.name}</h3>
                <Button variant="outline" onClick={() => setSelectedMaterial(null)}>
                  Close
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <div className="mb-4">
                  {getFileIcon(selectedMaterial.type)}
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">{selectedMaterial.name}</h4>
                <p className="text-gray-600 mb-4">{selectedMaterial.description}</p>
                <div className="flex justify-center space-x-3">
                  <Button onClick={() => handleDownload(selectedMaterial)}>
                    <Download size={16} className="mr-2" />
                    Download File
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedMaterial(null)}>
                    Close Preview
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
