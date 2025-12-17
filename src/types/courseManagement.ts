export interface Course {
  id: string;
  title: string;
  description: string;
  code: string;
  instructor: string;
  instructorId: string;
  duration: string;
  startDate: string;
  endDate: string;
  maxStudents: number;
  enrolledStudents: number;
  status: 'draft' | 'published' | 'active' | 'completed' | 'archived';
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  learningObjectives: string[];
  syllabus: CourseSyllabus[];
  resources: CourseManagementResource[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseSyllabus {
  id: string;
  week: number;
  title: string;
  description: string;
  topics: string[];
  assignments: string[];
  readings: string[];
}

export interface CourseManagementResource {
  id: string;
  title: string;
  type: 'document' | 'video' | 'link' | 'presentation';
  url: string;
  description?: string;
  isRequired: boolean;
}

export interface CourseManagementAssignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  type: 'assignment' | 'quiz' | 'exam' | 'project';
  instructions: string;
  dueDate: string;
  totalPoints: number;
  timeLimit?: number; // in minutes
  attempts: number;
  status: 'draft' | 'published' | 'closed';
  questions?: Question[];
  attachments: AssignmentAttachment[];
  submissions: Submission[];
  createdAt: string;
  updatedAt: string;
}

// Assignment Creation Types
export interface AssignmentCreationData {
  courseId: string;
  title: string;
  description: string;
  type: 'assignment' | 'quiz' | 'exam' | 'project';
  instructions: string;
  dueDate: string;
  availableFrom: string;
  totalPoints: number;
  timeLimit?: number;
  maxAttempts: number;
  isGroupWork: boolean;
  allowLateSubmissions: boolean;
  latePenalty: number; // percentage
  attachments: AssignmentAttachment[];
  rubric?: AssignmentRubric;
  isPublished: boolean;
  shuffleQuestions?: boolean; // for quizzes
  showCorrectAnswers?: boolean; // for quizzes
  allowReview?: boolean; // for quizzes
}

export interface AssignmentRubric {
  criteria: RubricCriteria[];
  totalPoints: number;
}

export interface RubricCriteria {
  id: string;
  name: string;
  description: string;
  points: number;
  levels: RubricLevel[];
}

export interface RubricLevel {
  id: string;
  name: string;
  description: string;
  points: number;
}

// Quiz Creation Types
export interface QuizCreationData {
  courseId: string;
  title: string;
  description: string;
  instructions: string;
  dueDate: string;
  availableFrom: string;
  availableUntil?: string;
  timeLimit?: number;
  maxAttempts: number;
  questions: QuizQuestion[];
  totalPoints: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showCorrectAnswers: boolean;
  allowReview: boolean;
  isPublished: boolean;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'matching' | 'ordering' | 'file_upload';
  question: string;
  points: number;
  options?: string[]; // for multiple choice, true/false
  correctAnswer?: string | string[];
  explanation?: string;
  order: number;
  required: boolean;
  attachments?: AssignmentAttachment[];
}

export interface Question {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'file_upload';
  question: string;
  points: number;
  options?: string[]; // for multiple choice
  correctAnswer?: string | string[];
  explanation?: string;
  order: number;
}

export interface AssignmentAttachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  type: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  status: 'submitted' | 'graded' | 'late' | 'missing';
  score?: number;
  feedback?: string;
  answers: SubmissionAnswer[];
  attachments: AssignmentAttachment[];
}

export interface SubmissionAnswer {
  questionId: string;
  answer: string | string[];
  points?: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: 'lecture' | 'assignment_due' | 'exam' | 'meeting' | 'deadline' | 'workshop';
  startDate: string;
  endDate: string;
  location?: string;
  isVirtual: boolean;
  meetingLink?: string;
  courseId?: string;
  assignmentId?: string;
  attendees: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProgress {
  studentId: string;
  studentName: string;
  email: string;
  courseId: string;
  enrolledAt: string;
  lastActivity: string;
  overallProgress: number; // percentage
  completedAssignments: number;
  totalAssignments: number;
  averageScore: number;
  currentGrade: string;
  attendance: AttendanceRecord[];
  assignmentScores: AssignmentScore[];
  moduleProgress: ModuleProgress[];
}

export interface AttendanceRecord {
  date: string;
  eventId: string;
  status: 'present' | 'absent' | 'late' | 'excused';
}

export interface AssignmentScore {
  assignmentId: string;
  assignmentTitle: string;
  score: number;
  totalPoints: number;
  submittedAt: string;
  gradedAt?: string;
}

export interface ModuleProgress {
  moduleId: string;
  moduleTitle: string;
  progress: number;
  completedAt?: string;
  timeSpent: number; // in minutes
}

export interface CourseAnalytics {
  courseId: string;
  totalStudents: number;
  activeStudents: number;
  averageProgress: number;
  averageScore: number;
  completionRate: number;
  engagementMetrics: {
    averageTimeSpent: number;
    forumPosts: number;
    resourceViews: number;
  };
  assignmentStats: {
    submitted: number;
    graded: number;
    overdue: number;
  };
  upcomingDeadlines: CourseManagementAssignment[];
}

export interface FellowProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  startDate: string;
  status: 'active' | 'on_leave' | 'completed' | 'withdrawn';
  supervisor: string;
  courses: StudentProgress[];
  overallGPA: number;
  completedCredits: number;
  totalCredits: number;
  research: {
    area: string;
    supervisor: string;
    progress: number;
  };
}

export type CourseFilter = {
  status?: Course['status'];
  category?: string;
  instructor?: string;
  difficulty?: Course['difficulty'];
  dateRange?: {
    start: string;
    end: string;
  };
};

export type ProgressFilter = {
  courseId?: string;
  status?: StudentProgress['currentGrade'];
  progressRange?: {
    min: number;
    max: number;
  };
};
