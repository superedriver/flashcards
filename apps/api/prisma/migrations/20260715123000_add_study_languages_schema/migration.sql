-- CreateEnum
CREATE TYPE "DeckPreviewSessionType" AS ENUM ('COPY_PUBLIC', 'COPY_GROUP', 'REGENERATE_DECK');

-- CreateEnum
CREATE TYPE "DeckPreviewSessionStatus" AS ENUM ('GENERATING', 'READY', 'EXPIRED');

-- AlterTable
ALTER TABLE "Deck" ADD COLUMN     "targetLanguage" TEXT,
ADD COLUMN     "sourceLanguage" TEXT;

-- AlterTable
ALTER TABLE "UserSettings" ADD COLUMN     "nativeLanguage" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "activeTargetLanguage" TEXT;

-- CreateTable
CREATE TABLE "UserStudyLanguage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserStudyLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeckPreviewSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "DeckPreviewSessionType" NOT NULL,
    "status" "DeckPreviewSessionStatus" NOT NULL DEFAULT 'GENERATING',
    "sourceDeckId" TEXT,
    "targetLanguage" TEXT NOT NULL,
    "chosenSourceLanguage" TEXT NOT NULL,
    "cards" JSONB NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeckPreviewSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Deck_targetLanguage_idx" ON "Deck"("targetLanguage");

-- CreateIndex
CREATE INDEX "Deck_sourceLanguage_idx" ON "Deck"("sourceLanguage");

-- CreateIndex
CREATE UNIQUE INDEX "UserStudyLanguage_userId_languageCode_key" ON "UserStudyLanguage"("userId", "languageCode");

-- CreateIndex
CREATE INDEX "UserStudyLanguage_userId_idx" ON "UserStudyLanguage"("userId");

-- CreateIndex
CREATE INDEX "UserStudyLanguage_languageCode_idx" ON "UserStudyLanguage"("languageCode");

-- CreateIndex
CREATE INDEX "DeckPreviewSession_userId_idx" ON "DeckPreviewSession"("userId");

-- CreateIndex
CREATE INDEX "DeckPreviewSession_expiresAt_idx" ON "DeckPreviewSession"("expiresAt");

-- CreateIndex
CREATE INDEX "DeckPreviewSession_status_idx" ON "DeckPreviewSession"("status");

-- AddForeignKey
ALTER TABLE "Deck" ADD CONSTRAINT "Deck_targetLanguage_fkey" FOREIGN KEY ("targetLanguage") REFERENCES "Language"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deck" ADD CONSTRAINT "Deck_sourceLanguage_fkey" FOREIGN KEY ("sourceLanguage") REFERENCES "Language"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStudyLanguage" ADD CONSTRAINT "UserStudyLanguage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStudyLanguage" ADD CONSTRAINT "UserStudyLanguage_languageCode_fkey" FOREIGN KEY ("languageCode") REFERENCES "Language"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeckPreviewSession" ADD CONSTRAINT "DeckPreviewSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
