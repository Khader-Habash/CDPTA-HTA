export interface ApplicationFormData {
  // Personal Information
  personalInfo: {
    title: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    nationality: string;
    countryOfResidence: string;
    phone: string;
    email: string;
    alternativeEmail?: string;
    // KHCC Staff Information
    isKHCCStaff: boolean;
    khccStaffId?: string;
  };

  // Educational Background
  education: {
    currentLevel: string;
    institution: string;
    fieldOfStudy: string;
    graduationDate: string;
    gpa?: string;
    transcriptUploaded: boolean;
    previousEducation: Array<{
      id: string;
      institution: string;
      degree: string;
      fieldOfStudy: string;
      graduationDate: string;
      grade?: string;
    }>;
  };

  // Professional Experience
  experience: {
    workExperience: Array<{
      id: string;
      company: string;
      position: string;
      startDate: string;
      endDate?: string;
      isCurrent: boolean;
      description: string;
      location: string;
    }>;
    skills: string[];
    languages: Array<{
      language: string;
      proficiency: 'basic' | 'intermediate' | 'advanced' | 'native';
    }>;
  };

  // Program Information
  programInfo: {
    programType: string;
    preferredStartDate: string;
    studyMode: 'full-time' | 'part-time' | 'online';
    campus: string;
    specialization?: string;
    previousApplications: boolean;
    fundingSource: string;
    // New fields
    canTravel: boolean;
    travelReason?: string;
    whyJoinCDPTA: string;
    engagedInCDPTAProjects: boolean;
    projectDetails?: string;
  };

  // Personal Statement & Essays (Optional - simplified)
  essays: {
    personalStatement: string;
    motivationLetter: string;
    careerGoals: string;
    whyThisProgram: string;
    additionalInfo?: string;
  };

  // References (Optional - simplified)
  references: Array<{
    id: string;
    type: 'academic' | 'professional' | 'personal';
    name: string;
    title: string;
    organization: string;
    email: string;
    phone: string;
    relationship: string;
    yearsKnown: number;
    submitted: boolean;
  }>;

  // Essay/Statement of Purpose (Optional - simplified)
  essay: {
    statementOfPurpose: string;
    researchInterests: string;
    careerGoals: string;
    whyThisProgram: string;
  };

  // Documents
  documents: {
    cv: ApplicationDocument | null;
    transcript: ApplicationDocument | null;
    motivationLetter: ApplicationDocument | null;
    letterOfInterest: ApplicationDocument | null; // New required field
    additionalDocuments: ApplicationDocument[];
  };

  // Application Metadata
  metadata: {
    currentStep: number;
    totalSteps: number;
    completedSteps: number[];
    lastSaved: string;
    status: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected';
    submissionDate?: string;
    applicationId?: string;
  };
}

export interface ApplicationDocument {
  id: string;
  name: string;
  filename?: string;
  type: string;
  size: number;
  uploadDate: string;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  url?: string;
  file?: File;
  base64?: string; // Base64 encoded file data for storage
  rejectionReason?: string;
}

export interface ApplicationStep {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isRequired: boolean;
  validationFields: string[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface UploadProgress {
  [documentId: string]: {
    progress: number;
    isUploading: boolean;
    error?: string;
  };
}

// Program Information Types
export interface ProgramInfo {
  id: string;
  title: string;
  description: string;
  duration: string;
  startDate: string;
  applicationDeadline: string;
  isApplicationOpen: boolean;
  curriculum: CurriculumModule[];
  faculty: FacultyMember[];
  studentResources: StudentResource[];
  requirements: string[];
  benefits: string[];
}

export interface CurriculumModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  credits: number;
  prerequisites?: string[];
  objectives: string[];
}

export interface FacultyMember {
  id: string;
  name: string;
  title: string;
  department: string;
  specialization: string[];
  bio: string;
  email: string;
  imageUrl?: string;
  publications?: string[];
  researchInterests: string[];
}

export interface StudentResource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'link' | 'video' | 'tool';
  url?: string;
  downloadUrl?: string;
  category: 'academic' | 'research' | 'career' | 'support';
}

// Application Window Management
export interface ApplicationWindow {
  id: string;
  programId: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  isOpen: boolean;
  maxApplications?: number;
  currentApplications: number;
}
