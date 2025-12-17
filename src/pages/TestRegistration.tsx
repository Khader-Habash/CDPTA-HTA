import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const TestRegistration: React.FC = () => {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const handleTestRegistration = async () => {
    setIsLoading(true);
    setResult('');
    
    try {
      const testData = {
        firstName: 'Test',
        lastName: 'User',
        email: `test-${Date.now()}@example.com`,
        password: 'testpassword123',
        phone: '1234567890',
        role: UserRole.APPLICANT,
        organization: 'Test Organization',
        position: 'Test Position',
        address: {
          street: '123 Test Street',
          city: 'Test City',
          postalCode: '12345',
          country: 'Test Country',
        },
        isKHCCStaff: false,
      };

      console.log('Testing registration with:', testData);
      
      await register(testData);
      setResult('✅ Registration successful!');
    } catch (error) {
      console.error('Test registration error:', error);
      setResult(`❌ Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <Card.Header>
            <h1 className="text-xl font-semibold">Test Registration</h1>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <p className="text-gray-600">
                This page tests the registration functionality with sample data.
              </p>
              
              <Button 
                onClick={handleTestRegistration}
                disabled={isLoading}
                fullWidth
              >
                {isLoading ? 'Testing...' : 'Test Registration'}
              </Button>
              
              {result && (
                <div className={`p-3 rounded-md ${
                  result.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  {result}
                </div>
              )}
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default TestRegistration;

