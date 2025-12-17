import React from 'react';
import Card from '@/components/ui/Card';
import { 
  User, 
  FileText, 
  ArrowRight, 
  CheckCircle, 
  Clock,
  Target 
} from 'lucide-react';

const ProfileApplicationDemo: React.FC = () => {
  return (
    <Card>
      <Card.Header>
        <div className="flex items-center space-x-2">
          <Target className="text-green-600" size={24} />
          <h3 className="text-lg font-semibold">Enhanced Profile for Applicants</h3>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Applicants can now continue their application process directly from their profile page.
        </p>
      </Card.Header>
      <Card.Content>
        <div className="space-y-6">
          {/* Feature Overview */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">✨ New Profile Features:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Smart Application Detection</strong> - Automatically detects application progress</li>
              <li>• <strong>Continue Application Button</strong> - Direct link to continue where they left off</li>
              <li>• <strong>Progress Tracking</strong> - Visual progress bar showing completion percentage</li>
              <li>• <strong>Status-Based Actions</strong> - Different options based on application status</li>
              <li>• <strong>Quick Access</strong> - Links to dashboard, status, and application form</li>
            </ul>
          </div>

          {/* Application States */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">📋 Application States:</h4>
            <div className="space-y-3">
              {/* New Applicant */}
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <FileText className="text-blue-600" size={20} />
                <div>
                  <p className="font-medium text-blue-900">New Applicant</p>
                  <p className="text-sm text-blue-700">Shows "Start Your Fellowship Application" button</p>
                </div>
              </div>

              {/* In Progress */}
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <Clock className="text-yellow-600" size={20} />
                <div>
                  <p className="font-medium text-yellow-900">Application In Progress</p>
                  <p className="text-sm text-yellow-700">Shows progress bar and "Continue Application" button</p>
                </div>
              </div>

              {/* Submitted */}
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="text-green-600" size={20} />
                <div>
                  <p className="font-medium text-green-900">Application Submitted</p>
                  <p className="text-sm text-green-700">Shows "Check Status" and "View Application" buttons</p>
                </div>
              </div>
            </div>
          </div>

          {/* How to Test */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">🧪 How to Test:</h4>
            <ol className="text-sm text-green-800 space-y-1">
              <li>1. <strong>Login as Applicant</strong>: Use <code className="bg-white px-1 rounded">applicant@cdpta.org</code> / <code className="bg-white px-1 rounded">applicant123</code></li>
              <li>2. <strong>Go to Profile</strong>: Click "Profile" in the sidebar</li>
              <li>3. <strong>See Application Section</strong>: Scroll down to "Fellowship Application"</li>
              <li>4. <strong>Test Different States</strong>:</li>
              <li className="ml-4">• New user: See "Start Application" button</li>
              <li className="ml-4">• Partial application: See progress bar and "Continue" button</li>
              <li className="ml-4">• Submitted: See status and view options</li>
            </ol>
          </div>

          {/* Navigation Paths */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">🗺️ Navigation Paths:</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p>• <strong>Profile → Start Application</strong> → Application Form</p>
              <p>• <strong>Profile → Continue Application</strong> → Application Form (with saved data)</p>
              <p>• <strong>Profile → Check Status</strong> → Application Status Page</p>
              <p>• <strong>Profile → View Dashboard</strong> → Applicant Dashboard</p>
            </div>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default ProfileApplicationDemo;
