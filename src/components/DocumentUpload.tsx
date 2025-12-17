import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, FileText, CheckCircle, AlertCircle, Download, Eye, Trash2 } from 'lucide-react';
import { ApplicationDocument } from '@/types/application';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toaster';

interface DocumentUploadProps {
  documentType: string;
  title: string;
  description: string;
  required: boolean;
  acceptedFormats: string[];
  maxSize: number; // in MB
  currentDocument?: ApplicationDocument | null;
  onUpload: (document: ApplicationDocument) => void;
  onRemove: () => void;
  onReplace: (document: ApplicationDocument) => void;
  className?: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  documentType,
  title,
  description,
  required,
  acceptedFormats,
  maxSize,
  currentDocument,
  onUpload,
  onRemove,
  onReplace,
  className = ''
}) => {
  console.log('🔧 DocumentUpload component props:', {
    documentType,
    title,
    onUpload: typeof onUpload,
    onRemove: typeof onRemove,
    onReplace: typeof onReplace
  });
  const { addToast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Local state for immediate display
  const [localDocument, setLocalDocument] = useState<ApplicationDocument | null>(null);
  
  // Load from localStorage on mount
  useEffect(() => {
    const savedDoc = localStorage.getItem(`document_${documentType}`);
    if (savedDoc) {
      try {
        const parsedDoc = JSON.parse(savedDoc);
        setLocalDocument(parsedDoc);
      } catch (error) {
        console.error('Error loading document from localStorage:', error);
      }
    }
  }, [documentType]);
  
  // Use local document for display
  const displayDocument = localDocument || currentDocument;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    console.log('🔍 Validating file:', file.name, 'Size:', file.size, 'Type:', file.type);
    console.log('🔍 Accepted formats:', acceptedFormats);
    console.log('🔍 Max size:', maxSize, 'MB');
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      console.log('❌ File too large:', file.size, '>', maxSize * 1024 * 1024);
      return {
        isValid: false,
        error: `File size must be less than ${maxSize}MB. Current size: ${formatFileSize(file.size)}`
      };
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    console.log('🔍 File extension:', fileExtension);
    const isAcceptedFormat = acceptedFormats.some(format => 
      format.toLowerCase() === fileExtension.toLowerCase()
    );
    console.log('🔍 Is accepted format:', isAcceptedFormat);

    if (!isAcceptedFormat) {
      console.log('❌ File type not accepted');
      return {
        isValid: false,
        error: `File type not accepted. Accepted formats: ${acceptedFormats.join(', ')}`
      };
    }

    console.log('✅ File validation passed');
    return { isValid: true };
  };

  const handleFileUpload = async (file: File) => {
    try {
      console.log('🚀 handleFileUpload called with file:', file.name);
      console.log('🚀 documentType:', documentType);
      console.log('🚀 onUpload function available:', !!onUpload);
      console.log('🚀 Starting file upload for:', file.name);
      
      const validation = validateFile(file);
      if (!validation.isValid) {
        console.log('❌ File validation failed:', validation.error);
        addToast({
          type: 'error',
          title: 'Invalid File',
          message: validation.error!
        });
        return;
      }

      console.log('✅ File validation passed, starting upload...');
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        setUploadProgress(progress);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Convert file to base64 for storage
      console.log('🔄 Converting file to base64...');
      const base64 = await fileToBase64(file);
      console.log('✅ Base64 conversion completed, length:', base64.length);

      // Create document object with base64 data
      const document: ApplicationDocument = {
        id: `${documentType}-${Date.now()}`,
        name: file.name,
        filename: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date().toISOString(),
        status: 'uploaded',
        url: base64, // Store base64 data instead of blob URL
        file: file,
        base64: base64, // Add base64 field for easier access
      };

      // Save to localStorage and update local state
      localStorage.setItem(`document_${documentType}`, JSON.stringify(document));
      setLocalDocument(document);
      
      // Call the upload handler
      console.log('📤 Calling onUpload with document:', document);
      console.log('📤 onUpload function:', onUpload);
      console.log('📤 onUpload type:', typeof onUpload);
      
      if (onUpload && typeof onUpload === 'function') {
        onUpload(document);
        console.log('✅ onUpload called successfully');
      } else {
        console.error('❌ onUpload is not a function or is undefined:', onUpload);
      }
      
      // Force a small delay to ensure state updates
      setTimeout(() => {
        console.log('⏰ Delayed callback - ensuring parent state is updated');
      }, 100);

      addToast({
        type: 'success',
        title: 'File Uploaded',
        message: `${file.name} has been uploaded successfully`
      });

    } catch (error) {
      console.error('❌ Upload error:', error);
      addToast({
        type: 'error',
        title: 'Upload Failed',
        message: 'Failed to upload file. Please try again.'
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('🎯 handleFileSelect called');
    const file = event.target.files?.[0];
    if (file) {
      console.log('🎯 File selected:', file.name);
      handleFileUpload(file);
    } else {
      console.log('🎯 No file selected');
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    console.log('🎯 handleDrop called');
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      console.log('🎯 File dropped:', file.name);
      handleFileUpload(file);
    } else {
      console.log('🎯 No files dropped');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleReplace = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="text-red-500" size={20} />;
    if (fileType.includes('word') || fileType.includes('document')) return <FileText className="text-blue-500" size={20} />;
    if (fileType.includes('image')) return <FileText className="text-green-500" size={20} />;
    return <FileText className="text-gray-500" size={20} />;
  };

  const getStatusIcon = () => {
    if (displayDocument) {
      return <CheckCircle className="text-green-600" size={20} />;
    }
    return required ? 
      <AlertCircle className="text-red-600" size={20} /> : 
      <FileText className="text-gray-400" size={20} />;
  };

  const getStatusText = () => {
    if (displayDocument) {
      return 'Uploaded';
    }
    return required ? 'Required' : 'Optional';
  };

  const getStatusColor = () => {
    if (displayDocument) {
      return 'bg-green-100 text-green-800';
    }
    return required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Document Header */}
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 mt-1">
          {getStatusIcon()}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-medium text-gray-900">{title}</h4>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
          
          <div className="text-xs text-gray-500 mb-3">
            Accepted formats: {acceptedFormats.join(', ')} | Max size: {maxSize}MB
          </div>
          
          {/* Test Button */}
          <div className="mb-3">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => {
                const testDoc = {
                  id: 'test-' + Date.now(),
                  name: 'Test Document.pdf',
                  filename: 'Test Document.pdf',
                  type: 'application/pdf',
                  size: 1024,
                  uploadDate: new Date().toISOString(),
                  status: 'uploaded' as const,
                  url: 'data:application/pdf;base64,test',
                  base64: 'data:application/pdf;base64,test'
                };
                localStorage.setItem(`document_${documentType}`, JSON.stringify(testDoc));
                setLocalDocument(testDoc);
                onUpload(testDoc);
              }}
            >
              🧪 Test Upload Callback
            </Button>
          </div>

          {/* Upload Area */}
          {displayDocument ? (
            <div className="space-y-3">
              {/* Uploaded Document Display */}
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  {getFileIcon(displayDocument.type)}
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      {displayDocument.name}
                    </p>
                    <p className="text-xs text-green-700">
                      {formatFileSize(displayDocument.size)} • Uploaded on {new Date(displayDocument.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => {
                    if (displayDocument.base64) {
                      // Create a blob from base64 and open it
                      const byteCharacters = atob(displayDocument.base64.split(',')[1]);
                      const byteNumbers = new Array(byteCharacters.length);
                      for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                      }
                      const byteArray = new Uint8Array(byteNumbers);
                      const blob = new Blob([byteArray], { type: displayDocument.type });
                      const url = URL.createObjectURL(blob);
                      window.open(url, '_blank');
                    }
                  }}>
                    <Eye size={14} className="mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => {
                    if (displayDocument.base64) {
                      // Create a blob from base64 and download it
                      const byteCharacters = atob(displayDocument.base64.split(',')[1]);
                      const byteNumbers = new Array(byteCharacters.length);
                      for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                      }
                      const byteArray = new Uint8Array(byteNumbers);
                      const blob = new Blob([byteArray], { type: displayDocument.type });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = displayDocument.filename || displayDocument.name;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                    }
                  }}>
                    <Download size={14} className="mr-1" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleReplace}>
                    <Upload size={14} className="mr-1" />
                    Replace
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => {
                    localStorage.removeItem(`document_${documentType}`);
                    setLocalDocument(null);
                    onRemove();
                  }} className="text-red-600 hover:text-red-700">
                    <Trash2 size={14} className="mr-1" />
                    Remove
                  </Button>
                </div>
              </div>

              {/* Upload Progress (if replacing) */}
              {isUploading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <Upload className="text-blue-600 animate-pulse" size={16} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900">Uploading new file...</p>
                      <div className="w-full bg-blue-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Upload Drop Zone */}
              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                  dragActive 
                    ? 'border-primary-400 bg-primary-50' 
                    : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept={acceptedFormats.join(',')}
                  className="hidden"
                />
                
                {isUploading ? (
                  <div className="space-y-3">
                    <Upload className="mx-auto text-blue-600 animate-pulse" size={32} />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Uploading...</p>
                      <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="mx-auto text-gray-400" size={32} />
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        Click to upload {title.toLowerCase()}
                      </p>
                      <p className="text-xs text-gray-500">
                        or drag and drop file here
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* File Requirements */}
              <div className="text-xs text-gray-500 text-center">
                <p>Accepted formats: {acceptedFormats.join(', ')}</p>
                <p>Maximum file size: {maxSize}MB</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;