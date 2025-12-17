export interface CourseContent {
  id: string;
  title: string;
  type: 'lecture' | 'reading' | 'video' | 'quiz' | 'assignment' | 'discussion' | 'resource' | 'live_session';
  description?: string;
  content?: string;
  url?: string;
  duration?: number; // in minutes
  points?: number;
  dueDate?: string;
  availableFrom?: string;
  availableUntil?: string;
  isRequired: boolean;
  isCompleted: boolean;
  completedAt?: string;
  grade?: number;
  maxGrade?: number;
  submissionStatus?: 'not_submitted' | 'submitted' | 'graded' | 'late';
  attempts?: number;
  maxAttempts?: number;
  timeSpent?: number; // in minutes
  resources?: CourseResource[];
  prerequisites?: string[];
  learningObjectives?: string[];
}

export interface CourseResource {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'video' | 'audio' | 'image' | 'link' | 'other';
  url: string;
  size?: number;
  downloadable: boolean;
  description?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
  isPublished: boolean;
  availableFrom?: string;
  availableUntil?: string;
  contents: CourseContent[];
  estimatedDuration: number; // in hours
  completionPercentage: number;
  isCompleted: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions: string;
  type: 'essay' | 'multiple_choice' | 'file_upload' | 'coding' | 'presentation' | 'project';
  dueDate: string;
  availableFrom: string;
  points: number;
  maxAttempts: number;
  timeLimit?: number; // in minutes
  isGroupWork: boolean;
  rubric?: AssignmentRubric;
  submissions?: AssignmentSubmission[];
  status: 'not_started' | 'in_progress' | 'submitted' | 'graded' | 'late';
  grade?: number;
  feedback?: string;
  submittedAt?: string;
  gradedAt?: string;
}

export interface AssignmentRubric {
  criteria: Array<{
    name: string;
    description: string;
    levels: Array<{
      name: string;
      description: string;
      points: number;
    }>;
  }>;
}

export interface AssignmentSubmission {
  id: string;
  studentId: string;
  submittedAt: string;
  content?: string;
  files?: CourseResource[];
  status: 'submitted' | 'graded' | 'returned';
  grade?: number;
  feedback?: string;
  attempt: number;
}

export interface CourseProgress {
  courseId: string;
  studentId: string;
  overallProgress: number; // percentage
  timeSpent: number; // in minutes
  lastAccessed: string;
  moduleProgress: Array<{
    moduleId: string;
    progress: number;
    timeSpent: number;
    completedContents: string[];
  }>;
  grades: Array<{
    assignmentId: string;
    grade: number;
    maxGrade: number;
    submittedAt: string;
    gradedAt?: string;
  }>;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    earnedAt: string;
    icon: string;
  }>;
}

export interface CourseDetails {
  id: string;
  code: string;
  title: string;
  description: string;
  instructor: string;
  instructors: Array<{
    id: string;
    name: string;
    email: string;
    role: 'instructor' | 'assistant' | 'guest';
    avatar?: string;
  }>;
  term: string;
  credits: number;
  maxStudents: number;
  enrolledStudents: number;
  startDate: string;
  endDate: string;
  status: 'draft' | 'published' | 'archived';
  color: string;
  image?: string;
  syllabus?: string;
  modules: CourseModule[];
  assignments: Assignment[];
  announcements: Array<{
    id: string;
    title: string;
    content: string;
    publishedAt: string;
    isImportant: boolean;
  }>;
  progress?: CourseProgress;
  settings: {
    allowLateSubmissions: boolean;
    latePenalty: number; // percentage
    showGrades: boolean;
    allowDiscussions: boolean;
    requireCompletion: boolean;
  };
}

// Course Creation Types
export interface CourseCreationData {
  title: string;
  code: string;
  description: string;
  shortDescription: string;
  instructor: string;
  instructorId: string;
  category: 'Core' | 'Advanced' | 'Specialized' | 'Research' | 'Professional Development';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  credits: number;
  maxStudents: number;
  startDate: string;
  endDate: string;
  prerequisites: string[];
  learningObjectives: string[];
  courseOutline: string;
  assessmentMethods: string[];
  resources: CourseResource[];
  attachments: CourseAttachment[];
  isPublished: boolean;
  allowEnrollment: boolean;
  enrollmentDeadline?: string;
  courseImage?: File;
}

export interface CourseAttachment {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'docx' | 'ppt' | 'pptx' | 'video' | 'audio' | 'image' | 'other';
  file: File;
  size: number;
  description?: string;
  isRequired: boolean;
  uploadedAt: string;
  url?: string;
}

export interface CourseResource {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'video' | 'audio' | 'image' | 'link' | 'other';
  url: string;
  size?: number;
  downloadable: boolean;
  description?: string;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'matching' | 'ordering';
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
  explanation?: string;
  image?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  instructions: string;
  questions: QuizQuestion[];
  timeLimit?: number; // in minutes
  maxAttempts: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showCorrectAnswers: boolean;
  allowReview: boolean;
  dueDate?: string;
  availableFrom: string;
  availableUntil?: string;
}
