import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { UserRole } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/layout/Layout';
import NewUserWelcome from '@/components/NewUserWelcome';

// Auth pages
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';

// Common pages
import HomePage from '@/pages/HomePage';
import PublicLandingPage from '@/pages/PublicLandingPage';
import TermsPage from '@/pages/TermsPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TestRegistration from '@/pages/TestRegistration';
import TestSubmission from '@/pages/TestSubmission';
import TestAdmin from '@/pages/TestAdmin';
import TestCourseCreation from '@/pages/TestCourseCreation';
import UnauthorizedPage from '@/pages/UnauthorizedPage';
import NotFoundPage from '@/pages/NotFoundPage';

// Dashboard pages
import ApplicantDashboard from '@/pages/dashboards/ApplicantDashboard';
import FellowDashboard from '@/pages/dashboards/FellowDashboard';
import PreceptorDashboard from '@/pages/dashboards/PreceptorDashboard';
import AdminDashboard from '@/pages/dashboards/AdminDashboard';

// Applicant pages
import ApplicationForm from '@/pages/applicant/ApplicationForm';
import ApplicationStatus from '@/pages/applicant/ApplicationStatus';
import ProgramInfo from '@/pages/applicant/ProgramInfo';

// Fellow pages
import FellowProfile from '@/pages/fellow/FellowProfile';
import FellowProjects from '@/pages/fellow/FellowProjects';
import FellowCourses from '@/pages/fellow/FellowCourses';
import CourseDetail from '@/pages/fellow/CourseDetail';
import FellowModules from '@/pages/fellow/FellowModulesTest';
// import FellowQuizzes from '@/pages/fellow/FellowQuizzes';
import FellowAssignments from '@/pages/fellow/FellowAssignments';
import FellowQuizzes from '@/pages/fellow/FellowQuizzes';
// import FellowCalendar from '@/pages/fellow/FellowCalendar';
// import FellowNotifications from '@/pages/fellow/FellowNotifications';
// import FellowMessages from '@/pages/fellow/FellowMessages';

// Preceptor pages
import PreceptorProfile from '@/pages/staff/StaffProfile';
import ManageFellows from '@/pages/staff/ManageFellows';
import CourseManagement from '@/pages/staff/CourseManagement';
import PreceptorMonitoring from '@/pages/preceptor/PreceptorMonitoring';

// Admin pages
import AdminProfile from '@/pages/admin/AdminProfile';
import UserManagement from '@/pages/admin/UserManagement';
import ApplicationReview from '@/pages/admin/ApplicationReview';
import SystemSettings from '@/pages/admin/SystemSettings';
import Analytics from '@/pages/admin/Analytics';
import AnnouncementManagement from '@/pages/admin/AnnouncementManagement';
import PreceptorAssignmentManagement from '@/pages/admin/PreceptorAssignmentManagement';
import AnnouncementsPage from '@/pages/AnnouncementsPage';

// Shared pages
import ProfilePage from '@/pages/ProfilePage';
import SettingsPage from '@/pages/SettingsPage';
import NotificationsPage from '@/pages/NotificationsPage';
import DirectApplication from '@/pages/DirectApplication';

