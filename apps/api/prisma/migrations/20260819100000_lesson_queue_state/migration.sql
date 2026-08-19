-- AlterTable
ALTER TABLE "StudySession" ADD COLUMN "snapshotCardIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "queueState" JSONB;
