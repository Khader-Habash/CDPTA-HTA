import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/Toaster';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { GraduationCap, Eye, EyeOff, UserPlus } from 'lucide-react';
import { UserRole } from '@/types';

// Registration form validation schema
const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  organization: z.string().min(2, 'Organization name is required'),
  position: z.string().min(2, 'Position is required'),
  // KHCC Staff specific fields
  isKHCCStaff: z.union([z.boolean(), z.string()]).optional().transform(val => {
    if (typeof val === 'string') {
      return val === 'true';
    }
    return val || false;
  }),
  khccStaffId: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.isKHCCStaff && !data.khccStaffId) {
    return false;
  }
  return true;
}, {
  message: "KHCC Staff ID is required when you are a KHCC staff member",
  path: ["khccStaffId"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      isKHCCStaff: false,
    },
  });

  const watchedIsKHCCStaff = watch('isKHCCStaff');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      console.log('Registration data:', data); // Debug log
      
      // Prepare user data for registration
      const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: UserRole.APPLICANT, // Always set as APPLICANT
        organization: data.organization,
        position: data.position,
        isKHCCStaff: data.isKHCCStaff || false,
        khccStaffId: data.khccStaffId || undefined,
      };

      console.log('Prepared user data:', userData); // Debug log
      
      const result = await registerUser(userData);
      console.log('Registration result:', result); // Debug log
      
      addToast({
        type: 'success',
        title: 'Welcome to CDPTA!',
        message: 'Your account has been created successfully. You\'ll now be guided through the application process step by step.',
      });

      // After successful registration, user is automatically logged in
      // Redirect to application form to start the process
      navigate('/applicant/application');
    } catch (error) {
      console.error('Registration error:', error); // Debug log
      addToast({
        type: 'error',
        title: 'Registration Failed',
        message: error instanceof Error ? error.message : 'An error occurred during registration',
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="text-white" size={24} />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">
            CDPTA
          </h1>
          <p className="mt-1 text-sm text-gray-600 font-medium">
            Center for Drug Policy & Technology Assessment
          </p>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Apply for Fellowship
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account to begin your CDPTA Fellowship application
          </p>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>What happens next?</strong> After registration, you'll be guided through a comprehensive application process including:
            </p>
            <ul className="mt-2 text-sm text-blue-700 space-y-1">
              <li>• Personal information and academic background</li>
              <li>• Professional experience and skills</li>
              <li>• Statement of purpose and motivation letter</li>
              <li>• Document uploads (CV, transcripts, etc.)</li>
              <li>• References and additional materials</li>
            </ul>
          </div>
          <Link 
            to="/" 
            className="mt-4 inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Registration Form */}
        <Card>
          <Card.Content className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name *"
                    {...register('firstName')}
                    error={errors.firstName?.message}
                    fullWidth
                  />
                  <Input
                    label="Last Name *"
                    {...register('lastName')}
                    error={errors.lastName?.message}
                    fullWidth
                  />
                </div>

                <div className="mt-4">
                  <Input
                    label="Email Address *"
                    type="email"
                    {...register('email')}
                    error={errors.email?.message}
                    fullWidth
                  />
                </div>

                <div className="mt-4">
                  <Input
                    label="Phone Number *"
                    type="tel"
                    {...register('phone')}
                    error={errors.phone?.message}
                    fullWidth
                  />
                </div>
              </div>


              {/* Professional Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Organization *"
                    {...register('organization')}
                    error={errors.organization?.message}
                    fullWidth
                  />
                  <Input
                    label="Position/Title *"
                    {...register('position')}
                    error={errors.position?.message}
                    fullWidth
                  />
                </div>

              </div>

              {/* KHCC Staff Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">KHCC Staff Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Are you a KHCC staff member?
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="true"
                          {...register('isKHCCStaff')}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="false"
                          {...register('isKHCCStaff')}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  </div>

                  {watchedIsKHCCStaff && (
                    <Input
                      label="KHCC Staff ID *"
                      {...register('khccStaffId')}
                      error={errors.khccStaffId?.message}
                      fullWidth
                      placeholder="Enter your KHCC Staff ID"
                    />
                  )}
                </div>
              </div>


              {/* Password */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Security</h3>
                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      label="Password *"
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      error={errors.password?.message}
                      fullWidth
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      label="Confirm Password *"
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...register('confirmPassword')}
                      error={errors.confirmPassword?.message}
                      fullWidth
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  required
                  className="mt-1"
                />
                <p className="text-sm text-gray-600">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                    Privacy Policy
                  </Link>
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  fullWidth
                  disabled={isLoading}
                  className="flex items-center justify-center"
                >
                  <UserPlus size={20} className="mr-2" />
                  {isLoading ? 'Creating Account...' : 'Create Account & Apply'}
                </Button>
              </div>
            </form>
          </Card.Content>
        </Card>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already started your application?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign in to continue
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;