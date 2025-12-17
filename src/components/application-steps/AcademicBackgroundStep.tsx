import React from 'react';
import { ApplicationFormData } from '@/types/application';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';

interface AcademicBackgroundStepProps {
  data: ApplicationFormData;
  onChange: (data: Partial<ApplicationFormData>) => void;
  errors?: (string | { field: string; message: string })[];
}

const AcademicBackgroundStep: React.FC<AcademicBackgroundStepProps> = ({ 
  data, 
  onChange,
  errors = [] 
}) => {
  console.log('🔍 AcademicBackgroundStep - Data received:', data);
  console.log('🔍 AcademicBackgroundStep - Education data:', data.education);
  console.log('🔍 AcademicBackgroundStep - Current level:', data.education.currentLevel);
  console.log('🔍 AcademicBackgroundStep - Institution:', data.education.institution);
  
  const updateEducation = (field: string, value: any) => {
    console.log('🔍 updateEducation called:', field, value);
    console.log('🔍 Current education data:', data.education);
    console.log('🔍 Field being updated:', field, 'New value:', value);
    
    const updatedEducation = {
      ...data.education,
      [field]: value,
    };
    
    console.log('🔍 Updated education data:', updatedEducation);
    
    onChange(updatedEducation);
    
    console.log('🔍 onChange called with education data');
  };

  const addPreviousEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      graduationDate: '',
      grade: '',
    };

    onChange({
      ...data.education,
      previousEducation: [...data.education.previousEducation, newEducation],
    });
  };

  const updatePreviousEducation = (id: string, field: string, value: string) => {
    const updated = data.education.previousEducation.map(edu =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );

    onChange({
      ...data.education,
      previousEducation: updated,
    });
  };

  const removePreviousEducation = (id: string) => {
    const filtered = data.education.previousEducation.filter(edu => edu.id !== id);
    
    onChange({
      ...data.education,
      previousEducation: filtered,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Academic Background</h2>
        <p className="text-gray-600">
          Please provide details about your educational qualifications. All fields marked with * are required.
        </p>
      </div>

      {/* Current/Highest Education */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold">Highest Educational Degree</h3>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Highest Educational Degree *
              </label>
              <select
                value={data.education.currentLevel || ''}
                onChange={(e) => {
                  console.log('🔍 Select onChange triggered:', e.target.value);
                  updateEducation('currentLevel', e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="">Select your highest degree</option>
                <option value="bachelors">Bachelor's Degree</option>
                <option value="masters">Master's Degree</option>
                <option value="phd">PhD</option>
                <option value="professional">Professional Degree (MD, PharmD, etc.)</option>
                <option value="other">Other</option>
              </select>
            </div>

            <Input
              label="Institution *"
              value={data.education.institution || ''}
              onChange={(e) => {
                console.log('🔍 Institution Input onChange triggered:', e.target.value);
                updateEducation('institution', e.target.value);
              }}
              placeholder="University or institution name"
              required
              fullWidth
            />

            <Input
              label="Field of Study *"
              value={data.education.fieldOfStudy || ''}
              onChange={(e) => {
                console.log('🔍 Field of Study Input onChange triggered:', e.target.value);
                updateEducation('fieldOfStudy', e.target.value);
              }}
              placeholder="e.g., Medicine, Pharmacy, Public Health"
              required
              fullWidth
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Graduation Date * (Month/Year)
              </label>
              <input
                type="month"
                value={data.education.graduationDate || ''}
                onChange={(e) => updateEducation('graduationDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <Input
              label="GPA (Optional)"
              value={data.education.gpa || ''}
              onChange={(e) => updateEducation('gpa', e.target.value)}
              placeholder="e.g., 3.8/4.0 or 85%"
              fullWidth
            />

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={data.education.transcriptUploaded}
                  onChange={(e) => updateEducation('transcriptUploaded', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">
                  I will upload my official transcript in the documents section
                </span>
              </label>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Additional Information */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold">Additional Academic Information</h3>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Academic Achievements</h4>
              <p className="text-sm text-gray-600 mb-3">
                List any relevant academic honors, awards, scholarships, or publications.
              </p>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows={4}
                placeholder="e.g., Dean's List, Research publications, Academic scholarships..."
              />
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Research Experience</h4>
              <p className="text-sm text-gray-600 mb-3">
                Describe any research projects, lab work, or academic research experience.
              </p>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows={4}
                placeholder="Describe your research experience, projects, methodologies used..."
              />
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Error Display */}
      {errors.length > 0 && (
        <Card>
          <Card.Content className="bg-red-50 border border-red-200">
            <div className="flex items-start space-x-3">
              <div className="text-red-600">⚠️</div>
              <div>
                <h4 className="font-medium text-red-900">Please complete the following:</h4>
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

export default AcademicBackgroundStep;

