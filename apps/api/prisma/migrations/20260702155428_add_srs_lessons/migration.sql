-- CreateEnum
CREATE TYPE "StudySessionStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "ReviewAnswer" AS ENUM ('KNOW', 'DONT_KNOW');

-- CreateTable
CREATE TABLE "CardReviewState" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "easeFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "intervalDays" INTEGER NOT NULL DEFAULT 0,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "lastReviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CardReviewState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudySession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deckId" TEXT NOT NULL,
    "status" "StudySessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "lessonSize" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "abandonedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudySession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudySessionReview" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deckId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "answer" "ReviewAnswer" NOT NULL,
    "quality" INTEGER NOT NULL,
    "reviewedAt" TIMESTAMP(3) NOT NULL,
    "previousEaseFactor" DOUBLE PRECISION,
    "previousIntervalDays" INTEGER,
    "previousRepetitions" INTEGER,
    "nextEaseFactor" DOUBLE PRECISION NOT NULL,
    "nextIntervalDays" INTEGER NOT NULL,
    "nextRepetitions" INTEGER NOT NULL,
    "nextDueAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudySessionReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CardReviewState_userId_idx" ON "CardReviewState"("userId");

-- CreateIndex
CREATE INDEX "CardReviewState_cardId_idx" ON "CardReviewState"("cardId");

-- CreateIndex
CREATE INDEX "CardReviewState_dueAt_idx" ON "CardReviewState"("dueAt");

-- CreateIndex
CREATE UNIQUE INDEX "CardReviewState_userId_cardId_key" ON "CardReviewState"("userId", "cardId");

-- CreateIndex
CREATE INDEX "StudySession_userId_idx" ON "StudySession"("userId");

-- CreateIndex
CREATE INDEX "StudySession_deckId_idx" ON "StudySession"("deckId");

-- CreateIndex
CREATE INDEX "StudySession_status_idx" ON "StudySession"("status");

-- CreateIndex
CREATE INDEX "StudySessionReview_userId_idx" ON "StudySessionReview"("userId");

-- CreateIndex
CREATE INDEX "StudySessionReview_deckId_idx" ON "StudySessionReview"("deckId");

-- CreateIndex
CREATE INDEX "StudySessionReview_cardId_idx" ON "StudySessionReview"("cardId");

-- CreateIndex
CREATE INDEX "StudySessionReview_reviewedAt_idx" ON "StudySessionReview"("reviewedAt");

-- CreateIndex
CREATE UNIQUE INDEX "StudySessionReview_sessionId_cardId_key" ON "StudySessionReview"("sessionId", "cardId");

-- AddForeignKey
ALTER TABLE "CardReviewState" ADD CONSTRAINT "CardReviewState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardReviewState" ADD CONSTRAINT "CardReviewState_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySession" ADD CONSTRAINT "StudySession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySession" ADD CONSTRAINT "StudySession_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySessionReview" ADD CONSTRAINT "StudySessionReview_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "StudySession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySessionReview" ADD CONSTRAINT "StudySessionReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySessionReview" ADD CONSTRAINT "StudySessionReview_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySessionReview" ADD CONSTRAINT "StudySessionReview_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;
