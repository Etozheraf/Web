/*
  Warnings:

  - A unique constraint covering the columns `[name,categoryUuid]` on the table `Internship` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Internship_name_key";

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "uuid" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Internship" ALTER COLUMN "uuid" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Request" ALTER COLUMN "uuid" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Tag" ALTER COLUMN "uuid" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "uuid" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Internship_name_categoryUuid_key" ON "Internship"("name", "categoryUuid");
