import React, { useState, useEffect } from 'react';
import { eventBus, EVENTS } from '@/services/eventBus';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const TestAdmin: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  // Listen for application submissions
  useEffect(() => {
    console.log('🧪 TestAdmin: Setting up event listener...');
    
    const unsubscribe = eventBus.on(EVENTS.APPLICATION_SUBMITTED, (data) => {
      console.log('🧪 TestAdmin: Received application submission:', data);
      
      // Add to events log
      setEvents(prev => [...prev, { 
        timestamp: new Date().toISOString(), 
        data 
      }]);
      
      // Add to applications list
      const newApplication = {
        id: data.applicationId,
        applicantName: data.applicantName,
        applicantEmail: data.applicantEmail,
        submittedAt: data.applicationData?.metadata?.submittedAt || new Date().toISOString(),
        personalInfo: data.applicationData?.personalInfo,
        education: data.applicationData?.education,
        documents: data.applicationData?.documents,
        metadata: data.applicationData?.metadata,
      };
      
      setApplications(prev => [newApplication, ...prev]);
      console.log('🧪 TestAdmin: Added application to list:', newApplication);
    });

    return () => {
      console.log('🧪 TestAdmin: Cleaning up event listener...');
      unsubscribe();
    };
  }, []);

  const testEvent = () => {
    console.log('🧪 TestAdmin: Emitting test event...');
    eventBus.emit(EVENTS.APPLICATION_SUBMITTED, {
      applicationId: 'test-admin-' + Date.now(),
      applicantName: 'Test Admin User',
      applicantEmail: 'test-admin@example.com',
      applicationData: {
        personalInfo: {
          firstName: 'Test',
          lastName: 'Admin',
          email: 'test-admin@example.com',
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
      },
      submissionResponse: {
        success: true,
        applicationId: 'test-admin-' + Date.now(),
        message: 'Test application submitted',
        submittedAt: new Date().toISOString(),
      }
    });
    console.log('🧪 TestAdmin: Test event emitted');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <Card.Header>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Admin Test Page</h1>
              <p className="text-gray-600">Test the admin event system</p>
            </div>
            <Button onClick={testEvent} variant="outline">
              🧪 Test Event
            </Button>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Applications List */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Applications ({applications.length})</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {applications.length === 0 ? (
                  <p className="text-gray-500">No applications received yet</p>
                ) : (
                  applications.map((app, index) => (
                    <div key={app.id} className="p-3 bg-gray-50 rounded border">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{app.applicantName}</p>
                          <p className="text-sm text-gray-600">{app.applicantEmail}</p>
                          <p className="text-xs text-gray-500">{app.submittedAt}</p>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {app.metadata?.status || 'unknown'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Events Log */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Events Log ({events.length})</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {events.length === 0 ? (
                  <p className="text-gray-500">No events received yet</p>
                ) : (
                  events.map((event, index) => (
                    <div key={index} className="p-2 bg-blue-50 rounded border text-xs">
                      <p className="font-medium text-blue-800">{event.timestamp}</p>
                      <p className="text-blue-600">Application ID: {event.data.applicationId}</p>
                      <p className="text-blue-600">Applicant: {event.data.applicantName}</p>
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

export default TestAdmin;





















