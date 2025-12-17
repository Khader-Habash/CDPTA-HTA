import React from 'react';
import Card from '@/components/ui/Card';
import { 
  UserPlus, 
  ArrowRight, 
  FileText, 
  CheckCircle 
} from 'lucide-react';

const NewApplicantFlow: React.FC = () => {
  return (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-semibold">New Applicant Flow</h3>
        <p className="text-sm text-gray-600 mt-2">
          This demonstrates the improved user experience for new applicants.
        </p>
      </Card.Header>
      <Card.Content>
        <div className="space-y-6">
          {/* Flow Steps */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <UserPlus className="text-primary-600" size={16} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">1. User Registers</h4>
                <p className="text-sm text-gray-600">New applicant creates an account</p>
              </div>
            </div>

            <div className="ml-4 border-l-2 border-gray-200 h-6"></div>

            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-600" size={16} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">2. Auto Login</h4>
                <p className="text-sm text-gray-600">User is automatically logged in after registration</p>
              </div>
            </div>

            <div className="ml-4 border-l-2 border-gray-200 h-6"></div>

            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <ArrowRight className="text-blue-600" size={16} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">3. Smart Redirect</h4>
                <p className="text-sm text-gray-600">System detects new applicant and redirects to application form</p>
              </div>
            </div>

            <div className="ml-4 border-l-2 border-gray-200 h-6"></div>

            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="text-purple-600" size={16} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">4. Start Application</h4>
                <p className="text-sm text-gray-600">User begins filling out their fellowship application</p>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Key Improvements:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Seamless registration-to-application flow</li>
              <li>• No need to navigate manually after registration</li>
              <li>• Smart routing based on application status</li>
              <li>• Clear welcome message for new applicants</li>
              <li>• Returning applicants go to dashboard with progress</li>
            </ul>
          </div>

          {/* Testing Instructions */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">How to Test:</h4>
            <ol className="text-sm text-green-800 space-y-1">
              <li>1. Go to <code className="bg-white px-1 rounded">/register</code></li>
              <li>2. Create a new applicant account</li>
              <li>3. Notice automatic redirect to application form</li>
              <li>4. Start filling the application (saves automatically)</li>
              <li>5. Login again - you'll go to dashboard with progress</li>
            </ol>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default NewApplicantFlow;
