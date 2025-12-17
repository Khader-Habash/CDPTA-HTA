import React, { useState, useEffect } from 'react';
import { eventBus, EVENTS } from '@/services/eventBus';
import { applicationService } from '@/services/applicationService';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const TestSubmission: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Listen for events
  useEffect(() => {
    const unsubscribe = eventBus.on(EVENTS.APPLICATION_SUBMITTED, (data) => {
      console.log('🧪 Test page received event:', data);
      setEvents(prev => [...prev, { timestamp: new Date().toISOString(), data }]);
    });

    return unsubscribe;
  }, []);

  const testSubmission = async () => {
    setIsSubmitting(true);
    try {
      console.log('🧪 Starting test submission...');
      
      const testData = {
        applicationId: 'test-' + Date.now(),
        applicantName: 'Test User',
        applicantEmail: 'test@example.com',
        applicationData: {
          personalInfo: {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            phone: '+1-555-0123',
            isKHCCStaff: false,
            khccStaffId: '',
            title: 'Mr.',
            dateOfBirth: '1990-01-01',
            gender: 'unknown',
            nationality: 'Test',
            countryOfResidence: 'Test',
            alternativeEmail: '',
          },
          education: {
            currentLevel: 'Bachelor',
            institution: 'Test University',
            fieldOfStudy: 'Computer Science',
            graduationDate: '2024-01-01',
            gpa: '3.5',
            transcriptUploaded: true,
            previousEducation: [],
          },
          documents: {
            cv: { id: 'cv-1', name: 'test-cv.pdf', status: 'uploaded' },
            transcript: { id: 'transcript-1', name: 'test-transcript.pdf', status: 'uploaded' },
            personalStatement: null,
            motivationLetter: null,
            passport: null,
            englishProficiency: null,
            additionalDocuments: [],
          },
          metadata: {
            currentStep: 4,
            totalSteps: 4,
            completedSteps: [1, 2, 3, 4],
            lastSaved: new Date().toISOString(),
            status: 'submitted',
            submittedAt: new Date().toISOString(),
          }
        }
      };

      // Test the application service
      const result = await applicationService.submitApplication(testData);
      console.log('🧪 Application service result:', result);

      // Emit the event
      eventBus.emit(EVENTS.APPLICATION_SUBMITTED, {
        ...testData,
        submissionResponse: result
      });

      console.log('🧪 Test submission completed');

    } catch (error) {
      console.error('🧪 Test submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <Card.Header>
          <h1 className="text-2xl font-bold">Application Submission Test</h1>
          <p className="text-gray-600">Test the application submission and event system</p>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <Button
              onClick={testSubmission}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Testing...' : 'Test Application Submission'}
            </Button>

            <div>
              <h3 className="text-lg font-semibold mb-2">Events Received:</h3>
              <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
                {events.length === 0 ? (
                  <p className="text-gray-500">No events received yet</p>
                ) : (
                  events.map((event, index) => (
                    <div key={index} className="mb-2 p-2 bg-white rounded border">
                      <p className="text-sm text-gray-600">{event.timestamp}</p>
                      <pre className="text-xs overflow-x-auto">
                        {JSON.stringify(event.data, null, 2)}
                      </pre>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default TestSubmission;





















