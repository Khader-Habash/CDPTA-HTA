import React, { useState } from 'react';
import { AnnouncementType, AnnouncementPriority, Announcement } from '@/types/announcement';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  FileText,
  Tag,
  Calendar,
  User,
  AlertCircle,
  X,
  Plus,
  Save,
  Eye,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toaster';

interface AddAnnouncementFormProps {
  onSubmit?: (announcement: Partial<Announcement>) => void;
  onCancel?: () => void;
  initialData?: Partial<Announcement>;
}

const AddAnnouncementForm: React.FC<AddAnnouncementFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState<Partial<Announcement>>({
    title: initialData?.title || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    type: initialData?.type || AnnouncementType.GENERAL,
    priority: initialData?.priority || AnnouncementPriority.MEDIUM,
    isImportant: initialData?.isImportant || false,
    isPublished: initialData?.isPublished || false,
    tags: initialData?.tags || [],
    targetAudience: initialData?.targetAudience || [],
    expiresAt: initialData?.expiresAt || '',
  });

  const [newTag, setNewTag] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (
    field: keyof Announcement,
    value: string | boolean | AnnouncementType | AnnouncementPriority
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove),
    }));
  };

  const toggleTargetAudience = (role: string) => {
    setFormData((prev) => {
      const currentAudience = prev.targetAudience || [];
      if (currentAudience.includes(role)) {
        return {
          ...prev,
          targetAudience: currentAudience.filter((r) => r !== role),
        };
      } else {
        return {
          ...prev,
          targetAudience: [...currentAudience, role],
        };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title?.trim()) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please enter a title for the announcement',
      });
      return;
    }

    if (!formData.content?.trim()) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please enter content for the announcement',
      });
      return;
    }

    // Generate excerpt if not provided
    if (!formData.excerpt?.trim() && formData.content) {
      const excerpt = formData.content.substring(0, 150) + 
        (formData.content.length > 150 ? '...' : '');
      formData.excerpt = excerpt;
    }

    onSubmit?.(formData);

    addToast({
      type: 'success',
      title: 'Success',
      message: `Announcement ${formData.isPublished ? 'published' : 'saved as draft'} successfully`,
    });
  };

  const targetAudienceOptions = [
    { value: 'applicant', label: 'Applicants' },
    { value: 'fellow', label: 'Fellows' },
    { value: 'staff', label: 'Staff' },
    { value: 'admin', label: 'Administrators' },
  ];

  return (
    <div className="space-y-6">
      {!showPreview ? (
        <form onSubmit={handleSubmit}>
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {initialData ? 'Edit Announcement' : 'Create New Announcement'}
                </h2>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(true)}
                  >
                    <Eye size={16} className="mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <Input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter announcement title"
                    required
                  />
                </div>

                {/* Type and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        handleInputChange('type', e.target.value as AnnouncementType)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      <option value={AnnouncementType.GENERAL}>General</option>
                      <option value={AnnouncementType.APPLICATION}>Application</option>
                      <option value={AnnouncementType.PROGRAM}>Program</option>
                      <option value={AnnouncementType.EVENT}>Event</option>
                      <option value={AnnouncementType.RESEARCH}>Research</option>
                      <option value={AnnouncementType.PARTNERSHIP}>Partnership</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority *
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        handleInputChange('priority', e.target.value as AnnouncementPriority)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      <option value={AnnouncementPriority.LOW}>Low</option>
                      <option value={AnnouncementPriority.MEDIUM}>Medium</option>
                      <option value={AnnouncementPriority.HIGH}>High</option>
                      <option value={AnnouncementPriority.URGENT}>Urgent</option>
                    </select>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Enter announcement content"
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                {/* Excerpt (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt (Optional)
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    placeholder="Brief summary (auto-generated if left empty)"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This will be displayed in list views
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex items-center space-x-2 mb-2">
                    <Input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <Plus size={16} />
                    </Button>
                  </div>
                  {formData.tags && formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                        >
                          <Tag size={12} className="mr-1" />
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-primary-600 hover:text-primary-800"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Target Audience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience (Optional)
                  </label>
                  <div className="space-y-2">
                    {targetAudienceOptions.map((option) => (
                      <label key={option.value} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.targetAudience?.includes(option.value) || false}
                          onChange={() => toggleTargetAudience(option.value)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to show to all users
                  </p>
                </div>

                {/* Expiration Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiration Date (Optional)
                  </label>
                  <Input
                    type="datetime-local"
                    value={formData.expiresAt}
                    onChange={(e) => handleInputChange('expiresAt', e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Announcement will be hidden after this date
                  </p>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3 border-t pt-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isImportant || false}
                      onChange={(e) => handleInputChange('isImportant', e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 font-medium">
                      Mark as Important
                    </span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isPublished || false}
                      onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 font-medium">
                      Publish Immediately
                    </span>
                  </label>
                </div>
              </div>
            </Card.Content>
            <Card.Footer>
              <div className="flex items-center justify-end space-x-3">
                {onCancel && (
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                )}
                <Button type="submit" variant="default">
                  <Save size={16} className="mr-2" />
                  {formData.isPublished ? 'Publish' : 'Save Draft'}
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </form>
      ) : (
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Preview</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(false)}
              >
                <X size={16} className="mr-2" />
                Close Preview
              </Button>
            </div>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                {formData.isImportant && (
                  <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                    <AlertCircle size={12} className="mr-1" />
                    Important
                  </span>
                )}
                <span className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded">
                  {formData.type}
                </span>
                <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                  {formData.priority} priority
                </span>
              </div>

              <h3 className="text-2xl font-bold text-gray-900">{formData.title}</h3>

              {formData.excerpt && (
                <p className="text-gray-600 italic">{formData.excerpt}</p>
              )}

              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{formData.content}</p>
              </div>

              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      <Tag size={10} className="mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {formData.targetAudience && formData.targetAudience.length > 0 && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    <User size={14} className="inline mr-1" />
                    Target: {formData.targetAudience.join(', ')}
                  </p>
                </div>
              )}

              {formData.expiresAt && (
                <div className="text-sm text-gray-600">
                  <Calendar size={14} className="inline mr-1" />
                  Expires: {new Date(formData.expiresAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  );
};

export default AddAnnouncementForm;














