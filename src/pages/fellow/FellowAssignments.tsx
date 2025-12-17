import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  FileText, 
  Search, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Upload,
  Eye,
  Download
} from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions: string;
  type: 'essay' | 'multiple_choice' | 'file_upload' | 'coding' | 'presentation' | 'project';
  dueDate: string;
  availableFrom: string;
  points: number;
  maxAttempts: number;
  timeLimit?: number;
  isGroupWork: boolean;
  status: 'not_started' | 'in_progress' | 'submitted' | 'graded' | 'late';
  grade?: number;
  feedback?: string;
  submittedAt?: string;
  gradedAt?: string;
  courseId: string;
  courseTitle: string;
}

const FellowAssignments: React.FC = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = () => {
    setIsLoading(true);
    try {
      // Load assignments from localStorage (created by preceptors)
      const storedAssignments = localStorage.getItem('fellow_assignments');
      if (storedAssignments) {
        const storedFellowAssignments = JSON.parse(storedAssignments);
        
        // Convert to fellow assignment format
        const assignments: Assignment[] = storedFellowAssignments.map((assign: any) => ({
          id: assign.id,
          title: assign.title,
          description: assign.description,
          instructions: assign.instructions,
          type: assign.type,
          dueDate: assign.dueDate,
          availableFrom: assign.availableFrom,
          points: assign.points,
          maxAttempts: assign.maxAttempts,
          timeLimit: assign.timeLimit,
          isGroupWork: assign.isGroupWork,
          status: 'not_started', // Default status for fellows
          courseId: assign.courseId,
          courseTitle: getCourseTitle(assign.courseId),
        }));
        
        setAssignments(assignments);
      } else {
        // Default assignments if none exist
        setAssignments([
          {
            id: '1',
            title: 'HTA Literature Review',
            description: 'Review and analyze HTA literature',
            instructions: 'Write a comprehensive literature review on HTA methodologies',
            type: 'essay',
            dueDate: '2024-10-15T23:59:00Z',
            availableFrom: '2024-09-01T00:00:00Z',
            points: 100,
            maxAttempts: 1,
            isGroupWork: false,
            status: 'not_started',
            courseId: 'HTA-101',
            courseTitle: 'Introduction to Health Technology Assessment',
          },
          {
            id: '2',
            title: 'Economic Evaluation Project',
            description: 'Conduct economic evaluation of a health technology',
            instructions: 'Choose a health technology and conduct a comprehensive economic evaluation',
            type: 'project',
            dueDate: '2024-11-30T23:59:00Z',
            availableFrom: '2024-10-01T00:00:00Z',
            points: 150,
            maxAttempts: 1,
            isGroupWork: true,
            status: 'in_progress',
            courseId: 'ECON-201',
            courseTitle: 'Health Economics',
          },
        ]);
      }
    } catch (error) {
      console.error('Error loading assignments:', error);
      setAssignments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getCourseTitle = (courseId: string): string => {
    // This would normally fetch from course data
    const courseTitles: { [key: string]: string } = {
      'HTA-101': 'Introduction to Health Technology Assessment',
      'ECON-201': 'Health Economics',
      'HTA-102': 'Advanced HTA Methods',
    };
    return courseTitles[courseId] || 'Unknown Course';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started': return 'text-gray-600 bg-gray-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'submitted': return 'text-green-600 bg-green-100';
      case 'graded': return 'text-purple-600 bg-purple-100';
      case 'late': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'not_started': return <Clock size={16} />;
      case 'in_progress': return <AlertCircle size={16} />;
      case 'submitted': return <CheckCircle size={16} />;
      case 'graded': return <CheckCircle size={16} />;
      case 'late': return <AlertCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStartAssignment = (assignmentId: string) => {
    navigate(`/fellow/assignments/${assignmentId}`);
  };

  const handleViewSubmission = (assignmentId: string) => {
    navigate(`/fellow/assignments/${assignmentId}/submission`);
  };

  const handleDownloadAssignment = (assignment: Assignment) => {
    // Create a downloadable assignment summary
    const assignmentData = {
      title: assignment.title,
      description: assignment.description,
      instructions: assignment.instructions,
      type: assignment.type,
      dueDate: assignment.dueDate,
      availableFrom: assignment.availableFrom,
      points: assignment.points,
      maxAttempts: assignment.maxAttempts,
      timeLimit: assignment.timeLimit,
      isGroupWork: assignment.isGroupWork,
      status: assignment.status,
      courseTitle: assignment.courseTitle,
      downloadedAt: new Date().toISOString()
    };

    // Create and download JSON file
    const dataStr = JSON.stringify(assignmentData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${assignment.title.replace(/[^a-zA-Z0-9]/g, '_')}_assignment.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('Assignment downloaded:', assignment.title);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600">Complete your assignments and track your progress</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="submitted">Submitted</option>
          <option value="graded">Graded</option>
          <option value="late">Late</option>
        </select>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading assignments...</p>
          </div>
        ) : filteredAssignments.length === 0 ? (
          <Card>
            <Card.Content className="text-center py-12">
              <FileText className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Assignments Found</h3>
              <p className="text-gray-600">No assignments match your current filters.</p>
            </Card.Content>
          </Card>
        ) : (
          filteredAssignments.map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-md transition-shadow">
              <Card.Content className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusColor(assignment.status)}`}>
                        {getStatusIcon(assignment.status)}
                        {assignment.status.replace('_', ' ')}
                      </span>
                      {isOverdue(assignment.dueDate) && assignment.status !== 'submitted' && assignment.status !== 'graded' && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                          Overdue
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{assignment.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText size={16} />
                        {assignment.points} points
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        {assignment.timeLimit ? `${assignment.timeLimit} min` : 'No time limit'}
                      </div>
                      {assignment.isGroupWork && (
                        <div className="flex items-center gap-1">
                          <span className="text-blue-600">Group Work</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      <strong>Course:</strong> {assignment.courseTitle}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {assignment.status === 'not_started' && (
                      <Button
                        onClick={() => handleStartAssignment(assignment.id)}
                        className="flex items-center gap-2"
                      >
                        <Upload size={16} />
                        Start Assignment
                      </Button>
                    )}
                    
                    {assignment.status === 'in_progress' && (
                      <Button
                        onClick={() => handleStartAssignment(assignment.id)}
                        className="flex items-center gap-2"
                      >
                        <Upload size={16} />
                        Continue
                      </Button>
                    )}
                    
                    {(assignment.status === 'submitted' || assignment.status === 'graded') && (
                      <Button
                        variant="outline"
                        onClick={() => handleViewSubmission(assignment.id)}
                        className="flex items-center gap-2"
                      >
                        <Eye size={16} />
                        View Submission
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      onClick={() => handleDownloadAssignment(assignment)}
                      className="flex items-center gap-2"
                    >
                      <Download size={16} />
                      Download
                    </Button>
                    
                    {assignment.status === 'graded' && assignment.grade && (
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">{assignment.grade}%</div>
                        <div className="text-xs text-gray-500">Grade</div>
                      </div>
                    )}
                  </div>
                </div>
                
                {assignment.feedback && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-1">Feedback</h4>
                    <p className="text-sm text-gray-600">{assignment.feedback}</p>
                  </div>
                )}
              </Card.Content>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default FellowAssignments;