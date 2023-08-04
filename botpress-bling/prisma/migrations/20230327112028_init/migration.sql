/*
  Warnings:

  - You are about to drop the column `chatId` on the `Story` table. All the data in the column will be lost.
  - Added the required column `botId` to the `Story` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Story" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "botId" TEXT NOT NULL,
    "queryId" INTEGER NOT NULL,
    "answerId" INTEGER NOT NULL,
    CONSTRAINT "Story_queryId_fkey" FOREIGN KEY ("queryId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Story_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Story" ("answerId", "id", "queryId") SELECT "answerId", "id", "queryId" FROM "Story";
DROP TABLE "Story";
ALTER TABLE "new_Story" RENAME TO "Story";
CREATE UNIQUE INDEX "Story_botId_key" ON "Story"("botId");
CREATE UNIQUE INDEX "Story_queryId_answerId_key" ON "Story"("queryId", "answerId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
