/*
  Warnings:

  - A unique constraint covering the columns `[queryId,answerId]` on the table `Story` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Story_queryId_answerId_key" ON "Story"("queryId", "answerId");
