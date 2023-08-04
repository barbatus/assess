-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Story" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "botId" TEXT NOT NULL,
    "queryId" INTEGER NOT NULL,
    "answerId" INTEGER NOT NULL,
    CONSTRAINT "Story_queryId_fkey" FOREIGN KEY ("queryId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Story_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Story" ("answerId", "botId", "id", "queryId") SELECT "answerId", "botId", "id", "queryId" FROM "Story";
DROP TABLE "Story";
ALTER TABLE "new_Story" RENAME TO "Story";
CREATE UNIQUE INDEX "Story_queryId_answerId_botId_key" ON "Story"("queryId", "answerId", "botId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
