import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { QuizCreationData, QuizQuestion, AssignmentAttachment } from '@/types/courseManagement';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toaster';
import { 
  Upload, 
  X, 
  Plus, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Link,
  Save,
  Eye,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Award,
  FileCheck,
  Shuffle,
  EyeOff,
  RotateCcw,
  HelpCircle,
  Type,
  CheckSquare,
  FileUp
} from 'lucide-react';

// Validation schema for quiz creation
const quizSchema = z.object({
  title: z.string().min(3, 'Quiz title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  instructions: z.string().min(10, 'Instructions must be at least 10 characters'),
  dueDate: z.string().min(1, 'Due date is required').refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, 'Please enter a valid due date'),
  availableFrom: z.string().min(1, 'Available from date is required').refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, 'Please enter a valid available from date'),
  availableUntil: z.string().optional(),
  timeLimit: z.number().min(1).max(480).optional().or(z.nan()).transform(val => isNaN(val) ? undefined : val), // max 8 hours
  maxAttempts: z.number().min(1, 'Max attempts must be at least 1').max(10, 'Max attempts cannot exceed 10'),
  shuffleQuestions: z.boolean().optional(),
  shuffleOptions: z.boolean().optional(),
  showCorrectAnswers: z.boolean().optional(),
  allowReview: z.boolean().optional(),
  isPublished: z.boolean().optional(),
}).refine((data) => {
  if (data.availableUntil && data.availableUntil.length > 0) {
    try {
      return new Date(data.availableFrom) < new Date(data.availableUntil);
    } catch {
      return true;
    }
  }
  return true;
}, {
  message: "Available until date must be after available from date",
  path: ["availableUntil"],
}).refine((data) => {
  try {
    const availableDate = new Date(data.availableFrom);
    const dueDate = new Date(data.dueDate);
    return availableDate < dueDate;
  } catch {
    return true;
  }
}, {
  message: "Due date must be after available from date",
  path: ["dueDate"],
});

type QuizFormData = z.infer<typeof quizSchema>;

interface AddQuizFormProps {
  courseId: string;
  onClose: () => void;
  onSave: (quizData: QuizCreationData) => void;
}

