-- Clear provenance on existing finalized copies. Preview sessions keep sourceDeckId.
UPDATE "Deck" SET "sourceDeckId" = NULL WHERE "sourceDeckId" IS NOT NULL;
