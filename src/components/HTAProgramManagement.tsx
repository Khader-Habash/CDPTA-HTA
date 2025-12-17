import React, { useState, useEffect } from 'react';
import { HTAModule, FellowProgress, HTAProgram, ModuleType, AssessmentType } from '@/types/htaProgram';
import { htaModules, htaProgramStructure } from '@/data/htaProgramData';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  BookOpen,
  Users,
  Calendar,
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Edit,
  Plus,
  Filter,
  Search,
  Download,
  Upload,
  Settings,
  GraduationCap,
  Award,
  Target,
  TrendingUp,
  FileText,
  Presentation,
  Calculator,
  Shield,
  Activity,
  UserCheck,
  ChevronRight,
  ChevronDown,
  Star,
  Flag,
  Zap,
} from 'lucide-react';
import { clsx } from 'clsx';

interface HTAProgramManagementProps {
  className?: string;
}

const HTAProgramManagement: React.FC<HTAProgramManagementProps> = ({ className }) => {
  const [selectedModule, setSelectedModule] = useState<HTAModule | null>(null);
  const [selectedFellow, setSelectedFellow] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'modules' | 'fellows' | 'assessments'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<ModuleType | 'all'>('all');

  // Mock data for demonstration
  const mockFellows = [
    { id: 'fellow-1', name: 'Dr. Sarah Ahmed', email: 'sarah.ahmed@cdpta.org', status: 'active', progress: 75 },
    { id: 'fellow-2', name: 'Dr. Mohammed Hassan', email: 'mohammed.hassan@cdpta.org', status: 'active', progress: 60 },
    { id: 'fellow-3', name: 'Dr. Fatima Al-Zahra', email: 'fatima.alzahra@cdpta.org', status: 'active', progress: 45 },
    { id: 'fellow-4', name: 'Dr. Omar Khalil', email: 'omar.khalil@cdpta.org', status: 'completed', progress: 100 },
  ];

  const mockFellowProgress: FellowProgress[] = [
    {
      fellowId: 'fellow-1',
      moduleId: 'rotation-6',
      status: 'in_progress',
      startDate: '2024-01-15',
      currentActivityId: 'activity-6-2',
      completedActivities: ['activity-6-1'],
      assessments: [],
      lastActivityDate: '2024-01-20',
    },
    {
      fellowId: 'fellow-2',
      moduleId: 'rotation-5',
      status: 'in_progress',
      startDate: '2024-01-10',
      currentActivityId: 'activity-5-3',
      completedActivities: ['activity-5-1', 'activity-5-2'],
      assessments: [],
      lastActivityDate: '2024-01-18',
    },
  ];

  const getModuleIcon = (type: ModuleType) => {
    switch (type) {
      case ModuleType.FORMULARY_MANAGEMENT:
        return <FileText className="text-blue-600" size={20} />;
      case ModuleType.LITERATURE_SEARCHING:
        return <Search className="text-green-600" size={20} />;
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

  const getModuleStatusColor = (status: string) => {
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredModules = (htaModules || []).filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.learningObjectives.some(obj => obj.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'all' || module.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getFellowProgressForModule = (moduleId: string) => {
    return mockFellowProgress.filter(progress => progress.moduleId === moduleId);
  };

  const getModuleCompletionRate = (moduleId: string) => {
    const progress = getFellowProgressForModule(moduleId);
    const completed = progress.filter(p => p.status === 'completed').length;
    return progress.length > 0 ? (completed / progress.length) * 100 : 0;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Program Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="text-blue-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Modules</p>
              <p className="text-2xl font-bold text-gray-900">{htaProgramStructure?.totalModules || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="text-green-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Fellows</p>
              <p className="text-2xl font-bold text-gray-900">{mockFellows.filter(f => f.status === 'active').length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="text-purple-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Program Duration</p>
              <p className="text-2xl font-bold text-gray-900">{htaProgramStructure?.totalDuration || 0} weeks</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BarChart3 className="text-orange-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(mockFellows.reduce((acc, f) => acc + f.progress, 0) / mockFellows.length)}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Program Structure */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold">HTA Program Structure</h3>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Program Overview</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={16} />
                  Duration: {htaProgramStructure?.totalDuration || 0} weeks
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={16} />
                  Modules: {htaProgramStructure?.totalModules || 0} core modules
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={16} />
                  Assessment: Multiple methods
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={16} />
                  Final Project: 12-week capstone
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Key Skills Developed</h4>
              <div className="flex flex-wrap gap-2">
                {(htaProgramStructure?.keySkills || []).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Recent Activity */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold">Recent Activity</h3>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            {mockFellowProgress.slice(0, 5).map((progress, index) => {
              const fellow = mockFellows.find(f => f.id === progress.fellowId);
              const module = (htaModules || []).find(m => m.id === progress.moduleId);
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <UserCheck className="text-blue-600" size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{fellow?.name}</p>
                      <p className="text-sm text-gray-600">{module?.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getModuleStatusColor(progress.status)}`}>
                      {progress.status.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(progress.lastActivityDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card.Content>
      </Card>
    </div>
  );

  const renderModules = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as ModuleType | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Types</option>
              <option value={ModuleType.FORMULARY_MANAGEMENT}>Formulary Management</option>
              <option value={ModuleType.LITERATURE_SEARCHING}>Literature Searching</option>
              <option value={ModuleType.BIOSTATISTICS}>Biostatistics</option>
              <option value={ModuleType.CLINICAL_TRIALS}>Clinical Trials</option>
              <option value={ModuleType.PHARMACOECONOMICS}>Pharmacoeconomics</option>
              <option value={ModuleType.DECISION_MODELING}>Decision Modeling</option>
              <option value={ModuleType.MEDICATION_SAFETY}>Medication Safety</option>
              <option value={ModuleType.FINAL_PROJECT}>Final Project</option>
            </select>
            <Button variant="outline" size="sm">
              <Filter size={16} className="mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Modules Grid */}
      {filteredModules.length === 0 ? (
        <Card>
          <Card.Content className="text-center py-12">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Modules Available</h3>
            <p className="text-gray-600">
              No modules are currently available. Check back later or contact your administrator.
            </p>
          </Card.Content>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => {
          const completionRate = getModuleCompletionRate(module.id);
          const fellowProgress = getFellowProgressForModule(module.id);
          
          return (
            <Card
              key={module.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedModule(module)}
            >
              <Card.Content className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getModuleIcon(module.type)}
                    <div>
                      <h3 className="font-semibold text-gray-900">{module.title}</h3>
                      <p className="text-sm text-gray-600">Rotation {module.rotationNumber}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(module.difficulty)}`}>
                    {module.difficulty}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{module.durationWeeks} weeks</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Activities:</span>
                    <span className="font-medium">{module.activities.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Assessments:</span>
                    <span className="font-medium">{module.assessmentMethods.length}</span>
                  </div>

                  {fellowProgress.length > 0 && (
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Completion Rate:</span>
                        <span className="font-medium">{Math.round(completionRate)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${completionRate}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {fellowProgress.filter(p => p.status === 'completed').length} of {fellowProgress.length} fellows completed
                      </p>
                    </div>
                  )}
                </div>

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
      )}
    </div>
  );

  const renderFellows = () => (
    <div className="space-y-6">
      {/* Fellows List */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Fellows Progress</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download size={16} className="mr-2" />
                Export
              </Button>
              <Button size="sm">
                <Plus size={16} className="mr-2" />
                Add Fellow
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            {mockFellows.map((fellow) => (
              <div key={fellow.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <GraduationCap className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{fellow.name}</h4>
                    <p className="text-sm text-gray-600">{fellow.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{fellow.progress}% Complete</p>
                    <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${fellow.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    fellow.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {fellow.status}
                  </span>
                  
                  <Button variant="outline" size="sm">
                    <Eye size={16} className="mr-2" />
                    View Progress
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>
    </div>
  );

  const renderModuleDetails = () => {
    if (!selectedModule) return null;

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
                <span className={`px-3 py-1 text-sm rounded-full ${getDifficultyColor(selectedModule.difficulty)}`}>
                  {selectedModule.difficulty}
                </span>
                <Button variant="outline" size="sm">
                  <Edit size={16} className="mr-2" />
                  Edit Module
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <h4 className="font-medium text-gray-900 mb-2">Activities ({selectedModule.activities.length})</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {selectedModule.activities.map((activity, index) => (
                    <li key={index} className="flex items-center">
                      <Clock className="text-blue-500 mr-2 flex-shrink-0" size={14} />
                      {activity.title}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Assessments ({selectedModule.assessmentMethods.length})</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {selectedModule.assessmentMethods.map((assessment, index) => (
                    <li key={index} className="flex items-center">
                      <FileText className="text-purple-500 mr-2 flex-shrink-0" size={14} />
                      {assessment.title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Fellow Progress for this Module */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold">Fellow Progress</h3>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {getFellowProgressForModule(selectedModule.id).map((progress) => {
                const fellow = mockFellows.find(f => f.id === progress.fellowId);
                return (
                  <div key={progress.fellowId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <UserCheck className="text-blue-600" size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{fellow?.name}</p>
                        <p className="text-sm text-gray-600">
                          {progress.completedActivities.length} of {selectedModule.activities.length} activities completed
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getModuleStatusColor(progress.status)}`}>
                        {progress.status.replace('_', ' ')}
                      </span>
                      <Button variant="outline" size="sm">
                        View Details
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
          <h1 className="text-2xl font-bold text-gray-900">HTA Program Management</h1>
          <p className="text-gray-600">Manage Health Technology Assessment training program</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Settings size={16} className="mr-2" />
            Program Settings
          </Button>
          <Button>
            <Plus size={16} className="mr-2" />
            Add Module
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'modules', label: 'Modules', icon: BookOpen },
            { id: 'fellows', label: 'Fellows', icon: Users },
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
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          {viewMode === 'overview' && renderOverview()}
          {viewMode === 'modules' && (selectedModule ? renderModuleDetails() : renderModules())}
          {viewMode === 'fellows' && renderFellows()}
          {viewMode === 'assessments' && (
            <Card>
              <Card.Content className="p-6">
                <div className="text-center text-gray-500">
                  <Award size={48} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Assessment Management</h3>
                  <p>Assessment management features coming soon...</p>
                </div>
              </Card.Content>
            </Card>
          )}
        </>
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

export default HTAProgramManagement;

