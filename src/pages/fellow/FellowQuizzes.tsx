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
  Play,
  Eye,
  Award,
  BookOpen,
  Download
} from 'lucide-react';

interface Quiz {
  id: string;
  title: string;
  description: string;
  instructions: string;
  type: 'quiz' | 'exam';
  dueDate: string;
  availableFrom: string;
  availableUntil?: string;
  timeLimit?: number;
  maxAttempts: number;
  totalPoints: number;
  questions: any[];
  courseId: string;
  courseTitle: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'graded';
  grade?: number;
  feedback?: string;
  submittedAt?: string;
  gradedAt?: string;
}

const FellowQuizzes: React.FC = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = () => {
    setIsLoading(true);
    try {
      // Load quizzes from localStorage (created by preceptors)
      const storedQuizzes = localStorage.getItem('fellow_quizzes');
      if (storedQuizzes) {
        const fellowQuizzes = JSON.parse(storedQuizzes);
        
        // Convert to fellow quiz format
        const quizzes: Quiz[] = fellowQuizzes.map((quiz: any) => ({
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          instructions: quiz.instructions,
          type: quiz.type,
          dueDate: quiz.dueDate,
          availableFrom: quiz.availableFrom,
          availableUntil: quiz.availableUntil,
          timeLimit: quiz.timeLimit,
          maxAttempts: quiz.maxAttempts,
          totalPoints: quiz.totalPoints,
          questions: quiz.questions || [],
          courseId: quiz.courseId,
          courseTitle: getCourseTitle(quiz.courseId),
          status: 'not_started', // Default status for fellows
        }));
        
        setQuizzes(quizzes);
      } else {
        // Default quizzes if none exist
        setQuizzes([
          {
            id: '1',
            title: 'HTA Fundamentals Quiz',
            description: 'Test your understanding of Health Technology Assessment basics',
            instructions: 'Answer all questions carefully. You have 30 minutes to complete this quiz.',
            type: 'quiz',
            dueDate: '2024-10-20T23:59:00Z',
            availableFrom: '2024-10-01T00:00:00Z',
            timeLimit: 30,
            maxAttempts: 2,
            totalPoints: 100,
            questions: [],
            courseId: 'HTA-101',
            courseTitle: 'Introduction to Health Technology Assessment',
            status: 'not_started',
          },
          {
            id: '2',
            title: 'Midterm Exam',
            description: 'Comprehensive exam covering all course materials',
            instructions: 'This is a comprehensive exam. Read each question carefully before answering.',
            type: 'exam',
            dueDate: '2024-11-15T23:59:00Z',
            availableFrom: '2024-11-01T00:00:00Z',
            timeLimit: 120,
            maxAttempts: 1,
            totalPoints: 200,
            questions: [],
            courseId: 'ECON-201',
            courseTitle: 'Health Economics',
            status: 'not_started',
          },
        ]);
      }
    } catch (error) {
      console.error('Error loading quizzes:', error);
      setQuizzes([]);
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
      case 'completed': return 'text-green-600 bg-green-100';
      case 'graded': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'not_started': return <Clock size={16} />;
      case 'in_progress': return <AlertCircle size={16} />;
      case 'completed': return <CheckCircle size={16} />;
      case 'graded': return <Award size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const isAvailable = (availableFrom: string) => {
    return new Date(availableFrom) <= new Date();
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || quiz.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStartQuiz = (quizId: string) => {
    navigate(`/fellow/quizzes/${quizId}`);
  };

  const handleViewResults = (quizId: string) => {
    navigate(`/fellow/quizzes/${quizId}/results`);
  };

  const handleDownloadQuiz = (quiz: Quiz) => {
    // Create a downloadable quiz summary
    const quizData = {
      title: quiz.title,
      description: quiz.description,
      instructions: quiz.instructions,
      type: quiz.type,
      dueDate: quiz.dueDate,
      availableFrom: quiz.availableFrom,
      availableUntil: quiz.availableUntil,
      timeLimit: quiz.timeLimit,
      maxAttempts: quiz.maxAttempts,
      totalPoints: quiz.totalPoints,
      status: quiz.status,
      courseTitle: quiz.courseTitle,
      questionsCount: quiz.questions?.length || 0,
      downloadedAt: new Date().toISOString()
    };

    // Create and download JSON file
    const dataStr = JSON.stringify(quizData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${quiz.title.replace(/[^a-zA-Z0-9]/g, '_')}_quiz.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('Quiz downloaded:', quiz.title);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quizzes & Exams</h1>
          <p className="text-gray-600">Complete your quizzes and track your progress</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search quizzes..."
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
          <option value="completed">Completed</option>
          <option value="graded">Graded</option>
        </select>
      </div>

      {/* Quizzes List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading quizzes...</p>
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <Card>
            <Card.Content className="text-center py-12">
              <FileText className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Quizzes Found</h3>
              <p className="text-gray-600">No quizzes match your current filters.</p>
            </Card.Content>
          </Card>
        ) : (
          filteredQuizzes.map((quiz) => (
            <Card key={quiz.id} className="hover:shadow-md transition-shadow">
              <Card.Content className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusColor(quiz.status)}`}>
                        {getStatusIcon(quiz.status)}
                        {quiz.status.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        quiz.type === 'quiz' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {quiz.type}
                      </span>
                      {isOverdue(quiz.dueDate) && quiz.status !== 'completed' && quiz.status !== 'graded' && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                          Overdue
                        </span>
                      )}
                      {!isAvailable(quiz.availableFrom) && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                          Not Available Yet
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{quiz.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        Due: {new Date(quiz.dueDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Award size={16} />
                        {quiz.totalPoints} points
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        {quiz.timeLimit ? `${quiz.timeLimit} min` : 'No time limit'}
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen size={16} />
                        Max {quiz.maxAttempts} attempt{quiz.maxAttempts > 1 ? 's' : ''}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      <strong>Course:</strong> {quiz.courseTitle}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {quiz.status === 'not_started' && isAvailable(quiz.availableFrom) && (
                      <Button
                        onClick={() => handleStartQuiz(quiz.id)}
                        className="flex items-center gap-2"
                      >
                        <Play size={16} />
                        Start Quiz
                      </Button>
                    )}
                    
                    {quiz.status === 'in_progress' && (
                      <Button
                        onClick={() => handleStartQuiz(quiz.id)}
                        className="flex items-center gap-2"
                      >
                        <Play size={16} />
                        Continue
                      </Button>
                    )}
                    
                    {(quiz.status === 'completed' || quiz.status === 'graded') && (
                      <Button
                        variant="outline"
                        onClick={() => handleViewResults(quiz.id)}
                        className="flex items-center gap-2"
                      >
                        <Eye size={16} />
                        View Results
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      onClick={() => handleDownloadQuiz(quiz)}
                      className="flex items-center gap-2"
                    >
                      <Download size={16} />
                      Download
                    </Button>
                    
                    {quiz.status === 'graded' && quiz.grade && (
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">{quiz.grade}%</div>
                        <div className="text-xs text-gray-500">Grade</div>
                      </div>
                    )}
                  </div>
                </div>
                
                {quiz.feedback && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-1">Feedback</h4>
                    <p className="text-sm text-gray-600">{quiz.feedback}</p>
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

export default FellowQuizzes;