import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Shield, ArrowLeft } from 'lucide-react';

const UnauthorizedPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="text-red-600" size={32} />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. Your current role is{' '}
            <span className="font-medium capitalize">{user?.role}</span>.
          </p>
          
          <div className="space-y-3">
            <Link to="/dashboard">
              <Button fullWidth>
                <ArrowLeft size={16} className="mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            
            <Link to="/profile">
              <Button variant="outline" fullWidth>
                View Profile
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-gray-500 mt-6">
            If you believe this is an error, please contact your administrator.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
