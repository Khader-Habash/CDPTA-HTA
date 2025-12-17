import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toaster';
import { 
  emitApplicationSubmitted,
  emitAssignmentCreated,
  emitQuizCreated,
  emitModuleCreated,
  emitLectureCreated 
} from '@/services/eventBus';
import { 
  Plus, 
  BookOpen, 
  FileText, 
  Users, 
  Zap 
} from 'lucide-react';

const RealtimeDemo: React.FC = () => {
  const { addToast } = useToast();

  // Demo functions to simulate realtime events
  const simulateApplicationSubmission = () => {
    try {
      emitApplicationSubmitted({
        applicationId: `APP-${Date.now()}`,
        applicantName: 'John Demo User',
        applicantEmail: 'demo@example.com',
      });

      addToast({
        title: '✅ Demo Application Submitted',
        message: 'Check the Admin Application Review page for the new application!',
        type: 'success',
      });
    } catch (error) {
      console.error('Error simulating application:', error);
      addToast({
        title: 'Demo Error',
        message: 'Failed to simulate application submission.',
        type: 'error',
      });
    }
  };

  const simulateAssignmentCreation = () => {
    try {
      emitAssignmentCreated({
        assignmentId: `assignment-${Date.now()}`,
        title: 'Demo Assignment: React Fundamentals',
        courseId: 'demo-course',
        courseName: 'Web Development Bootcamp',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });

      addToast({
        title: '✅ Demo Assignment Created',
        message: 'Check the Fellow Dashboard for the new assignment notification!',
        type: 'success',
      });
    } catch (error) {
      console.error('Error simulating assignment:', error);
      addToast({
        title: 'Demo Error',
        message: 'Failed to simulate assignment creation.',
        type: 'error',
      });
    }
  };

  const simulateQuizCreation = () => {
    try {
      emitQuizCreated({
        quizId: `quiz-${Date.now()}`,
        title: 'Demo Quiz: JavaScript Basics',
        courseId: 'demo-course',
        courseName: 'Web Development Bootcamp',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      });

      addToast({
        title: '✅ Demo Quiz Created',
        message: 'Check the Fellow Dashboard for the new quiz notification!',
        type: 'success',
      });
    } catch (error) {
      console.error('Error simulating quiz:', error);
      addToast({
        title: 'Demo Error',
        message: 'Failed to simulate quiz creation.',
        type: 'error',
      });
    }
  };

  const simulateModuleCreation = () => {
    try {
      emitModuleCreated({
        moduleId: `module-${Date.now()}`,
        title: 'Demo Module: Advanced React Patterns',
        courseId: 'demo-course',
        courseName: 'Web Development Bootcamp',
      });

      addToast({
        title: '✅ Demo Module Created',
        message: 'Check the Fellow Dashboard for the new module notification!',
        type: 'success',
      });
    } catch (error) {
      console.error('Error simulating module:', error);
      addToast({
        title: 'Demo Error',
        message: 'Failed to simulate module creation.',
        type: 'error',
      });
    }
  };

  const simulateLectureCreation = () => {
    try {
      emitLectureCreated({
        lectureId: `lecture-${Date.now()}`,
        title: 'Demo Lecture: Modern Web Development',
        courseId: 'demo-course',
        courseName: 'Web Development Bootcamp',
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });

      addToast({
        title: '✅ Demo Lecture Scheduled',
        message: 'Check the Fellow Dashboard for the new lecture notification!',
        type: 'success',
      });
    } catch (error) {
      console.error('Error simulating lecture:', error);
      addToast({
        title: 'Demo Error',
        message: 'Failed to simulate lecture creation.',
        type: 'error',
      });
    }
  };

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center space-x-2">
          <Zap className="text-yellow-600" size={24} />
          <h3 className="text-lg font-semibold">Realtime Sync Demo</h3>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Use these buttons to simulate realtime events and test the synchronization between different user roles.
        </p>
      </Card.Header>
      <Card.Content>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button
            onClick={simulateApplicationSubmission}
            className="flex items-center justify-center space-x-2"
            variant="outline"
          >
            <Users size={16} />
            <span>Simulate Application</span>
          </Button>

          <Button
            onClick={simulateAssignmentCreation}
            className="flex items-center justify-center space-x-2"
            variant="outline"
          >
            <FileText size={16} />
            <span>Create Assignment</span>
          </Button>

          <Button
            onClick={simulateQuizCreation}
            className="flex items-center justify-center space-x-2"
            variant="outline"
          >
            <Plus size={16} />
            <span>Create Quiz</span>
          </Button>

          <Button
            onClick={simulateModuleCreation}
            className="flex items-center justify-center space-x-2"
            variant="outline"
          >
            <BookOpen size={16} />
            <span>Create Module</span>
          </Button>

          <Button
            onClick={simulateLectureCreation}
            className="flex items-center justify-center space-x-2"
            variant="outline"
          >
            <Users size={16} />
            <span>Schedule Lecture</span>
          </Button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">How to Test:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Admins:</strong> Click "Simulate Application" to see new applications appear in the admin review page</li>
            <li>• <strong>Fellows:</strong> Click assignment/quiz/module/lecture buttons to see updates in the fellow dashboard</li>
            <li>• <strong>All Users:</strong> Check the notification bell for real-time notifications</li>
            <li>• <strong>Toast Messages:</strong> Watch for toast notifications confirming the events</li>
          </ul>
        </div>
      </Card.Content>
    </Card>
  );
};

export default RealtimeDemo;
