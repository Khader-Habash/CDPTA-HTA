import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  CheckCircle, 
  FileText, 
  Upload, 
  Edit3, 
  Users,
  ArrowRight,
  Clock,
  Shield
} from 'lucide-react';

interface NewUserWelcomeProps {
  userName: string;
  userId?: string;
  onStartApplication: () => void;
  onSkipWelcome?: () => void;
}

const NewUserWelcome: React.FC<NewUserWelcomeProps> = ({ 
  userName, 
  userId,
  onStartApplication, 
  onSkipWelcome 
}) => {
  const handleStartApplication = () => {
    // Mark welcome as seen
    if (userId) {
      localStorage.setItem(`welcomeSeen_${userId}`, 'true');
    }
    onStartApplication();
  };

  const handleSkipWelcome = () => {
    // Mark welcome as seen
    if (userId) {
      localStorage.setItem(`welcomeSeen_${userId}`, 'true');
    }
    onSkipWelcome?.();
  };
  const applicationSteps = [
    {
      icon: FileText,
      title: 'Personal Information',
      description: 'Basic details and contact information',
      time: '5 minutes'
    },
    {
      icon: Users,
      title: 'Academic Background',
      description: 'Education history and qualifications',
      time: '10 minutes'
    },
    {
      icon: Upload,
      title: 'Document Upload',
      description: 'CV, transcripts, and certificates',
      time: '15 minutes'
    },
    {
      icon: Edit3,
      title: 'Essays & Statements',
      description: 'Research interests and motivation',
      time: '20 minutes'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
        <Card.Content className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to CDPTA, {userName}! 🎉
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Your account has been created successfully. Let's get started with your fellowship application.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Shield className="mr-1" size={16} />
              Secure & Private
            </div>
            <div className="flex items-center">
              <Clock className="mr-1" size={16} />
              Save & Continue Anytime
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Application Overview */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-900">Application Process Overview</h2>
          <p className="text-gray-600">
            Complete your fellowship application in 4 simple steps. Your progress is automatically saved.
          </p>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {applicationSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <IconComponent className="text-primary-600" size={20} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock size={12} className="mr-1" />
                      Estimated time: {step.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card.Content>
      </Card>

      {/* Important Information */}
      <Card>
        <Card.Content className="bg-yellow-50 border-yellow-200">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="text-yellow-600" size={16} />
              </div>
            </div>
            <div>
              <h3 className="font-medium text-yellow-900 mb-1">Application Deadline</h3>
              <p className="text-sm text-yellow-800 mb-3">
                Applications close on <strong>March 15, 2024</strong>. Make sure to submit your application before the deadline.
              </p>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Pro Tip:</strong> You can save your progress and return anytime. We recommend completing each section thoroughly before moving to the next step.
                </p>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={handleStartApplication}
          size="lg"
          className="flex items-center justify-center"
        >
          Start Application Process
          <ArrowRight size={20} className="ml-2" />
        </Button>
        {onSkipWelcome && (
          <Button
            variant="outline"
            onClick={handleSkipWelcome}
            size="lg"
          >
            Skip Introduction
          </Button>
        )}
      </div>

      {/* Support Information */}
      <Card>
        <Card.Content className="bg-gray-50 text-center">
          <h3 className="font-medium text-gray-900 mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Our support team is here to help you with any questions about the application process.
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <a href="mailto:support@cdpta.org" className="text-primary-600 hover:text-primary-500">
              support@cdpta.org
            </a>
            <a href="tel:+1234567890" className="text-primary-600 hover:text-primary-500">
              +1 (234) 567-890
            </a>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default NewUserWelcome;
