import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CourseCreationData, CourseAttachment } from '@/types/course';
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
  CheckCircle
} from 'lucide-react';

// Validation schema for course creation
const courseSchema = z.object({
  title: z.string().min(3, 'Course title must be at least 3 characters'),
  code: z.string().min(2, 'Course code must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().min(5, 'Short description must be at least 5 characters'),
  instructor: z.string().min(2, 'Instructor name is required'),
  category: z.enum(['Core', 'Advanced', 'Specialized', 'Research', 'Professional Development']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  duration: z.string().min(1, 'Duration is required'),
  credits: z.number().min(1, 'Credits must be at least 1').max(10, 'Credits cannot exceed 10'),
  maxStudents: z.number().min(1, 'Maximum students must be at least 1').max(100, 'Maximum students cannot exceed 100'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  prerequisites: z.array(z.string()).optional(),
  learningObjectives: z.array(z.string()).optional(), // Made optional since we validate manually
  courseOutline: z.string().min(10, 'Course outline must be at least 10 characters'),
  assessmentMethods: z.array(z.string()).optional(), // Made optional since we validate manually
  isPublished: z.boolean().optional(),
  allowEnrollment: z.boolean().optional(),
  enrollmentDeadline: z.string().optional(),
}).refine((data) => new Date(data.startDate) < new Date(data.endDate), {
  message: "End date must be after start date",
  path: ["endDate"],
});

type CourseFormData = z.infer<typeof courseSchema>;

interface AddCourseFormProps {
  onClose: () => void;
  onSave: (courseData: CourseCreationData) => void;
}

interface CourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
}

const AddCourseForm: React.FC<AddCourseFormProps> = ({ onClose, onSave }) => {
  const { addToast } = useToast();
  const [attachments, setAttachments] = useState<CourseAttachment[]>([]);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [learningObjectives, setLearningObjectives] = useState<string[]>(['Understand the fundamentals of the subject']);
  const [assessmentMethods, setAssessmentMethods] = useState<string[]>(['Written assignments']);
  const [prerequisites, setPrerequisites] = useState<string[]>(['']);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: 'Test Course',
      code: 'TEST-101',
      description: 'This is a test course description that meets the minimum requirements.',
      shortDescription: 'Test course short description',
      instructor: 'Test Instructor',
      category: 'Core',
      difficulty: 'beginner',
      duration: '8 weeks',
      credits: 3,
      maxStudents: 25,
      startDate: '2024-03-01',
      endDate: '2024-05-01',
      courseOutline: 'This is a detailed course outline that meets the minimum requirements.',
      isPublished: false,
      allowEnrollment: true,
    },
  });

  const watchedStartDate = watch('startDate');

  // File upload handler
  const handleFileUpload = async (files: FileList) => {
    console.log('File upload started with files:', files);
    setIsUploading(true);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileId = `file-${Date.now()}-${i}`;
        
        console.log(`Processing file ${i + 1}:`, file.name, file.size, file.type);
        
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        const attachment: CourseAttachment = {
          id: fileId,
          name: file.name,
          type: getFileType(file.name),
          file,
          size: file.size,
          description: '',
          isRequired: false,
          uploadedAt: new Date().toISOString(),
        };

        console.log('Created attachment:', attachment);
        setAttachments(prev => [...prev, attachment]);
      }
      
      setIsUploading(false);
      addToast({
        type: 'success',
        title: 'Files uploaded successfully',
        message: `${files.length} file(s) uploaded`
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      setIsUploading(false);
      addToast({
        type: 'error',
        title: 'Upload failed',
        message: 'Failed to upload files. Please try again.'
      });
    }
  };

  const getFileType = (filename: string): CourseAttachment['type'] => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return 'pdf';
      case 'doc': return 'doc';
      case 'docx': return 'docx';
      case 'ppt': return 'ppt';
      case 'pptx': return 'pptx';
      case 'mp4': case 'avi': case 'mov': return 'video';
      case 'mp3': case 'wav': case 'm4a': return 'audio';
      case 'jpg': case 'jpeg': case 'png': case 'gif': return 'image';
      default: return 'other';
    }
  };

  const getFileIcon = (type: CourseAttachment['type']) => {
    switch (type) {
      case 'pdf': case 'doc': case 'docx': return <FileText className="text-red-500" size={20} />;
      case 'ppt': case 'pptx': return <FileText className="text-orange-500" size={20} />;
      case 'video': return <Video className="text-purple-500" size={20} />;
      case 'audio': return <Music className="text-green-500" size={20} />;
      case 'image': return <Image className="text-blue-500" size={20} />;
      default: return <FileText className="text-gray-500" size={20} />;
    }
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

  const addLearningObjective = () => {
    setLearningObjectives(prev => [...prev, '']);
  };

  const updateLearningObjective = (index: number, value: string) => {
    setLearningObjectives(prev => prev.map((obj, i) => i === index ? value : obj));
  };

  const removeLearningObjective = (index: number) => {
    setLearningObjectives(prev => prev.filter((_, i) => i !== index));
  };

  const addAssessmentMethod = () => {
    setAssessmentMethods(prev => [...prev, '']);
  };

  const updateAssessmentMethod = (index: number, value: string) => {
    setAssessmentMethods(prev => prev.map((method, i) => i === index ? value : method));
  };

  const removeAssessmentMethod = (index: number) => {
    setAssessmentMethods(prev => prev.filter((_, i) => i !== index));
  };

  const addPrerequisite = () => {
    setPrerequisites(prev => [...prev, '']);
  };

  // Module management functions
  const addModule = () => {
    const newModule: CourseModule = {
      id: `module-${Date.now()}`,
      title: '',
      description: '',
      order: modules.length + 1,
    };
    setModules(prev => [...prev, newModule]);
  };

  const updateModule = (id: string, field: keyof CourseModule, value: string | number) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const removeModule = (id: string) => {
    setModules(prev => prev.filter(m => m.id !== id).map((m, index) => ({ ...m, order: index + 1 })));
  };

  const updatePrerequisite = (index: number, value: string) => {
    setPrerequisites(prev => prev.map((prereq, i) => i === index ? value : prereq));
  };

  const removePrerequisite = (index: number) => {
    setPrerequisites(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CourseFormData) => {
    try {
      console.log('Form submitted with data:', data);
      console.log('Learning objectives:', learningObjectives);
      console.log('Assessment methods:', assessmentMethods);
      console.log('Prerequisites:', prerequisites);
      console.log('Modules:', modules);
      console.log('Attachments:', attachments);

      // Validate that we have at least one learning objective
      const validLearningObjectives = learningObjectives.filter(obj => obj.trim() !== '');
      if (validLearningObjectives.length === 0) {
        addToast({
          type: 'error',
          title: 'Validation Error',
          message: 'Please add at least one learning objective'
        });
        return;
      }

      // Validate that we have at least one assessment method
      const validAssessmentMethods = assessmentMethods.filter(method => method.trim() !== '');
      if (validAssessmentMethods.length === 0) {
        addToast({
          type: 'error',
          title: 'Validation Error',
          message: 'Please add at least one assessment method'
        });
        return;
      }

      const courseData: CourseCreationData = {
        ...data,
        instructorId: 'current-staff-id', // This would come from auth context
        prerequisites: prerequisites.filter(p => p.trim() !== ''),
        learningObjectives: validLearningObjectives,
        assessmentMethods: validAssessmentMethods,
        resources: [], // Convert attachments to resources if needed
        attachments,
        modules: modules.map(m => ({
          ...m,
          isPublished: false,
          contents: [],
          estimatedDuration: 0,
          completionPercentage: 0,
          isCompleted: false,
        })),
      };

      console.log('Course data prepared:', courseData);
      await onSave(courseData);
      
      addToast({
        type: 'success',
        title: 'Course created successfully',
        message: 'Your course has been created and saved as draft'
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating course:', error);
      addToast({
        type: 'error',
        title: 'Failed to create course',
        message: error instanceof Error ? error.message : 'An error occurred while creating the course'
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Create New Course</h2>
            <Button variant="outline" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit, (errors) => {
          console.log('Form validation errors:', errors);
          console.log('Form data:', watch());
          console.log('Learning objectives:', learningObjectives);
          console.log('Assessment methods:', assessmentMethods);
          console.log('Prerequisites:', prerequisites);
          console.log('Attachments:', attachments);
        })} className="p-6 space-y-8">
          {/* Basic Information */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Basic Information</h3>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Course Title *"
                  {...register('title')}
                  error={errors.title?.message}
                  placeholder="e.g., Drug Policy Fundamentals"
                  fullWidth
                />
                <Input
                  label="Course Code *"
                  {...register('code')}
                  error={errors.code?.message}
                  placeholder="e.g., DPF-101"
                  fullWidth
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    {...register('category')}
                    className="w-full input"
                  >
                    <option value="">Select category</option>
                    <option value="Core">Core</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Specialized">Specialized</option>
                    <option value="Research">Research</option>
                    <option value="Professional Development">Professional Development</option>
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level *
                  </label>
                  <select
                    {...register('difficulty')}
                    className="w-full input"
                  >
                    <option value="">Select difficulty</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  {errors.difficulty && (
                    <p className="text-red-500 text-sm mt-1">{errors.difficulty.message}</p>
                  )}
                </div>
              </div>

              <Input
                label="Short Description *"
                {...register('shortDescription')}
                error={errors.shortDescription?.message}
                placeholder="Brief description for course listings"
                fullWidth
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Description *
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full input"
                  placeholder="Detailed course description..."
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>
            </Card.Content>
          </Card>

          {/* Course Details */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Course Details</h3>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Instructor *"
                  {...register('instructor')}
                  error={errors.instructor?.message}
                  placeholder="Instructor name"
                  fullWidth
                />
                <Input
                  label="Duration *"
                  {...register('duration')}
                  error={errors.duration?.message}
                  placeholder="e.g., 8 weeks"
                  fullWidth
                />
                <Input
                  label="Credits *"
                  type="number"
                  {...register('credits', { valueAsNumber: true })}
                  error={errors.credits?.message}
                  min="1"
                  max="10"
                  fullWidth
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Start Date *"
                  type="date"
                  {...register('startDate')}
                  error={errors.startDate?.message}
                  fullWidth
                />
                <Input
                  label="End Date *"
                  type="date"
                  {...register('endDate')}
                  error={errors.endDate?.message}
                  fullWidth
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Maximum Students *"
                  type="number"
                  {...register('maxStudents', { valueAsNumber: true })}
                  error={errors.maxStudents?.message}
                  min="1"
                  max="100"
                  fullWidth
                />
                <Input
                  label="Enrollment Deadline"
                  type="date"
                  {...register('enrollmentDeadline')}
                  error={errors.enrollmentDeadline?.message}
                  fullWidth
                />
              </div>
            </Card.Content>
          </Card>

          {/* Learning Objectives */}
          <Card>
            <Card.Header>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Learning Objectives</h3>
                <Button type="button" variant="outline" size="sm" onClick={addLearningObjective}>
                  <Plus size={16} className="mr-1" />
                  Add Objective
                </Button>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                {learningObjectives.map((objective, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      value={objective}
                      onChange={(e) => updateLearningObjective(index, e.target.value)}
                      placeholder={`Learning objective ${index + 1}`}
                      fullWidth
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeLearningObjective(index)}
                      disabled={learningObjectives.length === 1}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Assessment Methods */}
          <Card>
            <Card.Header>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Assessment Methods</h3>
                <Button type="button" variant="outline" size="sm" onClick={addAssessmentMethod}>
                  <Plus size={16} className="mr-1" />
                  Add Method
                </Button>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                {assessmentMethods.map((method, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      value={method}
                      onChange={(e) => updateAssessmentMethod(index, e.target.value)}
                      placeholder={`Assessment method ${index + 1}`}
                      fullWidth
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeAssessmentMethod(index)}
                      disabled={assessmentMethods.length === 1}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Prerequisites */}
          <Card>
            <Card.Header>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Prerequisites</h3>
                <Button type="button" variant="outline" size="sm" onClick={addPrerequisite}>
                  <Plus size={16} className="mr-1" />
                  Add Prerequisite
                </Button>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                {prerequisites.map((prereq, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      value={prereq}
                      onChange={(e) => updatePrerequisite(index, e.target.value)}
                      placeholder={`Prerequisite ${index + 1}`}
                      fullWidth
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removePrerequisite(index)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Course Outline */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Course Outline</h3>
            </Card.Header>
            <Card.Content>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Course Outline *
                </label>
                <textarea
                  {...register('courseOutline')}
                  rows={6}
                  className="w-full input"
                  placeholder="Provide a detailed outline of the course content, modules, and topics..."
                />
                {errors.courseOutline && (
                  <p className="text-red-500 text-sm mt-1">{errors.courseOutline.message}</p>
                )}
              </div>
            </Card.Content>
          </Card>

          {/* Course Modules */}
          <Card>
            <Card.Header>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Course Modules</h3>
                <Button type="button" onClick={addModule} size="sm">
                  <Plus size={16} className="mr-1" />
                  Add Module
                </Button>
              </div>
            </Card.Header>
            <Card.Content>
              {modules.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No modules added yet. Click "Add Module" to create your course structure.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {modules.map((module, index) => (
                    <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Module {module.order}</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeModule(module.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <Input
                          label="Module Title *"
                          value={module.title}
                          onChange={(e) => updateModule(module.id, 'title', e.target.value)}
                          placeholder={`e.g., Introduction to ${watch('title') || 'the Course'}`}
                          fullWidth
                        />
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Module Description *
                          </label>
                          <textarea
                            value={module.description}
                            onChange={(e) => updateModule(module.id, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            rows={3}
                            placeholder="Describe what students will learn in this module..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Content>
          </Card>

          {/* File Attachments */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Course Materials & Attachments</h3>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-gray-900">Upload Course Materials</p>
                    <p className="text-gray-600">PDFs, documents, presentations, videos, and other resources</p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.avi,.mov,.mp3,.wav,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        console.log('File input changed:', e.target.files);
                        if (e.target.files && e.target.files.length > 0) {
                          handleFileUpload(e.target.files);
                        }
                      }}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="inline-block cursor-pointer">
                      <div className={`px-4 py-2 border border-gray-300 rounded-md inline-flex items-center ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}>
                        <Upload size={16} className="mr-2" />
                        {isUploading ? 'Uploading...' : 'Choose Files'}
                      </div>
                    </label>
                    <p className="text-sm text-gray-500 mt-2">Click "Choose Files" button to select files</p>
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
                            <p className="font-medium text-gray-900">{attachment.name}</p>
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

          {/* Course Settings */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Course Settings</h3>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isPublished"
                    {...register('isPublished')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
                    Publish course immediately
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="allowEnrollment"
                    {...register('allowEnrollment')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="allowEnrollment" className="text-sm font-medium text-gray-700">
                    Allow student enrollment
                  </label>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" variant="outline" onClick={() => {
              console.log('Test submit button clicked');
              console.log('Form errors:', errors);
              console.log('Form values:', watch());
              console.log('Learning objectives:', learningObjectives);
              console.log('Assessment methods:', assessmentMethods);
              console.log('Prerequisites:', prerequisites);
              console.log('Attachments:', attachments);
              
              // Test submission without validation
              const testData = {
                title: 'Test Course',
                code: 'TEST-101',
                description: 'This is a test course description that meets the minimum requirements.',
                shortDescription: 'Test course short description',
                instructor: 'Test Instructor',
                category: 'Core' as const,
                difficulty: 'beginner' as const,
                duration: '8 weeks',
                credits: 3,
                maxStudents: 25,
                startDate: '2024-03-01',
                endDate: '2024-05-01',
                courseOutline: 'This is a detailed course outline that meets the minimum requirements.',
                isPublished: false,
                allowEnrollment: true,
              };
              
              const courseData: CourseCreationData = {
                ...testData,
                instructorId: 'current-staff-id',
                prerequisites: prerequisites.filter(p => p.trim() !== ''),
                learningObjectives: learningObjectives.filter(obj => obj.trim() !== ''),
                assessmentMethods: assessmentMethods.filter(method => method.trim() !== ''),
                resources: [],
                attachments,
              };
              
              console.log('Test course data:', courseData);
              onSubmit(courseData as any);
            }}>
              Test Submit (No Validation)
            </Button>
            <Button type="submit" disabled={isSubmitting} onClick={() => {
              console.log('Submit button clicked');
              console.log('Form errors:', errors);
              console.log('Form values:', watch());
            }}>
              <Save size={16} className="mr-2" />
              {isSubmitting ? 'Creating Course...' : 'Create Course'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourseForm;
