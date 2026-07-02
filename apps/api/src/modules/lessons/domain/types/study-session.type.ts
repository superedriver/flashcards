import { StudySessionStatus } from './study-session-status.type';

export type StudySession = {
  id: string;
  userId: string;
  deckId: string;
  status: StudySessionStatus;
  lessonSize: number;
  startedAt: Date;
  completedAt: Date | null;
  abandonedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
