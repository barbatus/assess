/*
  Warnings:

  - A unique constraint covering the columns `[queryId,answerId,botId]` on the table `Story` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Story_queryId_answerId_key";

-- DropIndex
DROP INDEX "Story_botId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Story_queryId_answerId_botId_key" ON "Story"("queryId", "answerId", "botId");
