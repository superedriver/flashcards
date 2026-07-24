-- CardReviewState: drop SM-2 columns
ALTER TABLE "CardReviewState" DROP COLUMN "easeFactor";
ALTER TABLE "CardReviewState" DROP COLUMN "intervalDays";
ALTER TABLE "CardReviewState" DROP COLUMN "repetitions";

-- StudySessionReview: drop quality + SM-2 snapshot columns
ALTER TABLE "StudySessionReview" DROP COLUMN "quality";
ALTER TABLE "StudySessionReview" DROP COLUMN "previousEaseFactor";
ALTER TABLE "StudySessionReview" DROP COLUMN "previousIntervalDays";
ALTER TABLE "StudySessionReview" DROP COLUMN "previousRepetitions";
ALTER TABLE "StudySessionReview" DROP COLUMN "nextEaseFactor";
ALTER TABLE "StudySessionReview" DROP COLUMN "nextIntervalDays";
ALTER TABLE "StudySessionReview" DROP COLUMN "nextRepetitions";
