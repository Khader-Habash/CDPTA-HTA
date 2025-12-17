import React from 'react';
import { ApplicationFormData } from '@/types/application';
import Card from '@/components/ui/Card';
import { PenTool, AlertCircle } from 'lucide-react';

interface EssayStepProps {
  data: ApplicationFormData;
  onChange: (data: Partial<ApplicationFormData>) => void;
  errors?: (string | { field: string; message: string })[];
}

const EssayStep: React.FC<EssayStepProps> = ({ 
  data, 
  onChange,
  errors = [] 
}) => {
  console.log('🔍 EssayStep - Data received:', data);
  console.log('🔍 EssayStep - Essay data:', data.essay);
  console.log('🔍 EssayStep - Research interests:', data.essay.researchInterests);
  console.log('🔍 EssayStep - Research interests type:', typeof data.essay.researchInterests);
  
  const updateEssay = (field: string, value: string) => {
    console.log('🔍 updateEssay called:', field, value);
    onChange({
      essay: {
        ...data.essay,
        [field]: value,
      },
    });
  };

  const essayQuestions = [
    {
      key: 'researchInterests',
      title: 'Research Interests',
      prompt: 'Outline your specific research interests within drug policy and technology assessment. What areas would you like to explore during your fellowship? (300-500 words)',
      placeholder: 'Detail your specific research interests, methodologies you want to learn, areas of drug policy you are passionate about...',
      required: false,
      wordLimit: { min: 300, max: 500 }
    }
  ];

  const getWordCount = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getWordCountStatus = (text: string, wordLimit: { min: number; max: number }) => {
    const count = getWordCount(text);
    if (count < wordLimit.min) {
      return { status: 'under', message: `${count}/${wordLimit.min} words (minimum)`, color: 'text-red-600' };
    } else if (count > wordLimit.max) {
      return { status: 'over', message: `${count}/${wordLimit.max} words (exceeded)`, color: 'text-red-600' };
    } else {
      return { status: 'good', message: `${count} words (${wordLimit.min}-${wordLimit.max})`, color: 'text-green-600' };
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Research Interests (Optional)</h2>
        <p className="text-gray-600">
          Please share your research interests to help us understand your focus areas and potential contributions to the program.
        </p>
      </div>

      {/* Writing Guidelines */}
      <Card>
        <Card.Header>
          <div className="flex items-center space-x-3">
            <PenTool className="text-primary-600" size={24} />
            <h3 className="text-lg font-semibold">Writing Guidelines</h3>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Content Guidelines</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Be specific and provide concrete examples</li>
                <li>• Demonstrate knowledge of drug policy and health technology assessment</li>
                <li>• Show how your background aligns with program goals</li>
                <li>• Explain your potential contributions to the field</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Format Requirements</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Adhere to specified word limits for each question</li>
                <li>• Use clear, professional language</li>
                <li>• Proofread for grammar and spelling</li>
                <li>• Your responses are automatically saved as you type</li>
              </ul>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Essay Questions */}
      <div className="space-y-6">
        {essayQuestions.map((question, index) => {
          const currentText = data.essay[question.key as keyof typeof data.essay] || '';
          console.log('🔍 EssayStep - Question key:', question.key);
          console.log('🔍 EssayStep - Current text:', currentText);
          console.log('🔍 EssayStep - Current text type:', typeof currentText);
          const wordCountStatus = getWordCountStatus(currentText, question.wordLimit);
          
          return (
            <Card key={question.key}>
              <Card.Header>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{question.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{question.prompt}</p>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    Question {index + 1} of {essayQuestions.length}
                  </span>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  <textarea
                    value={String(currentText || '')}
                    onChange={(e) => updateEssay(question.key, e.target.value)}
                    placeholder={question.placeholder}
                    rows={12}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  />
                  
                  <div className="flex justify-between items-center">
                    <div className={`text-sm ${wordCountStatus.color}`}>
                      {wordCountStatus.message}
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Optional
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          );
        })}
      </div>

      {/* Additional Information */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold">Additional Information (Optional)</h3>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Is there anything else you would like us to know about your application?
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Use this space to provide any additional context, explain gaps in your education or experience, 
                or highlight anything else relevant to your application that wasn't covered in the questions above.
              </p>
              <textarea
                rows={6}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Optional: Any additional information you would like to share..."
              />
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* KHCC Staff Notice */}
      {data.personalInfo.isKHCCStaff && (
        <Card>
          <Card.Content className="bg-purple-50 border border-purple-200">
            <div className="flex items-start space-x-3">
              <div className="text-purple-600">💼</div>
              <div>
                <h4 className="font-medium text-purple-900">KHCC Staff Application</h4>
                <p className="text-purple-700 text-sm">
                  As a KHCC staff member, please also consider addressing how your current role and experience 
                  at KHCC will contribute to your fellowship research and how the fellowship will benefit 
                  your work at the center.
                </p>
              </div>
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Progress Summary */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold">Progress Summary</h3>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {essayQuestions.map((question) => {
              const currentText = data.essay[question.key as keyof typeof data.essay] || '';
              const wordCount = getWordCount(currentText);
              const isComplete = wordCount >= question.wordLimit.min && wordCount <= question.wordLimit.max;
              
              return (
                <div key={question.key} className="text-center p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm text-gray-900 mb-1">
                    {question.title.replace(' *', '')}
                  </h4>
                  <div className={`text-xs ${isComplete ? 'text-green-600' : 'text-red-600'}`}>
                    {isComplete ? '✓ Complete' : `${wordCount}/${question.wordLimit.min} words`}
                  </div>
                </div>
              );
            })}
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

export default EssayStep;

