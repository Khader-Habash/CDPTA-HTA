import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import AppRoutes from '@/routes/AppRoutes';
import { ToastProvider } from '@/components/ui/Toaster';
import ErrorBoundary from '@/components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <NotificationProvider>
            <div className="min-h-screen bg-gray-100">
              <AppRoutes />
            </div>
          </NotificationProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
