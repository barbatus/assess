/*
  Warnings:

  - You are about to drop the column `chatId` on the `Story` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Story" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "queryId" INTEGER NOT NULL,
    "answerId" INTEGER NOT NULL,
    CONSTRAINT "Story_queryId_fkey" FOREIGN KEY ("queryId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Story_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Story" ("answerId", "id", "queryId") SELECT "answerId", "id", "queryId" FROM "Story";
DROP TABLE "Story";
ALTER TABLE "new_Story" RENAME TO "Story";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
