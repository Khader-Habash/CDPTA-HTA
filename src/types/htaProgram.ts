export enum ModuleType {
  FORMULARY_MANAGEMENT = 'formulary_management',
  LITERATURE_SEARCHING = 'literature_searching',
  BIOSTATISTICS = 'biostatistics',
  CLINICAL_TRIALS = 'clinical_trials',
  PHARMACOECONOMICS = 'pharmacoeconomics',
  DECISION_MODELING = 'decision_modeling',
  MEDICATION_SAFETY = 'medication_safety',
  FINAL_PROJECT = 'final_project',
}

export enum AssessmentType {
  HANDS_ON = 'hands_on',
  MULTIPLE_CHOICE = 'multiple_choice',
  WRITTEN_APPRAISAL = 'written_appraisal',
  PRESENTATION = 'presentation',
  PROJECT = 'project',
  OBSERVATION = 'observation',
}

export enum LearningActivityType {
  READING = 'reading',
  LECTURE = 'lecture',
  WORKSHOP = 'workshop',
  EXERCISE = 'exercise',
  ONLINE_COURSE = 'online_course',
  JOURNAL_CLUB = 'journal_club',
  CASE_STUDY = 'case_study',
  PROJECT = 'project',
}

export interface HTAModule {
  id: string;
  rotationNumber: number;
  title: string;
  type: ModuleType;
  durationWeeks: number;
  learningObjectives: string[];
  activities: LearningActivity[];
  assessmentMethods: AssessmentMethod[];
  references: Reference[];
  prerequisites?: string[]; // Module IDs that must be completed first
  isCore: boolean; // Core module vs elective
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
  updatedAt: string;
}

export interface LearningActivity {
  id: string;
  type: LearningActivityType;
  title: string;
  description: string;
  duration?: string; // e.g., "4 hours", "1 day", "1.5 days"
  order: number;
  isRequired: boolean;
  resources?: ActivityResource[];
}

export interface ActivityResource {
  id: string;
  title: string;
  type: 'document' | 'video' | 'link' | 'software';
  url?: string;
  description?: string;
}

export interface AssessmentMethod {
  id: string;
  type: AssessmentType;
  title: string;
  description: string;
  weight: number; // Percentage of total grade
  instructions: string;
  rubric?: AssessmentRubric[];
  dueDate?: string;
  isRequired: boolean;
}

export interface AssessmentRubric {
  criterion: string;
  description: string;
  points: number;
  maxPoints: number;
}

export interface Reference {
  id: string;
  title: string;
  type: 'book' | 'article' | 'website' | 'course' | 'guideline';
  authors?: string;
  publisher?: string;
  year?: number;
  url?: string;
  isbn?: string;
  description?: string;
}

export interface FellowProgress {
  fellowId: string;
  moduleId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  startDate?: string;
  completionDate?: string;
  currentActivityId?: string;
  completedActivities: string[];
  assessments: FellowAssessment[];
  overallGrade?: number;
  feedback?: string;
  lastActivityDate: string;
}

export interface FellowAssessment {
  assessmentId: string;
  status: 'not_started' | 'in_progress' | 'submitted' | 'graded';
  submissionDate?: string;
  grade?: number;
  maxGrade: number;
  feedback?: string;
  gradedBy?: string;
  gradedDate?: string;
  submission?: AssessmentSubmission;
}

export interface AssessmentSubmission {
  id: string;
  content?: string; // Text submission
  files?: AssessmentFile[];
  submittedAt: string;
  version: number;
}

export interface AssessmentFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface HTAProgram {
  id: string;
  name: string;
  description: string;
  duration: number; // Total weeks
  modules: HTAModule[];
  fellows: string[]; // Fellow IDs
  staff: string[]; // Staff IDs
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  cohort: string; // e.g., "2024-1", "Spring 2024"
  createdAt: string;
  updatedAt: string;
}

export interface ProgramStatistics {
  totalModules: number;
  completedModules: number;
  averageGrade: number;
  fellowsProgress: FellowModuleProgress[];
  moduleCompletionRates: ModuleCompletionRate[];
}

export interface FellowModuleProgress {
  fellowId: string;
  fellowName: string;
  completedModules: number;
  totalModules: number;
  averageGrade: number;
  currentModule?: string;
  onTrack: boolean;
}

export interface ModuleCompletionRate {
  moduleId: string;
  moduleTitle: string;
  completionRate: number;
  averageGrade: number;
  totalFellows: number;
  completedFellows: number;
}

