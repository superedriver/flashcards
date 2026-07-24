-- CreateEnum
CREATE TYPE "StudySessionScope" AS ENUM ('DECK', 'HOME_ACTIVE_TARGET');

-- CardReviewState: add learning-step columns; keep SM-2 columns
ALTER TABLE "CardReviewState" ADD COLUMN "learningStep" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "CardReviewState" ADD COLUMN "longReviewSuccessCount" INTEGER NOT NULL DEFAULT 0;

UPDATE "CardReviewState"
SET
  "learningStep" = 0,
  "longReviewSuccessCount" = 0,
  "dueAt" = CURRENT_TIMESTAMP;

-- StudySession: scope + nullable deckId
ALTER TABLE "StudySession" ADD COLUMN "scope" "StudySessionScope" NOT NULL DEFAULT 'DECK';
ALTER TABLE "StudySession" ALTER COLUMN "deckId" DROP NOT NULL;
CREATE INDEX "StudySession_scope_idx" ON "StudySession"("scope");

-- StudySessionReview: add learning-step snapshots; keep SM-2 columns; allow re-queue
ALTER TABLE "StudySessionReview" ADD COLUMN "previousLearningStep" INTEGER;
ALTER TABLE "StudySessionReview" ADD COLUMN "previousLongReviewSuccessCount" INTEGER;
ALTER TABLE "StudySessionReview" ADD COLUMN "nextLearningStep" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "StudySessionReview" ADD COLUMN "nextLongReviewSuccessCount" INTEGER NOT NULL DEFAULT 0;

DROP INDEX IF EXISTS "StudySessionReview_sessionId_cardId_key";
CREATE INDEX "StudySessionReview_sessionId_idx" ON "StudySessionReview"("sessionId");
