-- CreateTable
CREATE TABLE "Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "order" INTEGER
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "queryId" INTEGER NOT NULL,
    CONSTRAINT "Answer_queryId_fkey" FOREIGN KEY ("queryId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TestChat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "artefactId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "score" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Story" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "chatId" INTEGER NOT NULL,
    "queryId" INTEGER NOT NULL,
    "answerId" INTEGER NOT NULL,
    CONSTRAINT "Story_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "TestChat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Story_queryId_fkey" FOREIGN KEY ("queryId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Story_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Question_text_key" ON "Question"("text");

-- CreateIndex
CREATE UNIQUE INDEX "Answer_text_key" ON "Answer"("text");

-- CreateIndex
CREATE UNIQUE INDEX "TestChat_artefactId_key" ON "TestChat"("artefactId");
