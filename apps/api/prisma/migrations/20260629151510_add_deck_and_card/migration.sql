-- CreateEnum
CREATE TYPE "DeckVisibility" AS ENUM ('PRIVATE', 'PUBLIC');

-- CreateEnum
CREATE TYPE "DeckModerationStatus" AS ENUM ('NONE', 'PENDING', 'APPROVED', 'REJECTED', 'HIDDEN');

-- CreateTable
CREATE TABLE "Deck" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "visibility" "DeckVisibility" NOT NULL DEFAULT 'PRIVATE',
    "moderationStatus" "DeckModerationStatus" NOT NULL DEFAULT 'NONE',
    "isOfficial" BOOLEAN NOT NULL DEFAULT false,
    "sourceDeckId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Deck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "deckId" TEXT NOT NULL,
    "front" TEXT NOT NULL,
    "back" TEXT NOT NULL,
    "example" TEXT,
    "notes" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Deck_ownerId_idx" ON "Deck"("ownerId");

-- CreateIndex
CREATE INDEX "Deck_visibility_idx" ON "Deck"("visibility");

-- CreateIndex
CREATE INDEX "Deck_moderationStatus_idx" ON "Deck"("moderationStatus");

-- CreateIndex
CREATE INDEX "Deck_isOfficial_idx" ON "Deck"("isOfficial");

-- CreateIndex
CREATE INDEX "Deck_deletedAt_idx" ON "Deck"("deletedAt");

-- CreateIndex
CREATE INDEX "Card_deckId_idx" ON "Card"("deckId");

-- CreateIndex
CREATE INDEX "Card_position_idx" ON "Card"("position");

-- CreateIndex
CREATE INDEX "Card_deletedAt_idx" ON "Card"("deletedAt");

-- AddForeignKey
ALTER TABLE "Deck" ADD CONSTRAINT "Deck_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;