const AddQuizForm: React.FC<AddQuizFormProps> = ({ courseId, onClose, onSave }) => {
  const { addToast } = useToast();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [attachments, setAttachments] = useState<AssignmentAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: '',
      description: '',
      instructions: '',
      dueDate: '',
      availableFrom: '',
      availableUntil: '',
      timeLimit: undefined,
      maxAttempts: 1,
      shuffleQuestions: false,
      shuffleOptions: false,
      showCorrectAnswers: false,
      allowReview: true,
      isPublished: false,
    },
  });

  const watchedShuffleQuestions = watch('shuffleQuestions');
  const watchedShuffleOptions = watch('shuffleOptions');
  const watchedShowCorrectAnswers = watch('showCorrectAnswers');
  const watchedAllowReview = watch('allowReview');

  // Question management
  const addQuestion = (type: QuizQuestion['type']) => {
    const newQuestion: QuizQuestion = {
      id: `question-${Date.now()}`,
      type,
      question: '',
      points: 1,
      options: type === 'multiple_choice' || type === 'true_false' ? [''] : undefined,
      correctAnswer: undefined,
      explanation: '',
      order: questions.length + 1,
      required: true,
    };
    setQuestions(prev => [...prev, newQuestion]);
  };

  const updateQuestion = (id: string, field: keyof QuizQuestion, value: any) => {
    setQuestions(prev => prev.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const removeQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id).map((q, index) => ({ ...q, order: index + 1 })));
  };

  const addOption = (questionId: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? { ...q, options: [...(q.options || []), ''] }
        : q
    ));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? {
            ...q,
            options: q.options?.map((opt, idx) => idx === optionIndex ? value : opt)
          }
        : q
    ));
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? {
            ...q,
            options: q.options?.filter((_, idx) => idx !== optionIndex)
          }
        : q
    ));
  };

  // File upload handler
  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = `file-${Date.now()}-${i}`;
      
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const attachment: AssignmentAttachment = {
        id: fileId,
        filename: file.name,
        url: URL.createObjectURL(file), // Mock URL for demo
        size: file.size,
        type: file.type,
      };

      setAttachments(prev => [...prev, attachment]);
    }
    
    setIsUploading(false);
    addToast({
      type: 'success',
      title: 'Files uploaded successfully',
      message: `${files.length} file(s) uploaded`
    });
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="text-red-500" size={20} />;
    if (type.includes('video')) return <Video className="text-purple-500" size={20} />;
    if (type.includes('audio')) return <Music className="text-green-500" size={20} />;
    if (type.includes('image')) return <Image className="text-blue-500" size={20} />;
    return <FileText className="text-gray-500" size={20} />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[id];
      return newProgress;
    });
  };

  const getQuestionTypeIcon = (type: QuizQuestion['type']) => {
    switch (type) {
      case 'multiple_choice': return <CheckSquare className="text-blue-500" size={20} />;
      case 'true_false': return <CheckSquare className="text-green-500" size={20} />;
      case 'short_answer': return <Type className="text-orange-500" size={20} />;
      case 'essay': return <FileText className="text-purple-500" size={20} />;
      case 'file_upload': return <FileUp className="text-red-500" size={20} />;
      default: return <HelpCircle className="text-gray-500" size={20} />;
    }
  };

  const getQuestionTypeLabel = (type: QuizQuestion['type']) => {
    switch (type) {
      case 'multiple_choice': return 'Multiple Choice';
      case 'true_false': return 'True/False';
      case 'short_answer': return 'Short Answer';
      case 'essay': return 'Essay';
      case 'file_upload': return 'File Upload';
      default: return 'Unknown';
    }
  };

  const calculateTotalPoints = () => {
    return questions.reduce((total, question) => total + question.points, 0);
  };

  const onSubmit = async (data: QuizFormData) => {
    try {
      if (questions.length === 0) {
        addToast({
          type: 'error',
          title: 'No questions added',
          message: 'Please add at least one question to the quiz'
        });
        return;
      }

      const quizData: QuizCreationData = {
        ...data,
        courseId,
        questions,
        totalPoints: calculateTotalPoints(),
        attachments,
      };

      await onSave(quizData);
      
      addToast({
        type: 'success',
        title: 'Quiz created successfully',
        message: 'Your quiz has been created and saved as draft'
      });
      
      onClose();
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to create quiz',
        message: error instanceof Error ? error.message : 'An error occurred while creating the quiz'
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Create New Quiz</h2>
            <Button variant="outline" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
          {/* Basic Information */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Quiz Information</h3>
            </Card.Header>
            <Card.Content className="space-y-4">
              <Input
                label="Quiz Title *"
                {...register('title')}
                error={errors.title?.message}
                placeholder="e.g., Midterm Quiz - Drug Policy Fundamentals"
                fullWidth
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full input"
                  placeholder="Brief description of the quiz..."
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructions *
                </label>
                <textarea
                  {...register('instructions')}
                  rows={4}
                  className="w-full input"
                  placeholder="Detailed instructions for students taking the quiz..."
                />
                {errors.instructions && (
                  <p className="text-red-500 text-sm mt-1">{errors.instructions.message}</p>
                )}
              </div>
            </Card.Content>
          </Card>

          {/* Quiz Settings */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Quiz Settings</h3>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Available From *"
                  type="datetime-local"
                  {...register('availableFrom')}
                  error={errors.availableFrom?.message}
                  fullWidth
                />
                <Input
                  label="Due Date *"
                  type="datetime-local"
                  {...register('dueDate')}
                  error={errors.dueDate?.message}
                  fullWidth
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Available Until"
                  type="datetime-local"
                  {...register('availableUntil')}
                  error={errors.availableUntil?.message}
                  placeholder="Optional"
                  fullWidth
                />
                <Input
                  label="Time Limit (minutes)"
                  type="number"
                  {...register('timeLimit', { valueAsNumber: true })}
                  error={errors.timeLimit?.message}
                  min="1"
                  max="480"
                  placeholder="Optional"
                  fullWidth
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Max Attempts *"
                  type="number"
                  {...register('maxAttempts', { valueAsNumber: true })}
                  error={errors.maxAttempts?.message}
                  min="1"
                  max="10"
                  fullWidth
                />
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Total Points:</span>
                  <span className="text-lg font-bold text-primary-600">{calculateTotalPoints()}</span>
                </div>
              </div>

              {/* Quiz Options */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">Quiz Options</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="shuffleQuestions"
                      {...register('shuffleQuestions')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      aria-label="Shuffle questions in quiz"
                    />
                    <label htmlFor="shuffleQuestions" className="text-sm font-medium text-gray-700">
                      Shuffle questions
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="shuffleOptions"
                      {...register('shuffleOptions')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      aria-label="Shuffle answer options in quiz"
                    />
                    <label htmlFor="shuffleOptions" className="text-sm font-medium text-gray-700">
                      Shuffle answer options
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="showCorrectAnswers"
                      {...register('showCorrectAnswers')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      aria-label="Show correct answers after submission"
                    />
                    <label htmlFor="showCorrectAnswers" className="text-sm font-medium text-gray-700">
                      Show correct answers after submission
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="allowReview"
                      {...register('allowReview')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      aria-label="Allow students to review their answers"
                    />
                    <label htmlFor="allowReview" className="text-sm font-medium text-gray-700">
                      Allow students to review their answers
                    </label>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isPublished"
                    {...register('isPublished')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    aria-label="Publish quiz immediately"
                  />
                  <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
                    Publish quiz immediately
                  </label>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Questions */}
          <Card>
            <Card.Header>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Quiz Questions ({questions.length})</h3>
                <div className="flex space-x-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => addQuestion('multiple_choice')}>
                    <CheckSquare size={16} className="mr-1" />
                    Multiple Choice
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => addQuestion('true_false')}>
                    <CheckSquare size={16} className="mr-1" />
                    True/False
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => addQuestion('short_answer')}>
                    <Type size={16} className="mr-1" />
                    Short Answer
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => addQuestion('essay')}>
                    <FileText size={16} className="mr-1" />
                    Essay
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Content>
              {questions.length > 0 ? (
                <div className="space-y-6">
                  {questions.map((question, index) => (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          {getQuestionTypeIcon(question.type)}
                          <span className="font-medium text-gray-700">
                            Question {index + 1} - {getQuestionTypeLabel(question.type)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Input
                            label="Points"
                            type="number"
                            value={question.points}
                            onChange={(e) => updateQuestion(question.id, 'points', Number(e.target.value))}
                            min="0"
                            className="w-20"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeQuestion(question.id)}
                            aria-label={`Remove question ${index + 1}`}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Question Text *
                          </label>
                          <textarea
                            value={question.question}
                            onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                            rows={3}
                            className="w-full input"
                            placeholder="Enter your question here..."
                          />
                        </div>

                        {/* Options for multiple choice and true/false */}
                        {(question.type === 'multiple_choice' || question.type === 'true_false') && (
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Answer Options
                              </label>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addOption(question.id)}
                              >
                                <Plus size={16} className="mr-1" />
                                Add Option
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {question.options?.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    name={`correct-${question.id}`}
                                    value={optionIndex}
                                    onChange={(e) => updateQuestion(question.id, 'correctAnswer', optionIndex)}
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                                    aria-label={`Select option ${optionIndex + 1} as correct answer`}
                                  />
                                  <Input
                                    value={option}
                                    onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                                    placeholder={`Option ${optionIndex + 1}`}
                                    className="flex-1"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeOption(question.id, optionIndex)}
                                    disabled={question.options?.length === 1}
                                    aria-label={`Remove option ${optionIndex + 1}`}
                                  >
                                    <X size={16} />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Correct answer for short answer */}
                        {question.type === 'short_answer' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Correct Answer
                            </label>
                            <Input
                              value={question.correctAnswer as string || ''}
                              onChange={(e) => updateQuestion(question.id, 'correctAnswer', e.target.value)}
                              placeholder="Enter the correct answer..."
                              fullWidth
                            />
                          </div>
                        )}

                        {/* Explanation */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Explanation (Optional)
                          </label>
                          <textarea
                            value={question.explanation || ''}
                            onChange={(e) => updateQuestion(question.id, 'explanation', e.target.value)}
                            rows={2}
                            className="w-full input"
                            placeholder="Explanation for the correct answer..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <HelpCircle className="mx-auto mb-2" size={32} />
                  <p>No questions added yet</p>
                  <p className="text-sm">Click on a question type button above to add questions</p>
                </div>
              )}
            </Card.Content>
          </Card>

          {/* File Attachments */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Quiz Materials & Attachments</h3>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-gray-900">Upload Quiz Materials</p>
                    <p className="text-gray-600">PDFs, documents, images, and other resources</p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleFileUpload(e.target.files);
                        }
                      }}
                      className="hidden"
                      id="quiz-file-upload"
                    />
                    <label htmlFor="quiz-file-upload" className="inline-block cursor-pointer">
                      <div className={`px-4 py-2 border border-gray-300 rounded-md inline-flex items-center ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}>
                        <Upload size={16} className="mr-2" />
                        {isUploading ? 'Uploading...' : 'Choose Files'}
                      </div>
                    </label>
                  </div>
                </div>

                {attachments.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Uploaded Files</h4>
                    {attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(attachment.type)}
                          <div>
                            <p className="font-medium text-gray-900">{attachment.filename}</p>
                            <p className="text-sm text-gray-500">{formatFileSize(attachment.size)}</p>
                            {uploadProgress[attachment.id] !== undefined && uploadProgress[attachment.id] < 100 && (
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${uploadProgress[attachment.id]}%` }}
                                ></div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeAttachment(attachment.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || questions.length === 0}>
              <Save size={16} className="mr-2" />
              {isSubmitting ? 'Creating Quiz...' : 'Create Quiz'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuizForm;
