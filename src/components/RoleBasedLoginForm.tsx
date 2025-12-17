import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/Toaster';
import { LoginCredentials, UserRole } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { 
  GraduationCap, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Users,
  UserCheck,
  Shield,
  BookOpen
} from 'lucide-react';
import { clsx } from 'clsx';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Demo credentials for different roles
const demoCredentials = [
  {
    role: UserRole.ADMIN,
    email: 'abeer@gmail.com',
    password: 'password123',
    name: 'Abeer Admin',
    icon: Shield,
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200',
    description: 'Full system access and user management'
  },
  {
    role: UserRole.PRECEPTOR,
    email: 'khader@gmail.com', 
    password: 'password123',
    name: 'Khader Preceptor',
    icon: UserCheck,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
    description: 'Manage courses and mentor students'
  },
  {
    role: UserRole.FELLOW,
    email: 'zaid@gmail.com',
    password: 'password123', 
    name: 'Zaid Fellow',
    icon: BookOpen,
    color: 'text-green-600',
    bgColor: 'bg-green-50 border-green-200',
    description: 'Access courses and track progress'
  },
  {
    role: UserRole.APPLICANT,
    email: 'applicant@example.com',
    password: 'password123',
    name: 'Program Applicant', 
    icon: Users,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 border-purple-200',
    description: 'Submit and track applications'
  }
];

const RoleBasedLoginForm: React.FC = () => {
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
  const [showDemoCredentials, setShowDemoCredentials] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Role-based redirect paths
  const getRoleRedirectPath = (role: UserRole): string => {
    const roleBasedPaths = {
      [UserRole.ADMIN]: '/admin/dashboard',
      [UserRole.PRECEPTOR]: '/preceptor/dashboard', 
      [UserRole.FELLOW]: '/fellow/dashboard',
      [UserRole.APPLICANT]: '/dashboard', // Use general dashboard for applicants to trigger smart routing
    };
    
    return roleBasedPaths[role] || '/dashboard';
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    
    try {
      await login({
        email: data.email,
        password: data.password,
      });

      // Success toast will be shown by AuthContext
      // Navigation will happen via useEffect when isAuthenticated changes
      
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Login Failed',
        message: error instanceof Error ? error.message : 'Invalid email or password. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = (demo: typeof demoCredentials[0]) => {
    setSelectedDemo(demo.email);
    setValue('email', demo.email);
    setValue('password', demo.password);
    
    // Auto-submit after a brief delay for visual feedback
    setTimeout(() => {
      handleSubmit(onSubmit)();
    }, 500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg">
            <GraduationCap className="text-white" size={32} />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Educational Platform
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your personalized dashboard
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Role-based access for students, faculty, and administrators
          </p>
        </div>

        {/* Demo Credentials */}
        {showDemoCredentials && (
          <Card className="bg-blue-50 border-blue-200">
            <Card.Header>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-blue-900">
                  Demo Login Options
                </h3>
                <button
                  onClick={() => setShowDemoCredentials(false)}
                  className="text-blue-600 hover:text-blue-800 text-xs"
                >
                  Hide
                </button>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                {demoCredentials.map((demo) => {
                  const Icon = demo.icon;
                  const isSelected = selectedDemo === demo.email;
                  
                  return (
                    <button
                      key={demo.role}
                      onClick={() => handleDemoLogin(demo)}
                      disabled={isSubmitting}
                      className={clsx(
                        'w-full p-3 rounded-lg border-2 transition-all duration-200 text-left',
                        isSelected 
                          ? 'border-primary-500 bg-primary-50 transform scale-105' 
                          : demo.bgColor + ' hover:shadow-md hover:transform hover:scale-102',
                        isSubmitting && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        {isSelected ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <Icon className={demo.color} size={20} />
                        )}
                        <div className="flex-1">
                          <p className={clsx('text-sm font-medium', demo.color)}>
                            {demo.name}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {demo.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {demo.email}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={14} />
                  <p className="text-xs text-yellow-800">
                    These are demo accounts for testing. Each role provides different access levels and features.
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>
        )}

        {/* Login Form */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-center">Sign In</h3>
          </Card.Header>
          <Card.Content>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="Email Address"
                type="email"
                autoComplete="email"
                required
                fullWidth
                error={errors.email?.message}
                {...register('email')}
              />

              <div className="space-y-1">
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    fullWidth
                    error={errors.password?.message}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    {...register('rememberMe')}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                fullWidth
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </Card.Content>
        </Card>

        {/* Registration Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Apply now
            </Link>
          </p>
        </div>

        {/* Help & Support */}
        <Card className="bg-gray-50">
          <Card.Content>
            <div className="text-center">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Need Help?
              </h4>
              <div className="space-y-1">
                <p className="text-xs text-gray-600">
                  Technical Support: support@university.edu
                </p>
                <p className="text-xs text-gray-600">
                  Admissions: admissions@university.edu
                </p>
                <p className="text-xs text-gray-600">
                  Phone: +1 (555) 123-4567
                </p>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Show demo credentials toggle */}
        {!showDemoCredentials && (
          <div className="text-center">
            <button
              onClick={() => setShowDemoCredentials(true)}
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              Show demo login options
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleBasedLoginForm;