const AppRoutes: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PublicLandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/test-registration" element={<TestRegistration />} />
            <Route path="/test-submission" element={<TestSubmission />} />
            <Route path="/test-admin" element={<TestAdmin />} />
            <Route path="/test-course-creation" element={<TestCourseCreation />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/apply" element={<DirectApplication />} />
      
      {/* Public announcements page - accessible to all (with layout for logged-in users) */}
      <Route 
        path="/announcements" 
        element={
          user ? (
            <Layout>
              <AnnouncementsPage />
            </Layout>
          ) : (
            <AnnouncementsPage />
          )
        } 
      />

      {/* Welcome route for new users */}
      <Route
        path="/welcome"
        element={
          <ProtectedRoute>
            <Layout>
              <WelcomePage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Dashboard routes - redirect based on user role */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardRedirect />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Applicant routes */}
      <Route
        path="/applicant/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="dashboard" element={<ApplicantDashboard />} />
                <Route path="application" element={<ApplicationForm />} />
                <Route path="status" element={<ApplicationStatus />} />
                <Route path="program-info" element={<ProgramInfo />} />
                <Route path="*" element={<Navigate to="/applicant/dashboard" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Fellow routes */}
      <Route
        path="/fellow/*"
        element={
          <ProtectedRoute requiredRoles={[UserRole.FELLOW]}>
            <Layout>
              <Routes>
                <Route path="dashboard" element={<FellowDashboard />} />
                <Route path="profile" element={<FellowProfile />} />
                <Route path="projects" element={<FellowProjects />} />
                <Route path="courses" element={<FellowCourses />} />
                <Route path="courses/:courseId" element={<CourseDetail />} />
                <Route path="modules" element={<FellowModules />} />
                <Route path="assignments" element={<FellowAssignments />} />
                <Route path="quizzes" element={<FellowQuizzes />} />
                <Route path="*" element={<Navigate to="/fellow/dashboard" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Preceptor routes */}
      <Route
        path="/preceptor/*"
        element={
          <ProtectedRoute requiredRoles={[UserRole.PRECEPTOR]}>
            <Layout>
              <Routes>
                <Route path="dashboard" element={<PreceptorDashboard />} />
                <Route path="profile" element={<PreceptorProfile />} />
                <Route path="fellows" element={<ManageFellows />} />
                <Route path="courses" element={<CourseManagement />} />
                <Route path="monitoring" element={<PreceptorMonitoring />} />
                <Route path="*" element={<Navigate to="/preceptor/dashboard" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
      
      {/* Legacy staff routes - redirect to preceptor */}
      <Route path="/staff/*" element={<Navigate to="/preceptor/dashboard" replace />} />

      {/* Admin routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRoles={[UserRole.ADMIN]}>
            <Layout>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="profile" element={<AdminProfile />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="applications" element={<ApplicationReview />} />
                <Route path="announcements" element={<AnnouncementManagement />} />
                <Route path="settings" element={<SystemSettings />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="preceptor-assignments" element={<PreceptorAssignmentManagement />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Shared protected routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <ProfilePage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <SettingsPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Layout>
              <NotificationsPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* 404 route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

// Welcome page component for new users
const WelcomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleStartApplication = () => {
    navigate('/applicant/application');
  };

  const handleSkipWelcome = () => {
    navigate('/applicant/dashboard');
  };

  return (
    <NewUserWelcome
      userName={user.firstName || 'Applicant'}
      userId={user.id}
      onStartApplication={handleStartApplication}
      onSkipWelcome={handleSkipWelcome}
    />
  );
};

// Component to redirect to appropriate dashboard based on user role
const DashboardRedirect: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // For applicants, check if they have started their application
  if (user.role === UserRole.APPLICANT) {
    // Check if user has application data in localStorage (indicating they've started)
    const savedApplication = localStorage.getItem('applicationFormData');
    
    if (!savedApplication) {
      // Check if user has seen the welcome page
      const hasSeenWelcome = localStorage.getItem(`welcomeSeen_${user.id}`);
      
      if (!hasSeenWelcome) {
        // New applicant - show welcome page first
        return <Navigate to="/welcome" replace />;
      } else {
        // User has seen welcome but no application data - go to application
        return <Navigate to="/applicant/application" replace />;
      }
    } else {
      // Existing applicant with saved data - go to dashboard
      return <Navigate to="/applicant/dashboard" replace />;
    }
  }

  const roleBasedRedirects = {
    [UserRole.FELLOW]: '/fellow/dashboard',
    [UserRole.PRECEPTOR]: '/preceptor/dashboard',
    [UserRole.ADMIN]: '/admin/dashboard',
  };

  const redirectPath = roleBasedRedirects[user.role] || '/applicant/dashboard';
  return <Navigate to={redirectPath} replace />;
};

export default AppRoutes;
