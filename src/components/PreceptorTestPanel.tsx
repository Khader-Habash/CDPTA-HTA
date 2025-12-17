import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toaster';
import { testService, TestResult, CompleteTestResult } from '@/services/testService';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Trash2, 
  BookOpen, 
  Users, 
  FileText, 
  GraduationCap,
  AlertCircle,
  Clock,
  TestTube
} from 'lucide-react';

const PreceptorTestPanel: React.FC = () => {
  const { addToast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<CompleteTestResult | null>(null);
  const [isCleaningUp, setIsCleaningUp] = useState(false);

  const runCompleteTest = async () => {
    setIsRunning(true);
    setTestResults(null);
    
    try {
      const results = await testService.runCompleteTest();
      setTestResults(results);
      
      if (results.overallSuccess) {
        addToast({
          type: 'success',
          title: 'Test Suite Passed!',
          message: 'All application workflow tests completed successfully.',
        });
      } else {
        addToast({
          type: 'error',
          title: 'Test Suite Failed',
          message: 'Some tests failed. Check the results below.',
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Test Error',
        message: 'Failed to run test suite.',
      });
    } finally {
      setIsRunning(false);
    }
  };

  const cleanupTestData = async () => {
    setIsCleaningUp(true);
    
    try {
      await testService.cleanupTestData();
      setTestResults(null);
      addToast({
        type: 'success',
        title: 'Cleanup Complete',
        message: 'All test data has been removed.',
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Cleanup Failed',
        message: 'Failed to cleanup test data.',
      });
    } finally {
      setIsCleaningUp(false);
    }
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="text-green-600" size={20} />
    ) : (
      <XCircle className="text-red-600" size={20} />
    );
  };

  const getStatusColor = (success: boolean) => {
    return success 
      ? 'border-green-200 bg-green-50' 
      : 'border-red-200 bg-red-50';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TestTube className="text-blue-600" size={28} />
            Preceptor Test Panel
          </h2>
          <p className="text-gray-600 mt-1">
            Test the complete application workflow and preceptor functionality
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={runCompleteTest}
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <RefreshCw className="animate-spin" size={16} />
            ) : (
              <Play size={16} />
            )}
            {isRunning ? 'Running Tests...' : 'Run Complete Test'}
          </Button>
          
          <Button
            variant="outline"
            onClick={cleanupTestData}
            disabled={isCleaningUp}
            className="flex items-center gap-2"
          >
            {isCleaningUp ? (
              <RefreshCw className="animate-spin" size={16} />
            ) : (
              <Trash2 size={16} />
            )}
            {isCleaningUp ? 'Cleaning...' : 'Cleanup Test Data'}
          </Button>
        </div>
      </div>

      {/* Test Overview */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-900">Test Overview</h3>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <GraduationCap className="text-blue-600 mx-auto mb-2" size={24} />
              <h4 className="font-semibold text-gray-900">Application</h4>
              <p className="text-sm text-gray-600">Submission & Review</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Users className="text-green-600 mx-auto mb-2" size={24} />
              <h4 className="font-semibold text-gray-900">Assignment</h4>
              <p className="text-sm text-gray-600">Preceptor Assignment</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <BookOpen className="text-purple-600 mx-auto mb-2" size={24} />
              <h4 className="font-semibold text-gray-900">Course Creation</h4>
              <p className="text-sm text-gray-600">Content Management</p>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <FileText className="text-orange-600 mx-auto mb-2" size={24} />
              <h4 className="font-semibold text-gray-900">Assignment</h4>
              <p className="text-sm text-gray-600">Creation & Grading</p>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Test Results */}
      {testResults && (
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Test Results</h3>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                testResults.overallSuccess 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {testResults.overallSuccess ? 'All Tests Passed' : 'Some Tests Failed'}
              </div>
            </div>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {testResults.results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${getStatusColor(result.success)}`}
                >
                  <div className="flex items-start gap-3">
                    {getStatusIcon(result.success)}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{result.step}</h4>
                      <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                      {result.data && (
                        <details className="mt-2">
                          <summary className="text-xs text-gray-500 cursor-pointer">
                            View Data
                          </summary>
                          <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Summary</h4>
              <p className="text-gray-600">{testResults.summary}</p>
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Quick Test Actions */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-900">Quick Test Actions</h3>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => testService.testApplicationSubmission()}
              className="flex items-center gap-2 h-auto p-4"
            >
              <GraduationCap size={20} />
              <div className="text-left">
                <div className="font-semibold">Test Application</div>
                <div className="text-sm text-gray-600">Submit test application</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => testService.testCourseCreation()}
              className="flex items-center gap-2 h-auto p-4"
            >
              <BookOpen size={20} />
              <div className="text-left">
                <div className="font-semibold">Test Course</div>
                <div className="text-sm text-gray-600">Create test course</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => testService.testAssignmentCreation()}
              className="flex items-center gap-2 h-auto p-4"
            >
              <FileText size={20} />
              <div className="text-left">
                <div className="font-semibold">Test Assignment</div>
                <div className="text-sm text-gray-600">Create test assignment</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => testService.testAutomaticFellowAssignment()}
              className="flex items-center gap-2 h-auto p-4"
            >
              <Users size={20} />
              <div className="text-left">
                <div className="font-semibold">Test Auto Assignment</div>
                <div className="text-sm text-gray-600">Verify fellow auto-assignment</div>
              </div>
            </Button>
          </div>
        </Card.Content>
      </Card>

      {/* Instructions */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <AlertCircle className="text-yellow-600" size={20} />
            Testing Instructions
          </h3>
        </Card.Header>
        <Card.Content>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <Clock size={16} className="mt-0.5 text-gray-400" />
              <p><strong>Step 1:</strong> Click "Run Complete Test" to test the entire workflow</p>
            </div>
            <div className="flex items-start gap-2">
              <Clock size={16} className="mt-0.5 text-gray-400" />
              <p><strong>Step 2:</strong> Check the results to see which steps passed/failed</p>
            </div>
            <div className="flex items-start gap-2">
              <Clock size={16} className="mt-0.5 text-gray-400" />
              <p><strong>Step 3:</strong> Use individual test buttons to test specific functionality</p>
            </div>
            <div className="flex items-start gap-2">
              <Clock size={16} className="mt-0.5 text-gray-400" />
              <p><strong>Step 4:</strong> Click "Cleanup Test Data" to remove test data when done</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-1">Test Credentials</h4>
            <p className="text-sm text-blue-800">
              After running tests, you can login as the test fellow using:<br/>
              <strong>Email:</strong> test.applicant@example.com<br/>
              <strong>Password:</strong> password123
            </p>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default PreceptorTestPanel;
