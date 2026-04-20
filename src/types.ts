export type FolderType = "Internal training" | "Customer training" | "Archived training";

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  rootType: "internal" | "customer" | "archived";
  createdAt: string;
  isSystemFolder?: boolean;
}

export interface Asset {
  id: string;
  name: string;
  folderId: string;
  fileSize: number;
  mimeType: string;
  url: string;
  createdAt: string;
}

export interface HistoryEntry {
  version: string;
  date: string;
  size: string;
  pushedToCourses?: string[]; // IDs of courses this version was pushed to
}

export interface FileItem {
  id: string;
  name?: string;
  title?: string;
  type: string;
  folderId: string;
  createdAt?: string;
  size?: string;
  version?: string;
  status?: string;
  usedIn?: number;
  views?: number;
  completionRate?: string;
  history?: HistoryEntry[];
  url?: string;
  tags?: string[];
  description?: string;
  assessmentData?: Assessment; // For assessments stored as learning objects
}

export type QuestionType = "single_choice" | "multiple_choice" | "open_ended";

export interface Answer {
  id: string;
  question_id: string;
  content: string;
  media_url?: string;
  is_correct: boolean;
  points?: number; // Added for partial credit scoring
  feedback?: string;
}

export interface Question {
  id: string;
  assessment_id: string;
  type: QuestionType;
  content: string;
  media_url?: string;
  points: number;
  order_index: number;
  scoring_type?: "binary" | "partial"; // Optional override for MCQ
  correct_feedback?: string;
  incorrect_feedback?: string;
  answers: Answer[];
}

export interface AssessmentSettings {
  timeLimit?: number; // minutes, 0 for unlimited
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  maxAttempts: number;
  scoringType: "binary" | "partial";
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  tenant_id: string;
}

export interface AccessRule {
  id: string;
  targetType: 'Group' | 'Role' | 'Individual' | 'Department';
  targetName: string;
  accessType: 'Auto-Enroll' | 'View Only' | 'Open' | 'Manual Request';
  status: 'Active' | 'Expired';
}

export interface CourseModule {
  id: string;
  assetId?: string;
  title: string;
  type: string; // 'SCORM' | 'Video' | 'PDF' | 'Assessment' | etc.
  version: string;
}

export interface Course {
  id: string;
  tenant_id: string;
  title: string;
  description?: string;
  audience: string;
  status: 'Published' | 'Under Maintenance' | 'Draft';
  lastUpdated: string;
  enrolledGroups: string[];
  enrolledSites: string[];
  thumbnail?: string;
  learningObjectives?: string[];
  instructors?: string[];
  duration?: string;
  language?: string;
  category?: string;
  tags?: string[];
  format?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  isPinned?: boolean;
  visibilityRule?: 'Public' | 'Restricted';
  accessRules?: AccessRule[];
  modules: CourseModule[];
}

export interface AssessmentAttempt {
  id: string;
  assessment_id: string;
  course_id?: string; // Optional: if taken within a course context
  user_id: string;
  user_name: string;
  group_ids: string[]; // Groups the user belonged to at the time of the attempt
  score: number;
  max_score: number;
  percentage: number;
  passed: boolean;
  started_at: string;
  completed_at: string;
  responses: Record<string, string | string[]>;
}

export interface Assessment {
  id: string;
  tenant_id: string;
  title: string;
  description?: string;
  passing_score: number; // percentage
  answer_key_url?: string; // Google Drive link for instructors
  settings: AssessmentSettings;
  questions: Question[];
}
