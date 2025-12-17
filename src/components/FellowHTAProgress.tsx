import React, { useState } from 'react';
import { HTAModule, FellowProgress, ModuleType } from '@/types/htaProgram';
import { htaModules } from '@/data/htaProgramData';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  BookOpen,
  CheckCircle,
  Clock,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Eye,
  FileText,
  Presentation,
  Calculator,
  Shield,
  Activity,
  TrendingUp,
  Target,
  Award,
  Star,
  Calendar,
  Users,
  BarChart3,
  ChevronRight,
  ChevronDown,
  Download,
  Upload,
} from 'lucide-react';
import { clsx } from 'clsx';

interface FellowHTAProgressProps {
  fellowId: string;
  className?: string;
}

const FellowHTAProgress: React.FC<FellowHTAProgressProps> = ({ fellowId, className }) => {
  const [selectedModule, setSelectedModule] = useState<HTAModule | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'modules' | 'assessments'>('overview');

  // Mock data for demonstration
  const mockFellowProgress: FellowProgress[] = [
    {
      fellowId: fellowId,
      moduleId: 'rotation-1',
      status: 'completed',
      startDate: '2024-01-01',
      completionDate: '2024-01-15',
      completedActivities: ['activity-1-1', 'activity-1-2', 'activity-1-3', 'activity-1-4', 'activity-1-5'],
      assessments: [
        {
          assessmentId: 'assessment-1-1',
          status: 'graded',
          submissionDate: '2024-01-14',
          grade: 85,
          maxGrade: 100,
          feedback: 'Excellent work on formulary management case studies. Good understanding of ABC analysis.',
          gradedBy: 'Dr. Smith',
          gradedDate: '2024-01-15',
        }
      ],
      overallGrade: 85,
      feedback: 'Strong performance in formulary management fundamentals.',
      lastActivityDate: '2024-01-15',
    },
    {
      fellowId: fellowId,
      moduleId: 'rotation-2',
      status: 'completed',
      startDate: '2024-01-16',
      completionDate: '2024-02-05',
      completedActivities: ['activity-2-1', 'activity-2-2', 'activity-2-3'],
      assessments: [
        {
          assessmentId: 'assessment-2-1',
          status: 'graded',
          submissionDate: '2024-02-03',
          grade: 92,
          maxGrade: 100,
          feedback: 'Outstanding literature search skills. Excellent use of PICO methodology.',
          gradedBy: 'Dr. Johnson',
          gradedDate: '2024-02-04',
        },
        {
          assessmentId: 'assessment-2-2',
          status: 'graded',
          submissionDate: '2024-02-04',
          grade: 88,
          maxGrade: 100,
          feedback: 'Good database navigation skills.',
          gradedBy: 'Dr. Johnson',
          gradedDate: '2024-02-04',
        },
        {
          assessmentId: 'assessment-2-3',
          status: 'graded',
          submissionDate: '2024-02-05',
          grade: 90,
          maxGrade: 100,
          feedback: 'Strong knowledge of literature search concepts.',
          gradedBy: 'Dr. Johnson',
          gradedDate: '2024-02-05',
        }
      ],
      overallGrade: 90,
      feedback: 'Excellent performance in literature searching module.',
      lastActivityDate: '2024-02-05',
    },
    {
      fellowId: fellowId,
      moduleId: 'rotation-3',
      status: 'in_progress',
      startDate: '2024-02-06',
      currentActivityId: 'activity-3-2',
      completedActivities: ['activity-3-1'],
      assessments: [],
      lastActivityDate: '2024-02-10',
    },
    {
      fellowId: fellowId,
      moduleId: 'rotation-4',
      status: 'not_started',
      assessments: [],
      lastActivityDate: '2024-02-10',
    },
  ];

  const getModuleIcon = (type: ModuleType) => {
    switch (type) {
      case ModuleType.FORMULARY_MANAGEMENT:
        return <FileText className="text-blue-600" size={20} />;
      case ModuleType.LITERATURE_SEARCHING:
        return <BookOpen className="text-green-600" size={20} />;
      case ModuleType.BIOSTATISTICS:
        return <Calculator className="text-purple-600" size={20} />;
      case ModuleType.CLINICAL_TRIALS:
        return <Activity className="text-orange-600" size={20} />;
      case ModuleType.PHARMACOECONOMICS:
        return <TrendingUp className="text-red-600" size={20} />;
      case ModuleType.DECISION_MODELING:
        return <Target className="text-indigo-600" size={20} />;
      case ModuleType.MEDICATION_SAFETY:
        return <Shield className="text-yellow-600" size={20} />;
      case ModuleType.FINAL_PROJECT:
        return <Award className="text-pink-600" size={20} />;
      default:
        return <BookOpen className="text-gray-600" size={20} />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'in_progress':
        return <Play className="text-blue-600" size={20} />;
      case 'not_started':
        return <Clock className="text-gray-400" size={20} />;
      case 'failed':
        return <AlertCircle className="text-red-600" size={20} />;
      default:
        return <Clock className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'not_started':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getOverallProgress = () => {
    const completedModules = mockFellowProgress.filter(p => p.status === 'completed').length;
    const totalModules = htaModules.length;
    return Math.round((completedModules / totalModules) * 100);
  };

  const getOverallGrade = () => {
    const gradedModules = mockFellowProgress.filter(p => p.overallGrade !== undefined);
    if (gradedModules.length === 0) return 0;
    const totalGrade = gradedModules.reduce((sum, p) => sum + (p.overallGrade || 0), 0);
    return Math.round(totalGrade / gradedModules.length);
  };

  const getCurrentModule = () => {
    return mockFellowProgress.find(p => p.status === 'in_progress');
  };

  const getUpcomingDeadlines = () => {
    // Mock upcoming deadlines
    return [
      {
        id: 'deadline-1',
        title: 'Biostatistics Quiz',
        module: 'Introduction to Biostatistics',
        dueDate: '2024-02-15',
        type: 'assessment',
      },
      {
        id: 'deadline-2',
        title: 'Clinical Trial Appraisal',
        module: 'Clinical Trial Designs',
        dueDate: '2024-02-20',
        type: 'assignment',
      },
    ];
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Progress Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="text-blue-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Modules Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockFellowProgress.filter(p => p.status === 'completed').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <BarChart3 className="text-green-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overall Progress</p>
              <p className="text-2xl font-bold text-gray-900">{getOverallProgress()}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award className="text-purple-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Grade</p>
              <p className={`text-2xl font-bold ${getGradeColor(getOverallGrade())}`}>
                {getOverallGrade()}%
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="text-orange-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Current Module</p>
              <p className="text-lg font-bold text-gray-900">
                {getCurrentModule() ? 'In Progress' : 'Not Started'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Current Module */}
      {getCurrentModule() && (
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold">Current Module</h3>
          </Card.Header>
          <Card.Content>
            {(() => {
              const currentProgress = getCurrentModule()!;
              const module = htaModules.find(m => m.id === currentProgress.moduleId);
              if (!module) return null;

              return (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    {getModuleIcon(module.type)}
                    <div>
                      <h4 className="font-semibold text-gray-900">{module.title}</h4>
                      <p className="text-sm text-gray-600">Rotation {module.rotationNumber} • {module.durationWeeks} weeks</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress:</span>
                      <span className="font-medium">
                        {currentProgress.completedActivities.length} of {module.activities.length} activities
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(currentProgress.completedActivities.length / module.activities.length) * 100}%` 
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm">
                      <Play size={16} className="mr-2" />
                      Continue Module
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye size={16} className="mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              );
            })()}
          </Card.Content>
        </Card>
      )}

      {/* Upcoming Deadlines */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold">Upcoming Deadlines</h3>
        </Card.Header>
        <Card.Content>
          <div className="space-y-3">
            {getUpcomingDeadlines().map((deadline) => (
              <div key={deadline.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Calendar className="text-orange-600" size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{deadline.title}</p>
                    <p className="text-sm text-gray-600">{deadline.module}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(deadline.dueDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {Math.ceil((new Date(deadline.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>
    </div>
  );

  const renderModules = () => (
    <div className="space-y-6">
      {/* Modules Progress */}
      <div className="space-y-4">
        {htaModules.map((module) => {
          const progress = mockFellowProgress.find(p => p.moduleId === module.id);
          const isCompleted = progress?.status === 'completed';
          const isInProgress = progress?.status === 'in_progress';
          const isNotStarted = !progress || progress.status === 'not_started';

          return (
            <Card
              key={module.id}
              className={clsx(
                'cursor-pointer hover:shadow-md transition-shadow',
                isCompleted && 'border-green-200 bg-green-50',
                isInProgress && 'border-blue-200 bg-blue-50',
                isNotStarted && 'border-gray-200'
              )}
              onClick={() => setSelectedModule(module)}
            >
              <Card.Content className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {getModuleIcon(module.type)}
                    <div>
                      <h3 className="font-semibold text-gray-900">{module.title}</h3>
                      <p className="text-sm text-gray-600">Rotation {module.rotationNumber} • {module.durationWeeks} weeks</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(progress?.status || 'not_started')}
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(progress?.status || 'not_started')}`}>
                      {progress?.status?.replace('_', ' ') || 'not started'}
                    </span>
                    {progress?.overallGrade && (
                      <span className={`font-medium ${getGradeColor(progress.overallGrade)}`}>
                        {progress.overallGrade}%
                      </span>
                    )}
                  </div>
                </div>

                {progress && (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Activities Completed:</span>
                      <span className="font-medium">
                        {progress.completedActivities.length} of {module.activities.length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(progress.completedActivities.length / module.activities.length) * 100}%` 
                        }}
                      />
                    </div>
                    
                    {progress.feedback && (
                      <div className="p-3 bg-gray-100 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>Feedback:</strong> {progress.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm">
                      <Eye size={16} className="mr-2" />
                      View Details
                    </Button>
                    <ChevronRight className="text-gray-400" size={16} />
                  </div>
                </div>
              </Card.Content>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderModuleDetails = () => {
    if (!selectedModule) return null;

    const progress = mockFellowProgress.find(p => p.moduleId === selectedModule.id);

    return (
      <div className="space-y-6">
        {/* Module Header */}
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getModuleIcon(selectedModule.type)}
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedModule.title}</h2>
                  <p className="text-gray-600">Rotation {selectedModule.rotationNumber} • {selectedModule.durationWeeks} weeks</p>
                </div>
              </div>
              <div className="flex space-x-2">
                {progress?.overallGrade && (
                  <span className={`px-3 py-1 text-sm rounded-full font-medium ${getGradeColor(progress.overallGrade)}`}>
                    Grade: {progress.overallGrade}%
                  </span>
                )}
                <Button variant="outline" size="sm">
                  <Download size={16} className="mr-2" />
                  Download Materials
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Learning Objectives</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {selectedModule.learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" size={14} />
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Activities Progress</h4>
                <div className="space-y-2">
                  {selectedModule.activities.map((activity, index) => {
                    const isCompleted = progress?.completedActivities.includes(activity.id);
                    return (
                      <div key={index} className="flex items-center space-x-2">
                        {isCompleted ? (
                          <CheckCircle className="text-green-500" size={16} />
                        ) : (
                          <Clock className="text-gray-400" size={16} />
                        )}
                        <span className={`text-sm ${isCompleted ? 'text-gray-900' : 'text-gray-600'}`}>
                          {activity.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Assessments */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold">Assessments</h3>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {selectedModule.assessmentMethods.map((assessment) => {
                const assessmentProgress = progress?.assessments.find(a => a.assessmentId === assessment.id);
                return (
                  <div key={assessment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <FileText className="text-purple-600" size={16} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{assessment.title}</h4>
                        <p className="text-sm text-gray-600">{assessment.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {assessmentProgress ? (
                        <>
                          <span className={`font-medium ${getGradeColor(assessmentProgress.grade || 0)}`}>
                            {assessmentProgress.grade}%
                          </span>
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            Completed
                          </span>
                        </>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                          Not Started
                        </span>
                      )}
                      <Button variant="outline" size="sm">
                        <Eye size={16} className="mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card.Content>
        </Card>
      </div>
    );
  };

  return (
    <div className={clsx('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">HTA Program Progress</h1>
          <p className="text-gray-600">Track your Health Technology Assessment training progress</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Export Progress
          </Button>
          <Button>
            <Upload size={16} className="mr-2" />
            Submit Assignment
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'modules', label: 'Modules', icon: BookOpen },
            { id: 'assessments', label: 'Assessments', icon: Award },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id as any)}
              className={clsx(
                'flex items-center py-2 px-1 border-b-2 font-medium text-sm',
                viewMode === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              <tab.icon size={16} className="mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {viewMode === 'overview' && renderOverview()}
      {viewMode === 'modules' && (selectedModule ? renderModuleDetails() : renderModules())}
      {viewMode === 'assessments' && (
        <Card>
          <Card.Content className="p-6">
            <div className="text-center text-gray-500">
              <Award size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Assessment Center</h3>
              <p>Assessment management features coming soon...</p>
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Back Button for Module Details */}
      {selectedModule && viewMode === 'modules' && (
        <div className="flex justify-start">
          <Button variant="outline" onClick={() => setSelectedModule(null)}>
            ← Back to Modules
          </Button>
        </div>
      )}
    </div>
  );
};

export default FellowHTAProgress;

