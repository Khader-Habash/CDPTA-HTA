import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/Toaster';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { User, Camera, FileText, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.profileData?.phone || '',
    bio: user?.profileData?.bio || '',
  });

  const [applicationProgress, setApplicationProgress] = useState({
    hasStarted: false,
    status: 'not_started',
    completionPercentage: 0,
    lastSaved: null,
  });

  // Check application progress for applicants
  useEffect(() => {
    if (user?.role === 'APPLICANT') {
      const savedApplication = localStorage.getItem('applicationFormData');
      if (savedApplication) {
        try {
          const parsedData = JSON.parse(savedApplication);
          const progress = {
            personalInfo: parsedData.personalInfo?.firstName ? true : false,
            education: parsedData.education?.institution ? true : false,
            documents: Object.values(parsedData.documents || {}).some(doc => doc !== null),
            essays: parsedData.essays?.personalStatement ? true : false,
          };
          
          const completed = Object.values(progress).filter(Boolean).length;
          const total = Object.keys(progress).length;
          const percentage = Math.round((completed / total) * 100);
          
          setApplicationProgress({
            hasStarted: true,
            status: parsedData.metadata?.status || 'draft',
            completionPercentage: percentage,
            lastSaved: parsedData.metadata?.lastSaved,
          });
        } catch (error) {
          console.error('Error parsing application data:', error);
        }
      }
    }
  }, [user?.role]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Here you would call the API to update the user profile
      // await authService.updateProfile(user!.id, formData);
      
      addToast({
        type: 'success',
        title: 'Profile updated',
        message: 'Your profile has been successfully updated.',
      });
      setIsEditing(false);
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Update failed',
        message: 'Failed to update profile. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.profileData?.phone || '',
      bio: user?.profileData?.bio || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">
          Manage your personal information and account settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card>
          <Card.Content>
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <User className="text-white" size={32} />
                  )}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-100">
                  <Camera size={16} className="text-gray-600" />
                </button>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-600 capitalize">{user?.role}</p>
              
              {user?.profileData?.bio && (
                <p className="text-sm text-gray-500 mt-2">{user.profileData.bio}</p>
              )}
            </div>
          </Card.Content>
        </Card>

        {/* Profile Information */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <div className="space-x-2">
                  {isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSave}
                        isLoading={isLoading}
                      >
                        Save
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    fullWidth
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    fullWidth
                  />
                </div>

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  fullWidth
                />

                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  fullWidth
                />

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    rows={4}
                    className="input w-full resize-none"
                    placeholder="Tell us about yourself..."
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>

      {/* Role-specific Information */}
      {user?.role && (
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold capitalize">{user.role} Information</h3>
          </Card.Header>
          <Card.Content>
            {user.role === 'fellow' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cohort
                  </label>
                  <p className="text-sm text-gray-900">
                    {user.profileData?.cohort || 'Not assigned'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <p className="text-sm text-gray-900">
                    {user.profileData?.startDate ? 
                      new Date(user.profileData.startDate).toLocaleDateString() : 
                      'Not set'
                    }
                  </p>
                </div>
              </div>
            )}
            
            {user.role === 'staff' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <p className="text-sm text-gray-900">
                    {user.profileData?.department || 'Not assigned'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <p className="text-sm text-gray-900">
                    {user.profileData?.position || 'Not set'}
                  </p>
                </div>
              </div>
            )}

            {user.role === 'APPLICANT' && (
              <div className="space-y-6">
                {/* Application Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Application Status
                    </label>
                    <p className={`text-sm font-medium capitalize ${
                      user.profileData?.applicationStatus === 'accepted' ? 'text-green-600' :
                      user.profileData?.applicationStatus === 'rejected' ? 'text-red-600' :
                      user.profileData?.applicationStatus === 'under_review' ? 'text-blue-600' :
                      'text-yellow-600'
                    }`}>
                      {user.profileData?.applicationStatus?.replace('_', ' ') || 'Pending'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Application Date
                    </label>
                    <p className="text-sm text-gray-900">
                      {user.profileData?.applicationDate ? 
                        new Date(user.profileData.applicationDate).toLocaleDateString() : 
                        'Not submitted'
                      }
                    </p>
                  </div>
                </div>

                {/* Continue Application Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Fellowship Application</h3>
                  
                  {!applicationProgress.hasStarted ? (
                    // New applicant - hasn't started application
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <FileText className="text-blue-600 mt-1" size={20} />
                        <div className="flex-1">
                          <h4 className="text-blue-900 font-medium">Start Your Fellowship Application</h4>
                          <p className="text-blue-700 text-sm mt-1">
                            Ready to take the next step? Begin your CDPTA Fellowship application and join our community of researchers.
                          </p>
                          <div className="mt-3">
                            <Link to="/applicant/application">
                              <Button className="bg-blue-600 hover:bg-blue-700">
                                <FileText className="mr-2" size={16} />
                                Start Application
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : applicationProgress.status === 'submitted' ? (
                    // Application submitted
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="text-green-600 mt-1" size={20} />
                        <div className="flex-1">
                          <h4 className="text-green-900 font-medium">Application Submitted</h4>
                          <p className="text-green-700 text-sm mt-1">
                            Your fellowship application has been successfully submitted and is under review.
                          </p>
                          <div className="mt-3 flex space-x-3">
                            <Link to="/applicant/status">
                              <Button variant="outline" size="sm">
                                <Clock className="mr-2" size={16} />
                                Check Status
                              </Button>
                            </Link>
                            <Link to="/applicant/application">
                              <Button variant="outline" size="sm">
                                <FileText className="mr-2" size={16} />
                                View Application
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Application in progress
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Clock className="text-yellow-600 mt-1" size={20} />
                        <div className="flex-1">
                          <h4 className="text-yellow-900 font-medium">Continue Your Application</h4>
                          <p className="text-yellow-700 text-sm mt-1">
                            Your application is {applicationProgress.completionPercentage}% complete. 
                            {applicationProgress.lastSaved && (
                              <span> Last saved {new Date(applicationProgress.lastSaved).toLocaleDateString()}.</span>
                            )}
                          </p>
                          
                          {/* Progress Bar */}
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-sm text-yellow-700 mb-1">
                              <span>Progress</span>
                              <span>{applicationProgress.completionPercentage}%</span>
                            </div>
                            <div className="w-full bg-yellow-200 rounded-full h-2">
                              <div 
                                className="bg-yellow-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${applicationProgress.completionPercentage}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="mt-4 flex space-x-3">
                            <Link to="/applicant/application">
                              <Button className="bg-yellow-600 hover:bg-yellow-700">
                                <ArrowRight className="mr-2" size={16} />
                                Continue Application
                              </Button>
                            </Link>
                            <Link to="/applicant/dashboard">
                              <Button variant="outline" size="sm">
                                View Dashboard
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card.Content>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;
