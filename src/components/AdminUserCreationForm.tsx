import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserRole } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toaster';
import { X, Save, UserPlus, Key, Mail } from 'lucide-react';

const userCreationSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['admin', 'preceptor', 'fellow']),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  department: z.string().optional(),
  cohort: z.string().optional(),
  sendEmail: z.boolean().optional(),
});

type UserCreationFormData = z.infer<typeof userCreationSchema>;

interface AdminUserCreationFormProps {
  onClose: () => void;
  onSave: (userData: UserCreationFormData) => void;
}

const AdminUserCreationForm: React.FC<AdminUserCreationFormProps> = ({ onClose, onSave }) => {
  const { addToast } = useToast();
  const [generatedPassword, setGeneratedPassword] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<UserCreationFormData>({
    resolver: zodResolver(userCreationSchema),
    defaultValues: {
      role: 'fellow',
      sendEmail: true,
    },
  });

  const watchedRole = watch('role');

  const generatePassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setGeneratedPassword(password);
    setValue('password', password);
    addToast({
      type: 'success',
      title: 'Password Generated',
      message: 'Secure password has been generated'
    });
  };

  const generateUsername = () => {
    const firstName = watch('firstName');
    const lastName = watch('lastName');
    if (firstName && lastName) {
      const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
      setValue('username', username);
    }
  };

  const onSubmit = async (data: UserCreationFormData) => {
    try {
      // Call the onSave function which will handle user creation through userService
      await onSave(data);

      addToast({
        type: 'success',
        title: 'User Created Successfully',
        message: `${data.firstName} ${data.lastName} has been created as ${data.role}${data.sendEmail ? '. Invitation email sent.' : '.'}`
      });

      onClose();
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to Create User',
        message: error instanceof Error ? error.message : 'An error occurred while creating the user'
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <UserPlus className="text-primary-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Create New User</h2>
            </div>
            <Button variant="outline" onClick={onClose} size="sm">
              <X size={20} />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Basic Information */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Basic Information</h3>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name *"
                  {...register('firstName')}
                  error={errors.firstName?.message}
                  placeholder="John"
                  fullWidth
                  onBlur={generateUsername}
                />
                <Input
                  label="Last Name *"
                  {...register('lastName')}
                  error={errors.lastName?.message}
                  placeholder="Doe"
                  fullWidth
                  onBlur={generateUsername}
                />
              </div>

              <Input
                label="Email Address *"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                placeholder="john.doe@cdpta.org"
                fullWidth
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Role *
                </label>
                <select
                  {...register('role')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="admin">Admin</option>
                  <option value="preceptor">Preceptor</option>
                  <option value="fellow">Fellow</option>
                </select>
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
                )}
              </div>

              {watchedRole === 'preceptor' && (
                <Input
                  label="Department"
                  {...register('department')}
                  error={errors.department?.message}
                  placeholder="Drug Policy Research"
                  fullWidth
                />
              )}

              {watchedRole === 'fellow' && (
                <Input
                  label="Cohort"
                  {...register('cohort')}
                  error={errors.cohort?.message}
                  placeholder="2024/25"
                  fullWidth
                />
              )}
            </Card.Content>
          </Card>

          {/* Login Credentials */}
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Login Credentials</h3>
              </div>
            </Card.Header>
            <Card.Content className="space-y-4">
              <Input
                label="Username *"
                {...register('username')}
                error={errors.username?.message}
                placeholder="john.doe"
                fullWidth
              />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password *
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generatePassword}
                  >
                    <Key size={14} className="mr-1" />
                    Generate Secure Password
                  </Button>
                </div>
                <Input
                  type="text"
                  {...register('password')}
                  error={errors.password?.message}
                  placeholder="Minimum 8 characters"
                  fullWidth
                />
                {generatedPassword && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-800">
                      <strong>Generated Password:</strong> {generatedPassword}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Please save this password securely. It will be sent to the user via email.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="sendEmail"
                  {...register('sendEmail')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="sendEmail" className="text-sm text-gray-700 flex items-center">
                  <Mail size={16} className="mr-2" />
                  Send invitation email with login credentials
                </label>
              </div>
            </Card.Content>
          </Card>

          {/* Important Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">📋 Important Notes:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• User will be able to change their password after first login</li>
              <li>• {watchedRole === 'preceptor' ? 'Preceptors' : 'Fellows'} can access their dashboard immediately</li>
              <li>• An invitation email will be sent if the checkbox is selected</li>
              <li>• Save the generated password before creating the user</li>
            </ul>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save size={16} className="mr-2" />
              {isSubmitting ? 'Creating User...' : 'Create User'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUserCreationForm;






