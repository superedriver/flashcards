-- CreateTable
CREATE TABLE "Language" (
    "code" TEXT NOT NULL,
    "englishName" TEXT NOT NULL,
    "nativeName" TEXT NOT NULL,
    "flag" TEXT NOT NULL,
    "popularSortOrder" INTEGER,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("code")
);

-- CreateIndex
CREATE INDEX "Language_popularSortOrder_idx" ON "Language"("popularSortOrder");
