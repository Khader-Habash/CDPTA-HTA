import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AssignmentCreationData, AssignmentAttachment, AssignmentRubric, RubricCriteria, RubricLevel } from '@/types/courseManagement';
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
  FileCheck
} from 'lucide-react';

// Validation schema for assignment creation
const assignmentSchema = z.object({
  title: z.string().min(3, 'Assignment title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.enum(['assignment', 'quiz', 'exam', 'project']),
  instructions: z.string().min(10, 'Instructions must be at least 10 characters'),
  dueDate: z.string().min(1, 'Due date is required').refine((val) => {
    // Check if the date string is valid
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, 'Please enter a valid due date'),
  availableFrom: z.string().min(1, 'Available from date is required').refine((val) => {
    // Check if the date string is valid
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, 'Please enter a valid available from date'),
  totalPoints: z.number().min(1, 'Total points must be at least 1').max(1000, 'Total points cannot exceed 1000'),
  timeLimit: z.number().min(1).max(480).optional().or(z.nan()).transform(val => isNaN(val) ? undefined : val), // max 8 hours
  maxAttempts: z.number().min(1, 'Max attempts must be at least 1').max(10, 'Max attempts cannot exceed 10'),
  isGroupWork: z.boolean().optional(),
  allowLateSubmissions: z.boolean().optional(),
  latePenalty: z.number().min(0).max(100).optional().or(z.nan()).transform(val => isNaN(val) ? undefined : val),
  isPublished: z.boolean().optional(),
}).refine((data) => {
  // Only validate date comparison if both dates are valid
  try {
    const availableDate = new Date(data.availableFrom);
    const dueDate = new Date(data.dueDate);
    return availableDate < dueDate;
  } catch {
    return true; // Let individual field validation handle invalid dates
  }
}, {
  message: "Due date must be after available from date",
  path: ["dueDate"],
});

type AssignmentFormData = z.infer<typeof assignmentSchema>;

interface AddAssignmentFormProps {
  courseId: string;
  onClose: () => void;
  onSave: (assignmentData: AssignmentCreationData) => void;
}

const AddAssignmentForm: React.FC<AddAssignmentFormProps> = ({ courseId, onClose, onSave }) => {
  const { addToast } = useToast();
  const [attachments, setAttachments] = useState<AssignmentAttachment[]>([]);
  const [rubricCriteria, setRubricCriteria] = useState<RubricCriteria[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      type: 'assignment' as const,
      instructions: '',
      dueDate: '',
      availableFrom: '',
      totalPoints: 100,
      maxAttempts: 1,
      timeLimit: undefined,
      isGroupWork: false,
      allowLateSubmissions: true,
      latePenalty: 10,
      isPublished: false,
    },
  });

  const watchedType = watch('type');
  const watchedIsGroupWork = watch('isGroupWork');
  const watchedAllowLateSubmissions = watch('allowLateSubmissions');

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

  // Rubric management
  const addRubricCriteria = () => {
    const newCriteria: RubricCriteria = {
      id: `criteria-${Date.now()}`,
      name: '',
      description: '',
      points: 0,
      levels: [
        { id: 'excellent', name: 'Excellent', description: '', points: 0 },
        { id: 'good', name: 'Good', description: '', points: 0 },
        { id: 'satisfactory', name: 'Satisfactory', description: '', points: 0 },
        { id: 'needs-improvement', name: 'Needs Improvement', description: '', points: 0 },
      ],
    };
    setRubricCriteria(prev => [...prev, newCriteria]);
  };

  const updateRubricCriteria = (id: string, field: keyof RubricCriteria, value: any) => {
    setRubricCriteria(prev => prev.map(criteria => 
      criteria.id === id ? { ...criteria, [field]: value } : criteria
    ));
  };

  const removeRubricCriteria = (id: string) => {
    setRubricCriteria(prev => prev.filter(criteria => criteria.id !== id));
  };

  const updateRubricLevel = (criteriaId: string, levelId: string, field: keyof RubricLevel, value: any) => {
    setRubricCriteria(prev => prev.map(criteria => 
      criteria.id === criteriaId 
        ? {
            ...criteria,
            levels: criteria.levels.map(level =>
              level.id === levelId ? { ...level, [field]: value } : level
            )
          }
        : criteria
    ));
  };

  const onSubmit = async (data: AssignmentFormData) => {
    try {
      const assignmentData: AssignmentCreationData = {
        ...data,
        courseId,
        attachments,
        rubric: rubricCriteria.length > 0 ? {
          criteria: rubricCriteria,
          totalPoints: rubricCriteria.reduce((sum, criteria) => sum + criteria.points, 0),
        } : undefined,
      };

      await onSave(assignmentData);
      
      addToast({
        type: 'success',
        title: 'Assignment created successfully',
        message: 'Your assignment has been created and saved as draft'
      });
      
      onClose();
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to create assignment',
        message: error instanceof Error ? error.message : 'An error occurred while creating the assignment'
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Create New Assignment</h2>
            <Button variant="outline" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
          {/* Basic Information */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Basic Information</h3>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Assignment Title *"
                  {...register('title')}
                  error={errors.title?.message}
                  placeholder="e.g., Policy Analysis Paper"
                  fullWidth
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment Type *
                  </label>
                  <select
                    {...register('type')}
                    className="w-full input"
                  >
                    <option value="assignment">Assignment</option>
                    <option value="quiz">Quiz</option>
                    <option value="exam">Exam</option>
                    <option value="project">Project</option>
                  </select>
                  {errors.type && (
                    <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full input"
                  placeholder="Brief description of the assignment..."
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
                  placeholder="Detailed instructions for students..."
                />
                {errors.instructions && (
                  <p className="text-red-500 text-sm mt-1">{errors.instructions.message}</p>
                )}
              </div>
            </Card.Content>
          </Card>

          {/* Assignment Settings */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Assignment Settings</h3>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Total Points *"
                  type="number"
                  {...register('totalPoints', { valueAsNumber: true })}
                  error={errors.totalPoints?.message}
                  min="1"
                  max="1000"
                  fullWidth
                />
                <Input
                  label="Max Attempts *"
                  type="number"
                  {...register('maxAttempts', { valueAsNumber: true })}
                  error={errors.maxAttempts?.message}
                  min="1"
                  max="10"
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

              {/* Assignment Options */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isGroupWork"
                    {...register('isGroupWork')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isGroupWork" className="text-sm font-medium text-gray-700">
                    Allow group work
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="allowLateSubmissions"
                    {...register('allowLateSubmissions')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="allowLateSubmissions" className="text-sm font-medium text-gray-700">
                    Allow late submissions
                  </label>
                </div>

                {watchedAllowLateSubmissions && (
                  <div className="ml-6">
                    <Input
                      label="Late Penalty (%)"
                      type="number"
                      {...register('latePenalty', { valueAsNumber: true })}
                      error={errors.latePenalty?.message}
                      min="0"
                      max="100"
                      placeholder="10"
                      className="w-32"
                    />
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isPublished"
                    {...register('isPublished')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
                    Publish assignment immediately
                  </label>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* File Attachments */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Assignment Materials & Attachments</h3>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-gray-900">Upload Assignment Materials</p>
                    <p className="text-gray-600">PDFs, documents, presentations, videos, and other resources</p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.avi,.mov,.mp3,.wav,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleFileUpload(e.target.files);
                        }
                      }}
                      className="hidden"
                      id="assignment-file-upload"
                    />
                    <label htmlFor="assignment-file-upload" className="inline-block cursor-pointer">
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

          {/* Grading Rubric */}
          <Card>
            <Card.Header>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Grading Rubric (Optional)</h3>
                <Button type="button" variant="outline" size="sm" onClick={addRubricCriteria}>
                  <Plus size={16} className="mr-1" />
                  Add Criteria
                </Button>
              </div>
            </Card.Header>
            <Card.Content>
              {rubricCriteria.length > 0 ? (
                <div className="space-y-6">
                  {rubricCriteria.map((criteria, index) => (
                    <div key={criteria.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 space-y-3">
                          <Input
                            placeholder={`Criteria ${index + 1} name`}
                            value={criteria.name}
                            onChange={(e) => updateRubricCriteria(criteria.id, 'name', e.target.value)}
                            fullWidth
                          />
                          <textarea
                            placeholder="Criteria description"
                            value={criteria.description}
                            onChange={(e) => updateRubricCriteria(criteria.id, 'description', e.target.value)}
                            rows={2}
                            className="w-full input"
                          />
                          <Input
                            label="Points"
                            type="number"
                            value={criteria.points}
                            onChange={(e) => updateRubricCriteria(criteria.id, 'points', Number(e.target.value))}
                            min="0"
                            className="w-24"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeRubricCriteria(criteria.id)}
                          className="ml-4"
                        >
                          <X size={16} />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-medium text-gray-700">Performance Levels</h5>
                        {criteria.levels.map((level) => (
                          <div key={level.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                            <Input
                              placeholder="Level name"
                              value={level.name}
                              onChange={(e) => updateRubricLevel(criteria.id, level.id, 'name', e.target.value)}
                              className="flex-1"
                            />
                            <Input
                              placeholder="Description"
                              value={level.description}
                              onChange={(e) => updateRubricLevel(criteria.id, level.id, 'description', e.target.value)}
                              className="flex-1"
                            />
                            <Input
                              placeholder="Points"
                              type="number"
                              value={level.points}
                              onChange={(e) => updateRubricLevel(criteria.id, level.id, 'points', Number(e.target.value))}
                              min="0"
                              className="w-20"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Award className="mx-auto mb-2" size={32} />
                  <p>No rubric criteria added</p>
                  <p className="text-sm">Click "Add Criteria" to create a grading rubric</p>
                </div>
              )}
            </Card.Content>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save size={16} className="mr-2" />
              {isSubmitting ? 'Creating Assignment...' : 'Create Assignment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssignmentForm;
