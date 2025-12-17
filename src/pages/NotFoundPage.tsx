import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Search, Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="text-primary-600" size={32} />
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Page Not Found
          </h2>
          
          <p className="text-gray-600 mb-6">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
          
          <div className="space-y-3">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button fullWidth>
                  <Home size={16} className="mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button fullWidth>
                  <Home size={16} className="mr-2" />
                  Go to Login
                </Button>
              </Link>
            )}
            
            <Link to="/">
              <Button variant="outline" fullWidth>
                Go to Home
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-gray-500 mt-6">
            If you think this is a mistake, please contact support.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default NotFoundPage;
