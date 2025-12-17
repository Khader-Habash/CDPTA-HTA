import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApplicationFormData } from '@/types/application';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toaster';
import { eventBus, EVENTS } from '@/services/eventBus';
import { applicationService } from '@/services/applicationService';
import { 
  CheckCircle, 
  AlertCircle, 
  User, 
  GraduationCap, 
  FileText, 
  Edit,
  Shield,
  Calendar,
  Send
} from 'lucide-react';

interface ReviewStepProps {
  data: ApplicationFormData;
  onChange: (data: Partial<ApplicationFormData>) => void;
  errors?: (string | { field: string; message: string })[];
}

const ReviewStep: React.FC<ReviewStepProps> = ({ 
  data, 
  onChange,
  errors = [] 
}) => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedApplicationId, setSubmittedApplicationId] = useState<string>('');
  const [declarationAccepted, setDeclarationAccepted] = useState(false);

  // Monitor step changes to debug redirect issues
  useEffect(() => {
    console.log('🔍 ReviewStep - Step changed to:', data.metadata.currentStep);
    console.log('🔍 ReviewStep - isSubmitted:', isSubmitted);
    console.log('🔍 ReviewStep - isSubmitting:', isSubmitting);
  }, [data.metadata.currentStep, isSubmitted, isSubmitting]);

  // Helper function to check if document exists in localStorage or parent state
  const getDocumentStatus = (documentType: string) => {
    // First check localStorage
    const localDoc = localStorage.getItem(`document_${documentType}`);
    if (localDoc) {
      try {
        const parsedDoc = JSON.parse(localDoc);
        if (parsedDoc && parsedDoc.name) {
          return 'Uploaded';
        }
      } catch (error) {
        console.error('Error parsing localStorage document:', error);
      }
    }
    
    // Fallback to parent state
    const parentDoc = data.documents[documentType as keyof typeof data.documents];
    return parentDoc ? 'Uploaded' : 'Not uploaded';
  };

  // Handle application submission
  const handleSubmitApplication = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Prevent multiple submissions
    if (isSubmitting || isSubmitted) {
      console.log('⚠️ Submission already in progress or completed');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('🚀 Starting application submission...');
      console.log('📋 Application data:', data);
      
      // Generate unique application ID
      const applicationId = `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      console.log('🆔 Generated application ID:', applicationId);
      
      // Check if required fields are present
      if (!data.personalInfo.firstName || !data.personalInfo.lastName || !data.personalInfo.email) {
        throw new Error('Missing required personal information');
      }
      
      // Check if declaration is accepted
      if (!declarationAccepted) {
        throw new Error('You must accept the application declaration to proceed');
      }
      
      // Prepare application data with documents from localStorage
      const applicationData = {
        ...data,
        documents: {
          ...data.documents,
          // Load documents from localStorage but only store metadata, not full Base64
          cv: localStorage.getItem('document_cv') ? (() => {
            const doc = JSON.parse(localStorage.getItem('document_cv')!);
            return {
              id: doc.id,
              name: doc.name,
              filename: doc.filename,
              type: doc.type,
              size: doc.size,
              uploadDate: doc.uploadDate,
              status: doc.status,
              // Don't store the full base64 data to avoid quota issues
              hasFile: !!doc.base64,
            };
          })() : null,
          transcript: localStorage.getItem('document_transcript') ? (() => {
            const doc = JSON.parse(localStorage.getItem('document_transcript')!);
            return {
              id: doc.id,
              name: doc.name,
              filename: doc.filename,
              type: doc.type,
              size: doc.size,
              uploadDate: doc.uploadDate,
              status: doc.status,
              hasFile: !!doc.base64,
            };
          })() : null,
        },
        metadata: {
          ...data.metadata,
          status: 'submitted',
          submittedAt: new Date().toISOString(),
        }
      };

      console.log('📄 Prepared application data:', applicationData);

      // Submit application to backend service
      console.log('📤 Submitting application to backend service...');
      const submissionData = {
        applicationId,
        applicantName: `${data.personalInfo.firstName} ${data.personalInfo.lastName}`,
        applicantEmail: data.personalInfo.email,
        applicationData,
      };
      
      const submissionResponse = await applicationService.submitApplication(submissionData);
      console.log('✅ Application submitted to backend:', submissionResponse);

      // Emit application submitted event for admin/staff
      console.log('📡 Emitting application submitted event...');
      const eventData = {
        applicationId,
        applicantName: `${data.personalInfo.firstName} ${data.personalInfo.lastName}`,
        applicantEmail: data.personalInfo.email,
        applicationData,
        submissionResponse,
      };
      console.log('📡 Event data being emitted:', eventData);
      console.log('📡 Event data keys:', Object.keys(eventData));
      console.log('📡 Application data keys:', Object.keys(applicationData));
      
      eventBus.emit(EVENTS.APPLICATION_SUBMITTED, eventData);
      console.log('✅ Event emitted successfully');

      // Save application to localStorage for persistence
      console.log('💾 Saving application to localStorage...');
      
      // Clear any existing application data to prevent quota issues
      const existingKeys = Object.keys(localStorage).filter(key => key.startsWith('application_'));
      existingKeys.forEach(key => localStorage.removeItem(key));
      console.log('🧹 Cleared existing application data');
      
      localStorage.setItem(`application_${applicationId}`, JSON.stringify(applicationData));
      console.log('✅ Application saved to localStorage');
      
      // Update form data
      console.log('🔄 Updating form data...');
      onChange({
        metadata: {
          ...data.metadata,
          status: 'submitted',
          submittedAt: new Date().toISOString(),
        }
      });
      console.log('✅ Form data updated');

      setIsSubmitted(true);
      setSubmittedApplicationId(applicationId);
      
      // Prevent any further step changes
      console.log('🔒 Application submitted - preventing step changes');
      
      addToast({
        type: 'success',
        title: 'Application Submitted Successfully!',
        message: `Your application (ID: ${applicationId}) has been submitted and is now under review by our team. You will be redirected to the main page in a moment.`
      });

      console.log('🎉 Application submission completed successfully');
      
      // Redirect to home page after a short delay
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error('❌ Error submitting application:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        data: data
      });
      
      addToast({
        type: 'error',
        title: 'Submission Failed',
        message: `There was an error submitting your application: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCompletionStatus = () => {
    const sections = [
      {
        name: 'Personal Information',
        icon: User,
        complete: !!(data.personalInfo.firstName && data.personalInfo.lastName && data.personalInfo.email),
        fields: [
          { label: 'Full Name', value: `${data.personalInfo.firstName} ${data.personalInfo.lastName}` },
          { label: 'Email', value: data.personalInfo.email },
          { label: 'Phone', value: data.personalInfo.phone },
          { label: 'KHCC Staff', value: data.personalInfo.isKHCCStaff ? `Yes (ID: ${data.personalInfo.khccStaffId || 'N/A'})` : 'No' },
        ]
      },
      {
        name: 'Academic Background',
        icon: GraduationCap,
        complete: !!(data.education.currentLevel && data.education.institution && data.education.fieldOfStudy),
        fields: [
          { label: 'Current Level', value: data.education.currentLevel },
          { label: 'Institution', value: data.education.institution },
          { label: 'Field of Study', value: data.education.fieldOfStudy },
          { label: 'Graduation Date', value: data.education.graduationDate },
        ]
      },
      {
        name: 'Documents',
        icon: FileText,
        complete: true, // Documents are optional, so always complete
        fields: [
          { label: 'CV', value: getDocumentStatus('cv') },
          { label: 'Transcripts', value: getDocumentStatus('transcript') },
          { label: 'Additional Documents', value: `${data.documents.additionalDocuments?.length || 0} files` },
        ]
      },
    ];

    return sections;
  };

  const sections = getCompletionStatus();
  const allComplete = sections.every(section => section.complete) && declarationAccepted;
  
  // Debug completion status
  console.log('🔍 ReviewStep - Completion status:', {
    sections: sections.map(s => ({ name: s.name, complete: s.complete })),
    allComplete,
    personalInfo: {
      firstName: data.personalInfo.firstName,
      lastName: data.personalInfo.lastName,
      email: data.personalInfo.email,
    },
    education: {
      currentLevel: data.education.currentLevel,
      institution: data.education.institution,
      fieldOfStudy: data.education.fieldOfStudy,
    }
  });

  const handleEditSection = (stepNumber: number) => {
    // This would navigate to the specific step
    // For now, we'll just show a message
    console.log(`Navigate to step ${stepNumber}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h2>
        <p className="text-gray-600">
          Please review your application carefully before submitting. You can edit any section by clicking the "Edit" button.
        </p>
      </div>

      {/* Application Status Overview */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Application Status</h3>
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
              allComplete 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {allComplete ? (
                <>
                  <CheckCircle size={16} />
                  <span>Ready to Submit</span>
                </>
              ) : (
                <>
                  <AlertCircle size={16} />
                  <span>Incomplete</span>
                </>
              )}
            </div>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <div key={section.name} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                    section.complete ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <IconComponent className={section.complete ? 'text-green-600' : 'text-red-600'} size={20} />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{section.name}</h4>
                  <p className={`text-xs ${section.complete ? 'text-green-600' : 'text-red-600'}`}>
                    {section.complete ? 'Complete' : 'Incomplete'}
                  </p>
                </div>
              );
            })}
          </div>
        </Card.Content>
      </Card>

      {/* Detailed Review Sections */}
      <div className="space-y-4">
        {sections.map((section, index) => (
          <Card key={section.name}>
            <Card.Header>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${section.complete ? 'bg-green-100' : 'bg-red-100'}`}>
                    <section.icon className={section.complete ? 'text-green-600' : 'text-red-600'} size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{section.name}</h3>
                    <p className={`text-sm ${section.complete ? 'text-green-600' : 'text-red-600'}`}>
                      {section.complete ? 'Section completed' : 'Please complete this section'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditSection(index + 1)}
                >
                  <Edit size={14} className="mr-1" />
                  Edit
                </Button>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.fields.map((field) => (
                  <div key={field.label} className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">{field.label}:</span>
                    <span className="text-sm text-gray-900">
                      {typeof field.value === 'object' ? JSON.stringify(field.value) : (field.value || 'Not provided')}
                    </span>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>

      {/* KHCC Staff Summary */}
      {data.personalInfo.isKHCCStaff && (
        <Card>
          <Card.Content className="bg-purple-50 border border-purple-200">
            <div className="flex items-start space-x-3">
              <Shield className="text-purple-600 mt-1" size={20} />
              <div>
                <h4 className="font-medium text-purple-900">KHCC Staff Application Summary</h4>
                <div className="text-purple-700 text-sm mt-2 space-y-1">
                  <p><strong>Staff ID:</strong> {data.personalInfo.khccStaffId}</p>
                  <p><strong>Priority Processing:</strong> Your application will receive expedited review</p>
                  <p><strong>Department Contact:</strong> Your department will be notified upon submission</p>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Submission Guidelines */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold">Before You Submit</h3>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Important Information</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Once submitted, your application cannot be edited</li>
                <li>• You will receive a confirmation email within 24 hours</li>
                <li>• Application review process takes 2-4 weeks</li>
                <li>• Interview invitations will be sent if your application is shortlisted</li>
                <li>• KHCC staff applications receive priority processing</li>
              </ul>
            </div>

            {/* Timeline hidden per user request */}
          </div>
        </Card.Content>
      </Card>

      {/* Declaration */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold">Application Declaration</h3>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                I declare that the information provided in this application is true, complete, and accurate to the best of my knowledge. 
                I understand that any false or misleading information may result in the rejection of my application or termination 
                from the program if discovered after admission. I consent to the collection and processing of my personal data for 
                the purposes of application evaluation and program administration.
              </p>
            </div>
            
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                checked={declarationAccepted}
                onChange={(e) => setDeclarationAccepted(e.target.checked)}
                required
              />
              <span className="text-sm text-gray-700">
                I have read and agree to the above declaration. I confirm that all information provided is accurate and complete.
              </span>
            </label>
          </div>
        </Card.Content>
      </Card>

      {/* Error Display */}
      {errors.length > 0 && (
        <Card>
          <Card.Content className="bg-red-50 border border-red-200">
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-red-600 mt-1" size={20} />
              <div>
                <h4 className="font-medium text-red-900">Please address the following before submitting:</h4>
                <ul className="text-red-700 text-sm mt-1 list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{typeof error === 'string' ? error : error.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card.Content>
        </Card>
      )}

             {!allComplete && (
               <Card>
                 <Card.Content className="bg-yellow-50 border border-yellow-200">
                   <div className="flex items-start space-x-3">
                     <AlertCircle className="text-yellow-600 mt-1" size={20} />
                     <div>
                       <h4 className="font-medium text-yellow-900">Application Incomplete</h4>
                       <p className="text-yellow-700 text-sm mt-1">
                         Please complete all required sections before submitting your application. 
                         Use the "Edit" buttons above to return to incomplete sections.
                       </p>
                       <div className="mt-2">
                         <p className="text-yellow-800 text-sm font-medium">Incomplete sections:</p>
                         <ul className="text-yellow-700 text-sm mt-1 list-disc list-inside">
                           {sections.filter(s => !s.complete).map(section => (
                             <li key={section.name}>{section.name}</li>
                           ))}
                         </ul>
                       </div>
                     </div>
                   </div>
                 </Card.Content>
               </Card>
             )}

      {/* Submit Button */}
      <Card>
        <Card.Content>
          {isSubmitted ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="text-green-600" size={48} />
              </div>
                     <h3 className="text-xl font-semibold text-green-900">Application Submitted Successfully!</h3>
                     <p className="text-gray-600">
                       Your application has been submitted and is now under review by our team. 
                       You will receive an email confirmation shortly.
                     </p>
                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                       <p className="text-sm text-blue-800">
                         <strong>Application ID:</strong> {submittedApplicationId}
                       </p>
                     </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <strong>What happens next?</strong><br />
                  • Our team will review your application within 5-7 business days<br />
                  • You'll receive an email with the decision<br />
                  • If approved, you'll get instructions for the next steps
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-sm text-gray-600 py-4">
              <p>Review your information above. Click "Submit Application" at the bottom to complete your submission.</p>
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
};

export default ReviewStep;

