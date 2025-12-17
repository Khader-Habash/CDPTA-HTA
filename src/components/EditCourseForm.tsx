import React, { useState, useEffect } from 'react';
import { CourseCreationData } from '@/types/course';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toaster';
import { X, Save, Plus, Trash2 } from 'lucide-react';

interface EditCourseFormProps {
  course: CourseCreationData;
  onSave: (courseData: CourseCreationData) => void;
  onCancel: () => void;
}

const EditCourseForm: React.FC<EditCourseFormProps> = ({ course, onSave, onCancel }) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState<CourseCreationData>(course);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof CourseCreationData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleModuleChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((module, i) => 
        i === index ? { ...module, [field]: value } : module
      )
    }));
  };

  const handleContentChange = (moduleIndex: number, contentIndex: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((module, i) => 
        i === moduleIndex 
          ? {
              ...module,
              contents: module.contents.map((content, j) => 
                j === contentIndex ? { ...content, [field]: value } : content
              )
            }
          : module
      )
    }));
  };

  const addModule = () => {
    const newModule = {
      id: `module-${Date.now()}`,
      title: '',
      description: '',
      order: formData.modules.length + 1,
      contents: [
        {
          id: `content-${Date.now()}`,
          title: '',
          type: 'lecture' as const,
          description: '',
          duration: 30,
          isRequired: true,
          isCompleted: false,
        }
      ],
      isCompleted: false,
    };

    setFormData(prev => ({
      ...prev,
      modules: [...prev.modules, newModule]
    }));
  };

  const removeModule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index)
    }));
  };

  const addContent = (moduleIndex: number) => {
    const newContent = {
      id: `content-${Date.now()}`,
      title: '',
      type: 'lecture' as const,
      description: '',
      duration: 30,
      isRequired: true,
      isCompleted: false,
    };

    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((module, i) => 
        i === moduleIndex 
          ? { ...module, contents: [...module.contents, newContent] }
          : module
      )
    }));
  };

  const removeContent = (moduleIndex: number, contentIndex: number) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((module, i) => 
        i === moduleIndex 
          ? { ...module, contents: module.contents.filter((_, j) => j !== contentIndex) }
          : module
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        addToast({
          type: 'error',
          title: 'Validation Error',
          message: 'Course title is required'
        });
        return;
      }

      if (!formData.code.trim()) {
        addToast({
          type: 'error',
          title: 'Validation Error',
          message: 'Course code is required'
        });
        return;
      }

      onSave(formData);
      addToast({
        type: 'success',
        title: 'Course Updated',
        message: 'Course has been updated successfully'
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update course'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <Card.Header className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Edit Course</h2>
          <Button variant="outline" size="sm" onClick={onCancel}>
            <X size={16} />
          </Button>
        </Card.Header>
        
        <Card.Content>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Course Title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
              
              <Input
                label="Course Code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                required
              />
              
              <Input
                label="Instructor"
                value={formData.instructor}
                onChange={(e) => handleInputChange('instructor', e.target.value)}
                required
              />
              
              <Input
                label="Term"
                value={formData.term}
                onChange={(e) => handleInputChange('term', e.target.value)}
                required
              />
              
              <Input
                label="Credits"
                type="number"
                value={formData.credits}
                onChange={(e) => handleInputChange('credits', parseInt(e.target.value))}
                required
              />
              
              <Input
                label="Max Students"
                type="number"
                value={formData.maxStudents}
                onChange={(e) => handleInputChange('maxStudents', parseInt(e.target.value))}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                required
              />
              
              <Input
                label="End Date"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Syllabus
              </label>
              <textarea
                value={formData.syllabus || ''}
                onChange={(e) => handleInputChange('syllabus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
            </div>

            {/* Course Modules */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Course Modules</h3>
                <Button type="button" onClick={addModule} size="sm">
                  <Plus size={16} className="mr-2" />
                  Add Module
                </Button>
              </div>

              <div className="space-y-4">
                {formData.modules.map((module, moduleIndex) => (
                  <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Module {moduleIndex + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeModule(moduleIndex)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Input
                        label="Module Title"
                        value={module.title}
                        onChange={(e) => handleModuleChange(moduleIndex, 'title', e.target.value)}
                        required
                      />
                      
                      <Input
                        label="Order"
                        type="number"
                        value={module.order}
                        onChange={(e) => handleModuleChange(moduleIndex, 'order', parseInt(e.target.value))}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Module Description
                      </label>
                      <textarea
                        value={module.description}
                        onChange={(e) => handleModuleChange(moduleIndex, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                      />
                    </div>

                    {/* Module Contents */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-700">Contents</h5>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addContent(moduleIndex)}
                        >
                          <Plus size={14} className="mr-1" />
                          Add Content
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {module.contents.map((content, contentIndex) => (
                          <div key={content.id} className="bg-gray-50 p-3 rounded">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Content {contentIndex + 1}</span>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeContent(moduleIndex, contentIndex)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              <Input
                                label="Title"
                                value={content.title}
                                onChange={(e) => handleContentChange(moduleIndex, contentIndex, 'title', e.target.value)}
                                size="sm"
                              />
                              
                              <select
                                value={content.type}
                                onChange={(e) => handleContentChange(moduleIndex, contentIndex, 'type', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              >
                                <option value="lecture">Lecture</option>
                                <option value="reading">Reading</option>
                                <option value="video">Video</option>
                                <option value="quiz">Quiz</option>
                                <option value="assignment">Assignment</option>
                                <option value="discussion">Discussion</option>
                                <option value="resource">Resource</option>
                                <option value="live_session">Live Session</option>
                              </select>
                              
                              <Input
                                label="Duration (min)"
                                type="number"
                                value={content.duration}
                                onChange={(e) => handleContentChange(moduleIndex, contentIndex, 'duration', parseInt(e.target.value))}
                                size="sm"
                              />
                            </div>

                            <div className="mt-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                              </label>
                              <textarea
                                value={content.description}
                                onChange={(e) => handleContentChange(moduleIndex, contentIndex, 'description', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                rows={2}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                <Save size={16} className="mr-2" />
                Update Course
              </Button>
            </div>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
};

export default EditCourseForm;




