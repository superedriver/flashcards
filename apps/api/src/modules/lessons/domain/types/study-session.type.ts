import { StudySessionScope } from './study-session-scope.type';
import { StudySessionStatus } from './study-session-status.type';

export type StudySession = {
  id: string;
  userId: string;
  deckId: string | null;
  scope: StudySessionScope;
  status: StudySessionStatus;
  lessonSize: number;
  startedAt: Date;
  completedAt: Date | null;
  abandonedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
