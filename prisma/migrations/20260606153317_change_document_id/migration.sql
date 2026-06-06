/*
  Warnings:

  - Made the column `documentId` on table `Chunk` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Chunk" DROP CONSTRAINT "Chunk_documentId_fkey";

-- AlterTable
ALTER TABLE "Chunk" ALTER COLUMN "documentId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Chunk" ADD CONSTRAINT "Chunk_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
