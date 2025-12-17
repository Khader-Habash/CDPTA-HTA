import { ApplicationDocument } from '@/types/application';
import { apiClient, apiUtils } from './apiClient';

class DocumentService {
  // Upload a document
  async uploadDocument(file: File, documentType: string): Promise<ApplicationDocument> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);

      const response = await apiUtils.post<ApplicationDocument>('/documents/upload', formData);

      return response.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw new Error('Failed to upload document');
    }
  }

  // Get document by ID
  async getDocument(documentId: string): Promise<ApplicationDocument> {
    try {
      const response = await apiUtils.get<ApplicationDocument>(`/documents/${documentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching document:', error);
      throw new Error('Failed to fetch document');
    }
  }

  // Delete document
  async deleteDocument(documentId: string): Promise<void> {
    try {
      await apiUtils.delete(`/documents/${documentId}`);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw new Error('Failed to delete document');
    }
  }

  // Download document
  async downloadDocument(documentId: string): Promise<Blob> {
    try {
      const response = await apiClient.get(`/documents/${documentId}/download`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading document:', error);
      throw new Error('Failed to download document');
    }
  }

  // Validate document
  async validateDocument(documentId: string): Promise<{ isValid: boolean; errors: string[] }> {
    try {
      const response = await apiUtils.post<{ isValid: boolean; errors: string[] }>(`/documents/${documentId}/validate`);
      return response.data;
    } catch (error) {
      console.error('Error validating document:', error);
      throw new Error('Failed to validate document');
    }
  }

  // Get document URL for viewing
  getDocumentUrl(documentId: string): string {
    return `${apiClient.defaults.baseURL}/documents/${documentId}/view`;
  }

  // Mock methods for demo purposes
  async mockUploadDocument(file: File, documentType: string): Promise<ApplicationDocument> {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create mock document
    const document: ApplicationDocument = {
      id: `${documentType}-${Date.now()}`,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date().toISOString(),
      status: 'uploaded',
      url: URL.createObjectURL(file), // Mock URL for demo
      file: file,
    };

    console.log('Mock document uploaded:', document);
    return document;
  }

  async mockValidateDocument(_documentId: string): Promise<{ isValid: boolean; errors: string[] }> {
    // Simulate validation delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock validation - always return valid for demo
    return {
      isValid: true,
      errors: []
    };
  }

  async mockDeleteDocument(documentId: string): Promise<void> {
    // Simulate deletion delay
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Mock: Document ${documentId} deleted`);
  }

  // File validation utilities
  validateFileType(file: File, acceptedTypes: string[]): boolean {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    return acceptedTypes.some(type => type.toLowerCase().includes(fileExtension));
  }

  validateFileSize(file: File, maxSizeMB: number): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

  getFileTypeIcon(fileType: string): string {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return '📊';
    return '📁';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Document type configurations
  getDocumentTypeConfig(documentType: string) {
    const configs = {
      cv: {
        title: 'Curriculum Vitae (CV)',
        description: 'Current CV highlighting your academic and professional background',
        required: true,
        acceptedFormats: ['.pdf', '.doc', '.docx'],
        maxSize: 5,
        icon: '📄'
      },
      transcript: {
        title: 'Official Transcripts',
        description: 'Official academic transcripts from your most recent degree',
        required: true,
        acceptedFormats: ['.pdf'],
        maxSize: 10,
        icon: '🎓'
      },
      personalStatement: {
        title: 'Personal Statement',
        description: 'A personal statement or cover letter explaining your motivation and goals',
        required: true,
        acceptedFormats: ['.pdf', '.doc', '.docx'],
        maxSize: 5,
        icon: '📝'
      },
      passport: {
        title: 'Passport Copy',
        description: 'Copy of passport or national ID for identity verification',
        required: false,
        acceptedFormats: ['.pdf', '.jpg', '.png'],
        maxSize: 5,
        icon: '🆔'
      },
      englishProficiency: {
        title: 'English Proficiency Certificate',
        description: 'IELTS, TOEFL, or equivalent (if applicable)',
        required: false,
        acceptedFormats: ['.pdf'],
        maxSize: 5,
        icon: '🌍'
      }
    };

    return configs[documentType as keyof typeof configs] || {
      title: 'Document',
      description: 'Upload your document',
      required: false,
      acceptedFormats: ['.pdf'],
      maxSize: 5,
      icon: '📁'
    };
  }
}

export const documentService = new DocumentService();
