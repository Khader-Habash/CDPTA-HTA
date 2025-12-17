import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useApplicationForm } from '@/hooks/useApplicationForm';
import PersonalInfoStep from '@/components/application-steps/PersonalInfoStep';
import AcademicBackgroundStep from '@/components/application-steps/AcademicBackgroundStep';
import ProgramInfoStep from '@/components/application-steps/ProgramInfoStep';
import DocumentUploadStep from '@/components/application-steps/DocumentUploadStep';
import ReviewStep from '@/components/application-steps/ReviewStep';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toaster';
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Send,
  AlertCircle,
  CheckCircle,
  Calendar,
  User,
  BookOpen,
  FileText,
  Eye
} from 'lucide-react';

const ApplicationForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use the application form hook
  const {
    formData,
    updateFormData,
    saveApplication,
    submitApplication,
    nextStep,
    previousStep,
    goToStep,
    isLoading,
    isSaving,
    validationErrors,
    steps,
    isApplicationSubmitted
  } = useApplicationForm();

  // If application is submitted, show read-only view
  if (isApplicationSubmitted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="text-center">
          <Card.Content className="py-12">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted Successfully!</h1>
            <p className="text-gray-600 mb-6">
              Your application has been submitted and is now under review. You cannot make changes to a submitted application.
            </p>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Application ID: <span className="font-mono font-medium">{formData.metadata.applicationId}</span>
              </p>
              <p className="text-sm text-gray-500">
                Submitted on: <span className="font-medium">{new Date(formData.metadata.submittedAt || '').toLocaleDateString()}</span>
              </p>
            </div>
            <div className="mt-8">
              <Button onClick={() => window.location.href = '/'}>
                Return to Main Page
              </Button>
            </div>
          </Card.Content>
        </Card>
      </div>
    );
  }

  // Check if this is a first-time user and pre-populate data
  useEffect(() => {
    console.log('🔍 Debug - User:', user);
    console.log('🔍 Debug - FormData:', formData);
    console.log('🔍 Debug - PersonalInfo:', formData.personalInfo);
    console.log('🔍 Debug - FirstName:', formData.personalInfo.firstName);
    console.log('🔍 Debug - FirstName type:', typeof formData.personalInfo.firstName);
    
    if (user && !formData.personalInfo.email) {
      // Pre-populate with user registration data
      updateFormData('personalInfo', {
        ...formData.personalInfo,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        isKHCCStaff: user.isKHCCStaff || false,
        khccStaffId: user.khccStaffId || '',
        organization: user.organization || '',
        position: user.position || ''
      });
      
      // Check if this is a new user (no saved application data)
      const savedApplication = localStorage.getItem('applicationFormData');
      if (!savedApplication) {
        setIsFirstTimeUser(true);
        addToast({
          type: 'info',
          title: 'Welcome to the Application Process!',
          message: 'We\'ve pre-filled some information from your registration. Please complete all sections to submit your application.',
          duration: 8000
        });
      }
    }
  }, [user, formData.personalInfo.email, updateFormData, addToast]);

  // Step components mapping
  const stepComponents = {
    1: { 
      title: 'Personal Information', 
      description: 'Basic details and KHCC staff information',
      icon: User,
      component: PersonalInfoStep
    },
    2: { 
      title: 'Academic Background', 
      description: 'Education history and qualifications',
      icon: BookOpen,
      component: AcademicBackgroundStep
    },
    3: { 
      title: 'Program Information', 
      description: 'Additional information about your interest in CDPTA',
      icon: FileText,
      component: ProgramInfoStep
    },
    4: { 
      title: 'Document Upload', 
      description: 'CV, transcripts, and certificates',
      icon: FileText,
      component: DocumentUploadStep
    },
    5: { 
      title: 'Review & Submit', 
      description: 'Review your application before submission',
      icon: Eye,
      component: ReviewStep
    }
  };

  const currentStepData = stepComponents[formData.metadata.currentStep as keyof typeof stepComponents];

  const handleNext = async () => {
    try {
      nextStep();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handlePrevious = () => {
    previousStep();
  };

  const handleSave = async () => {
    try {
      await saveApplication();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleSubmit = async () => {
    try {
      console.log('🚀 Starting application submission...');
      setIsSubmitting(true);
      
      // Call submitApplication without showing duplicate toasts
      const result = await submitApplication();
      console.log('✅ Application submission result:', result);
      
      // Always redirect to home page after submission attempt
      setTimeout(() => {
        console.log('🏠 Redirecting to home page...');
        navigate('/');
      }, 1500);
      
    } catch (error) {
      console.error('❌ Error in handleSubmit:', error);
      // Show error toast and still redirect
      addToast({
        type: 'error',
        title: 'Submission Error',
        message: 'Could not submit your application. Please try again.',
        duration: 3000
      });
      setTimeout(() => navigate('/'), 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isApplicationWindowOpen = true; // This would come from API
  const applicationDeadline = '2024-03-15';

  if (!isApplicationWindowOpen) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <Card.Content className="text-center py-12">
            <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Application Window Closed
            </h2>
            <p className="text-gray-600">
              The application window for this program has closed. Please check back for future application periods.
            </p>
          </Card.Content>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CDPTA HTA Fellowship Application</h1>
          <p className="text-gray-600">
            Complete your application for the {new Date().getFullYear()} fellowship program
          </p>
          {isFirstTimeUser && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Welcome!</strong> We've pre-filled some information from your registration. Please review and complete all sections.
              </p>
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
            <Calendar size={16} />
            <span>Deadline: {new Date(applicationDeadline).toLocaleDateString()}</span>
          </div>
          {formData.metadata.lastSaved && (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <CheckCircle size={14} />
              <span>Last saved: {new Date(formData.metadata.lastSaved).toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Application Progress */}
      <Card>
        <Card.Content>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Application Progress</h3>
            <span className="text-sm text-gray-600">
              Step {formData.metadata.currentStep} of {formData.metadata.totalSteps}
            </span>
          </div>
          <div className="flex space-x-2">
            {steps.map((step, index) => {
              const IconComponent = stepComponents[step.id as keyof typeof stepComponents]?.icon || User;
              const isClickable = (index + 1 < formData.metadata.currentStep || step.isCompleted) && !isApplicationSubmitted;
              
              return (
                <div 
                  key={step.id} 
                  className={`flex-1 transition-all duration-200 ${
                    isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-60'
                  }`}
                  onClick={() => isClickable && goToStep(step.id)}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-200 ${
                      step.isCompleted 
                        ? 'bg-green-500 text-white shadow-md' 
                        : index + 1 === formData.metadata.currentStep 
                        ? 'bg-primary-500 text-white shadow-md ring-2 ring-primary-200' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step.isCompleted ? (
                        <CheckCircle size={12} />
                      ) : (
                        <IconComponent size={12} />
                      )}
                    </div>
                    <div className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                      step.isCompleted
                    ? 'bg-green-500' 
                        : index + 1 === formData.metadata.currentStep 
                    ? 'bg-primary-500' 
                    : 'bg-gray-200'
                }`} />
                  </div>
                  <p className={`text-xs text-center font-medium transition-colors ${
                    index + 1 === formData.metadata.currentStep ? 'text-primary-700' : 'text-gray-900'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-center text-gray-500 mt-1">{step.description}</p>
                  {isClickable && index + 1 < formData.metadata.currentStep && (
                    <p className="text-xs text-center text-primary-600 mt-1 font-medium">Click to review</p>
                  )}
              </div>
              );
            })}
          </div>
        </Card.Content>
      </Card>

      {/* Application Form */}
      <Card>
        <Card.Header>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">
                Step {formData.metadata.currentStep}: {currentStepData?.title}
              </h2>
              <p className="text-gray-600">{currentStepData?.description}</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save size={16} className="mr-2" />
              {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>
          </div>
        </Card.Header>
        <Card.Content>
          {formData.metadata.currentStep === 1 && (
            <PersonalInfoStep 
              data={formData.personalInfo}
              onChange={(personalInfo) => updateFormData('personalInfo', personalInfo)}
            />
          )}
          {formData.metadata.currentStep === 2 && (
            <AcademicBackgroundStep 
              data={formData}
              onChange={(data) => updateFormData('education', data)}
              errors={validationErrors}
            />
          )}
          {formData.metadata.currentStep === 3 && (
            <ProgramInfoStep 
              data={formData.programInfo}
              onChange={(programInfo) => updateFormData('programInfo', programInfo)}
              errors={validationErrors}
            />
          )}
          {formData.metadata.currentStep === 4 && (
            <DocumentUploadStep 
              data={formData}
              onChange={(data) => updateFormData('documents', data)}
              errors={validationErrors}
            />
          )}
          {formData.metadata.currentStep === 5 && (
            <ReviewStep 
              data={formData}
              onChange={updateFormData}
              errors={validationErrors}
            />
          )}
        </Card.Content>
        <Card.Footer>
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={formData.metadata.currentStep === 1 || isApplicationSubmitted}
            >
              <ChevronLeft size={16} className="mr-2" />
              Previous
            </Button>
            
            {/* Step indicator */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Step {formData.metadata.currentStep} of {formData.metadata.totalSteps}</span>
              <div className="w-16 h-1 bg-gray-200 rounded-full">
                <div 
                  className="h-1 bg-primary-500 rounded-full transition-all duration-300"
                  style={{ width: `${(formData.metadata.currentStep / formData.metadata.totalSteps) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              {formData.metadata.currentStep === formData.metadata.totalSteps ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || isApplicationSubmitted}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send size={16} className="mr-2" />
                  {isSubmitting ? 'Submitting...' : isApplicationSubmitted ? 'Application Submitted' : 'Submit Application'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={isLoading || isApplicationSubmitted}
                >
                  Next
                  <ChevronRight size={16} className="ml-2" />
                </Button>
              )}
            </div>
          </div>
        </Card.Footer>
      </Card>

      {/* Help Text */}
      <Card>
        <Card.Content className="bg-blue-50">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-blue-600 mt-1" size={20} />
            <div>
              <h4 className="font-medium text-blue-900">Need Help?</h4>
              <p className="text-blue-700 text-sm">
                Your application is automatically saved as you work. You can return at any time to continue where you left off.
                {formData.personalInfo.isKHCCStaff && (
                  <span className="block mt-1">
                    <strong>KHCC Staff:</strong> Make sure to provide your staff ID for priority processing.
                  </span>
                )}
              </p>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default ApplicationForm;
