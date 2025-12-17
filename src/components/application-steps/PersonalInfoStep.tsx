import React from 'react';
import { ApplicationFormData } from '@/types/application';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

interface PersonalInfoStepProps {
  data: ApplicationFormData['personalInfo'];
  onChange: (data: ApplicationFormData['personalInfo']) => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ data, onChange }) => {
  console.log('🔍 PersonalInfoStep - Data received:', data);
  console.log('🔍 PersonalInfoStep - FirstName:', data.firstName);
  console.log('🔍 PersonalInfoStep - FirstName type:', typeof data.firstName);
  
  const updateField = (field: string, value: string | boolean) => {
    console.log('🔍 updateField called:', field, value);
    console.log('🔍 Current data:', data);
    
    if (field === 'isKHCCStaff') {
      onChange({
        ...data,
        [field]: value === 'true',
        // Clear staff ID if switching to "No"
        ...(value === 'false' && { khccStaffId: '' })
      });
    } else {
      onChange({
        ...data,
        [field]: value,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
        <p className="text-gray-600">
          Please provide your basic personal information. All fields marked with * are required.
        </p>
      </div>

      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold">Basic Details</h3>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <select
                value={data.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full input"
              >
                <option value="">Select title</option>
                <option value="Mr">Mr</option>
                <option value="Ms">Ms</option>
                <option value="Mrs">Mrs</option>
                <option value="Dr">Dr</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <Input
              label="First Name"
              value={data.firstName || ''}
              onChange={(e) => updateField('firstName', e.target.value)}
              required
              fullWidth
            />

            <Input
              label="Last Name"
              value={data.lastName || ''}
              onChange={(e) => updateField('lastName', e.target.value)}
              required
              fullWidth
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Input
              label="Date of Birth"
              type="date"
              value={data.dateOfBirth || ''}
              onChange={(e) => updateField('dateOfBirth', e.target.value)}
              required
              fullWidth
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                value={data.gender || ''}
                onChange={(e) => updateField('gender', e.target.value)}
                className="w-full input"
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Input
              label="Nationality"
              value={data.nationality || ''}
              onChange={(e) => updateField('nationality', e.target.value)}
              required
              fullWidth
            />

            <Input
              label="Country of Residence"
              value={data.countryOfResidence || ''}
              onChange={(e) => updateField('countryOfResidence', e.target.value)}
              required
              fullWidth
            />
          </div>
        </Card.Content>
      </Card>

      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold">Contact Information</h3>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Email Address"
              type="email"
              value={data.email || ''}
              onChange={(e) => updateField('email', e.target.value)}
              required
              fullWidth
              helperText="This will be your primary contact email"
            />

            <Input
              label="Alternative Email"
              type="email"
              value={data.alternativeEmail || ''}
              onChange={(e) => updateField('alternativeEmail', e.target.value)}
              fullWidth
              helperText="Optional backup email address"
            />
          </div>

          <div className="mt-6">
            <Input
              label="Phone Number"
              type="tel"
              value={data.phone || ''}
              onChange={(e) => updateField('phone', e.target.value)}
              required
              fullWidth
              helperText="Include country code (e.g., +1234567890)"
            />
          </div>
        </Card.Content>
      </Card>


      {/* KHCC Staff Information */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold">KHCC Staff Information</h3>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Are you a KHCC staff member? *
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isKHCCStaff"
                    value="true"
                    checked={data.isKHCCStaff === true}
                    onChange={() => updateField('isKHCCStaff', 'true')}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isKHCCStaff"
                    value="false"
                    checked={data.isKHCCStaff === false}
                    onChange={() => updateField('isKHCCStaff', 'false')}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            {data.isKHCCStaff && (
              <div>
                <Input
                  label="KHCC Staff ID"
                  value={data.khccStaffId || ''}
                  onChange={(e) => updateField('khccStaffId', e.target.value)}
                  placeholder="Enter your KHCC Staff ID"
                  required
                  fullWidth
                />
                <p className="text-sm text-gray-600 mt-1">
                  Please enter your official KHCC Staff ID number.
                </p>
              </div>
            )}
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default PersonalInfoStep;
