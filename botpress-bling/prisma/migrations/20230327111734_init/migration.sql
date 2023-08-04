/*
  Warnings:

  - You are about to drop the column `queryId` on the `Answer` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Answer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL
);
INSERT INTO "new_Answer" ("id", "text") SELECT "id", "text" FROM "Answer";
DROP TABLE "Answer";
ALTER TABLE "new_Answer" RENAME TO "Answer";
CREATE UNIQUE INDEX "Answer_text_key" ON "Answer"("text");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
