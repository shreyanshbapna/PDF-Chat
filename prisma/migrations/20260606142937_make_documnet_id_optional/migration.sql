-- DropForeignKey
ALTER TABLE "Chunk" DROP CONSTRAINT "Chunk_documentId_fkey";

-- AlterTable
ALTER TABLE "Chunk" ALTER COLUMN "documentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Chunk" ADD CONSTRAINT "Chunk_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;
