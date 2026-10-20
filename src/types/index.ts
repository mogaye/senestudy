/**
 * Types according to Noria PRD & TRD specifications
 */

export type EducationStage =
  | 'college'
  | 'lycee_general_tech'
  | 'voie_pro'
  | 'superieur'
  | 'apprentissage_formation'
  | 'autre';

export type LearnerType =
  | 'school_pupil'
  | 'higher_education_student'
  | 'apprentice_or_trainee'
  | 'other'
  | 'prefer_not_to_say';

export type AgeBand = 'under_15' | '15_to_17' | '18_and_over';

export type DiscoverySource =
  | 'tiktok'
  | 'instagram'
  | 'youtube'
  | 'other_social_network'
  | 'web_search'
  | 'friend_or_family'
  | 'teacher_or_school'
  | 'advertising'
  | 'other'
  | 'unknown'
  | 'prefer_not_to_say';

export interface StudyProfile {
  userId: string;
  learnerType: LearnerType;
  educationStage: EducationStage;
  classYear: string;
  studyTrack?: string;
  subjectCodes: string[];
  primaryStudyGoal?: string;
  ageBand: AgeBand;
  dailyMinutesGoal: number;
  notificationsEnabled: boolean;
  questionnaireVersion: string;
  profileCompletedAt: string | null;
}

export interface WorkspaceAppearance {
  backgroundSource: 'default' | 'preset' | 'upload';
  backgroundPresetId: string;
  customImageDataUrl?: string;
  focalX: number;
  focalY: number;
  overlayStrength: number; // 20 - 90 %
  reduceMotion: boolean;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  color: string;
  description?: string;
  archivedAt?: string | null;
  createdAt: string;
}

export interface MaterialChunk {
  id: string;
  materialId: string;
  pageNumber?: number;
  sectionLabel?: string;
  chunkIndex: number;
  textContent: string;
  contentHash: string;
}

export interface LearningMaterial {
  id: string;
  courseId: string;
  displayName: string;
  mimeType: string;
  sizeBytes: number;
  processingStatus: 'processing' | 'ready' | 'error';
  pageCount?: number;
  chunks: MaterialChunk[];
  createdAt: string;
}

export type GenerationStatus = 'generated' | 'user_edited' | 'approved' | 'archived';

export interface StudyCard {
  id: string;
  courseId: string;
  materialId?: string;
  sourceChunkIds: string[];
  prompt: string;
  expectedAnswer: string;
  explanation: string;
  hint1?: string;
  hint2?: string;
  generationStatus: GenerationStatus;
  difficulty?: 'facile' | 'moyen' | 'difficile';
  nextReviewAt: string;
  reviewCount: number;
  lastRating?: 'revoir' | 'hesitant' | 'acquis';
  createdAt: string;
}

export interface StudyTask {
  id: string;
  courseId?: string;
  title: string;
  description?: string;
  taskType: 'revision' | 'devoir' | 'examen' | 'autre';
  dueAt: string;
  status: 'todo' | 'done';
  priority: 'basse' | 'moyenne' | 'haute';
  estimatedMinutes: number;
}

export interface CoachMessage {
  id: string;
  sender: 'student' | 'coach';
  text: string;
  hints?: string[];
  activeHintIndex?: number;
  sources?: {
    courseName: string;
    materialName: string;
    pageNumber?: number;
    quote: string;
  }[];
  isGeneralExplanation?: boolean;
  timestamp: string;
  reported?: boolean;
}
