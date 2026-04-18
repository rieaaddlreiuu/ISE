import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON;');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS "__codex_test";');

    await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Problem" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "serialCode" TEXT NOT NULL,
            "title" TEXT NOT NULL,
            "subject" TEXT NOT NULL,
            "domain" TEXT,
            "tagsText" TEXT,
            "status" TEXT NOT NULL,
            "statementMd" TEXT NOT NULL,
            "answerMd" TEXT,
            "explanationMd" TEXT,
            "authorMemoMd" TEXT,
            "sourceType" TEXT,
            "sourceDetail" TEXT,
            "difficultySelf" INTEGER,
            "targetLevel" TEXT,
            "estimatedSolveTime" INTEGER,
            "archivedAt" DATETIME,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    `);

    await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "ProblemAsset" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "problemId" TEXT NOT NULL,
            "storageKey" TEXT NOT NULL,
            "fileName" TEXT NOT NULL,
            "mimeType" TEXT NOT NULL,
            "width" INTEGER,
            "height" INTEGER,
            "sizeBytes" INTEGER,
            "altText" TEXT,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "ProblemAsset_problemId_fkey"
                FOREIGN KEY ("problemId")
                REFERENCES "Problem" ("id")
                ON DELETE CASCADE
                ON UPDATE CASCADE
        );
    `);

    await prisma.$executeRawUnsafe(`
        CREATE UNIQUE INDEX IF NOT EXISTS "Problem_serialCode_key"
        ON "Problem"("serialCode");
    `);

    await prisma.$executeRawUnsafe(`
        CREATE UNIQUE INDEX IF NOT EXISTS "ProblemAsset_storageKey_key"
        ON "ProblemAsset"("storageKey");
    `);

    await prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "ProblemAsset_problemId_idx"
        ON "ProblemAsset"("problemId");
    `);
}

try {
    await main();
    console.log('Database initialized.');
} catch (error) {
    console.error(error);
    process.exitCode = 1;
} finally {
    await prisma.$disconnect();
}
