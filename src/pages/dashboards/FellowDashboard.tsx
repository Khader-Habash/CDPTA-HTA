import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import FellowHTAProgress from '@/components/FellowHTAProgress';
import { useToast } from '@/components/ui/Toaster';
import { eventBus, EVENTS } from '@/services/eventBus';
import { 
  BookOpen, 
  Award, 
  TrendingUp, 
  Users,
  Calendar,
  Target,
  CheckCircle,
  GraduationCap
} from 'lucide-react';

const FellowDashboard: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [recentUpdates, setRecentUpdates] = useState<string[]>([]);

  // Listen for course content updates
  useEffect(() => {
    const unsubscribeAssignment = eventBus.on(EVENTS.ASSIGNMENT_CREATED, (data) => {
      console.log('📚 Fellow received assignment creation:', data);
      const title = 'New Assignment Available';
      const message = `"${data.title}" has been added to your course.`;
      
      setRecentUpdates(prev => [
        `${title}: ${message}`,
        ...prev.slice(0, 4)
      ]);

      addToast({
        title,
        message,
        type: 'info',
      });
    });

    const unsubscribeQuiz = eventBus.on(EVENTS.QUIZ_CREATED, (data) => {
      console.log('📝 Fellow received quiz creation:', data);
      const title = 'New Quiz Available';
      const message = `"${data.title}" is now available for submission.`;
      
      setRecentUpdates(prev => [
        `${title}: ${message}`,
        ...prev.slice(0, 4)
      ]);

      addToast({
        title,
        message,
        type: 'info',
      });
    });

    const unsubscribeModule = eventBus.on(EVENTS.MODULE_CREATED, (data) => {
      console.log('📖 Fellow received module creation:', data);
      const title = 'New Module Available';
      const message = `"${data.title}" has been added to your learning path.`;
      
      setRecentUpdates(prev => [
        `${title}: ${message}`,
        ...prev.slice(0, 4)
      ]);

      addToast({
        title,
        message,
        type: 'info',
      });
    });

    const unsubscribeLecture = eventBus.on(EVENTS.LECTURE_CREATED, (data) => {
      console.log('🎓 Fellow received lecture creation:', data);
      const title = 'New Lecture Scheduled';
      const message = `"${data.title}" has been scheduled.`;
      
      setRecentUpdates(prev => [
        `${title}: ${message}`,
        ...prev.slice(0, 4)
      ]);

      addToast({
        title,
        message,
        type: 'info',
      });
    });

    return () => {
      unsubscribeAssignment();
      unsubscribeQuiz();
      unsubscribeModule();
      unsubscribeLecture();
    };
  }, [addToast]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600">
          Continue your learning journey and track your progress.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <Card.Content>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Courses Completed</p>
                <p className="text-2xl font-bold text-gray-900">0/0</p>
              </div>
              <BookOpen className="text-primary-600" size={24} />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Projects</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <Award className="text-yellow-600" size={24} />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cohort Rank</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Peer Connections</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <Users className="text-blue-600" size={24} />
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Courses */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold">Current Courses</h2>
            </Card.Header>
            <Card.Content>
              <div className="text-center py-12">
                <BookOpen className="mx-auto text-gray-400" size={48} />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No courses assigned yet</h3>
                <p className="mt-2 text-gray-600">
                  Your preceptor will assign courses to you. Check back later for updates.
                </p>
                <div className="mt-6">
                  <Link to="/fellow/courses">
                    <Button fullWidth>View All Courses</Button>
                  </Link>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <Card>
            <Card.Header>
              <div className="flex items-center space-x-2">
                <Calendar className="text-red-600" size={20} />
                <h3 className="text-lg font-semibold">Upcoming Deadlines</h3>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="text-center py-8">
                <Calendar className="mx-auto text-gray-400" size={32} />
                <p className="mt-2 text-sm text-gray-600">No upcoming deadlines</p>
              </div>
            </Card.Content>
          </Card>

          {/* Current Project */}
          <Card>
            <Card.Header>
              <div className="flex items-center space-x-2">
                <Target className="text-primary-600" size={20} />
                <h3 className="text-lg font-semibold">Current Project</h3>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="text-center py-8">
                <Target className="mx-auto text-gray-400" size={32} />
                <p className="mt-2 text-sm text-gray-600">No current project</p>
                <Link to="/fellow/projects">
                  <Button variant="outline" fullWidth size="sm" className="mt-4">View All Projects</Button>
                </Link>
              </div>
            </Card.Content>
          </Card>

          {/* Achievements */}
          <Card>
            <Card.Header>
              <div className="flex items-center space-x-2">
                <Award className="text-yellow-600" size={20} />
                <h3 className="text-lg font-semibold">Recent Achievements</h3>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="text-center py-8">
                <Award className="mx-auto text-gray-400" size={32} />
                <p className="mt-2 text-sm text-gray-600">No achievements yet</p>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>

      {/* Recent Updates */}
      {recentUpdates.length > 0 && (
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold">Recent Updates</h3>
          </Card.Header>
          <Card.Content>
            <div className="space-y-2">
              {recentUpdates.map((update, index) => (
                <div key={index} className="flex items-start space-x-2 p-2 bg-blue-50 rounded-lg">
                  <CheckCircle className="text-blue-600 mt-0.5" size={16} />
                  <p className="text-sm text-gray-700">{update}</p>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      )}

      {/* HTA Program Progress Section */}
      <div className="mt-8">
        <FellowHTAProgress fellowId={user?.id || 'current-fellow'} />
      </div>
    </div>
  );
};

export default FellowDashboard;
