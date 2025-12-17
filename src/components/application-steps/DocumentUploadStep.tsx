import React from 'react';
import { ApplicationFormData } from '@/types/application';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import DocumentUpload from '@/components/DocumentUpload';
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  Download
} from 'lucide-react';

interface DocumentUploadStepProps {
  data: ApplicationFormData;
  onChange: (data: Partial<ApplicationFormData>) => void;
  errors?: (string | { field: string; message: string })[];
}

const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({ 
  data, 
  onChange,
  errors = [] 
}) => {
  console.log('🔍 DocumentUploadStep - Data received:', data);
  console.log('🔍 DocumentUploadStep - Documents data:', data.documents);
  
  const updateDocument = (documentType: string, document: any) => {
    console.log('📥 DocumentUploadStep - updateDocument called:', documentType, document);
    console.log('📥 Current documents data:', data.documents);
    
    const updatedDocuments = {
      ...data.documents,
      [documentType]: document,
    };
    
    console.log('📥 Updated documents data:', updatedDocuments);
    
    onChange({
      documents: updatedDocuments,
    });
    
    console.log('📥 onChange called with documents data');
  };

  const removeDocument = (documentType: string) => {
    onChange({
      documents: {
        ...data.documents,
        [documentType]: null,
      },
    });
  };

  const requiredDocuments = [
    {
      key: 'letterOfInterest',
      title: 'Letter of Interest (PDF)',
      description: 'Upload your letter of interest as a PDF file (Required)',
      required: true,
      acceptedFormats: ['.pdf'],
      maxSize: 5
    },
    {
      key: 'cv',
      title: 'Curriculum Vitae (CV)',
      description: 'Current CV highlighting your academic and professional background (Required)',
      required: true,
      acceptedFormats: ['.pdf', '.doc', '.docx'],
      maxSize: 5
    },
    {
      key: 'transcript',
      title: 'Official Transcripts',
      description: 'Official academic transcripts from your most recent degree (Optional)',
      required: false,
      acceptedFormats: ['.pdf'],
      maxSize: 10
    }
  ];

  const getDocumentStatus = (documentKey: string) => {
    const document = data.documents[documentKey as keyof typeof data.documents];
    if (document) {
      return 'uploaded';
    }
    return 'pending';
  };

  const getStatusIcon = (status: string, required: boolean) => {
    switch (status) {
      case 'uploaded':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'pending':
        return required ? 
          <AlertCircle className="text-red-600" size={20} /> : 
          <FileText className="text-gray-400" size={20} />;
      default:
        return <FileText className="text-gray-400" size={20} />;
    }
  };

  const getStatusText = (status: string, required: boolean) => {
    switch (status) {
      case 'uploaded':
        return 'Uploaded';
      case 'pending':
        return required ? 'Required' : 'Optional';
      default:
        return 'Pending';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Upload</h2>
        <p className="text-gray-600">
          Upload your documents (optional). Ensure files are in the accepted formats and within size limits.
        </p>
      </div>

      {/* Upload Instructions */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold">Upload Instructions</h3>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">File Requirements</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Maximum file size: 10MB per document</li>
                <li>• Accepted formats: PDF, DOC, DOCX for text documents</li>
                <li>• JPG, PNG accepted for images</li>
                <li>• Files should be clear and legible</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Important Notes</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• All documents should be in English or officially translated</li>
                <li>• Transcripts must be official/certified copies</li>
                <li>• KHCC staff may have expedited processing</li>
                <li>• You can replace documents before final submission</li>
              </ul>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Document Upload Sections */}
      <div className="space-y-4">
        {requiredDocuments.map((doc) => {
          const uploadedDoc = data.documents[doc.key as keyof typeof data.documents];
          console.log(`🔍 DocumentUploadStep - ${doc.key} uploadedDoc:`, uploadedDoc);
          
          return (
            <Card key={doc.key}>
              <Card.Content>
                <DocumentUpload
                  documentType={doc.key}
                  title={doc.title}
                  description={doc.description}
                  required={doc.required}
                  acceptedFormats={doc.acceptedFormats}
                  maxSize={doc.maxSize}
                  currentDocument={uploadedDoc}
                  onUpload={(document) => {
                    console.log('🔗 DocumentUploadStep - onUpload callback called for:', doc.key, document);
                    updateDocument(doc.key, document);
                  }}
                  onRemove={() => removeDocument(doc.key)}
                  onReplace={(document) => updateDocument(doc.key, document)}
                />
              </Card.Content>
            </Card>
          );
        })}
      </div>

      {/* KHCC Staff Notice */}
      {data.personalInfo.isKHCCStaff && (
        <Card>
          <Card.Content className="bg-purple-50 border border-purple-200">
            <div className="flex items-start space-x-3">
              <div className="text-purple-600">👤</div>
              <div>
                <h4 className="font-medium text-purple-900">KHCC Staff Priority Processing</h4>
                <p className="text-purple-700 text-sm">
                  As a KHCC staff member (ID: {data.personalInfo.khccStaffId}), your documents may receive expedited review. 
                  Please ensure all required documents are uploaded for faster processing.
                </p>
              </div>
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Error Display */}
      {errors.length > 0 && (
        <Card>
          <Card.Content className="bg-red-50 border border-red-200">
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-red-600 mt-1" size={20} />
              <div>
                <h4 className="font-medium text-red-900">Document Upload Issues:</h4>
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

export default DocumentUploadStep;
