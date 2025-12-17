import React from 'react';
import { ApplicationFormData } from '@/types/application';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { 
  Globe, 
  Target, 
  Briefcase,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface ProgramInfoStepProps {
  data: ApplicationFormData['programInfo'];
  onChange: (data: ApplicationFormData['programInfo']) => void;
  errors?: (string | { field: string; message: string })[];
}

const ProgramInfoStep: React.FC<ProgramInfoStepProps> = ({ 
  data, 
  onChange,
  errors = [] 
}) => {
  const handleFieldChange = (field: string, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Program Information</h2>
        <p className="text-gray-600">
          Please provide additional information about your interest in joining the CDPTA Fellowship Program.
        </p>
      </div>

      {/* Travel Ability */}
      <Card>
        <Card.Header>
          <div className="flex items-center space-x-2">
            <Globe className="text-primary-600" size={20} />
            <h3 className="text-lg font-semibold">Travel Ability</h3>
          </div>
        </Card.Header>
        <Card.Content className="space-y-4">
          <div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                checked={data.canTravel}
                onChange={(e) => handleFieldChange('canTravel', e.target.checked)}
              />
              <span className="text-sm font-medium text-gray-700">
                I am able to travel if required for the fellowship program
              </span>
            </label>
          </div>
          
          {data.canTravel && (
            <div className="mt-4 pl-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Please provide details about your travel ability and any constraints:
              </label>
              <textarea
                rows={4}
                className="input w-full"
                placeholder="e.g., I can travel within Jordan for conferences and meetings, or specify any limitations..."
                value={data.travelReason || ''}
                onChange={(e) => handleFieldChange('travelReason', e.target.value)}
              />
            </div>
          )}
        </Card.Content>
      </Card>

      {/* Why Join CDPTA */}
      <Card>
        <Card.Header>
          <div className="flex items-center space-x-2">
            <Target className="text-primary-600" size={20} />
            <h3 className="text-lg font-semibold">Why do you want to join the HTA fellowship at CDPTA (or delivered by CDPTA)?</h3>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Please explain why you are interested in joining the HTA fellowship at CDPTA (or delivered by CDPTA) and what you hope to gain from this experience. (Required)
            </p>
            <textarea
              rows={6}
              className="input w-full"
              placeholder="Describe your motivation, goals, and how this fellowship aligns with your career aspirations..."
              value={data.whyJoinCDPTA}
              onChange={(e) => handleFieldChange('whyJoinCDPTA', e.target.value)}
              required
            />
            {data.whyJoinCDPTA && (
              <p className="text-xs text-gray-500">
                {data.whyJoinCDPTA.length} characters
              </p>
            )}
          </div>
        </Card.Content>
      </Card>

      {/* CDPTA Projects Engagement */}
      <Card>
        <Card.Header>
          <div className="flex items-center space-x-2">
            <Briefcase className="text-primary-600" size={20} />
            <h3 className="text-lg font-semibold">CDPTA Projects Engagement</h3>
          </div>
        </Card.Header>
        <Card.Content className="space-y-4">
          <div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                checked={data.engagedInCDPTAProjects}
                onChange={(e) => handleFieldChange('engagedInCDPTAProjects', e.target.checked)}
              />
              <span className="text-sm font-medium text-gray-700">
                I have previously engaged in or participated in CDPTA projects
              </span>
            </label>
          </div>
          
          {data.engagedInCDPTAProjects && (
            <div className="mt-4 pl-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Please provide details about your CDPTA project engagement:
              </label>
              <textarea
                rows={5}
                className="input w-full"
                placeholder="Describe the projects you have been involved in, your role, duration, and any outcomes..."
                value={data.projectDetails || ''}
                onChange={(e) => handleFieldChange('projectDetails', e.target.value)}
              />
            </div>
          )}
        </Card.Content>
      </Card>

      {/* Help Text */}
      <Card>
        <Card.Content className="bg-blue-50 border border-blue-200">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-blue-600 mt-1" size={20} />
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 mb-2">Tips for Writing Your Responses</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Be specific and provide concrete examples where possible</li>
                <li>• Explain how the CDPTA fellowship aligns with your career goals</li>
                <li>• Demonstrate your passion for health technology assessment and drug policy</li>
                <li>• If you have prior CDPTA experience, highlight your contributions and learning</li>
                <li>• Be honest about travel constraints - this helps us plan accordingly</li>
              </ul>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Error Display */}
      {errors.length > 0 && (
        <Card>
          <Card.Content className="bg-red-50 border border-red-200">
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-red-600 mt-1" size={20} />
              <div>
                <h4 className="font-medium text-red-900">Please address the following:</h4>
                <ul className="text-red-700 text-sm mt-1 list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{typeof error === 'string' ? error : error.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  );
};

export default ProgramInfoStep;
