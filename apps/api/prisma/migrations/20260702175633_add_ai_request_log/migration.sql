-- CreateEnum
CREATE TYPE "AiProvider" AS ENUM ('MOCK', 'GEMINI');

-- CreateEnum
CREATE TYPE "AiRequestStatus" AS ENUM ('SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "AiRequestLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deckId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "provider" "AiProvider" NOT NULL,
    "feature" TEXT NOT NULL,
    "status" "AiRequestStatus" NOT NULL,
    "promptPreview" TEXT,
    "outputPreview" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiRequestLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiRequestLog_userId_idx" ON "AiRequestLog"("userId");

-- CreateIndex
CREATE INDEX "AiRequestLog_deckId_idx" ON "AiRequestLog"("deckId");

-- CreateIndex
CREATE INDEX "AiRequestLog_cardId_idx" ON "AiRequestLog"("cardId");

-- CreateIndex
CREATE INDEX "AiRequestLog_provider_idx" ON "AiRequestLog"("provider");

-- CreateIndex
CREATE INDEX "AiRequestLog_status_idx" ON "AiRequestLog"("status");

-- CreateIndex
CREATE INDEX "AiRequestLog_createdAt_idx" ON "AiRequestLog"("createdAt");

-- AddForeignKey
ALTER TABLE "AiRequestLog" ADD CONSTRAINT "AiRequestLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiRequestLog" ADD CONSTRAINT "AiRequestLog_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiRequestLog" ADD CONSTRAINT "AiRequestLog_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;
